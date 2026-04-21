"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  X,
  Upload,
  Calendar,
  Trash2,
  AlertCircle,
  Save,
  MapPin,
  Tag,
  Smile,
  Lock,
  Unlock,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LifeStage, Memory, MediaType } from "../../types";
import { useMemories } from "../../context/MemoryContext";
import { useTheme } from "../../context/ThemeContext";
import theme from "../theme";

// ========== RESPONSIVE & DARK MODE HOOKS ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
};

const useIsDark = () => {
  const { theme: themeMode } = useTheme();
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  return themeMode === "dark" ? true : themeMode === "light" ? false : systemDark;
};

// ========== TYPES ==========
interface ExistingImage {
  publicId: string;
  url: string;
  caption: string;
  altText: string;
  location: string;
  _id?: string;
}

interface NewImageFile {
  file: File;
  previewUrl: string;
  caption: string;
  altText: string;
  location: string;
}

type ImageItem =
  | { type: "existing"; data: ExistingImage }
  | { type: "new"; data: NewImageFile; index: number };

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Memory | null;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// ========== SORTABLE IMAGE CARD (MOBILE-FRIENDLY) ==========
interface SortableImageCardProps {
  item: ImageItem;
  onRemove: () => void;
  onFieldChange: (field: string, value: string) => void;
  isSubmitting: boolean;
  isDark: boolean;
}

const SortableImageCard: React.FC<SortableImageCardProps> = ({
  item,
  onRemove,
  onFieldChange,
  isSubmitting,
  isDark,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: getItemId(item) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  const borderColor = isDark ? theme.dark.borderSubtle : theme.light.border;
  const bgInput = isDark ? theme.dark.bgInput : theme.light.bgInput;
  const textPrimary = isDark ? theme.dark.text : theme.light.text;
  const inputBorder = isDark ? theme.dark.border : theme.light.border;
  const focusRingStyle = `0 0 0 2px ${
    isDark ? "rgba(16, 185, 129, 0.5)" : "rgba(5, 150, 105, 0.4)"
  }`;

  const imageUrl = item.type === "existing" ? item.data.url : item.data.previewUrl;
  const caption = item.type === "existing" ? item.data.caption : item.data.caption;
  const altText = item.type === "existing" ? item.data.altText : item.data.altText;
  const location = item.type === "existing" ? item.data.location : item.data.location;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative border rounded-xl p-4 bg-opacity-50 transition-shadow"
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Draggable image area */}
      <div
        {...attributes}
        {...listeners}
        className="relative w-full h-48 rounded-lg overflow-hidden mb-3 cursor-grab active:cursor-grabbing touch-manipulation"
        style={{ touchAction: "none" }}
      >
        <img
          src={imageUrl}
          alt={altText || "Memory"}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        {/* Visual drag handle indicator */}
        <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-sm p-1.5 rounded-full text-white">
          <GripVertical size={18} />
        </div>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        disabled={isSubmitting}
        className="absolute top-4 right-4 bg-rose-500 text-white rounded-full p-1.5 shadow-sm hover:bg-rose-600 transition z-10"
      >
        <Trash2 size={16} />
      </button>

      {/* Metadata fields */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => onFieldChange("caption", e.target.value)}
          disabled={isSubmitting}
          className="w-full px-3 py-2 text-sm border rounded-md"
          style={{
            borderColor: inputBorder,
            backgroundColor: bgInput,
            color: textPrimary,
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
        <input
          type="text"
          placeholder="Alt text (accessibility)"
          value={altText}
          onChange={(e) => onFieldChange("altText", e.target.value)}
          disabled={isSubmitting}
          className="w-full px-3 py-2 text-sm border rounded-md"
          style={{
            borderColor: inputBorder,
            backgroundColor: bgInput,
            color: textPrimary,
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
        <input
          type="text"
          placeholder="Photo location (optional)"
          value={location}
          onChange={(e) => onFieldChange("location", e.target.value)}
          disabled={isSubmitting}
          className="w-full px-3 py-2 text-sm border rounded-md"
          style={{
            borderColor: inputBorder,
            backgroundColor: bgInput,
            color: textPrimary,
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>
    </div>
  );
};

// Helper to generate a stable ID for dnd-kit
const getItemId = (item: ImageItem): string => {
  if (item.type === "existing") return `existing-${item.data.publicId}`;
  return `new-${item.index}`;
};

const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addMemory, updateMemory } = useMemories();

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  const isDark = useIsDark();
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lifeStage, setLifeStage] = useState<LifeStage>(LifeStage.EARLY_YEARS);
  const [isPrivate, setIsPrivate] = useState(false);
  const [location, setLocation] = useState("");
  const [mood, setMood] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Unified image state
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const newImageCounter = useRef(0);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const totalImagesCount = imageItems.length;

  // Cleanup preview URLs on unmount or when items change
  useEffect(() => {
    return () => {
      imageItems.forEach((item) => {
        if (item.type === "new") URL.revokeObjectURL(item.data.previewUrl);
      });
    };
  }, [imageItems]);

  // Initialize form from initialData when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDate(
        initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setLifeStage(initialData.lifeStage || LifeStage.EARLY_YEARS);
      setIsPrivate(initialData.isPrivate ?? false);
      setLocation(initialData.location || "");
      setMood(initialData.mood || "");
      setTagsInput((initialData.tags || []).join(", "));

      const existing: ImageItem[] = (initialData.images || []).map((img: any) => ({
        type: "existing",
        data: {
          publicId: img.publicId,
          url: img.url,
          caption: img.caption || "",
          altText: img.altText || "",
          location: img.location || "",
        },
      }));
      setImageItems(existing);
      setRemovedImagePublicIds([]);
      newImageCounter.current = 0;
    } else {
      setTitle("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setLifeStage(LifeStage.EARLY_YEARS);
      setIsPrivate(false);
      setLocation("");
      setMood("");
      setTagsInput("");
      setImageItems([]);
      setRemovedImagePublicIds([]);
      newImageCounter.current = 0;
    }

    setIsSaved(false);
    setSubmitError(null);
    setFileValidationError(null);
  }, [isOpen, initialData]);

  // ========== FILE VALIDATION ==========
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { valid: false, error: `"${file.name}" is not a PNG or JPG image.` };
    }
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      return { valid: false, error: `"${file.name}" exceeds ${MAX_FILE_SIZE_MB} MB.` };
    }
    return { valid: true };
  };

  // ========== HANDLE NEW FILE SELECTION ==========
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setFileValidationError(null);
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const { valid, error } = validateFile(file);
      if (valid) validFiles.push(file);
      else errors.push(error!);
    });

    if (errors.length > 0) {
      setFileValidationError(errors.join(" "));
    }

    if (totalImagesCount + validFiles.length > MAX_FILES) {
      setFileValidationError(`You can upload up to ${MAX_FILES} images total.`);
      return;
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    const newItems: ImageItem[] = validFiles.map((file) => {
      const index = newImageCounter.current++;
      return {
        type: "new",
        data: {
          file,
          previewUrl: URL.createObjectURL(file),
          caption: "",
          altText: "",
          location: "",
        },
        index,
      };
    });

    setImageItems((prev) => [...prev, ...newItems]);
    setIsUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ========== REMOVE IMAGE ==========
  const handleRemoveImage = (item: ImageItem) => {
    if (item.type === "existing") {
      setRemovedImagePublicIds((prev) => [...prev, item.data.publicId]);
    } else {
      URL.revokeObjectURL(item.data.previewUrl);
    }
    setImageItems((prev) => prev.filter((i) => getItemId(i) !== getItemId(item)));
  };

  // ========== UPDATE IMAGE METADATA ==========
  const handleImageFieldChange = (item: ImageItem, field: string, value: string) => {
    setImageItems((prev) =>
      prev.map((i) => {
        if (getItemId(i) !== getItemId(item)) return i;
        if (i.type === "existing") {
          return {
            ...i,
            data: { ...i.data, [field]: value },
          };
        } else {
          return {
            ...i,
            data: { ...i.data, [field]: value },
          };
        }
      })
    );
  };

  // ========== DRAG END HANDLER ==========
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setImageItems((items) => {
      const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
      const newIndex = items.findIndex((item) => getItemId(item) === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // ========== SUBMIT ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFileValidationError(null);

    if (!initialData && totalImagesCount === 0) {
      setSubmitError("At least one image is required to create a memory.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("lifeStage", lifeStage);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("isPrivate", String(isPrivate));
      if (location) formData.append("location", location);
      if (mood) formData.append("mood", mood);
      if (tagsInput.trim()) {
        const tagsArray = tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
        formData.append("tags", JSON.stringify(tagsArray));
      }

      // Separate existing and new images in current order
      const orderedExisting = imageItems
        .filter((item): item is { type: "existing"; data: ExistingImage } => item.type === "existing")
        .map((item) => item.data);

      const orderedNew = imageItems.filter(
        (item): item is { type: "new"; data: NewImageFile; index: number } => item.type === "new"
      );

      formData.append("existingImages", JSON.stringify(orderedExisting));
      formData.append("removedImages", JSON.stringify(removedImagePublicIds));

      orderedNew.forEach((item) => {
        formData.append("images", item.data.file);
      });

      const newCaptions = orderedNew.map((item) => item.data.caption);
      const newAltTexts = orderedNew.map((item) => item.data.altText);
      const newImageLocations = orderedNew.map((item) => item.data.location);

      formData.append("captions", JSON.stringify(newCaptions));
      formData.append("altTexts", JSON.stringify(newAltTexts));
      formData.append("imageLocations", JSON.stringify(newImageLocations));

      if (initialData) {
        await updateMemory(initialData.id, formData);
      } else {
        await addMemory(formData);
      }

      setIsSaved(true);
    } catch (err: any) {
      console.error("Error saving memory:", err);
      setSubmitError(err.message || "Failed to save memory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // ========== THEME COLORS ==========
  const textPrimary = isDark ? theme.dark.text : theme.light.text;
  const textSecondary = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const textMuted = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const bgModal = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const bgInput = isDark ? theme.dark.bgInput : theme.light.bgInput;
  const borderColor = isDark ? theme.dark.borderSubtle : theme.light.border;
  const inputBorder = isDark ? theme.dark.border : theme.light.border;
  const brandColor = theme.colors.brand[500];
  const brandHover = isDark ? theme.colors.brand[400] : theme.colors.brand[600];
  const errorBg = isDark ? "rgba(244, 63, 94, 0.15)" : "#fef2f2";
  const errorText = isDark ? "#fb7185" : theme.colors.rose[500];
  const successIconBg = isDark ? theme.colors.brand[800] : theme.colors.brand[100];
  const successIconColor = isDark ? theme.colors.brand[300] : theme.colors.brand[600];
  const cancelBtnColor = textMuted;
  const cancelBtnHoverColor = isDark ? theme.colors.brand[300] : theme.colors.brand[700];
  const focusRingStyle = `0 0 0 2px ${
    isDark ? "rgba(16, 185, 129, 0.5)" : "rgba(5, 150, 105, 0.4)"
  }`;

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          padding: theme.spacing(4),
        }}
        onClick={onClose}
      >
        <div
          className="animate-slide-up"
          style={{
            backgroundColor: bgModal,
            borderRadius: theme.borderRadius["3xl"],
            width: "100%",
            maxWidth: isLgUp ? "1024px" : "900px",
            maxHeight: "90vh",
            overflow: "hidden",
            boxShadow: isDark
              ? theme.boxShadow["2xl"]
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isSaved ? (
            // Success screen
            <div
              style={{
                padding: theme.spacing(12),
                textAlign: "center",
                animation: "fade-in 0.3s ease-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: theme.spacing(20),
                  height: theme.spacing(20),
                  backgroundColor: successIconBg,
                  color: successIconColor,
                  borderRadius: theme.borderRadius.full,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: theme.spacing(6),
                  boxShadow: theme.boxShadow.green,
                }}
              >
                <Save size={48} />
              </div>
              <h2
                style={{
                  fontSize: theme.fontSize["3xl"],
                  fontFamily: theme.fontFamily.serif,
                  fontWeight: 700,
                  color: textPrimary,
                  marginBottom: theme.spacing(2),
                }}
              >
                Memory Preserved
              </h2>
              <p
                style={{
                  color: textMuted,
                  fontSize: theme.fontSize.lg,
                  maxWidth: "320px",
                  marginBottom: theme.spacing(8),
                }}
              >
                Your moment has been safely saved in the family archive.
              </p>
              <button
                onClick={onClose}
                style={{
                  padding: `${theme.spacing(3)} ${theme.spacing(10)}`,
                  backgroundColor: brandColor,
                  color: theme.colors.white,
                  borderRadius: theme.borderRadius.xl,
                  fontWeight: 700,
                  fontSize: theme.fontSize.lg,
                  border: "none",
                  cursor: "pointer",
                  transition: theme.transition.DEFAULT,
                  boxShadow: theme.boxShadow.green,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = brandHover;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = brandColor;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Back to Timeline
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div
                style={{
                  padding: `${theme.spacing(6)} ${theme.spacing(8)}`,
                  borderBottom: `1px solid ${borderColor}`,
                  position: "sticky",
                  top: 0,
                  backgroundColor: bgModal,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: theme.fontSize["3xl"],
                      fontFamily: theme.fontFamily.serif,
                      fontWeight: 700,
                      color: textPrimary,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {initialData ? "Edit Moment" : "New Memory"}
                  </h2>
                  <button
                    onClick={onClose}
                    style={{
                      padding: theme.spacing(2),
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: theme.borderRadius.full,
                      color: textMuted,
                      cursor: "pointer",
                      transition: theme.transition.DEFAULT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = textPrimary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                  >
                    <X size={28} />
                  </button>
                </div>
                <p
                  style={{
                    color: textMuted,
                    fontSize: theme.fontSize.sm,
                    marginTop: theme.spacing(2),
                  }}
                >
                  {initialData
                    ? "Update the details of your cherished moment."
                    : "Add a new memory to your family timeline."}
                </p>
              </div>

              {/* Form Content */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    padding: theme.spacing(8),
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing(8),
                  }}
                >
                  {/* Errors */}
                  {submitError && (
                    <div
                      style={{
                        padding: theme.spacing(4),
                        backgroundColor: errorBg,
                        color: errorText,
                        borderRadius: theme.borderRadius.lg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: theme.spacing(3),
                        fontSize: theme.fontSize.sm,
                        borderLeft: `4px solid ${errorText}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}>
                        <AlertCircle size={18} />
                        <span>{submitError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSubmitError(null)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: errorText,
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {fileValidationError && (
                    <div
                      style={{
                        padding: theme.spacing(4),
                        backgroundColor: errorBg,
                        color: errorText,
                        borderRadius: theme.borderRadius.lg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: theme.spacing(3),
                        fontSize: theme.fontSize.sm,
                        borderLeft: `4px solid ${errorText}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}>
                        <AlertCircle size={18} />
                        <span>{fileValidationError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFileValidationError(null)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: errorText,
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* Title + Date + Life Stage */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMdUp ? "1fr 0.8fr 1fr" : "1fr",
                      gap: theme.spacing(6),
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: theme.fontSize.sm,
                          fontWeight: 600,
                          color: textSecondary,
                          marginBottom: theme.spacing(2),
                        }}
                      >
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                          width: "100%",
                          padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                          border: `1px solid ${inputBorder}`,
                          borderRadius: theme.borderRadius.lg,
                          backgroundColor: bgInput,
                          color: textPrimary,
                          outline: "none",
                          fontSize: theme.fontSize.base,
                          transition: theme.transition.DEFAULT,
                        }}
                        onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                        placeholder="A moment to remember..."
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: theme.fontSize.sm,
                          fontWeight: 600,
                          color: textSecondary,
                          marginBottom: theme.spacing(2),
                        }}
                      >
                        Date *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Calendar
                          size={18}
                          style={{
                            position: "absolute",
                            left: theme.spacing(3),
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: textMuted,
                          }}
                        />
                        <input
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          style={{
                            width: "100%",
                            padding: `${theme.spacing(3)} ${theme.spacing(4)} ${theme.spacing(3)} ${theme.spacing(10)}`,
                            border: `1px solid ${inputBorder}`,
                            borderRadius: theme.borderRadius.lg,
                            backgroundColor: bgInput,
                            color: textPrimary,
                            outline: "none",
                            fontSize: theme.fontSize.base,
                            transition: theme.transition.DEFAULT,
                          }}
                          onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
                          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: theme.fontSize.sm,
                          fontWeight: 600,
                          color: textSecondary,
                          marginBottom: theme.spacing(2),
                        }}
                      >
                        Life Stage *
                      </label>
                      <select
                        value={lifeStage}
                        onChange={(e) => setLifeStage(e.target.value as LifeStage)}
                        style={{
                          width: "100%",
                          padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                          border: `1px solid ${inputBorder}`,
                          borderRadius: theme.borderRadius.lg,
                          backgroundColor: bgInput,
                          color: textPrimary,
                          outline: "none",
                          fontSize: theme.fontSize.base,
                          transition: theme.transition.DEFAULT,
                        }}
                        onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                      >
                        {Object.values(LifeStage).map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: theme.fontSize.sm,
                        fontWeight: 600,
                        color: textSecondary,
                        marginBottom: theme.spacing(2),
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      style={{
                        width: "100%",
                        padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: theme.borderRadius.lg,
                        backgroundColor: bgInput,
                        color: textPrimary,
                        outline: "none",
                        resize: "vertical",
                        fontSize: theme.fontSize.base,
                        transition: theme.transition.DEFAULT,
                      }}
                      onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
                      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                      placeholder="Write the story behind this memory..."
                    />
                  </div>

                  {/* Location, Mood, Tags */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMdUp ? "repeat(3, 1fr)" : "1fr",
                      gap: theme.spacing(6),
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: theme.fontSize.sm,
                          fontWeight: 600,
                          color: textSecondary,
                          marginBottom: theme.spacing(2),
                        }}
                      >
                        Location
                      </label>
                      <div style={{ position: "relative" }}>
                        <MapPin
                          size={18}
                          style={{
                            position: "absolute",
                            left: theme.spacing(3),
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: textMuted,
                          }}
                        />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          style={{
                            width: "100%",
                            padding: `${theme.spacing(3)} ${theme.spacing(4)} ${theme.spacing(3)} ${theme.spacing(10)}`,
                            border: `1px solid ${inputBorder}`,
                            borderRadius: theme.borderRadius.lg,
                            backgroundColor: bgInput,
                            color: textPrimary,
                            outline: "none",
                            fontSize: theme.fontSize.base,
                            transition: theme.transition.DEFAULT,
                          }}
                          onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
                          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                          placeholder="e.g., Paris, France"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: theme.fontSize.sm,
                          fontWeight: 600,
                          color: textSecondary,
                          marginBottom: theme.spacing(2),
                        }}
                      >
                        Mood
                      </label>
                      <div style={{ position: "relative" }}>
                        <Smile
                          size={18}
                          style={{
                            position: "absolute",
                            left: theme.spacing(3),
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: textMuted,
                          }}
                        />
                        <select
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                          style={{
                            width: "100%",
                            padding: `${theme.spacing(3)} ${theme.spacing(4)} ${theme.spacing(3)} ${theme.spacing(10)}`,
                            border: `1px solid ${inputBorder}`,
                            borderRadius: theme.borderRadius.lg,
                            backgroundColor: bgInput,
                            color: textPrimary,
                            outline: "none",
                            fontSize: theme.fontSize.base,
                            transition: theme.transition.DEFAULT,
                            appearance: "none",
                          }}
                          onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
                          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                        >
                          <option value="">Select mood</option>
                          <option value="happy">😊 Happy</option>
                          <option value="nostalgic">🕰️ Nostalgic</option>
                          <option value="funny">😂 Funny</option>
                          <option value="sad">😢 Sad</option>
                          <option value="exciting">🎉 Exciting</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: theme.fontSize.sm,
                          fontWeight: 600,
                          color: textSecondary,
                          marginBottom: theme.spacing(2),
                        }}
                      >
                        Tags
                      </label>
                      <div style={{ position: "relative" }}>
                        <Tag
                          size={18}
                          style={{
                            position: "absolute",
                            left: theme.spacing(3),
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: textMuted,
                          }}
                        />
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          style={{
                            width: "100%",
                            padding: `${theme.spacing(3)} ${theme.spacing(4)} ${theme.spacing(3)} ${theme.spacing(10)}`,
                            border: `1px solid ${inputBorder}`,
                            borderRadius: theme.borderRadius.lg,
                            backgroundColor: bgInput,
                            color: textPrimary,
                            outline: "none",
                            fontSize: theme.fontSize.base,
                            transition: theme.transition.DEFAULT,
                          }}
                          onFocus={(e) => (e.currentTarget.style.boxShadow = focusRingStyle)}
                          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                          placeholder="vacation, family, beach"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media Upload Section */}
                  <div
                    style={{
                      paddingTop: theme.spacing(4),
                      borderTop: `1px solid ${borderColor}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: theme.spacing(4),
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: theme.fontSize.sm,
                          fontWeight: 600,
                          color: textSecondary,
                          marginBottom: theme.spacing(2),
                        }}
                      >
                        Images *
                      </label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: theme.spacing(4),
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isSubmitting || totalImagesCount >= MAX_FILES}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing(2),
                            padding: `${theme.spacing(3)} ${theme.spacing(7)}`,
                            backgroundColor: brandColor,
                            color: theme.colors.white,
                            borderRadius: theme.borderRadius.xl,
                            fontWeight: 600,
                            fontSize: theme.fontSize.base,
                            border: "none",
                            cursor:
                              isSubmitting || totalImagesCount >= MAX_FILES
                                ? "not-allowed"
                                : "pointer",
                            transition: theme.transition.DEFAULT,
                            boxShadow: theme.boxShadow.green,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubmitting && totalImagesCount < MAX_FILES)
                              e.currentTarget.style.backgroundColor = brandHover;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = brandColor;
                          }}
                        >
                          <Upload size={18} />
                          {isUploading ? "Processing..." : "Upload Images"}
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                          accept="image/png,image/jpeg,image/jpg"
                          multiple
                          disabled={isSubmitting || totalImagesCount >= MAX_FILES}
                        />
                        {totalImagesCount > 0 && (
                          <span
                            style={{
                              color: textMuted,
                              fontSize: theme.fontSize.sm,
                              fontWeight: 500,
                            }}
                          >
                            {totalImagesCount} of {MAX_FILES} images
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: theme.fontSize.xs,
                          color: textMuted,
                          marginTop: theme.spacing(2),
                        }}
                      >
                        JPG or PNG only • Max 5 images • 5 MB each • Drag to reorder
                      </div>
                    </div>

                    {/* Drag & Drop Image Gallery */}
                    {totalImagesCount > 0 && (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={imageItems.map(getItemId)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                              gap: theme.spacing(6),
                            }}
                          >
                            {imageItems.map((item) => (
                              <SortableImageCard
                                key={getItemId(item)}
                                item={item}
                                onRemove={() => handleRemoveImage(item)}
                                onFieldChange={(field, value) =>
                                  handleImageFieldChange(item, field, value)
                                }
                                isSubmitting={isSubmitting}
                                isDark={isDark}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>

                  {/* Private toggle */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing(3),
                      padding: theme.spacing(2),
                      backgroundColor: isDark
                        ? "rgba(31, 41, 55, 0.5)"
                        : "#f9fafb",
                      borderRadius: theme.borderRadius.lg,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsPrivate(!isPrivate)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: isPrivate ? brandColor : textMuted,
                        transition: theme.transition.DEFAULT,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {isPrivate ? <Lock size={20} /> : <Unlock size={20} />}
                    </button>
                    <label
                      style={{
                        color: textSecondary,
                        fontSize: theme.fontSize.sm,
                        cursor: "pointer",
                        userSelect: "none",
                        fontWeight: 500,
                      }}
                    >
                      Make this memory private (only visible to you)
                    </label>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: theme.spacing(4),
                      paddingTop: theme.spacing(6),
                      borderTop: `1px solid ${borderColor}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      style={{
                        padding: `${theme.spacing(3)} ${theme.spacing(8)}`,
                        color: cancelBtnColor,
                        background: "none",
                        border: `1px solid ${borderColor}`,
                        borderRadius: theme.borderRadius.xl,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        fontWeight: 600,
                        transition: theme.transition.DEFAULT,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = cancelBtnHoverColor;
                        e.currentTarget.style.borderColor = brandColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = cancelBtnColor;
                        e.currentTarget.style.borderColor = borderColor;
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || (!initialData && totalImagesCount === 0)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(2),
                        padding: `${theme.spacing(3)} ${theme.spacing(10)}`,
                        backgroundColor: brandColor,
                        color: theme.colors.white,
                        borderRadius: theme.borderRadius.xl,
                        fontWeight: 700,
                        fontSize: theme.fontSize.lg,
                        border: "none",
                        cursor:
                          isSubmitting || (!initialData && totalImagesCount === 0)
                            ? "not-allowed"
                            : "pointer",
                        transition: theme.transition.DEFAULT,
                        boxShadow: theme.boxShadow.green,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting && (initialData || totalImagesCount > 0)) {
                          e.currentTarget.style.backgroundColor = brandHover;
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = brandColor;
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {isSubmitting ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save size={18} />{" "}
                          {initialData ? "Update Moment" : "Preserve Forever"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MemoryModal;
