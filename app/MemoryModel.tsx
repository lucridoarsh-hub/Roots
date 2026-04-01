"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  X,
  Upload,
  Calendar,
  Tag,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Save,
} from 'lucide-react';
import { LifeStage, MediaType, Memory } from '../types';
import { useMemories } from '../context/MemoryContext';
import { useTheme } from '../context/ThemeContext';

// ========== THEME CONSTANTS ==========
const theme = {
  colors: {
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    red: {
      600: '#dc2626',
    },
    white: '#ffffff',
    black: '#000000',
  },
  spacing: (n: number) => `${n * 0.25}rem`,
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  borderRadius: {
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  transition: {
    DEFAULT: 'all 0.2s ease',
  },
};

// ========== RESPONSIVE & DARK MODE HOOKS ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

const useIsDark = () => {
  const { theme: themeMode } = useTheme();
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  return themeMode === 'dark' ? true : themeMode === 'light' ? false : systemDark;
};

// Type for a selected file with preview
interface SelectedFile {
  file: File;
  previewUrl: string;
  mediaType: MediaType;
}

// ========== COMPONENT ==========
interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Memory | null;
}

const DRAFT_KEY = 'roots_memory_draft';
const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addMemory, updateMemory } = useMemories();

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  const isDark = useIsDark();
  const isMdUp = useMediaQuery('(min-width: 768px)');

  // Form State (only details tab – no comments/history as requested)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [lifeStage, setLifeStage] = useState<LifeStage>(LifeStage.EARLY_YEARS);
  const [tags, setTags] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Multiple file selection
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, [selectedFiles]);

  // Load initial data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDate(
        initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setLifeStage(initialData.lifeStage || LifeStage.EARLY_YEARS);
      setTags(Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '');
      setSelectedFiles([]);
      setCaptions([]);
      setIsPrivate(initialData.isPrivate ?? false);
    } else {
      // New memory – clear form
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setLifeStage(LifeStage.EARLY_YEARS);
      setTags('');
      setSelectedFiles([]);
      setCaptions([]);
      setIsPrivate(false);
    }

    setIsSaved(false);
    setSubmitError(null);
    setFileValidationError(null);
  }, [isOpen, initialData]);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { valid: false, error: `"${file.name}" is not a PNG or JPG image.` };
    }
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      return {
        valid: false,
        error: `"${file.name}" exceeds ${MAX_FILE_SIZE_MB} MB (${sizeInMB.toFixed(2)} MB).`,
      };
    }
    return { valid: true };
  };

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
      setFileValidationError(errors.join(' '));
    }

    if (selectedFiles.length + validFiles.length > MAX_FILES) {
      setFileValidationError(`You can upload up to ${MAX_FILES} images.`);
      return;
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const newFiles: SelectedFile[] = [];
    const newCaptions: string[] = [];

    validFiles.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      newFiles.push({ file, previewUrl, mediaType: MediaType.PHOTO });
      newCaptions.push('');
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setCaptions((prev) => [...prev, ...newCaptions]);
    setIsUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
    setCaptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCaptionChange = (index: number, value: string) => {
    setCaptions((prev) => prev.map((c, i) => (i === index ? value : c)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFileValidationError(null);

    if (!initialData && selectedFiles.length === 0) {
      setSubmitError('At least one image is required to create a memory.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('title', title);
      formData.append('lifeStage', lifeStage);
      formData.append('description', description);
      formData.append('date', date);
      formData.append('isPrivate', String(isPrivate));

      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append('tags', tagsArray.join(','));

      selectedFiles.forEach(({ file }) => {
        formData.append('images', file);
      });
      formData.append('captions', JSON.stringify(captions));

      if (initialData) {
        const memoryId = initialData.id;
        if (!memoryId) throw new Error('Memory ID not found');
        await updateMemory(memoryId, formData);
      } else {
        await addMemory(formData);
      }

      localStorage.removeItem(DRAFT_KEY);
      setIsSaved(true);
    } catch (err: any) {
      console.error('Error saving memory:', err);
      setSubmitError(err.message || 'Failed to save memory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Conditional colors
  const bgOverlay = 'rgba(0,0,0,0.5)';
  const bgModal = isDark ? theme.colors.brand[950] : theme.colors.white;
  const textPrimary = isDark ? theme.colors.brand[100] : theme.colors.gray[800];
  const textSecondary = isDark ? theme.colors.brand[400] : theme.colors.gray[500];
  const textMuted = isDark ? theme.colors.brand[500] : theme.colors.gray[400];
  const borderColor = isDark ? 'rgba(255,255,255,0.05)' : theme.colors.gray[100];
  const inputBg = isDark ? theme.colors.brand[900] : theme.colors.white;
  const inputBorder = isDark ? theme.colors.brand[800] : theme.colors.gray[300];
  const inputText = isDark ? theme.colors.white : theme.colors.gray[900];
  const successIconBg = isDark ? theme.colors.brand[800] : theme.colors.brand[100];
  const successIconColor = isDark ? theme.colors.brand[400] : theme.colors.brand[600];
  const cancelBtnColor = isDark ? theme.colors.brand[400] : theme.colors.gray[500];
  const cancelBtnHoverColor = isDark ? theme.colors.brand[300] : theme.colors.gray[700];

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgOverlay,
          backdropFilter: 'blur(4px)',
          padding: theme.spacing(4),
        }}
      >
        <div
          style={{
            backgroundColor: bgModal,
            borderRadius: theme.borderRadius['2xl'],
            width: '100%',
            maxWidth: theme.spacing(128),
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: theme.boxShadow['2xl'],
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isSaved ? (
            // Success screen
            <div
              style={{
                padding: theme.spacing(12),
                textAlign: 'center',
                animation: 'fade-in 0.3s ease-out',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: theme.spacing(20),
                  height: theme.spacing(20),
                  backgroundColor: successIconBg,
                  color: successIconColor,
                  borderRadius: theme.borderRadius.full,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing(6),
                }}
              >
                <Save size={40} />
              </div>
              <h2
                style={{
                  fontSize: theme.fontSize['3xl'],
                  fontFamily: (theme as any).fontFamily?.serif,
                  fontWeight: 'bold',
                  color: textPrimary,
                  marginBottom: theme.spacing(2),
                }}
              >
                Memory Preserved
              </h2>
              <button
                onClick={onClose}
                style={{
                  marginTop: theme.spacing(8),
                  padding: `${theme.spacing(3)} ${theme.spacing(8)}`,
                  backgroundColor: isDark ? theme.colors.brand[600] : theme.colors.brand[900],
                  color: theme.colors.white,
                  borderRadius: theme.borderRadius.xl,
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  transition: theme.transition.DEFAULT,
                }}
              >
                Back to Timeline
              </button>
            </div>
          ) : (
            // Main Form (only Details – comments & history removed as requested)
            <>
              {/* Header */}
              <div
                style={{
                  padding: `${theme.spacing(6)} ${theme.spacing(6)}`,
                  borderBottom: `1px solid ${borderColor}`,
                  position: 'sticky',
                  top: 0,
                  backgroundColor: bgModal,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h2
                    style={{
                      fontSize: theme.fontSize['2xl'],
                 fontFamily: (theme as any).fontFamily?.serif,
                      fontWeight: 'bold',
                      color: textPrimary,
                    }}
                  >
                    {initialData ? 'Edit Moment' : 'New Memory'}
                  </h2>
                  <button
                    onClick={onClose}
                    style={{
                      padding: theme.spacing(2),
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: theme.borderRadius.full,
                      color: textMuted,
                      cursor: 'pointer',
                      transition: theme.transition.DEFAULT,
                    }}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    padding: theme.spacing(6),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing(6),
                  }}
                >
                  {/* Errors */}
                  {submitError && (
                    <div
                      style={{
                        padding: theme.spacing(3),
                        backgroundColor: isDark ? theme.colors.red[600] + '33' : '#fef2f2',
                        color: isDark ? '#fca5a5' : theme.colors.red[600],
                        borderRadius: theme.borderRadius.lg,
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing(2),
                        fontSize: theme.fontSize.sm,
                      }}
                    >
                      <AlertCircle size={16} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {fileValidationError && (
                    <div
                      style={{
                        padding: theme.spacing(3),
                        backgroundColor: isDark ? theme.colors.red[600] + '33' : '#fef2f2',
                        color: isDark ? '#fca5a5' : theme.colors.red[600],
                        borderRadius: theme.borderRadius.lg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: theme.spacing(2),
                        fontSize: theme.fontSize.sm,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
                        <AlertCircle size={16} />
                        <span>{fileValidationError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFileValidationError(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Title + Date + Life Stage */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMdUp ? 'repeat(2, 1fr)' : '1fr',
                      gap: theme.spacing(6),
                    }}
                  >
                    <div style={{ gridColumn: isMdUp ? 'span 2' : 'auto' }}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: theme.fontSize.sm,
                          fontWeight: 'bold',
                          color: isDark ? theme.colors.brand[300] : theme.colors.gray[700],
                          marginBottom: theme.spacing(1),
                        }}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                          width: '100%',
                          padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                          border: `1px solid ${inputBorder}`,
                          borderRadius: theme.borderRadius.lg,
                          backgroundColor: inputBg,
                          color: inputText,
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: theme.fontSize.sm,
                          fontWeight: 'bold',
                          color: isDark ? theme.colors.brand[300] : theme.colors.gray[700],
                          marginBottom: theme.spacing(1),
                        }}
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                          border: `1px solid ${inputBorder}`,
                          borderRadius: theme.borderRadius.lg,
                          backgroundColor: inputBg,
                          color: inputText,
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: theme.fontSize.sm,
                          fontWeight: 'bold',
                          color: isDark ? theme.colors.brand[300] : theme.colors.gray[700],
                          marginBottom: theme.spacing(1),
                        }}
                      >
                        Life Stage
                      </label>
                      <select
                        value={lifeStage}
                        onChange={(e) => setLifeStage(e.target.value as LifeStage)}
                        style={{
                          width: '100%',
                          padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                          border: `1px solid ${inputBorder}`,
                          borderRadius: theme.borderRadius.lg,
                          backgroundColor: inputBg,
                          color: inputText,
                          outline: 'none',
                        }}
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
                        display: 'block',
                        fontSize: theme.fontSize.sm,
                        fontWeight: 'bold',
                        color: isDark ? theme.colors.brand[300] : theme.colors.gray[700],
                        marginBottom: theme.spacing(1),
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      style={{
                        width: '100%',
                        padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: theme.borderRadius.lg,
                        backgroundColor: inputBg,
                        color: inputText,
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: theme.fontSize.sm,
                        fontWeight: 'bold',
                        color: isDark ? theme.colors.brand[300] : theme.colors.gray[700],
                        marginBottom: theme.spacing(1),
                      }}
                    >
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      style={{
                        width: '100%',
                        padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: theme.borderRadius.lg,
                        backgroundColor: inputBg,
                        color: inputText,
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Media Upload */}
                  <div
                    style={{
                      paddingTop: theme.spacing(4),
                      borderTop: `1px solid ${borderColor}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: theme.spacing(4),
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(4) }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting || selectedFiles.length >= MAX_FILES}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: theme.spacing(2),
                          padding: `${theme.spacing(2.5)} ${theme.spacing(6)}`,
                          backgroundColor: isDark ? theme.colors.brand[600] : theme.colors.brand[900],
                          color: theme.colors.white,
                          borderRadius: theme.borderRadius.xl,
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: isSubmitting || selectedFiles.length >= MAX_FILES ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Upload size={18} />
                        {isUploading ? 'Processing...' : 'Upload Images'}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/png,image/jpeg,image/jpg"
                        multiple
                        disabled={isSubmitting || selectedFiles.length >= MAX_FILES}
                      />
                      {selectedFiles.length > 0 && (
                        <span style={{ color: textSecondary, fontSize: theme.fontSize.sm }}>
                          {selectedFiles.length} of {MAX_FILES} images
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: theme.fontSize.xs, color: textMuted }}>
                      JPG or PNG only • Max 5 images • 5 MB each
                    </div>

                    {/* Previews + Captions */}
                    {selectedFiles.length > 0 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                          gap: theme.spacing(4),
                        }}
                      >
                        {selectedFiles.map((fileObj, index) => (
                          <div key={index} style={{ position: 'relative' }}>
                            <div
                              style={{
                                width: '100%',
                                height: theme.spacing(32),
                                borderRadius: theme.borderRadius.lg,
                                overflow: 'hidden',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : theme.colors.gray[200]}`,
                              }}
                            >
                              <img
                                src={fileObj.previewUrl}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              disabled={isSubmitting}
                              style={{
                                position: 'absolute',
                                top: theme.spacing(1),
                                right: theme.spacing(1),
                                backgroundColor: theme.colors.red[600],
                                color: theme.colors.white,
                                borderRadius: theme.borderRadius.full,
                                border: 'none',
                                padding: theme.spacing(1),
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>

                            <input
                              type="text"
                              placeholder="Add caption..."
                              value={captions[index] || ''}
                              onChange={(e) => handleCaptionChange(index, e.target.value)}
                              disabled={isSubmitting}
                              style={{
                                marginTop: theme.spacing(2),
                                width: '100%',
                                padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                                fontSize: theme.fontSize.xs,
                                border: `1px solid ${inputBorder}`,
                                borderRadius: theme.borderRadius.lg,
                                backgroundColor: inputBg,
                                color: inputText,
                                outline: 'none',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Private toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
                    <input
                      type="checkbox"
                      id="private"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    <label htmlFor="private" style={{ color: textSecondary, fontSize: theme.fontSize.sm }}>
                      Make this memory private
                    </label>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: theme.spacing(3),
                      paddingTop: theme.spacing(6),
                      borderTop: `1px solid ${borderColor}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      style={{
                        padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
                        color: cancelBtnColor,
                        background: 'none',
                        border: 'none',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || (!initialData && selectedFiles.length === 0)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing(2),
                        padding: `${theme.spacing(2.5)} ${theme.spacing(10)}`,
                        backgroundColor: isDark ? theme.colors.brand[600] : theme.colors.brand[900],
                        color: theme.colors.white,
                        borderRadius: theme.borderRadius.xl,
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: isSubmitting || (!initialData && selectedFiles.length === 0) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isSubmitting ? (
                        'Saving...'
                      ) : (
                        <>
                          <Save size={18} /> {initialData ? 'Update Moment' : 'Preserve Forever'}
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