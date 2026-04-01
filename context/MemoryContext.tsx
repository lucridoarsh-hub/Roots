"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import axios from "axios";
import { Memory, FilterState, MediaType, Reaction, LifeStage } from "../types";
import { useAuth } from "./AuthContext";

// ========== API CONFIGURATION ==========
const API_BASE_URL = ""; // Local dev, change to production URL later

interface MemoryContextType {
  memories: Memory[];
  filteredMemories: Memory[];
  isLoading: boolean;
  error: string | null;
  addMemory: (formData: FormData) => Promise<void>;
  updateMemory: (id: string, formData: FormData) => Promise<Memory>;
  deleteMemory: (id: string) => Promise<void>;
  restoreMemory: (id: string) => Promise<void>;
  undoLastDelete: () => void;
  lastDeletedId: string | null;
  updateMemoryReactions: (memoryId: string, reactions: Reaction[]) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const useMemories = () => {
  const context = useContext(MemoryContext);
  if (!context) throw new Error("useMemories must be used within MemoryProvider");
  return context;
};

// ========== TRANSFORM BACKEND MEMORY TO FRONTEND MEMORY ==========
const transformMemory = (backend: any): Memory => {
  const memoryDate = new Date(backend.date);

  return {
    id: backend._id,
    ownerId: backend.userId?._id || backend.ownerId || "",
    title: backend.title,
    lifeStage: backend.lifeStage as LifeStage,
    description: backend.description,
    date: backend.date,
    year: memoryDate.getFullYear(),
    tags: backend.tags || [],
    mediaType: backend.images?.length ? MediaType.PHOTO : MediaType.TEXT,
    mediaUrl: backend.images?.[0]?.url || "",
    images: (backend.images || []).map((img: any) => ({
      url: img.url,
      publicId: img.publicId,
      caption: img.caption || "",
    })),
    reactions: backend.reactions || [],
    comments: backend.comments || [],
    isPrivate: backend.isPrivate ?? false,
    createdAt: backend.createdAt
      ? (typeof backend.createdAt === "string"
          ? new Date(backend.createdAt).getTime()
          : backend.createdAt)
      : Date.now(),
    isDeleted: false,
    collaborators: backend.collaborators || [],
    // Optional fields (defaults to undefined)
    summary: backend.summary,
    history: backend.history || [],
    lastEditedBy: backend.lastEditedBy,
    lastEditedAt: backend.lastEditedAt,
  };
};

export const MemoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDeletedId, setLastDeletedId] = useState<string | null>(null);

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    lifeStage: "ALL",
    mediaType: "ALL",
    yearRange: [1900, new Date().getFullYear()],
    showDeleted: false,
  });

  const { isAuthenticated } = useAuth();

  // ========== LOAD MEMORIES ==========
  const loadMemories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/auth/fetch-memory`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const transformed = res.data.memories.map(transformMemory);
        setMemories(transformed);
        setError(null);
      } else {
        setError(res.data.message || "Failed to load memories");
      }
    } catch (err: any) {
      console.error("Load memory error:", err);
      setError(err.response?.data?.message || "Failed to load memories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // React to authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadMemories();
    } else {
      setMemories([]);
      setError(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, loadMemories]);

  // ========== ADD MEMORY ==========
  const addMemory = useCallback(async (formData: FormData) => {
    try {
      const res = await axios.post(
        `/api/auth/create-memory`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data.success) {
        const newMemory = transformMemory(res.data.memory);
        setMemories((prev) => [newMemory, ...prev]);
      } else {
        setError(res.data.message || "Failed to add memory");
      }
    } catch (err: any) {
      console.error("Add memory error:", err);
      setError(err.response?.data?.message || "Failed to add memory");
    }
  }, []);

  // ========== UPDATE MEMORY ==========
  const updateMemory = useCallback(
    async (id: string, formData: FormData): Promise<Memory> => {
      try {
        const res = await axios.patch(
          `/api/auth/edit-memory/${id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (res.data.success) {
          const updatedMemory = transformMemory(res.data.memory);
          setMemories((prev) =>
            prev.map((m) => (m.id === id ? updatedMemory : m))
          );
          return updatedMemory;
        } else {
          throw new Error(res.data.message || "Update failed");
        }
      } catch (err: any) {
        console.error("Update memory error:", err);
        setError(err.response?.data?.message || "Failed to update memory");
        throw err;
      }
    },
    []
  );

  // ========== DELETE MEMORY ==========
  const deleteMemory = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/auth/delete-memory/${id}`, {
        withCredentials: true,
      });
      setMemories((prev) => prev.filter((m) => m.id !== id));
      setLastDeletedId(id);
      setTimeout(() => setLastDeletedId(null), 8000);
    } catch (err: any) {
      console.error("Delete memory error:", err);
      setError(err.response?.data?.message || "Failed to delete memory");
    }
  }, []);

  // ========== RESTORE MEMORY ==========
  const restoreMemory = useCallback(async (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isDeleted: false } : m))
    );
    setLastDeletedId(null);
  }, []);

  // ========== UNDO LAST DELETE ==========
  const undoLastDelete = useCallback(() => {
    if (lastDeletedId) {
      restoreMemory(lastDeletedId);
    }
  }, [lastDeletedId, restoreMemory]);

  // ========== UPDATE REACTIONS ==========
  const updateMemoryReactions = useCallback(
    (memoryId: string, reactions: Reaction[]) => {
      setMemories((prev) =>
        prev.map((m) => (m.id === memoryId ? { ...m, reactions } : m))
      );
    },
    []
  );

  // ========== FILTERED MEMORIES ==========
  const filteredMemories = useMemo(() => {
    return memories.filter((memory) => {
      if (filterState.showDeleted) {
        if (!memory.isDeleted) return false;
      } else {
        if (memory.isDeleted) return false;
      }

      const matchesSearch =
        memory.title.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
        memory.description.toLowerCase().includes(filterState.searchQuery.toLowerCase());

      const matchesStage =
        filterState.lifeStage === "ALL" || memory.lifeStage === filterState.lifeStage;

      const matchesMedia =
        filterState.mediaType === "ALL" || memory.mediaType === filterState.mediaType;

      const year = new Date(memory.date).getFullYear();
      const matchesYear = year >= filterState.yearRange[0] && year <= filterState.yearRange[1];

      return matchesSearch && matchesStage && matchesMedia && matchesYear;
    });
  }, [memories, filterState]);

  const value = {
    memories,
    filteredMemories,
    isLoading,
    error,
    addMemory,
    updateMemory,
    deleteMemory,
    restoreMemory,
    undoLastDelete,
    lastDeletedId,
    updateMemoryReactions,
    filterState,
    setFilterState,
  };

  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>;
};