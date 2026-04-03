// TimelineView.tsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Memory } from '../../types';
import MemoryCard from './MemoryCard';
import { Command } from 'lucide-react';
import theme from '../theme'; // ← Enduring Roots Design System
import { useTheme } from '../../context/ThemeContext';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "My Timeline — Enduring Roots | Your Life Story, Beautifully Organized",
  description:
    "View and manage your personal memory timeline on Enduring Roots. Browse your life story by chapter, add new memories, and share your legacy with loved ones.",
  keywords: [
    "personal timeline",
    "life story timeline",
    "memory timeline",
    "enduring roots timeline",
    "digital memory board",
  ],
  authors: [{ name: "Enduring Roots" }],
  metadataBase: new URL("https://www.enduringroots.in"),
  alternates: {
    canonical: "/timeline",
  },

  // 🔒 Private page (important)
  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    type: "website",
    url: "https://www.enduringroots.in/timeline",
    title:
      "My Timeline — Enduring Roots | Your Life Story, Beautifully Organized",
    description:
      "Browse your life story by chapter, add new memories, and share your legacy with loved ones on Enduring Roots.",
    images: [
      {
        url: "/assets/og-timeline.jpg",
        width: 1200,
        height: 630,
        alt: "Timeline - Enduring Roots",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "My Timeline — Enduring Roots | Your Life Story, Beautifully Organized",
    description:
      "Browse your life story by chapter, add new memories, and share your legacy with loved ones on Enduring Roots.",
    images: ["/assets/og-timeline.jpg"],
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
  const isDark = useIsDark();
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

  // ========== NEW THEME COLORS (Enduring Roots) ==========
  const bgEmpty = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const borderEmpty = isDark ? theme.dark.borderSubtle : theme.light.border;

  const textEmptyPrimary = isDark ? theme.dark.text : theme.light.text;
  const textEmptySecondary = isDark ? theme.dark.textMuted : theme.light.textMuted;

  const controlBg = isDark ? `${theme.dark.bgCard}E6` : 'rgba(255,255,255,0.9)';
  const controlBorder = isDark ? theme.dark.borderSubtle : theme.light.border;

  const buttonActiveBg = theme.colors.brand[500]; // heritage green
  const buttonActiveText = theme.colors.white;
  const buttonInactiveText = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const buttonHoverBg = isDark ? 'rgba(85, 130, 94, 0.15)' : theme.colors.brand[100];

  const timelineLineBg = isDark ? 'rgba(85, 130, 94, 0.3)' : 'rgba(85, 130, 94, 0.25)';
  const timelineDotBg = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const timelineDotBorder = theme.colors.brand[500];

  const yearBadgeBg = theme.colors.brand[500];
  const yearBadgeText = theme.colors.white;
  const yearBadgeBorder = isDark ? theme.dark.bgCard : theme.colors.white;

  const mobileConnectorBg = isDark ? 'rgba(85, 130, 94, 0.4)' : 'rgba(85, 130, 94, 0.3)';

  if (memories.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: theme.spacing(32),
          backgroundColor: bgEmpty,
          borderRadius: theme.borderRadius['3xl'],
          border: `2px dashed ${borderEmpty}`,
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
        <p style={{ color: textEmptySecondary, fontSize: theme.fontSize.lg }}>
          Add your first memory to start your journey.
        </p>
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
              backdropFilter: 'blur(12px)',
              boxShadow: isDark ? theme.boxShadow['2xl'] : theme.boxShadow.greenLg,
              border: `1px solid ${controlBorder}`,
              borderRadius: theme.borderRadius.full,
              padding: theme.spacing(1),
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {(['decade', 'year', 'month'] as ZoomLevel[]).map((level) => {
              const isActive = zoomLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => setZoomLevel(level)}
                  style={{
                    padding: `${theme.spacing(2)} ${theme.spacing(5)}`,
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.fontSize.sm,
                    fontWeight: 700,
                    transition: theme.transition.DEFAULT,
                    backgroundColor: isActive ? buttonActiveBg : 'transparent',
                    color: isActive ? buttonActiveText : buttonInactiveText,
                    border: 'none',
                    cursor: 'pointer',
                    minWidth: theme.spacing(20),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = buttonHoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
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
              color: isDark ? theme.colors.brand[300] : theme.colors.brand[600],
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(1),
              marginTop: theme.spacing(3),
              opacity: 0.6,
            }}
          >
            <Command size={10} /> + [+/-] to Zoom
          </div>
        </div>

        {/* Vertical Timeline Line */}
        <div
          className="print-hidden"
          style={{
            position: 'absolute',
            left: isMdUp ? '50%' : theme.spacing(6),
            top: 0,
            bottom: 0,
            width: '3px',
            backgroundColor: timelineLineBg,
            transform: isMdUp ? 'translateX(-50%)' : 'none',
            zIndex: 0,
            borderRadius: theme.borderRadius.full,
          }}
        />

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
                paddingLeft: isMdUp ? 0 : theme.spacing(14),
              }}
            >
              <div
                className="year-badge"
                style={{
                  backgroundColor: yearBadgeBg,
                  color: yearBadgeText,
                  padding: `${theme.spacing(3)} ${theme.spacing(9)}`,
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.fontSize.xl,
                  fontFamily: theme.fontFamily.serif,
                  fontWeight: 700,
                  boxShadow: theme.boxShadow.greenLg,
                  border: `5px solid ${yearBadgeBorder}`,
                  display: 'inline-block',
                  minWidth: theme.spacing(40),
                  textAlign: 'center',
                }}
              >
                {key}
              </div>

              {/* Mobile connector line */}
              {!isMdUp && (
                <div
                  className="print-hidden"
                  style={{
                    position: 'absolute',
                    left: theme.spacing(6),
                    top: '50%',
                    width: theme.spacing(8),
                    height: '3px',
                    backgroundColor: mobileConnectorBg,
                    transform: 'translateY(-50%)',
                  }}
                />
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
                      gap: isMdUp ? 0 : theme.spacing(8),
                    }}
                  >
                    {/* Card Column */}
                    <div
                      style={{
                        width: isMdUp ? '45%' : '100%',
                        paddingLeft: isMdUp ? 0 : theme.spacing(14),
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
                        left: isMdUp ? '50%' : theme.spacing(6),
                        top: isMdUp ? '50%' : theme.spacing(10),
                        width: theme.spacing(5),
                        height: theme.spacing(5),
                        backgroundColor: timelineDotBg,
                        border: `5px solid ${timelineDotBorder}`,
                        borderRadius: theme.borderRadius.full,
                        transform: isMdUp ? 'translate(-50%, -50%)' : 'translateY(-50%)',
                        zIndex: 10,
                        boxShadow: theme.boxShadow.green,
                      }}
                    />

                    {/* Mobile connector from dot to card */}
                    {!isMdUp && (
                      <div
                        className="print-hidden"
                        style={{
                          position: 'absolute',
                          left: theme.spacing(6),
                          top: theme.spacing(10),
                          width: theme.spacing(8),
                          height: '3px',
                          backgroundColor: mobileConnectorBg,
                          transform: 'translateY(-50%)',
                        }}
                      />
                    )}

                    {/* Spacer column (desktop only) */}
                    {isMdUp && <div style={{ width: '45%' }} />}
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