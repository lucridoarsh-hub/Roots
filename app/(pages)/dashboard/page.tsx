// app/dashboard/page.tsx (or pages/dashboard.tsx)
"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useMemories } from '../../../context/MemoryContext';
import { useAuth } from '../../../context/AuthContext';
import { Memory, LifeStage, MediaType } from '../../../types';
import TimelineView from '../../components/TimelineView';
import { ChaptersView } from '../../components/ChaptersView';
import MemoryModal from '../../components/MemoryModel';
import MemoryCard from '../../components/MemoryCard';
import VideoPlayerModal from '../../components/VideoPlayerModal';
import {
  Plus,
  LayoutGrid,
  List,
  BookOpen,
  Undo2,
  X,
  History,
} from 'lucide-react';
import theme from '../../theme'; // <-- imported design system

// ========== RESPONSIVE HOOKS ==========
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
const flexBetween = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
} as const;

const absoluteFill = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

// ========== HELPER: Convert Memory to FormData ==========
const memoryToFormData = (memory: Memory): FormData => {
  const fd = new FormData();
  fd.append('title', memory.title);
  fd.append('description', memory.description);
  fd.append('date', memory.date);
  fd.append('lifeStage', memory.lifeStage);
  fd.append("isPrivate", String((memory as any).isPrivate ?? false));
  return fd;
};

// ========== COMPONENT ==========
const Dashboard: React.FC = () => {
  const {
    filteredMemories,
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    restoreMemory,
    undoLastDelete,
    lastDeletedId,
    filterState,
  } = useMemories();

  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'chapters'>('chapters');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  const isDark = useDarkMode();
  const isLgUp = useMediaQuery('(min-width: 1024px)');
  const isMdUp = useMediaQuery('(min-width: 768px)');
  const isSmUp = useMediaQuery('(min-width: 640px)');
  const isXlUp = useMediaQuery('(min-width: 1280px)');

  // Choose light/dark palette from theme
  const palette = isDark ? theme.dark : theme.light;

  // Derived styles using theme primitives
  const bgColor = palette.bg;
  const textPrimary = palette.text;
  const textSecondary = palette.textMuted;
  const textMuted = isDark ? theme.colors.brand[500] : theme.colors.stone[400];
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const topBarBg = isDark ? theme.colors.brand[950] + 'CC' : 'rgba(255,255,255,0.8)';
  const viewToggleBg = isDark ? theme.colors.brand[900] : theme.colors.stone[100];
  const viewToggleActiveBg = isDark ? theme.colors.brand[800] : theme.colors.white;
  const viewToggleActiveText = isDark ? theme.colors.brand[200] : theme.colors.brand[600];
  const viewToggleInactiveText = isDark ? theme.colors.brand[400] : theme.colors.stone[500];
  const addBtnBg = theme.colors.brand[500];
  const addBtnHoverBg = theme.colors.brand[600];
  const flashbackGradient = isDark
    ? `linear-gradient(to right, ${theme.colors.brand[950]}, ${theme.colors.brand[800]})`
    : `linear-gradient(to right, ${theme.colors.brand[800]}, ${theme.colors.brand[600]})`;
  const memoryRestoreOverlay = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
  const coverTitleColor = isDark ? theme.colors.white : theme.colors.stone[900];
  const coverDateColor = isDark ? theme.colors.stone[400] : theme.colors.stone[500];
  const coverDividerColor = isDark ? theme.colors.brand[700] : theme.colors.brand[600];

  // ========== RESPONSIVE VALUES ==========
  const topBarPaddingX = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const topBarPaddingY = isMdUp ? theme.spacing(4) : theme.spacing(3);
  const mainPadding = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const flashbackPadding = isMdUp ? theme.spacing(8) : theme.spacing(5);
  const flashbackGridGap = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const mainGridGap = isMdUp ? theme.spacing(6) : theme.spacing(4);

  // ========== FLASHBACK MEMORIES ==========
  const flashbackMemories = useMemo(() => {
    const today = new Date();
    return memories.filter(m => {
      if (m.isDeleted) return false;
      const memDate = new Date(m.date);
      return memDate.getMonth() === today.getMonth() &&
        memDate.getDate() === today.getDate() &&
        memDate.getFullYear() < today.getFullYear();
    });
  }, [memories]);

  // ========== KEYBOARD SHORTCUTS ==========
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ========== UNDO TOAST ==========
  useEffect(() => {
    if (lastDeletedId) {
      setShowUndoToast(true);
      const timer = setTimeout(() => setShowUndoToast(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [lastDeletedId]);

  // ========== HANDLERS ==========
  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };

  const handleSave = (memory: Memory) => {
    const formData = memoryToFormData(memory);
    if (editingMemory && editingMemory.id === memory.id && memories.some(m => m.id === memory.id)) {
      updateMemory(editingMemory.id, formData).catch(err => console.error('Update failed', err));
    } else {
      addMemory(formData).catch(err => console.error('Add failed', err));
    }
    setEditingMemory(null);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  const handlePlayVideo = (url: string, title: string) => {
    setActiveVideo({ url, title });
  };

  // ========== STATS (kept for future use) ==========
  const stats = {
    total: memories.filter(m => !m.isDeleted).length,
    photos: memories.filter(m => m.mediaType === MediaType.PHOTO && !m.isDeleted).length,
    trash: memories.filter(m => m.isDeleted).length,
  };

  // ========== GRID UTILITIES ==========
  const getGridColumns = () => {
    if (viewMode === 'grid') {
      if (isXlUp) return 'repeat(4, 1fr)';
      if (isLgUp) return 'repeat(3, 1fr)';
      if (isMdUp) return 'repeat(2, 1fr)';
      return '1fr';
    }
    return undefined;
  };

  const getFlashbackGridColumns = () => {
    if (isLgUp) return 'repeat(3, 1fr)';
    if (isMdUp) return 'repeat(2, 1fr)';
    return '1fr';
  };

  return (
    <>
      {/* Global styles for animations and print */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @media print {
          .print-hidden {
            display: none !important;
          }
          .memory-book-title {
            display: block !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          backgroundColor: bgColor,
          transition: `background-color 300ms ${theme.transition.DEFAULT}`,
          paddingBottom: theme.spacing(20),
        }}
      >
        {/* Print Cover Page */}
        <div
          className="memory-book-title"
          style={{
            display: 'none',
            textAlign: 'center',
            padding: theme.spacing(12),
          }}
        >
          <h1
            style={{
              fontSize: theme.fontSize['6xl'],
              fontFamily: theme.fontFamily.serif,
              fontWeight: 'bold',
              color: coverTitleColor,
              marginBottom: theme.spacing(4),
            }}
          >
            {(user as any)?.name || 'User'}
          </h1>
          <p
            style={{
              fontSize: theme.fontSize['2xl'],
              color: coverDateColor,
              fontStyle: 'italic',
              marginBottom: theme.spacing(8),
            }}
          >
            A Journey Through Moments & Memories
          </p>
          <div
            style={{
              width: theme.spacing(32),
              height: '4px',
              backgroundColor: coverDividerColor,
              margin: '0 auto',
              borderRadius: theme.borderRadius.full,
              marginBottom: theme.spacing(8),
            }}
          />
          <p
            style={{
              color: theme.colors.stone[400],
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: theme.fontSize.sm,
            }}
          >
            Archived via Roots •{' '}
            {new Date().toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Undo Toast */}
        {showUndoToast && (
          <div
            className="print-hidden"
            style={{
              position: 'fixed',
              bottom: theme.spacing(24),
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              animation: 'fade-in-up 0.3s ease-out',
            }}
          >
            <div
              style={{
                backgroundColor: theme.colors.brand[900],
                color: theme.colors.white,
                padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
                borderRadius: theme.borderRadius.full,
                boxShadow: theme.boxShadow['2xl'],
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing(4),
                border: `1px solid ${theme.colors.brand[700]}`,
              }}
            >
              <span style={{ fontSize: theme.fontSize.sm, fontWeight: 500 }}>
                Memory moved to Trash
              </span>
              <button
                onClick={() => {
                  undoLastDelete();
                  setShowUndoToast(false);
                }}
                style={{
                  color: theme.colors.amber[400],
                  fontWeight: 'bold',
                  fontSize: theme.fontSize.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(1),
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                <Undo2 size={16} /> Undo
              </button>
              <button
                onClick={() => setShowUndoToast(false)}
                style={{
                  color: theme.colors.brand[700],
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div
          className="print-hidden"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            backgroundColor: topBarBg,
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${borderColor}`,
            padding: `${topBarPaddingY} ${topBarPaddingX}`,
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: isMdUp ? 'row' : 'column',
              alignItems: isMdUp ? 'center' : 'flex-start',
              justifyContent: 'space-between',
              gap: isMdUp ? theme.spacing(4) : theme.spacing(3),
            }}
          >
            {/* Left Section: Welcome & Date */}
            <div>
              <h2
                style={{
                  fontSize: isMdUp ? theme.fontSize.xl : theme.fontSize.lg,
                  fontWeight: 'bold',
                  color: textPrimary,
                  fontFamily: theme.fontFamily.serif,
                  letterSpacing: '-0.025em',
                }}
              >
                Welcome{' '}
                {localStorage.getItem('username') || (user as any)?.name?.split(' ')[0] || 'User'}
              </h2>
              <p
                style={{
                  fontSize: theme.fontSize.xs,
                  color: textSecondary,
                }}
              >
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Right Section: View Toggle + Add Button */}
            <div
              style={{
                display: 'flex',
                flexDirection: isSmUp ? 'row' : 'column',
                alignItems: 'center',
                gap: theme.spacing(3),
              }}
            >
              {/* View Toggle Buttons */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: viewToggleBg,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing(1),
                }}
              >
                {[
                  { mode: 'chapters', icon: BookOpen },
                  { mode: 'timeline', icon: List },
                  { mode: 'grid', icon: LayoutGrid },
                ].map(({ mode, icon: Icon }) => {
                  const isActive = viewMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as any)}
                      style={{
                        padding: isMdUp ? theme.spacing(2) : theme.spacing(1.5),
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: isActive ? viewToggleActiveBg : 'transparent',
                        color: isActive
                          ? viewToggleActiveText
                          : viewToggleInactiveText,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} View`}
                    >
                      <Icon size={isMdUp ? 16 : 14} />
                    </button>
                  );
                })}
              </div>

              {/* Add Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing(2),
                  backgroundColor: addBtnBg,
                  color: theme.colors.white,
                  padding: `${isMdUp ? theme.spacing(2) : theme.spacing(1.5)} ${isMdUp ? theme.spacing(5) : theme.spacing(4)}`,
                  borderRadius: theme.borderRadius.full,
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: 'scale(1)',
                  boxShadow: theme.boxShadow.green,
                  fontSize: isMdUp ? theme.fontSize.sm : theme.fontSize.xs,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = addBtnHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = addBtnBg;
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Plus size={isMdUp ? 18 : 16} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: mainPadding,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(8),
          }}
        >
          {/* Flashback Section */}
          {flashbackMemories.length > 0 && !filterState.showDeleted && !filterState.searchQuery && (
            <div
              className="print-hidden"
              style={{
                background: flashbackGradient,
                borderRadius: theme.borderRadius['2xl'],
                padding: flashbackPadding,
                color: theme.colors.white,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: theme.boxShadow['2xl'],
                animation: 'fade-in 0.6s ease-out',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: theme.spacing(64),
                  height: theme.spacing(64),
                  backgroundColor: theme.colors.brand[500] + '33',
                  filter: 'blur(128px)',
                  marginRight: theme.spacing(-32),
                  marginTop: theme.spacing(-32),
                }}
              />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(3),
                    marginBottom: theme.spacing(6),
                  }}
                >
                  <div
                    style={{
                      padding: theme.spacing(3),
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: theme.borderRadius['2xl'],
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <History size={24} style={{ color: theme.colors.amber[400] }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: isMdUp ? theme.fontSize.xl : theme.fontSize.lg,
                        fontFamily: theme.fontFamily.serif,
                        fontWeight: 'bold',
                      }}
                    >
                      On This Day...
                    </h3>
                    <p
                      style={{
                        fontSize: theme.fontSize.xs,
                        color: theme.colors.brand[200],
                        fontWeight: 500,
                      }}
                    >
                      Revisiting moments from years past
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: getFlashbackGridColumns(),
                    gap: flashbackGridGap,
                  }}
                >
                  {flashbackMemories.slice(0, 3).map((memory) => (
                    <div
                      key={memory.id}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleEdit(memory)}
                    >
                      <div
                        style={{
                          aspectRatio: '4/3',
                          borderRadius: theme.borderRadius['2xl'],
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <img
                          src={memory.mediaUrl}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          alt=""
                        />
                        <div
                          style={{
                            ...absoluteFill,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: theme.spacing(4),
                            left: theme.spacing(4),
                            right: theme.spacing(4),
                          }}
                        >
                          <p
                            style={{
                              fontSize: '10px',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              color: theme.colors.amber[400],
                              marginBottom: theme.spacing(1),
                            }}
                          >
                            {new Date(memory.date).getFullYear()}
                          </p>
                          <p
                            style={{
                              fontSize: theme.fontSize.sm,
                              fontWeight: 'bold',
                              color: theme.colors.white,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {memory.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main View */}
          <div style={{ position: 'relative' }}>
            {!filterState.showDeleted && (
              <>
                {viewMode === 'chapters' && (
                  <ChaptersView
                    memories={filteredMemories}
                    onEdit={handleEdit}
                    onDelete={deleteMemory}
                    onPlayVideo={handlePlayVideo}
                  />
                )}
                {viewMode === 'timeline' && (
                  <TimelineView
                    memories={filteredMemories}
                    onEdit={handleEdit}
                    onDelete={deleteMemory}
                    onPlayVideo={handlePlayVideo}
                  />
                )}
                {viewMode === 'grid' && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: getGridColumns(),
                      gap: mainGridGap,
                    }}
                  >
                    {filteredMemories.map((memory) => (
                      <MemoryCard
                        key={memory.id}
                        memory={memory}
                        onEdit={handleEdit}
                        onDelete={deleteMemory}
                        onPlayVideo={handlePlayVideo}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {filterState.showDeleted && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: getGridColumns(),
                  gap: mainGridGap,
                }}
              >
                {filteredMemories.map((memory) => (
                  <div key={memory.id} style={{ position: 'relative' }}>
                    <MemoryCard
                      memory={memory}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onPlayVideo={handlePlayVideo}
                    />
                    <div
                      style={{
                        ...absoluteFill,
                        backgroundColor: memoryRestoreOverlay,
                        backdropFilter: 'blur(1px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: theme.spacing(3),
                      }}
                    >
                      <button
                        onClick={() => restoreMemory(memory.id)}
                        style={{
                          backgroundColor: theme.colors.brand[600],
                          color: theme.colors.white,
                          padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
                          borderRadius: theme.borderRadius.full,
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: theme.boxShadow.lg,
                          transition: 'backgroundColor 0.2s',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = theme.colors.brand[700])
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = theme.colors.brand[600])
                        }
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <MemoryModal
          isOpen={isModalOpen}
          onClose={handleClose}
          // onSave={handleSave} // Note: MemoryModal expects onSave prop; if not used, comment out.
          initialData={editingMemory}
        />
        <VideoPlayerModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo?.url || ''}
          title={activeVideo?.title || ''}
        />
      </div>
    </>
  );
};

export default Dashboard;