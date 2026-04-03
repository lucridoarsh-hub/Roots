"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Mail,
  Plus,
  X,
  UserPlus,
  Shield,
  Heart,
  Loader2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  Send,
  Edit3,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { PermissionLevel } from "@/types";
import { useFamily } from "@/context/FamilyContext";
import { useAuth } from "@/context/AuthContext";
import theme from "../../theme"; // <-- Imported external theme (green brand)

// ========== RESPONSIVE & DARK MODE HOOKS ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
};

const useDarkMode = () => {
  return useMediaQuery("(prefers-color-scheme: dark)");
};

// ========== STYLE UTILITIES ==========
const flexCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;
const flexBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
} as const;
const absoluteFill = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

// ========== COMPONENT ==========
const FamilyPage: React.FC = () => {
  const {
    familyMembers,
    familyMemories,
    isLoading,
    inviteMember,
    removeMember,
    updatePermission,
    addComment,
    updateMemory,
  } = useFamily();
  const { user } = useAuth();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState<PermissionLevel>("VIEW");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  // Edit memory modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMemoryData, setEditMemoryData] = useState<any>(null);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const isDark = useDarkMode();
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");

  // Keep selectedMemory in sync with familyMemories
  useEffect(() => {
    if (selectedMemory) {
      const updated = familyMemories.find((m) => m._id === selectedMemory._id);
      if (updated && updated !== selectedMemory) {
        setSelectedMemory(updated);
      }
    }
  }, [familyMemories, selectedMemory?._id]);

  // Check if current user can edit the selected memory (for UI hints only)
  const canEditSelectedMemory = useMemo(() => {
    if (!selectedMemory || !familyMembers.length || !user) return false;
    const ownerId = selectedMemory.userId?._id;
    if (!ownerId) return false;
    const member = familyMembers.find((m) => m.userId === ownerId);
    return member?.permission === "EDIT";
  }, [selectedMemory, familyMembers, user]);

  // Open edit modal with current memory data
  const openEditModal = () => {
    if (!selectedMemory) return;
    setEditMemoryData({
      title: selectedMemory.title,
      description: selectedMemory.description,
      lifeStage: selectedMemory.lifeStage,
      date: selectedMemory.date.split("T")[0],
    });
    setRemovedImages([]);
    setNewImages([]);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditMemoryData((prev: any) => ({ ...prev, [name]: value }));
  };

  const toggleRemoveImage = (publicId: string) => {
    setRemovedImages((prev) =>
      prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]
    );
  };

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemory || isEditSubmitting) return;
    setIsEditSubmitting(true);
    const formData = new FormData();
    formData.append("title", editMemoryData.title);
    formData.append("description", editMemoryData.description);
    formData.append("lifeStage", editMemoryData.lifeStage);
    formData.append("date", editMemoryData.date);
    if (removedImages.length > 0) {
      formData.append("removedImages", JSON.stringify(removedImages));
    }
    newImages.forEach((file) => {
      formData.append("images", file);
    });
    try {
      await updateMemory(selectedMemory._id, formData);
      setIsEditModalOpen(false);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // Theme-based dynamic colors
  const bgPage = isDark ? theme.dark.bg : theme.light.bg;
  const textPrimary = isDark ? theme.dark.text : theme.light.text;
  const textSecondary = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const textMuted = isDark ? theme.colors.brand[500] : theme.colors.stone[400];
  const borderColor = isDark ? theme.dark.border : theme.light.border;
  const headerBg = isDark ? theme.colors.brand[950] : theme.colors.brand[500];
  const headerText = theme.colors.white;
  const headerMuted = isDark ? theme.colors.brand[300] : theme.colors.brand[100];
  const cardBg = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const cardBorder = isDark ? theme.dark.border : theme.light.border;
  const cardHeaderBg = isDark ? theme.dark.bgCard + "80" : "rgba(249,250,251,0.5)";
  const divideColor = isDark ? theme.dark.border : theme.light.border;
  const memberHoverBg = isDark ? "rgba(255,255,255,0.05)" : theme.colors.stone[50];
  const avatarBg = isDark ? theme.colors.brand[800] : theme.colors.brand[100];
  const avatarText = isDark ? theme.colors.brand[300] : theme.colors.brand[700];
  const avatarBorder = isDark ? theme.colors.brand[700] : theme.colors.white;
  const pendingBg = isDark ? theme.colors.amber[400] + "66" : theme.colors.amber[500];
  const pendingText = isDark ? theme.colors.amber[400] : theme.colors.amber[500];
  const selectBg = isDark ? theme.colors.brand[800] : theme.colors.stone[100];
  const selectText = isDark ? theme.colors.brand[200] : theme.colors.stone[700];
  const removeBtnColor = isDark ? theme.colors.brand[700] : theme.colors.stone[300];
  const removeBtnHoverBg = isDark
    ? theme.colors.rose[400] + "33"
    : theme.colors.rose[500];
  const removeBtnHoverText = isDark ? theme.colors.rose[400] : theme.colors.rose[500];
  const emptyIconBg = isDark ? theme.colors.brand[900] : theme.colors.brand[50];
  const emptyIconColor = isDark ? theme.colors.brand[400] : theme.colors.brand[300];
  const guideCardBg = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const guideCardBorder = isDark ? theme.dark.border : theme.light.border;
  const viewerDot = theme.colors.stone[400];
  const commenterDot = theme.colors.brand[500];
  const contributorDot = theme.colors.brand[700];
  const modalBg = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const modalBorder = isDark ? theme.dark.border : theme.light.border;
  const modalHeaderBg = isDark ? theme.dark.bgCard + "80" : "rgba(249,250,251,0.5)";
  const modalHeaderBorder = isDark ? theme.dark.border : theme.light.border;
  const inputBg = isDark ? theme.dark.bgInput : theme.light.bgInput;
  const inputBorder = isDark ? theme.dark.borderSubtle : theme.light.border;
  const inputText = isDark ? theme.dark.text : theme.light.text;
  const labelColor = isDark ? theme.colors.brand[500] : theme.colors.stone[400];
  const radioOptionBg = isDark ? theme.dark.bgCard + "66" : theme.colors.brand[50];
  const radioOptionBorder = isDark ? theme.dark.border : theme.light.border;
  const radioOptionActiveBg = isDark ? theme.dark.bgCard + "66" : theme.colors.brand[50];
  const radioOptionActiveBorder = theme.colors.brand[600];
  const radioOptionActiveRing = theme.colors.brand[500] + "33";
  const radioOptionText = isDark ? theme.dark.text : theme.light.text;
  const radioOptionDesc = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const submitBtnBg = isDark ? theme.colors.brand[600] : theme.colors.brand[500];
  const submitBtnHoverBg = isDark ? theme.colors.brand[500] : theme.colors.brand[600];
  const commentBg = isDark ? theme.colors.brand[800] + "80" : theme.colors.stone[100];
  const commentText = isDark ? theme.colors.stone[300] : theme.colors.stone[600];
  const commentBorder = isDark ? theme.dark.border : theme.light.border;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await inviteMember(inviteEmail, invitePermission);
      setInviteEmail("");
      setIsInviteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (
      window.confirm(
        "Remove this family member? They will lose access to your shared memories."
      )
    ) {
      await removeMember(userId);
    }
  };

  const handleChangePermission = async (userId: string, perm: PermissionLevel) => {
    await updatePermission(userId, perm);
  };

  const openMemoryModal = (memory: any) => {
    setSelectedMemory(memory);
    setCurrentImageIndex(0);
    setNewComment("");
    setIsMemoryModalOpen(true);
  };

  const closeMemoryModal = () => {
    setIsMemoryModalOpen(false);
    setSelectedMemory(null);
    setNewComment("");
  };

  const nextImage = () => {
    if (selectedMemory && selectedMemory.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedMemory.images.length);
    }
  };

  const prevImage = () => {
    if (selectedMemory && selectedMemory.images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + selectedMemory.images.length) % selectedMemory.images.length
      );
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isCommentSubmitting || !selectedMemory) return;
    setIsCommentSubmitting(true);
    try {
      await addComment(selectedMemory._id, newComment);
      setNewComment("");
    } catch (error) {
      // Error already handled in context
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .memory-card {
          transition: all 0.3s ease;
        }
        .memory-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
      `}</style>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: bgPage,
          paddingBottom: theme.spacing(20),
          transition: `background-color 300ms ${theme.transition.DEFAULT}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: headerBg,
            color: headerText,
            padding: `${theme.spacing(12)} ${theme.spacing(6)}`,
          }}
        >
          <div style={{ maxWidth: "896px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(3),
                marginBottom: theme.spacing(4),
              }}
            >
              <div
                style={{
                  padding: theme.spacing(3),
                  backgroundColor: theme.colors.brand[800],
                  borderRadius: theme.borderRadius.xl,
                }}
              >
                <Users size={32} style={{ color: theme.colors.amber[400] }} />
              </div>
              <h1
                style={{
                  fontSize: theme.fontSize["3xl"],
                  fontFamily: theme.fontFamily.serif,
                  fontWeight: "bold",
                }}
              >
                Family & Sharing
              </h1>
            </div>
            <p
              style={{
                color: headerMuted,
                fontSize: theme.fontSize.lg,
                maxWidth: "42rem",
                lineHeight: 1.625,
              }}
            >
              Invite your loved ones to view, comment on, or contribute to your
              life's story. Building a legacy is a shared journey.
            </p>
          </div>
        </div>

        <div
          style={{
            maxWidth: "896px",
            margin: "0 auto",
            padding: `0 ${theme.spacing(6)}`,
            marginTop: theme.spacing(-8),
          }}
        >
          {/* Active Members Card */}
          <div
            style={{
              backgroundColor: cardBg,
              borderRadius: theme.borderRadius["2xl"],
              boxShadow: theme.boxShadow.lg,
              border: `1px solid ${cardBorder}`,
              overflow: "hidden",
              marginBottom: theme.spacing(8),
            }}
          >
            <div
              style={{
                padding: theme.spacing(6),
                borderBottom: `1px solid ${divideColor}`,
                display: "flex",
                flexDirection: isSmUp ? "row" : "column",
                alignItems: isSmUp ? "center" : "flex-start",
                justifyContent: "space-between",
                gap: theme.spacing(4),
                backgroundColor: cardHeaderBg,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: theme.fontSize.xl,
                    fontWeight: "bold",
                    color: textPrimary,
                  }}
                >
                  Family Circle
                </h2>
                <p style={{ fontSize: theme.fontSize.sm, color: textSecondary }}>
                  Manage access to your personal history
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                  padding: `${theme.spacing(2.5)} ${theme.spacing(5)}`,
                  backgroundColor: theme.colors.brand[600],
                  color: theme.colors.white,
                  borderRadius: theme.borderRadius.full,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: theme.boxShadow.md,
                  fontSize: theme.fontSize.sm,
                  fontWeight: "bold",
                  transition: theme.transition.DEFAULT,
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.brand[700];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.brand[600];
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <UserPlus size={18} /> Invite New Member
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {isLoading ? (
                <div
                  style={{
                    padding: theme.spacing(20),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.colors.stone[400],
                  }}
                >
                  <Loader2
                    size={32}
                    style={{ marginBottom: theme.spacing(4) }}
                    className="animate-spin"
                  />
                  <p style={{ fontSize: theme.fontSize.sm }}>
                    Synchronizing family records...
                  </p>
                </div>
              ) : familyMembers.length > 0 ? (
                familyMembers.map((member) => (
                  <div
                    key={member.userId}
                    style={{
                      padding: theme.spacing(6),
                      display: "flex",
                      flexDirection: isSmUp ? "row" : "column",
                      alignItems: isSmUp ? "center" : "flex-start",
                      justifyContent: "space-between",
                      borderBottom: `1px solid ${divideColor}`,
                      transition: theme.transition.DEFAULT,
                      gap: theme.spacing(4),
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = memberHoverBg)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {/* Avatar + Name */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(4),
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: theme.spacing(12),
                          height: theme.spacing(12),
                          borderRadius: theme.borderRadius.full,
                          backgroundColor: avatarBg,
                          ...flexCenter,
                          color: avatarText,
                          fontWeight: "bold",
                          fontSize: theme.fontSize.lg,
                          border: `2px solid ${avatarBorder}`,
                          boxShadow: theme.boxShadow.sm,
                          flexShrink: 0,
                        }}
                      >
                        {member.name
                          ? member.name[0].toUpperCase()
                          : member.email[0].toUpperCase()}
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <h3
                          style={{
                            fontWeight: "bold",
                            color: textPrimary,
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing(2),
                          }}
                        >
                          {member.name || member.email}
                          {member.status === "PENDING" && (
                            <span
                              style={{
                                fontSize: "9px",
                                backgroundColor: pendingBg,
                                color: pendingText,
                                padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
                                borderRadius: theme.borderRadius.full,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontWeight: 900,
                              }}
                            >
                              Pending
                            </span>
                          )}
                        </h3>
                        <p style={{ fontSize: theme.fontSize.sm, color: textSecondary }}>
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {/* Right side: Permission + Role + Remove */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: theme.spacing(4),
                        justifyContent: isSmUp ? "flex-end" : "space-between",
                      }}
                    >
                      {/* Permission Column */}
                      <div style={{ textAlign: isSmUp ? "right" : "left" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isSmUp ? "flex-end" : "flex-start",
                            gap: theme.spacing(1),
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: textMuted,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: theme.spacing(1.5),
                          }}
                        >
                          <Shield size={12} /> Permission
                        </div>
                        <select
                          value={member.permission}
                          onChange={(e) =>
                            handleChangePermission(
                              member.userId,
                              e.target.value as PermissionLevel
                            )
                          }
                          style={{
                            backgroundColor: selectBg,
                            border: "none",
                            borderRadius: theme.borderRadius.lg,
                            fontSize: theme.fontSize.xs,
                            fontWeight: "bold",
                            color: selectText,
                            padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                            outline: "none",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.brand[500]}80`)
                          }
                          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                        >
                          <option value="VIEW">Viewer</option>
                          <option value="COMMENT">Commenter</option>
                          <option value="EDIT">Contributor</option>
                        </select>
                      </div>
                      {/* Role Column */}
                      <div style={{ textAlign: isSmUp ? "right" : "left" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isSmUp ? "flex-end" : "flex-start",
                            gap: theme.spacing(1),
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: textMuted,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: theme.spacing(1.5),
                          }}
                        >
                          Role
                        </div>
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: selectBg,
                            color: selectText,
                            fontSize: theme.fontSize.xs,
                            fontWeight: "bold",
                            padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                            borderRadius: theme.borderRadius.lg,
                          }}
                        >
                          {(member as any).role}
                        </span>
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(member.userId)}
                        style={{
                          padding: theme.spacing(2.5),
                          color: removeBtnColor,
                          background: "none",
                          border: "none",
                          borderRadius: theme.borderRadius.full,
                          cursor: "pointer",
                          transition: theme.transition.DEFAULT,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = removeBtnHoverBg;
                          e.currentTarget.style.color = removeBtnHoverText;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = removeBtnColor;
                        }}
                        title="Remove Member"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: theme.spacing(20),
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: theme.spacing(16),
                      height: theme.spacing(16),
                      backgroundColor: emptyIconBg,
                      borderRadius: theme.borderRadius.full,
                      ...flexCenter,
                      color: emptyIconColor,
                      marginBottom: theme.spacing(4),
                    }}
                  >
                    <Heart size={32} />
                  </div>
                  <h3
                    style={{
                      fontSize: theme.fontSize.lg,
                      fontWeight: "bold",
                      color: textPrimary,
                      marginBottom: theme.spacing(2),
                    }}
                  >
                    No family members yet
                  </h3>
                  <p style={{ color: textSecondary, maxWidth: "20rem", margin: "0 auto" }}>
                    Invite your family to start building a collective history together.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shared Memories Card */}
          <div
            style={{
              backgroundColor: cardBg,
              borderRadius: theme.borderRadius["2xl"],
              boxShadow: theme.boxShadow.lg,
              border: `1px solid ${cardBorder}`,
              overflow: "hidden",
              marginBottom: theme.spacing(8),
            }}
          >
            <div
              style={{
                padding: theme.spacing(6),
                borderBottom: `1px solid ${divideColor}`,
                display: "flex",
                flexDirection: isSmUp ? "row" : "column",
                alignItems: isSmUp ? "center" : "flex-start",
                justifyContent: "space-between",
                gap: theme.spacing(4),
                backgroundColor: cardHeaderBg,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(3) }}>
                <div
                  style={{
                    padding: theme.spacing(3),
                    backgroundColor: theme.colors.brand[800],
                    borderRadius: theme.borderRadius.xl,
                  }}
                >
                  <BookOpen size={32} style={{ color: theme.colors.amber[400] }} />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: theme.fontSize.xl,
                      fontWeight: "bold",
                      color: textPrimary,
                    }}
                  >
                    Shared Memories ({familyMemories.length})
                  </h2>
                  <p style={{ fontSize: theme.fontSize.sm, color: textSecondary }}>
                    Stories contributed by your family
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: theme.spacing(6),
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: theme.spacing(6),
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    padding: theme.spacing(20),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.colors.stone[400],
                  }}
                >
                  <Loader2
                    size={32}
                    style={{ marginBottom: theme.spacing(4) }}
                    className="animate-spin"
                  />
                  <p style={{ fontSize: theme.fontSize.sm }}>Loading shared memories...</p>
                </div>
              ) : familyMemories.length > 0 ? (
                familyMemories.map((memory) => (
                  <div
                    key={memory._id}
                    className="memory-card"
                    onClick={() => openMemoryModal(memory)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: isDark
                        ? theme.colors.brand[900] + "cc"
                        : theme.colors.white,
                      borderRadius: theme.borderRadius.xl,
                      boxShadow: theme.boxShadow.md,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = theme.boxShadow.lg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = theme.boxShadow.md;
                    }}
                  >
                    {/* Cover Image or Placeholder */}
                    <div style={{ position: "relative", height: "180px" }}>
                      {memory.images && memory.images.length > 0 ? (
                        <>
                          <img
                            src={memory.images[0].url}
                            alt="Memory cover"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          {memory.images.length > 1 && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: theme.spacing(2),
                                right: theme.spacing(2),
                                backgroundColor: "rgba(0,0,0,0.6)",
                                color: theme.colors.white,
                                padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                                borderRadius: theme.borderRadius.full,
                                fontSize: theme.fontSize.xs,
                                fontWeight: "bold",
                              }}
                            >
                              +{memory.images.length - 1}
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: emptyIconBg,
                            ...flexCenter,
                          }}
                        >
                          <ImageIcon size={48} style={{ color: emptyIconColor }} />
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div
                      style={{
                        padding: theme.spacing(4),
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: theme.fontSize.lg,
                          fontWeight: "bold",
                          color: textPrimary,
                          marginBottom: theme.spacing(2),
                        }}
                      >
                        {memory.title}
                      </h3>
                      <p
                        style={{
                          fontSize: theme.fontSize.sm,
                          color: textSecondary,
                          lineHeight: 1.6,
                          marginBottom: theme.spacing(4),
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {memory.description}
                      </p>
                      <div style={{ marginTop: "auto" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: theme.spacing(2),
                          }}
                        >
                          <span
                            style={{
                              fontSize: theme.fontSize.xs,
                              color: textMuted,
                              textTransform: "uppercase",
                              fontWeight: "bold",
                            }}
                          >
                            {memory.lifeStage}
                          </span>
                          <span style={{ fontSize: theme.fontSize.xs, color: textMuted }}>
                            {new Date(memory.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: theme.spacing(2),
                            }}
                          >
                            <div
                              style={{
                                width: theme.spacing(6),
                                height: theme.spacing(6),
                                borderRadius: theme.borderRadius.full,
                                backgroundColor: avatarBg,
                                ...flexCenter,
                                color: avatarText,
                                fontSize: theme.fontSize.xs,
                                fontWeight: "bold",
                              }}
                            >
                              {memory.userId?.username
                                ? memory.userId.username[0].toUpperCase()
                                : "?"}
                            </div>
                            <span style={{ fontSize: theme.fontSize.sm, color: textPrimary }}>
                              {memory.userId?.username || "Family Member"}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: theme.spacing(1),
                              color: textSecondary,
                            }}
                          >
                            <MessageCircle size={16} />
                            <span style={{ fontSize: theme.fontSize.sm }}>
                              {memory.comments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    padding: theme.spacing(20),
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: theme.spacing(16),
                      height: theme.spacing(16),
                      backgroundColor: emptyIconBg,
                      borderRadius: theme.borderRadius.full,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: emptyIconColor,
                      marginBottom: theme.spacing(4),
                    }}
                  >
                    <BookOpen size={32} />
                  </div>
                  <h3
                    style={{
                      fontSize: theme.fontSize.lg,
                      fontWeight: "bold",
                      color: textPrimary,
                      marginBottom: theme.spacing(2),
                    }}
                  >
                    No shared memories yet
                  </h3>
                  <p style={{ color: textSecondary, maxWidth: "20rem", margin: "0 auto" }}>
                    When your family contributes stories, they will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Permissions Guide */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMdUp ? "repeat(3, 1fr)" : "1fr",
              gap: theme.spacing(6),
            }}
          >
            <div
              style={{
                backgroundColor: guideCardBg,
                padding: theme.spacing(6),
                borderRadius: theme.borderRadius["2xl"],
                border: `1px solid ${guideCardBorder}`,
                boxShadow: theme.boxShadow.sm,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  color: isDark ? theme.colors.stone[300] : theme.colors.stone[900],
                  fontWeight: 900,
                  fontSize: theme.fontSize.xs,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: theme.spacing(3),
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                }}
              >
                <div
                  style={{
                    width: theme.spacing(2),
                    height: theme.spacing(2),
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: viewerDot,
                  }}
                />
                Viewer
              </div>
              <p style={{ fontSize: theme.fontSize.sm, color: textSecondary, lineHeight: 1.625 }}>
                Can read your timeline and view all attached media. Cannot interact or edit.
              </p>
            </div>
            <div
              style={{
                backgroundColor: guideCardBg,
                padding: theme.spacing(6),
                borderRadius: theme.borderRadius["2xl"],
                border: `1px solid ${guideCardBorder}`,
                boxShadow: theme.boxShadow.sm,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  color: commenterDot,
                  fontWeight: 900,
                  fontSize: theme.fontSize.xs,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: theme.spacing(3),
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                }}
              >
                <div
                  style={{
                    width: theme.spacing(2),
                    height: theme.spacing(2),
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: commenterDot,
                  }}
                />
                Commenter
              </div>
              <p style={{ fontSize: theme.fontSize.sm, color: textSecondary, lineHeight: 1.625 }}>
                Can view content and add reactions or comments to your shared stories.
              </p>
            </div>
            <div
              style={{
                backgroundColor: guideCardBg,
                padding: theme.spacing(6),
                borderRadius: theme.borderRadius["2xl"],
                border: `1px solid ${guideCardBorder}`,
                boxShadow: theme.boxShadow.sm,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  color: contributorDot,
                  fontWeight: 900,
                  fontSize: theme.fontSize.xs,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: theme.spacing(3),
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                }}
              >
                <div
                  style={{
                    width: theme.spacing(2),
                    height: theme.spacing(2),
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: contributorDot,
                  }}
                />
                Contributor
              </div>
              <p style={{ fontSize: theme.fontSize.sm, color: textSecondary, lineHeight: 1.625 }}>
                Can add new memories and edit existing details. Perfect for spouses or siblings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
            padding: theme.spacing(4),
            animation: "fade-in 0.2s ease-out",
          }}
        >
          <div
            style={{
              backgroundColor: modalBg,
              borderRadius: theme.borderRadius["3xl"],
              boxShadow: theme.boxShadow["2xl"],
              width: "100%",
              maxWidth: "28rem",
              overflow: "hidden",
              border: `1px solid ${modalBorder}`,
            }}
          >
            <div
              style={{
                padding: `${theme.spacing(6)} ${theme.spacing(8)}`,
                borderBottom: `1px solid ${modalHeaderBorder}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: modalHeaderBg,
              }}
            >
              <h3
                style={{
                  fontSize: theme.fontSize.xl,
                  fontWeight: "bold",
                  color: textPrimary,
                }}
              >
                Send Invitation
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                style={{
                  padding: theme.spacing(2),
                  background: "none",
                  border: "none",
                  borderRadius: theme.borderRadius.full,
                  cursor: "pointer",
                  transition: theme.transition.DEFAULT,
                  color: isDark ? theme.colors.brand[400] : theme.colors.stone[600],
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? theme.colors.brand[800]
                    : theme.colors.stone[200];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleInvite}
              style={{
                padding: theme.spacing(8),
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(6),
                textAlign: "left",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: theme.fontSize.xs,
                    fontWeight: 900,
                    color: labelColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: theme.spacing(2),
                    marginLeft: theme.spacing(1),
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={18}
                    style={{
                      position: "absolute",
                      left: theme.spacing(4),
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: theme.colors.stone[400],
                    }}
                  />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    style={{
                      width: "100%",
                      paddingLeft: theme.spacing(12),
                      paddingRight: theme.spacing(4),
                      paddingTop: theme.spacing(3),
                      paddingBottom: theme.spacing(3),
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius["2xl"],
                      color: inputText,
                      outline: "none",
                    }}
                    placeholder="family@email.com"
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.brand[500]}80`)
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: theme.fontSize.xs,
                    fontWeight: 900,
                    color: labelColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: theme.spacing(2),
                    marginLeft: theme.spacing(1),
                  }}
                >
                  Choose Access Level
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing(3) }}>
                  {[
                    { id: "VIEW", title: "Viewer", desc: "Read-only access" },
                    { id: "COMMENT", title: "Commenter", desc: "Can add reactions" },
                    { id: "EDIT", title: "Contributor", desc: "Full editing rights" },
                  ].map((opt) => {
                    const isActive = invitePermission === opt.id;
                    return (
                      <label
                        key={opt.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          padding: theme.spacing(4),
                          border: `1px solid ${
                            isActive ? radioOptionActiveBorder : radioOptionBorder
                          }`,
                          borderRadius: theme.borderRadius["2xl"],
                          cursor: "pointer",
                          transition: theme.transition.DEFAULT,
                          backgroundColor: isActive
                            ? radioOptionActiveBg
                            : isDark
                            ? theme.colors.brand[900]
                            : "transparent",
                          boxShadow: isActive ? `0 0 0 2px ${radioOptionActiveRing}` : "none",
                        }}
                      >
                        <input
                          type="radio"
                          name="perm"
                          value={opt.id}
                          checked={isActive}
                          onChange={() => setInvitePermission(opt.id as PermissionLevel)}
                          style={{
                            marginTop: theme.spacing(1),
                            marginRight: theme.spacing(4),
                            accentColor: theme.colors.brand[600],
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: theme.fontSize.sm,
                              color: radioOptionText,
                            }}
                          >
                            {opt.title}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: radioOptionDesc,
                              textTransform: "uppercase",
                              letterSpacing: "0.025em",
                              fontWeight: 500,
                            }}
                          >
                            {opt.desc}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  backgroundColor: submitBtnBg,
                  color: theme.colors.white,
                  padding: theme.spacing(4),
                  borderRadius: theme.borderRadius["2xl"],
                  fontWeight: "bold",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: `0 20px 25px -5px ${theme.colors.brand[900]}33`,
                  transition: theme.transition.DEFAULT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.spacing(2),
                  opacity: isSubmitting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = submitBtnHoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = submitBtnBg;
                  }
                }}
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <UserPlus size={20} />
                )}
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Memory Detail Modal */}
      {isMemoryModalOpen && selectedMemory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 70,
            padding: theme.spacing(4),
            animation: "fade-in 0.2s ease-out",
          }}
        >
          <div
            style={{
              backgroundColor: modalBg,
              borderRadius: theme.borderRadius["2xl"],
              boxShadow: theme.boxShadow["2xl"],
              width: "100%",
              maxWidth: "56rem",
              maxHeight: "90vh",
              overflow: "auto",
              border: `1px solid ${modalBorder}`,
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: `${theme.spacing(6)} ${theme.spacing(8)}`,
                borderBottom: `1px solid ${modalHeaderBorder}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: modalHeaderBg,
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <h3
                style={{
                  fontSize: theme.fontSize.xl,
                  fontWeight: "bold",
                  color: textPrimary,
                }}
              >
                Memory Details
              </h3>
              <div style={{ display: "flex", gap: theme.spacing(2) }}>
                {/* Edit button – ALWAYS ENABLED, always clickable */}
                <button
                  onClick={openEditModal}
                  style={{
                    padding: theme.spacing(2),
                    background: "none",
                    border: "none",
                    borderRadius: theme.borderRadius.full,
                    cursor: "pointer",
                    color: theme.colors.brand[500],
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? theme.colors.brand[800]
                      : theme.colors.stone[200];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  title={
                    canEditSelectedMemory
                      ? "Edit Memory"
                      : "You may not have permission to edit this memory (API will enforce)"
                  }
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={closeMemoryModal}
                  style={{
                    padding: theme.spacing(2),
                    background: "none",
                    border: "none",
                    borderRadius: theme.borderRadius.full,
                    cursor: "pointer",
                    transition: theme.transition.DEFAULT,
                    color: isDark ? theme.colors.brand[400] : theme.colors.stone[600],
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? theme.colors.brand[800]
                      : theme.colors.stone[200];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* Modal Body */}
            <div style={{ padding: theme.spacing(8) }}>
              {/* Contributor info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(4),
                  marginBottom: theme.spacing(6),
                }}
              >
                <div
                  style={{
                    width: theme.spacing(14),
                    height: theme.spacing(14),
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: avatarText,
                    fontWeight: "bold",
                    fontSize: theme.fontSize.xl,
                    border: `2px solid ${avatarBorder}`,
                  }}
                >
                  {selectedMemory.userId?.username
                    ? selectedMemory.userId.username[0].toUpperCase()
                    : "?"}
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: theme.fontSize.lg,
                      fontWeight: "bold",
                      color: textPrimary,
                    }}
                  >
                    {selectedMemory.userId?.username || "Family Member"}
                  </h4>
                  <p style={{ color: textMuted, fontSize: theme.fontSize.sm }}>
                    Shared on{" "}
                    {new Date(selectedMemory.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {/* Title and life stage */}
              <h2
                style={{
                  fontSize: theme.fontSize["2xl"],
                  fontWeight: "bold",
                  color: textPrimary,
                  marginBottom: theme.spacing(2),
                }}
              >
                {selectedMemory.title}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                  marginBottom: theme.spacing(6),
                }}
              >
                <span
                  style={{
                    backgroundColor: theme.colors.brand[800],
                    color: theme.colors.amber[400],
                    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.fontSize.xs,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {selectedMemory.lifeStage}
                </span>
              </div>
              {/* Description */}
              <div style={{ marginBottom: theme.spacing(8) }}>
                <h5
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: "bold",
                    color: textPrimary,
                    marginBottom: theme.spacing(3),
                  }}
                >
                  Story
                </h5>
                <p
                  style={{
                    color: textSecondary,
                    lineHeight: 1.8,
                    fontSize: theme.fontSize.base,
                  }}
                >
                  {selectedMemory.description}
                </p>
              </div>
              {/* Images Gallery */}
              {selectedMemory.images && selectedMemory.images.length > 0 && (
                <div>
                  <h5
                    style={{
                      fontSize: theme.fontSize.lg,
                      fontWeight: "bold",
                      color: textPrimary,
                      marginBottom: theme.spacing(4),
                    }}
                  >
                    Photos ({selectedMemory.images.length})
                  </h5>
                  {/* Main image with navigation */}
                  <div style={{ position: "relative", marginBottom: theme.spacing(4) }}>
                    <div
                      style={{
                        width: "100%",
                        height: "400px",
                        borderRadius: theme.borderRadius.xl,
                        overflow: "hidden",
                        border: `1px solid ${cardBorder}`,
                        backgroundColor: isDark
                          ? theme.colors.brand[900]
                          : theme.colors.stone[100],
                      }}
                    >
                      <img
                        src={selectedMemory.images[currentImageIndex].url}
                        alt={`Memory ${currentImageIndex + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                    {selectedMemory.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          style={{
                            position: "absolute",
                            left: theme.spacing(4),
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: theme.colors.white,
                            border: "none",
                            borderRadius: theme.borderRadius.full,
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.7)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
                          }
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          style={{
                            position: "absolute",
                            right: theme.spacing(4),
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: theme.colors.white,
                            border: "none",
                            borderRadius: theme.borderRadius.full,
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.7)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
                          }
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  <div style={{ display: "flex", gap: theme.spacing(3), flexWrap: "wrap" }}>
                    {selectedMemory.images.map((img: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: theme.borderRadius.lg,
                          overflow: "hidden",
                          border:
                            idx === currentImageIndex
                              ? `2px solid ${theme.colors.brand[600]}`
                              : `1px solid ${cardBorder}`,
                          cursor: "pointer",
                          opacity: idx === currentImageIndex ? 1 : 0.7,
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity =
                            idx === currentImageIndex ? "1" : "0.7")
                        }
                      >
                        <img
                          src={img.url}
                          alt={`Thumbnail ${idx + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* ===== COMMENTS SECTION ===== */}
              <div style={{ marginTop: theme.spacing(10) }}>
                <h5
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: "bold",
                    color: textPrimary,
                    marginBottom: theme.spacing(4),
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing(2),
                  }}
                >
                  <MessageCircle size={20} /> Comments ({selectedMemory.comments?.length || 0})
                </h5>
                {/* Comment list */}
                <div
                  style={{
                    marginBottom: theme.spacing(6),
                    maxHeight: "300px",
                    overflowY: "auto",
                    paddingRight: theme.spacing(2),
                  }}
                >
                  {selectedMemory.comments && selectedMemory.comments.length > 0 ? (
                    selectedMemory.comments.map((comment: any) => (
                      <div
                        key={comment._id}
                        style={{
                          display: "flex",
                          gap: theme.spacing(3),
                          marginBottom: theme.spacing(4),
                          padding: theme.spacing(3),
                          backgroundColor: commentBg,
                          borderRadius: theme.borderRadius.lg,
                        }}
                      >
                        <div
                          style={{
                            width: theme.spacing(8),
                            height: theme.spacing(8),
                            borderRadius: theme.borderRadius.full,
                            backgroundColor: avatarBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: avatarText,
                            fontWeight: "bold",
                            fontSize: theme.fontSize.sm,
                            flexShrink: 0,
                          }}
                        >
                          {comment.userId?.username
                            ? comment.userId.username[0].toUpperCase()
                            : "?"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: theme.spacing(1),
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "bold",
                                color: textPrimary,
                                fontSize: theme.fontSize.sm,
                              }}
                            >
                              {comment.userId?.username || "Family Member"}
                            </span>
                            <span style={{ color: textMuted, fontSize: theme.fontSize.xs }}>
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p
                            style={{
                              color: commentText,
                              fontSize: theme.fontSize.sm,
                              lineHeight: 1.5,
                            }}
                          >
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p
                      style={{
                        color: textMuted,
                        textAlign: "center",
                        padding: theme.spacing(4),
                      }}
                    >
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  )}
                </div>
                {/* Add comment form */}
                <form onSubmit={handleAddComment} style={{ display: "flex", gap: theme.spacing(3) }}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{
                      flex: 1,
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius.full,
                      padding: `${theme.spacing(2.5)} ${theme.spacing(4)}`,
                      color: inputText,
                      outline: "none",
                      fontSize: theme.fontSize.sm,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.brand[500]}80`)
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  />
                  <button
                    type="submit"
                    disabled={isCommentSubmitting || !newComment.trim()}
                    style={{
                      backgroundColor: theme.colors.brand[600],
                      color: theme.colors.white,
                      border: "none",
                      borderRadius: theme.borderRadius.full,
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: isCommentSubmitting ? "not-allowed" : "pointer",
                      opacity: isCommentSubmitting || !newComment.trim() ? 0.5 : 1,
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isCommentSubmitting && newComment.trim()) {
                        e.currentTarget.style.backgroundColor = theme.colors.brand[700];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCommentSubmitting) {
                        e.currentTarget.style.backgroundColor = theme.colors.brand[600];
                      }
                    }}
                  >
                    {isCommentSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Memory Modal */}
      {isEditModalOpen && editMemoryData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 80,
            padding: theme.spacing(4),
            animation: "fade-in 0.2s ease-out",
          }}
        >
          <div
            style={{
              backgroundColor: modalBg,
              borderRadius: theme.borderRadius["2xl"],
              boxShadow: theme.boxShadow["2xl"],
              width: "100%",
              maxWidth: "42rem",
              maxHeight: "90vh",
              overflow: "auto",
              border: `1px solid ${modalBorder}`,
            }}
          >
            <div
              style={{
                padding: `${theme.spacing(6)} ${theme.spacing(8)}`,
                borderBottom: `1px solid ${modalHeaderBorder}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: modalHeaderBg,
              }}
            >
              <h3
                style={{
                  fontSize: theme.fontSize.xl,
                  fontWeight: "bold",
                  color: textPrimary,
                }}
              >
                Edit Memory
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  padding: theme.spacing(2),
                  background: "none",
                  border: "none",
                  borderRadius: theme.borderRadius.full,
                  cursor: "pointer",
                  color: isDark ? theme.colors.brand[400] : theme.colors.stone[600],
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleEditSubmit}
              style={{
                padding: theme.spacing(8),
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(6),
              }}
            >
              {/* Title */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: theme.fontSize.xs,
                    fontWeight: 900,
                    color: labelColor,
                    textTransform: "uppercase",
                    marginBottom: theme.spacing(2),
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editMemoryData.title}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: "100%",
                    padding: theme.spacing(3),
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: theme.borderRadius.lg,
                    color: inputText,
                  }}
                />
              </div>
              {/* Description */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: theme.fontSize.xs,
                    fontWeight: 900,
                    color: labelColor,
                    textTransform: "uppercase",
                    marginBottom: theme.spacing(2),
                  }}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={editMemoryData.description}
                  onChange={handleEditChange}
                  required
                  rows={4}
                  style={{
                    width: "100%",
                    padding: theme.spacing(3),
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: theme.borderRadius.lg,
                    color: inputText,
                    resize: "vertical",
                  }}
                />
              </div>
              {/* Life Stage */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: theme.fontSize.xs,
                    fontWeight: 900,
                    color: labelColor,
                    textTransform: "uppercase",
                    marginBottom: theme.spacing(2),
                  }}
                >
                  Life Stage
                </label>
                <select
                  name="lifeStage"
                  value={editMemoryData.lifeStage}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: theme.spacing(3),
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: theme.borderRadius.lg,
                    color: inputText,
                  }}
                >
                  <option value="EARLY_YEARS">Early Years</option>
                  <option value="SCHOOL_YEARS">School Years</option>
                  <option value="COLLEGE">College</option>
                  <option value="MARRIAGE_RELATIONSHIPS">Marriage & Relationships</option>
                  <option value="CAREER">Career</option>
                  <option value="RETIREMENT_REFLECTIONS">Retirement & Reflections</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              {/* Date */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: theme.fontSize.xs,
                    fontWeight: 900,
                    color: labelColor,
                    textTransform: "uppercase",
                    marginBottom: theme.spacing(2),
                  }}
                >
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={editMemoryData.date}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: "100%",
                    padding: theme.spacing(3),
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: theme.borderRadius.lg,
                    color: inputText,
                  }}
                />
              </div>
              {/* Images */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: theme.fontSize.xs,
                    fontWeight: 900,
                    color: labelColor,
                    textTransform: "uppercase",
                    marginBottom: theme.spacing(2),
                  }}
                >
                  Photos
                </label>
                {selectedMemory?.images?.length > 0 && (
                  <div style={{ marginBottom: theme.spacing(4) }}>
                    <p
                      style={{
                        fontSize: theme.fontSize.sm,
                        color: textSecondary,
                        marginBottom: theme.spacing(2),
                      }}
                    >
                      Current images (click to mark for removal):
                    </p>
                    <div style={{ display: "flex", gap: theme.spacing(3), flexWrap: "wrap" }}>
                      {selectedMemory.images.map((img: any) => (
                        <div key={img.publicId} style={{ position: "relative" }}>
                          <div
                            onClick={() => toggleRemoveImage(img.publicId)}
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: theme.borderRadius.lg,
                              overflow: "hidden",
                              border: removedImages.includes(img.publicId)
                                ? `2px solid ${theme.colors.rose[500]}`
                                : `1px solid ${cardBorder}`,
                              opacity: removedImages.includes(img.publicId) ? 0.5 : 1,
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src={img.url}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                          {removedImages.includes(img.publicId) && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: theme.colors.rose[500],
                                color: "white",
                                borderRadius: theme.borderRadius.full,
                                width: "20px",
                                height: "20px",
                                ...flexCenter,
                              }}
                            >
                              <X size={12} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label
                    style={{
                      fontSize: theme.fontSize.sm,
                      color: textSecondary,
                      marginBottom: theme.spacing(2),
                      display: "block",
                    }}
                  >
                    Add new images (max 10 total):
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleNewImages}
                    style={{ color: textSecondary }}
                  />
                  {newImages.length > 0 && (
                    <p
                      style={{
                        fontSize: theme.fontSize.xs,
                        color: textMuted,
                        marginTop: theme.spacing(2),
                      }}
                    >
                      {newImages.length} new image(s) selected
                    </p>
                  )}
                </div>
              </div>
              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: theme.spacing(4), justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
                    backgroundColor: "transparent",
                    border: `1px solid ${inputBorder}`,
                    borderRadius: theme.borderRadius.full,
                    color: textSecondary,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  style={{
                    padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
                    backgroundColor: theme.colors.brand[600],
                    border: "none",
                    borderRadius: theme.borderRadius.full,
                    color: "white",
                    fontWeight: "bold",
                    cursor: isEditSubmitting ? "not-allowed" : "pointer",
                    opacity: isEditSubmitting ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing(2),
                  }}
                >
                  {isEditSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Edit3 size={18} />
                  )}
                  {isEditSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FamilyPage;