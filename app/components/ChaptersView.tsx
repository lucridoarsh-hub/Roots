// ChaptersView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Memory, LifeStage } from '../../types';
import { LIFE_STAGE_CONFIG } from '../../constants';
import MemoryCard from './MemoryCard';
import {
  ChevronRight,
  BookOpen,
  Loader2,
  X,
  ChevronLeft,
  Heart,
  MessageCircle,
  Calendar,
  Tag,
  Download,
  Trash2,
} from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { useTheme } from '../../context/ThemeContext';
import theme from '../theme';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

// ========== UTILITY: Convert stage to colors (using theme palette) ==========
const getStageColors = (stage: string, isDark: boolean) => {
  const stageLower = stage.toLowerCase();
  if (stageLower.includes('early') || stageLower.includes('child')) {
    return {
      bgColor: isDark ? `${theme.colors.rose[400]}20` : theme.colors.rose[400],
      textColor: isDark ? theme.colors.rose[400] : theme.colors.rose[500],
    };
  }
  if (stageLower.includes('school') || stageLower.includes('youth')) {
    return {
      bgColor: isDark ? `${theme.colors.brand[400]}20` : theme.colors.brand[100],
      textColor: isDark ? theme.colors.brand[400] : theme.colors.brand[700],
    };
  }
  if (stageLower.includes('college')) {
    return {
      bgColor: isDark ? `${theme.colors.emerald[400]}20` : theme.colors.emerald[300],
      textColor: isDark ? theme.colors.emerald[400] : theme.colors.emerald[300],
    };
  }
  if (stageLower.includes('marriage') || stageLower.includes('relationship')) {
    return {
      bgColor: isDark ? `${theme.colors.amber[400]}20` : theme.colors.amber[300],
      textColor: isDark ? theme.colors.amber[400] : theme.colors.amber[300],
    };
  }
  if (stageLower.includes('career')) {
    return {
      bgColor: isDark ? `${theme.colors.brand[400]}20` : theme.colors.brand[100],
      textColor: isDark ? theme.colors.brand[400] : theme.colors.brand[700],
    };
  }
  if (stageLower.includes('retirement')) {
    return {
      bgColor: isDark ? `${theme.colors.stone[400]}20` : theme.colors.stone[100],
      textColor: isDark ? theme.colors.stone[400] : theme.colors.stone[700],
    };
  }
  return {
    bgColor: isDark ? `${theme.colors.stone[500]}20` : theme.colors.stone[100],
    textColor: isDark ? theme.colors.stone[400] : theme.colors.stone[600],
  };
};

// ========== RESPONSIVE HOOK ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
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

// ========== MODAL COMPONENT ==========
interface MemoryDetailModalProps {
  memory: Memory | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  isDark: boolean;
}

const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({ memory, onClose, onDelete, isDark }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Reset loading and error state when image index or memory changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [currentImageIndex, memory]);

  if (!memory) return null;

  const images = memory.images || [];
  const hasMultipleImages = images.length > 1;
  const config = LIFE_STAGE_CONFIG[memory.lifeStage as LifeStage] || LIFE_STAGE_CONFIG[LifeStage.OTHER];
  const { textColor, bgColor } = getStageColors(memory.lifeStage, isDark);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formattedDate = memory.date
    ? new Date(memory.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date not specified';

  const modalBg = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const textPrimary = isDark ? theme.dark.text : theme.light.text;
  const textSecondary = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const borderColor = isDark ? theme.dark.border : theme.light.border;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      onDelete?.(memory.id);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: theme.spacing(4),
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: modalBg,
          borderRadius: theme.borderRadius['2xl'],
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: theme.boxShadow['2xl'],
          border: `1px solid ${borderColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close & Delete buttons */}
        <div style={{ position: 'absolute', top: theme.spacing(4), right: theme.spacing(4), display: 'flex', gap: theme.spacing(2), zIndex: 10 }}>
          {onDelete && (
            <button
              onClick={handleDelete}
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                borderRadius: theme.borderRadius.full,
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: theme.colors.rose[500],
                backdropFilter: 'blur(4px)',
                transition: theme.transition.DEFAULT,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')}
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              border: 'none',
              borderRadius: theme.borderRadius.full,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: textPrimary,
              backdropFilter: 'blur(4px)',
              transition: theme.transition.DEFAULT,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')}
          >
            <X size={20} />
          </button>
        </div>

        {images.length > 0 && (
          <>
            <div
              style={{
                position: 'relative',
                backgroundColor: isDark ? theme.colors.brand[950] : theme.colors.stone[100],
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: theme.borderRadius['2xl'],
                borderTopRightRadius: theme.borderRadius['2xl'],
              }}
            >
              {/* Loading spinner overlay */}
              {imageLoading && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(2px)',
                    zIndex: 5,
                  }}
                >
                  <Loader2 size={48} className="animate-spin" style={{ color: theme.colors.brand[500] }} />
                </div>
              )}

              {/* Image */}
              {!imageError ? (
                <img
                  src={images[currentImageIndex]?.url || ''}
                  alt={memory.title}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '500px',
                    objectFit: 'contain',
                    borderRadius: theme.borderRadius['2xl'],
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              ) : (
                <div
                  style={{
                    padding: theme.spacing(8),
                    color: textSecondary,
                    textAlign: 'center',
                  }}
                >
                  <p>Unable to load image</p>
                </div>
              )}

              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: theme.spacing(4),
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
                      border: 'none',
                      borderRadius: theme.borderRadius.full,
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: textPrimary,
                      backdropFilter: 'blur(4px)',
                      transition: theme.transition.DEFAULT,
                      zIndex: 6,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)')}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: theme.spacing(4),
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
                      border: 'none',
                      borderRadius: theme.borderRadius.full,
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: textPrimary,
                      backdropFilter: 'blur(4px)',
                      transition: theme.transition.DEFAULT,
                      zIndex: 6,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)')}
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: theme.spacing(4),
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
                      padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                      borderRadius: theme.borderRadius.full,
                      fontSize: theme.fontSize.sm,
                      color: textPrimary,
                      backdropFilter: 'blur(4px)',
                      zIndex: 6,
                    }}
                  >
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Caption Display */}
            {images[currentImageIndex]?.caption && (
              <div
                style={{
                  padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
                  backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
                  color: textSecondary,
                  fontSize: theme.fontSize.sm,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  borderBottomLeftRadius: theme.borderRadius['2xl'],
                  borderBottomRightRadius: theme.borderRadius['2xl'],
                  marginTop: theme.spacing(2),
                }}
              >
                {images[currentImageIndex].caption}
              </div>
            )}
          </>
        )}

        <div style={{ padding: theme.spacing(6) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(3), marginBottom: theme.spacing(4) }}>
            <div
              style={{
                width: theme.spacing(10),
                height: theme.spacing(10),
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: bgColor,
              }}
            >
              <config.icon size={20} style={{ color: textColor }} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: theme.fontSize['2xl'],
                  fontWeight: 'bold',
                  color: textPrimary,
                }}
              >
                {memory.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2), color: textColor }}>
                <Tag size={16} />
                <span style={{ fontSize: theme.fontSize.sm }}>{config.label}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(2),
              color: textSecondary,
              marginBottom: theme.spacing(4),
            }}
          >
            <Calendar size={18} />
            <span>{formattedDate}</span>
          </div>

          {memory.description && (
            <div style={{ marginBottom: theme.spacing(6) }}>
              <h3
                style={{
                  fontSize: theme.fontSize.lg,
                  fontWeight: 600,
                  color: textPrimary,
                  marginBottom: theme.spacing(2),
                }}
              >
                Description
              </h3>
              <p
                style={{
                  color: textSecondary,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {memory.description}
              </p>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: theme.spacing(6),
              paddingTop: theme.spacing(4),
              borderTop: `1px solid ${borderColor}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
              <Heart size={20} color={textSecondary} />
              <span style={{ color: textSecondary }}>
                {memory.reactions?.length || 0} reactions
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
              <MessageCircle size={20} color={textSecondary} />
              <span style={{ color: textSecondary }}>
                {memory.comments?.length || 0} comments
              </span>
            </div>
          </div>

          {/* Comments Section */}
          {memory.comments && memory.comments.length > 0 && (
            <div style={{ marginTop: theme.spacing(6) }}>
              <h3
                style={{
                  fontSize: theme.fontSize.lg,
                  fontWeight: 600,
                  color: textPrimary,
                  marginBottom: theme.spacing(4),
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(2),
                }}
              >
                <MessageCircle size={20} color={textSecondary} />
                Comments ({memory.comments.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(4) }}>
                {memory.comments.map((comment: any) => {
                  const commentDate = comment.createdAt
                    ? new Date(comment.createdAt)
                    : new Date();
                  const timeAgo = formatDistanceToNow(commentDate, { addSuffix: true });
                  return (
                    <div
                      key={comment.id}
                      style={{
                        display: 'flex',
                        gap: theme.spacing(3),
                        paddingBottom: theme.spacing(4),
                        borderBottom: `1px solid ${borderColor}`,
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: theme.borderRadius.full,
                          backgroundColor: isDark ? theme.colors.stone[700] : theme.colors.stone[200],
                          backgroundImage: comment.userAvatar ? `url(${comment.userAvatar})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: textSecondary,
                          fontSize: theme.fontSize.sm,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {!comment.userAvatar && comment.userName?.charAt(0).toUpperCase()}
                      </div>
                      {/* Comment content */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing(2),
                            marginBottom: theme.spacing(1),
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: textPrimary,
                            }}
                          >
                            {comment.userName}
                          </span>
                          <span
                            style={{
                              fontSize: theme.fontSize.xs,
                              color: textSecondary,
                            }}
                          >
                            {timeAgo}
                          </span>
                        </div>
                        <p
                          style={{
                            color: textSecondary,
                            lineHeight: 1.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
interface ChaptersViewProps {
  memories: Memory[];
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
  onPlayVideo?: (url: string, title: string) => void;
}

export const ChaptersView: React.FC<ChaptersViewProps> = ({ onEdit, onDelete, onPlayVideo }) => {
  const isDark = useIsDark();
  const isSmUp = useMediaQuery('(min-width: 640px)');
  const isLgUp = useMediaQuery('(min-width: 1024px)');

  const { memories, isLoading, error } = useMemories();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'downloading' | 'complete'>('idle');
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const orderedStages = [
    LifeStage.EARLY_YEARS,
    LifeStage.SCHOOL_YEARS,
    LifeStage.COLLEGE,
    LifeStage.MARRIAGE_RELATIONSHIPS,
    LifeStage.CAREER,
    LifeStage.RETIREMENT_REFLECTIONS,
    LifeStage.OTHER,
  ];

  const groupedMemories = memories.reduce((acc, memory) => {
    if (!acc[memory.lifeStage]) acc[memory.lifeStage] = [];
    acc[memory.lifeStage].push(memory);
    return acc;
  }, {} as Record<string, Memory[]>);

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const closeModal = () => {
    setSelectedMemory(null);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('generating');
    
    // Simulate progress while waiting for server response
    progressIntervalRef.current = setInterval(() => {
      setExportProgress(prev => {
        // Slowly increase up to 90% (server generation phase)
        const increment = prev < 30 ? 2 : prev < 60 ? 1.5 : prev < 80 ? 0.8 : 0.4;
        const next = Math.min(prev + increment, 90);
        return next;
      });
    }, 200);

    try {
      const response = await axios.get(`/api/auth/pdf?download=true`, {
        withCredentials: true,
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          // Once we start receiving data, we're in downloading phase
          if (progressEvent.total) {
            setExportStatus('downloading');
            // Map download progress from 90% to 100%
            const percentCompleted = Math.round((progressEvent.loaded * 10) / progressEvent.total);
            setExportProgress(90 + percentCompleted);
          }
        },
      });

      // Clear the interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Create blob and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `memory-album-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Show completion
      setExportProgress(100);
      setExportStatus('complete');
      
      // Reset after a short delay
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportStatus('idle');
      }, 1500);
      
    } catch (err: any) {
      console.error('PDF export error:', err);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      let message = 'Failed to export PDF';
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
      
      // Could show a toast notification here
      alert(message);
      
      setIsExporting(false);
      setExportProgress(0);
      setExportStatus('idle');
    }
  };

  // Theme-based colors
  const textPrimary = isDark ? theme.dark.text : theme.light.text;
  const textSecondary = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const cardBg = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const cardBorder = isDark ? theme.dark.border : theme.light.border;
  const cardHoverBg = isDark ? theme.colors.brand[800] : theme.colors.stone[50];
  const chapterHeaderBorder = isDark ? theme.dark.border : theme.light.border;
  const memoriesGridBg = isDark ? theme.colors.brand[900] + '40' : theme.colors.stone[50] + '60';
  const emptyChapterBadgeBg = isDark ? theme.colors.brand[800] : theme.colors.stone[100];
  const emptyChapterBadgeText = isDark ? theme.dark.textMuted : theme.light.textMuted;

  const getGridColumns = () => {
    if (isLgUp) return 'repeat(3, 1fr)';
    if (isSmUp) return 'repeat(2, 1fr)';
    return '1fr';
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: theme.spacing(4),
        }}
      >
        <Loader2 size={48} className="animate-spin" style={{ color: theme.colors.brand[500] }} />
        <p style={{ color: textSecondary }}>Loading your memories...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(8),
        maxWidth: '1024px',
        margin: '0 auto',
      }}
    >
      {/* Header with Export Button */}
      <div style={{ textAlign: 'center', marginBottom: theme.spacing(10) }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(3),
            backgroundColor: isDark ? `${theme.colors.brand[400]}20` : theme.colors.brand[100],
            borderRadius: theme.borderRadius.full,
            marginBottom: theme.spacing(4),
          }}
        >
          <BookOpen
            size={32}
            style={{
              color: isDark ? theme.colors.brand[400] : theme.colors.brand[600],
            }}
          />
        </div>
        <h2
          style={{
            fontSize: theme.fontSize['3xl'],
            fontFamily: theme.fontFamily.serif,
            fontWeight: 'bold',
            color: textPrimary,
          }}
        >
          Chapters of My Life
        </h2>
        <p
          style={{
            color: textSecondary,
            marginTop: theme.spacing(2),
          }}
        >
          Your life, remembered one chapter at a time
        </p>

        {/* Export Section */}
        <div style={{ marginTop: theme.spacing(6) }}>
          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: theme.spacing(2),
              padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
              backgroundColor: isDark ? theme.colors.brand[600] : theme.colors.brand[500],
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius.full,
              fontWeight: 500,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.7 : 1,
              transition: theme.transition.DEFAULT,
            }}
            onMouseEnter={(e) => {
              if (!isExporting) e.currentTarget.style.backgroundColor = isDark ? theme.colors.brand[500] : theme.colors.brand[600];
            }}
            onMouseLeave={(e) => {
              if (!isExporting) e.currentTarget.style.backgroundColor = isDark ? theme.colors.brand[600] : theme.colors.brand[500];
            }}
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {exportStatus === 'generating' && 'Generating PDF...'}
                {exportStatus === 'downloading' && 'Downloading...'}
                {exportStatus === 'complete' && 'Done!'}
              </>
            ) : (
              <>
                <Download size={18} />
                Export as PDF
              </>
            )}
          </button>

          {/* Progress Bar */}
          {isExporting && (
            <div style={{ marginTop: theme.spacing(4), maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
              <div
                style={{
                  height: '6px',
                  backgroundColor: isDark ? theme.colors.stone[700] : theme.colors.stone[200],
                  borderRadius: theme.borderRadius.full,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${exportProgress}%`,
                    backgroundColor: theme.colors.brand[500],
                    transition: 'width 0.2s ease-out',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: theme.spacing(1),
                  fontSize: theme.fontSize.xs,
                  color: textSecondary,
                }}
              >
                <span>{Math.round(exportProgress)}%</span>
                {exportStatus === 'complete' && <span>✓ Complete</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {orderedStages.map((stage) => {
        const stageMemories = groupedMemories[stage] || [];
        const config = LIFE_STAGE_CONFIG[stage];
        const Icon = config.icon;
        const { textColor, bgColor } = getStageColors(stage, isDark);
        const isEmpty = stageMemories.length === 0;

        return (
          <div
            key={stage}
            style={{
              backgroundColor: cardBg,
              borderRadius: theme.borderRadius['2xl'],
              boxShadow: theme.boxShadow.lg,
              border: `1px solid ${cardBorder}`,
              overflow: 'hidden',
              backdropFilter: isDark ? 'blur(8px)' : 'none',
              transition: theme.transition.DEFAULT,
            }}
          >
            {/* Chapter Header */}
            <div
              style={{
                padding: `${theme.spacing(4)} ${theme.spacing(6)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: theme.transition.DEFAULT,
                borderBottom: `1px solid ${chapterHeaderBorder}`,
                opacity: isEmpty ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = cardHoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(4) }}>
                <div
                  style={{
                    width: theme.spacing(12),
                    height: theme.spacing(12),
                    borderRadius: theme.borderRadius.xl,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: bgColor,
                  }}
                >
                  <Icon size={24} style={{ color: textColor }} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: theme.fontSize.xl,
                      fontWeight: 'bold',
                      color: textPrimary,
                    }}
                  >
                    {config.label}
                  </h3>
                  <p
                    style={{
                      fontSize: theme.fontSize.sm,
                      color: textSecondary,
                    }}
                  >
                    {stageMemories.length} {stageMemories.length === 1 ? 'memory' : 'memories'}
                  </p>
                </div>
              </div>
              {isEmpty && (
                <span
                  style={{
                    fontSize: theme.fontSize.xs,
                    fontWeight: 500,
                    color: emptyChapterBadgeText,
                    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                    backgroundColor: emptyChapterBadgeBg,
                    borderRadius: theme.borderRadius.full,
                  }}
                >
                  No memories yet
                </span>
              )}
            </div>

            {/* Memories Grid (if any) */}
            {!isEmpty && (
              <div
                style={{
                  padding: theme.spacing(6),
                  backgroundColor: memoriesGridBg,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: getGridColumns(),
                    gap: theme.spacing(4),
                  }}
                >
                  {stageMemories.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onPlayVideo={onPlayVideo}
                      layout="grid"
                      onClick={handleMemoryClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          onClose={closeModal}
          onDelete={onDelete}
          isDark={isDark}
        />
      )}
    </div>
  );
};