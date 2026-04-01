import React, { useState } from 'react';
import { Memory, LifeStage } from '../types';
import { LIFE_STAGE_CONFIG } from '../constants';
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
} from 'lucide-react';
import { useMemories } from '../context/MemoryContext';
import { useTheme } from '../context/ThemeContext';

// ========== MODERN THEME CONSTANTS ==========
const theme = {
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
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
    sm: '0.25rem',
    base: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
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
  fontFamily: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Cormorant Garamond, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  transition: {
    DEFAULT: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ========== RESPONSIVE & DARK MODE HOOKS ==========
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

// ========== UTILITY: Convert stage to colors (modern) ==========
const getStageColors = (stage: string, isDark: boolean) => {
  const stageLower = stage.toLowerCase();
  if (stageLower.includes('early') || stageLower.includes('child')) {
    return {
      bgColor: isDark ? 'rgba(244, 114, 182, 0.2)' : '#fce7f3',
      textColor: isDark ? '#f9a8d4' : '#be185d',
    };
  }
  if (stageLower.includes('school') || stageLower.includes('youth')) {
    return {
      bgColor: isDark ? 'rgba(96, 165, 250, 0.2)' : '#dbeafe',
      textColor: isDark ? '#93c5fd' : '#1e40af',
    };
  }
  if (stageLower.includes('college')) {
    return {
      bgColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#d1fae5',
      textColor: isDark ? '#6ee7b7' : '#047857',
    };
  }
  if (stageLower.includes('marriage') || stageLower.includes('relationship')) {
    return {
      bgColor: isDark ? 'rgba(251, 146, 60, 0.2)' : '#ffedd5',
      textColor: isDark ? '#fdba74' : '#c2410c',
    };
  }
  if (stageLower.includes('career')) {
    return {
      bgColor: isDark ? 'rgba(129, 140, 248, 0.2)' : '#e0e7ff',
      textColor: isDark ? '#a5b4fc' : '#3730a3',
    };
  }
  if (stageLower.includes('retirement')) {
    return {
      bgColor: isDark ? 'rgba(196, 181, 253, 0.2)' : '#f3e8ff',
      textColor: isDark ? '#c4b5fd' : '#6b21a8',
    };
  }
  return {
    bgColor: isDark ? 'rgba(148, 163, 184, 0.2)' : '#f1f5f9',
    textColor: isDark ? '#cbd5e1' : '#475569',
  };
};

// ========== MODAL COMPONENT ==========
interface MemoryDetailModalProps {
  memory: Memory | null;
  onClose: () => void;
  isDark: boolean;
}

const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({ memory, onClose, isDark }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          backgroundColor: isDark ? '#0f172a' : theme.colors.white,
          borderRadius: theme.borderRadius['2xl'],
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: theme.boxShadow['2xl'],
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: theme.spacing(4),
            right: theme.spacing(4),
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: theme.borderRadius.full,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isDark ? '#f1f5f9' : '#0f172a',
            zIndex: 10,
            backdropFilter: 'blur(4px)',
            transition: theme.transition.DEFAULT,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')}
        >
          <X size={20} />
        </button>

        {images.length > 0 && (
          <>
            <div
              style={{
                position: 'relative',
                backgroundColor: isDark ? '#020617' : '#f1f5f9',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: theme.borderRadius['2xl'],
                borderTopRightRadius: theme.borderRadius['2xl'],
              }}
            >
              <img
                src={images[currentImageIndex]?.url || ''}
                alt={memory.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: theme.borderRadius['2xl'],
                }}
              />
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
                      color: isDark ? '#f1f5f9' : '#0f172a',
                      backdropFilter: 'blur(4px)',
                      transition: theme.transition.DEFAULT,
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
                      color: isDark ? '#f1f5f9' : '#0f172a',
                      backdropFilter: 'blur(4px)',
                      transition: theme.transition.DEFAULT,
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
                      color: isDark ? '#f1f5f9' : '#0f172a',
                      backdropFilter: 'blur(4px)',
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
                  color: isDark ? '#e2e8f0' : '#1e293b',
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
                  color: isDark ? '#f1f5f9' : '#0f172a',
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
              color: isDark ? '#94a3b8' : '#475569',
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
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  marginBottom: theme.spacing(2),
                }}
              >
                Description
              </h3>
              <p
                style={{
                  color: isDark ? '#cbd5e1' : '#334155',
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
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
              <Heart size={20} color={isDark ? '#94a3b8' : '#475569'} />
              <span style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                {memory.reactions?.length || 0} reactions
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
              <MessageCircle size={20} color={isDark ? '#94a3b8' : '#475569'} />
              <span style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                {memory.comments?.length || 0} comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
interface ChaptersViewProps {
     memories: Memory[]; // 👈 add this
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
  onPlayVideo?: (url: string, title: string) => void;
}

export const ChaptersView: React.FC<ChaptersViewProps> = ({ onEdit, onDelete, onPlayVideo }) => {
  const isDark = useIsDark();
  const isSmUp = useMediaQuery('(min-width: 640px)');
  const isLgUp = useMediaQuery('(min-width: 1024px)');

  // ✅ FIXED: Use the correct property name from the context
  const { memories, isLoading, error } = useMemories();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

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

  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#475569';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)';
  const cardHoverBg = isDark ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc';
  const chapterHeaderBorder = isDark ? 'rgba(51, 65, 85, 0.3)' : '#f1f5f9';
  const memoriesGridBg = isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.6)';
  const emptyChapterBadgeBg = isDark ? '#1e293b' : '#f1f5f9';
  const emptyChapterBadgeText = isDark ? '#94a3b8' : '#475569';

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
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: theme.spacing(10) }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(3),
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe',
            borderRadius: theme.borderRadius.full,
            marginBottom: theme.spacing(4),
          }}
        >
          <BookOpen
            size={32}
            style={{
              color: isDark ? '#60a5fa' : '#2563eb',
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
        <MemoryDetailModal memory={selectedMemory} onClose={closeModal} isDark={isDark} />
      )}
    </div>
  );
};