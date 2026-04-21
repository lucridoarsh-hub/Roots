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
const API_BASE_URL = "";
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
  exportToPDF: () => Promise<void>; // ✅ New method
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

  // Normalize reactions
  const normalizedReactions = (backend.reactions || []).map((reaction: any) => {
    let userId = reaction.userId;
    if (userId && typeof userId === 'object' && userId._id) {
      userId = userId._id.toString();
    } else if (userId && typeof userId === 'object' && userId.id) {
      userId = userId.id.toString();
    } else if (userId && typeof userId !== 'string') {
      userId = userId.toString();
    }
    return {
      userId: userId,
      userName: reaction.userName || 'User',
      type: reaction.type.toUpperCase(),
    };
  });

  // Transform images with all metadata
  const transformedImages = (backend.images || []).map((img: any) => ({
    url: img.url,
    publicId: img.publicId,
    caption: img.caption || '',
    altText: img.altText || '',
    location: img.location || '',
  }));

  // Transform history (commits) if present
  const transformedHistory = (backend.history || []).map((entry: any) => ({
    editedBy: entry.editedBy
      ? typeof entry.editedBy === 'object'
        ? entry.editedBy.username || entry.editedBy.email || 'Unknown'
        : entry.editedBy
      : 'System',
    editedAt: entry.editedAt ? new Date(entry.editedAt).toISOString() : new Date().toISOString(),
    changes: entry.changes || 'No details provided',
  }));

  // Transform comments
  const transformedComments = (backend.comments || []).map((comment: any) => {
    let user = { _id: '', username: 'Unknown', profileImage: { url: '' } };
    if (comment.userId) {
      if (typeof comment.userId === 'object') {
        user = {
          _id: comment.userId._id?.toString() || '',
          username: comment.userId.username || 'Unknown',
          profileImage: comment.userId.profileImage || { url: '' },
        };
      } else {
        user = { _id: comment.userId.toString(), username: 'User', profileImage: { url: '' } };
      }
    }
    return {
      id: comment._id,
      userId: user._id,
      userName: user.username,
      userAvatar: user.profileImage?.url || '',
      text: comment.text,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  });

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
    images: transformedImages,
    reactions: normalizedReactions,
    comments: transformedComments,
    isPrivate: backend.isPrivate ?? false,
    createdAt: backend.createdAt
      ? (typeof backend.createdAt === "string"
          ? new Date(backend.createdAt).getTime()
          : backend.createdAt)
      : Date.now(),
    isDeleted: false,
    collaborators: backend.collaborators || [],
    summary: backend.summary,
    history: transformedHistory,
    lastEditedBy: backend.lastEditedBy
      ? typeof backend.lastEditedBy === 'object'
        ? backend.lastEditedBy.username
        : backend.lastEditedBy
      : undefined,
    lastEditedAt: backend.lastEditedAt,
    location: backend.location || '',
    mood: backend.mood || '',
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

  // ✅ UPDATED: Export to PDF (now calls endpoint with ?download=true)
  const exportToPDF = useCallback(async () => {
    try {
      // ✅ Add ?download=true to get the PDF file directly
      const response = await axios.get(`/api/auth/pdf?download=true`, {
        withCredentials: true,
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `memory-album-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("PDF export error:", err);
      let message = "Failed to export PDF";
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          message = json.message || message;
        } catch {
          message = text || message;
        }
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
    }
  }, []);

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
    exportToPDF,
  };

  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>;
};