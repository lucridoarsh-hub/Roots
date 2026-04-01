"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { Collaborator, PermissionLevel } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "./NotificationContext";

// ========== API CONFIGURATION ==========
const API_BASE_URL = ""; // Change to your actual Next.js domain in production

const apiClient = axios.create({
  baseURL: `/api/auth`, // ✅ All calls go to /api/auth/*
  withCredentials: true,                // ✅ Send cookies (JWT token)
});

// ========== PERMISSION MAPPING ==========
const mapPermissionToRole = (permission: PermissionLevel): string => {
  const map: Record<PermissionLevel, string> = {
    VIEW: "Viewer",
    COMMENT: "Commenter",
    EDIT: "Contributor",
  };
  return map[permission];
};

const mapRoleToPermission = (role: string): PermissionLevel => {
  const map: Record<string, PermissionLevel> = {
    Viewer: "VIEW",
    Commenter: "COMMENT",
    Contributor: "EDIT",
  };
  return map[role] || "VIEW";
};

// ========== INTERFACE ==========
interface FamilyContextType {
  familyMembers: Collaborator[];
  familyMemories: any[];
  isLoading: boolean;
  inviteMember: (email: string, permission: PermissionLevel) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  updatePermission: (userId: string, permission: PermissionLevel) => Promise<void>;
  addComment: (memoryId: string, text: string) => Promise<void>;
  updateMemory: (memoryId: string, formData: FormData) => Promise<void>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState<Collaborator[]>([]);
  const [familyMemories, setFamilyMemories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useNotification();
  const hasShownLoadError = useRef(false);

  useEffect(() => {
    hasShownLoadError.current = false;
  }, [user]);

  // ========== LOAD FAMILY DATA ==========
  const loadFamily = useCallback(async () => {
    if (!user) {
      setFamilyMembers([]);
      setFamilyMemories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Parallel requests: fetch family members and family memories
      const [membersRes, memoriesRes] = await Promise.all([
        apiClient.get("/fetch-family-circle"),        // ✅ assumed endpoint
        apiClient.get("/fetch-family-circle-memory"), // ✅ provided endpoint
      ]);

      // ----- Process family members -----
      if (membersRes.data.success && Array.isArray(membersRes.data.data)) {
        const members: Collaborator[] = membersRes.data.data.map((item: any) => {
          const memberUser = item.userId;
          const role = item.role || "Viewer";
          return {
            userId: memberUser._id,
            email: memberUser.email,
            name: memberUser.username,
            permission: mapRoleToPermission(role),
            role,
            status: "ACTIVE",
            profileImage: memberUser.profileImage?.url,
          };
        });
        setFamilyMembers(members);
      } else {
        setFamilyMembers([]);
      }

      // ----- Process family memories -----
      if (memoriesRes.data.success && Array.isArray(memoriesRes.data.data)) {
        setFamilyMemories(memoriesRes.data.data);
      } else {
        setFamilyMemories([]);
      }

      hasShownLoadError.current = false;
    } catch (err) {
      if (!hasShownLoadError.current) {
        showToast("Failed to load family data", "ERROR");
        hasShownLoadError.current = true;
      }
      setFamilyMembers([]);
      setFamilyMemories([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    loadFamily();
  }, [loadFamily]);

  // ========== INVITE MEMBER ==========
  const inviteMember = async (email: string, permission: PermissionLevel) => {
    try {
      await apiClient.post("/invite-user", { email, role: mapPermissionToRole(permission) });
      showToast("Invitation sent successfully", "SUCCESS");
      loadFamily(); // refresh
    } catch (err) {
      showToast("Failed to send invitation", "ERROR");
    }
  };

  // ========== REMOVE MEMBER ==========
  const removeMember = async (userId: string) => {
    try {
      await apiClient.delete("/remove-family-member", { data: { userId } });
      showToast("Member removed", "SUCCESS");
      loadFamily();
    } catch (err) {
      showToast("Failed to remove member", "ERROR");
    }
  };

  // ========== UPDATE PERMISSION ==========
  const updatePermission = async (userId: string, permission: PermissionLevel) => {
    try {
      await apiClient.put("/update-family-role", { memberId: userId, role: mapPermissionToRole(permission) });
      showToast("Permission updated", "SUCCESS");
      loadFamily();
    } catch (err) {
      showToast("Failed to update permission", "ERROR");
    }
  };

  // ========== ADD COMMENT ==========
  const addComment = async (memoryId: string, text: string) => {
    if (!text.trim()) return;
    try {
      const response = await apiClient.post(`/memory-comment/${memoryId}`, { comment: text });
      if (response.data.success) {
        await loadFamily(); // refresh to show new comment
        showToast("Comment added", "SUCCESS");
      } else {
        showToast(response.data.message || "Failed to add comment", "ERROR");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to add comment";
      showToast(msg, "ERROR");
    }
  };

  // ========== UPDATE MEMORY (FormData) ==========
  const updateMemory = async (memoryId: string, formData: FormData) => {
    try {
      const response = await apiClient.patch(`/update-family-memory/${memoryId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials:true
      });
      if (response.data.success) {
        showToast("Memory updated successfully", "SUCCESS");
        await loadFamily(); // refresh list
      } else {
        showToast(response.data.message || "Failed to update memory", "ERROR");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update memory";
      showToast(msg, "ERROR");
    }
  };

  return (
    <FamilyContext.Provider
      value={{
        familyMembers,
        familyMemories,
        isLoading,
        inviteMember,
        removeMember,
        updatePermission,
        addComment,
        updateMemory,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) throw new Error("useFamily must be used within a FamilyProvider");
  return context;
};