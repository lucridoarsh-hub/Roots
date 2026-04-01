// TimelineView.tsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Memory } from '../types';
import MemoryCard from './MemoryCard';
import { Command } from 'lucide-react';

// ========== THEME CONSTANTS (copied from original) ==========
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
    none: '0',
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
  },
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
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

const useDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

// ========== STYLE UTILITIES ==========
const flexCol = {
  display: 'flex',
  flexDirection: 'column',
} as const;

// ========== COMPONENT ==========
interface TimelineViewProps {
  memories: Memory[];
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
  onPlayVideo?: (url: string, title: string) => void;
}

type ZoomLevel = 'decade' | 'year' | 'month';

const TimelineView: React.FC<TimelineViewProps> = ({
  memories,
  onEdit,
  onDelete,
  onPlayVideo,
}) => {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('year');
  const isDark = useDarkMode();
  const isMdUp = useMediaQuery('(min-width: 768px)');

  // Keyboard shortcuts for zoom
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoomLevel((prev) => (prev === 'decade' ? 'year' : 'month'));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoomLevel((prev) => (prev === 'month' ? 'year' : 'decade'));
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Group memories based on zoom level
  const grouped = useMemo(() => {
    return memories.reduce((acc, memory) => {
      const date = new Date(memory.date);
      let key = '';

      if (zoomLevel === 'decade') {
        const year = date.getFullYear();
        key = `${Math.floor(year / 10) * 10}s`;
      } else if (zoomLevel === 'year') {
        key = date.getFullYear().toString();
      } else {
        key = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(memory);
      return acc;
    }, {} as Record<string, Memory[]>);
  }, [memories, zoomLevel]);

  const keys = Object.keys(grouped).sort((a, b) => {
    const timeA = new Date(grouped[a][0].date).getTime();
    const timeB = new Date(grouped[b][0].date).getTime();
    return timeB - timeA;
  });

  // Conditional colors (dark mode)
  const bgEmpty = isDark ? theme.colors.brand[900] : theme.colors.white;
  const borderEmpty = isDark ? 'rgba(255,255,255,0.1)' : theme.colors.gray[300];
  const textEmptyPrimary = isDark ? theme.colors.brand[100] : theme.colors.gray[800];
  const textEmptySecondary = isDark ? theme.colors.brand[400] : theme.colors.gray[500];

  const controlBg = isDark ? theme.colors.brand[900] + 'E6' : 'rgba(255,255,255,0.9)';
  const controlBorder = isDark ? 'rgba(255,255,255,0.1)' : theme.colors.gray[200];
  const buttonActiveBg = isDark ? theme.colors.brand[600] : theme.colors.brand[900];
  const buttonActiveText = theme.colors.white;
  const buttonInactiveText = isDark ? theme.colors.brand[400] : theme.colors.gray[500];
  const buttonHoverBg = isDark ? theme.colors.brand[800] : theme.colors.gray[100];

  const timelineLineBg = isDark ? theme.colors.brand[800] : theme.colors.brand[200];
  const timelineDotBg = isDark ? theme.colors.brand[900] : theme.colors.white;
  const timelineDotBorder = theme.colors.brand[500];

  const yearBadgeBg = isDark ? theme.colors.brand[800] : theme.colors.brand[600];
  const yearBadgeText = theme.colors.white;
  const yearBadgeBorder = isDark ? theme.colors.brand[950] : theme.colors.white;

  const mobileConnectorBg = isDark ? theme.colors.brand[800] : theme.colors.brand[200];

  if (memories.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: theme.spacing(32),
          backgroundColor: bgEmpty,
          borderRadius: theme.borderRadius['2xl'],
          border: `1px dashed ${borderEmpty}`,
        }}
      >
        <h3
          style={{
            fontSize: theme.fontSize.xl,
            fontFamily: theme.fontFamily.serif,
            color: textEmptyPrimary,
            marginBottom: theme.spacing(2),
          }}
        >
          Your timeline is waiting
        </h3>
        <p style={{ color: textEmptySecondary }}>Add your first memory to start your journey.</p>
      </div>
    );
  }

  return (
    <>
      {/* Global styles for scrollbar hiding and print */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media print {
          .print-hidden {
            display: none !important;
          }
          .timeline-section {
            page-break-inside: avoid;
          }
          .year-badge {
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          maxWidth: '896px',
          margin: '0 auto',
          padding: `${theme.spacing(8)} ${theme.spacing(4)}`,
        }}
      >
        {/* Zoom Controls */}
        <div
          className="print-hidden"
          style={{
            position: 'sticky',
            top: theme.spacing(24),
            zIndex: 30,
            marginBottom: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: controlBg,
              backdropFilter: 'blur(8px)',
              boxShadow: theme.boxShadow.lg,
              border: `1px solid ${controlBorder}`,
              borderRadius: theme.borderRadius.full,
              padding: theme.spacing(1),
              display: 'flex',
              alignItems: 'center',
              marginBottom: theme.spacing(2),
            }}
          >
            {(['decade', 'year', 'month'] as ZoomLevel[]).map((level) => {
              const isActive = zoomLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => setZoomLevel(level)}
                  style={{
                    padding: `${theme.spacing(1.5)} ${theme.spacing(4)}`,
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.fontSize.xs,
                    fontWeight: 'bold',
                    transition: theme.transition.DEFAULT,
                    backgroundColor: isActive ? buttonActiveBg : 'transparent',
                    color: isActive ? buttonActiveText : buttonInactiveText,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = buttonHoverBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              );
            })}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: isDark ? theme.colors.brand[600] : theme.colors.gray[400],
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(1),
              opacity: 0.5,
            }}
          >
            <Command size={10} /> + [+/-] to Zoom
          </div>
        </div>

        {/* Vertical Timeline Line (always visible) */}
        <div
          className="print-hidden"
          style={{
            position: 'absolute',
            left: isMdUp ? '50%' : theme.spacing(4),
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: timelineLineBg,
            transform: isMdUp ? 'translateX(-50%)' : 'none',
            zIndex: 0,
          }}
        ></div>

        {keys.map((key) => (
          <div
            key={key}
            id={`section-${key.replace(/\s+/g, '-')}`}
            style={{
              marginBottom: theme.spacing(16),
              position: 'relative',
              zIndex: 10,
              scrollMarginTop: theme.spacing(32),
            }}
            className="timeline-section"
          >
            {/* Year Badge */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: isMdUp ? 'center' : 'flex-start',
                marginBottom: theme.spacing(12),
                paddingLeft: isMdUp ? 0 : theme.spacing(12),
              }}
            >
              <div
                className="year-badge"
                style={{
                  backgroundColor: yearBadgeBg,
                  color: yearBadgeText,
                  padding: `${theme.spacing(3)} ${theme.spacing(8)}`,
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.fontSize.xl,
                  fontWeight: 'bold',
                  boxShadow: theme.boxShadow.lg,
                  border: `4px solid ${yearBadgeBorder}`,
                  display: 'inline-block',
                  minWidth: theme.spacing(35),
                  textAlign: 'center',
                }}
              >
                {key}
              </div>

              {/* Mobile connector line (from left edge to badge) */}
              {!isMdUp && (
                <div
                  className="print-hidden"
                  style={{
                    position: 'absolute',
                    left: theme.spacing(4),
                    top: '50%',
                    width: theme.spacing(8),
                    height: '2px',
                    backgroundColor: mobileConnectorBg,
                    transform: 'translateY(-50%)',
                  }}
                ></div>
              )}
            </div>

            {/* Memories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(16) }}>
              {grouped[key].map((memory, index) => {
                const isEven = index % 2 === 0;
                const flexDirection = isMdUp ? (isEven ? 'row' : 'row-reverse') : 'column';

                return (
                  <div
                    key={memory.id}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: isMdUp ? 'center' : 'flex-start',
                      justifyContent: 'space-between',
                      flexDirection: flexDirection,
                      gap: isMdUp ? 0 : theme.spacing(6),
                    }}
                  >
                    {/* Card Column */}
                    <div
                      style={{
                        width: isMdUp ? '45%' : '100%',
                        paddingLeft: isMdUp ? 0 : theme.spacing(12),
                      }}
                    >
                      <MemoryCard
                        memory={memory}
                        layout="timeline"
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onPlayVideo={onPlayVideo}
                      />
                    </div>

                    {/* Timeline Dot */}
                    <div
                      className="print-hidden"
                      style={{
                        position: 'absolute',
                        left: isMdUp ? '50%' : theme.spacing(4),
                        top: isMdUp ? '50%' : theme.spacing(8),
                        width: theme.spacing(4),
                        height: theme.spacing(4),
                        backgroundColor: timelineDotBg,
                        border: `4px solid ${timelineDotBorder}`,
                        borderRadius: theme.borderRadius.full,
                        transform: isMdUp ? 'translate(-50%, -50%)' : 'translateY(-50%)',
                        zIndex: 10,
                        boxShadow: theme.boxShadow.sm,
                      }}
                    ></div>

                    {/* Mobile connector from dot to card */}
                    {!isMdUp && (
                      <div
                        className="print-hidden"
                        style={{
                          position: 'absolute',
                          left: theme.spacing(4),
                          top: theme.spacing(8),
                          width: theme.spacing(8),
                          height: '2px',
                          backgroundColor: mobileConnectorBg,
                          transform: 'translateY(-50%)',
                        }}
                      ></div>
                    )}

                    {/* Spacer column (md+ only) */}
                    {isMdUp && <div style={{ width: '45%' }}></div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TimelineView;