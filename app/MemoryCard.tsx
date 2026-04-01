import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Memory, MediaType, Reaction } from '../types';
import { LIFE_STAGE_CONFIG, MEDIA_TYPE_ICONS, CURRENT_USER } from '../constants';
import {
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  PlayCircle,
  Heart,
  ThumbsUp,
  Smile,
  Play,
  Image as ImageIcon,
} from 'lucide-react';
import { useMemories } from '../context/MemoryContext';
import HighlightedText from './HighlightedText';
import { useTheme } from '../context/ThemeContext';

// ========== THEME CONSTANTS ==========
const theme = {
  colors: {
    brand: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49' },
    gray: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' },
    red: { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
    blue: { 500: '#3b82f6' },
    amber: { 500: '#f59e0b' },
    rose: { 500: '#f43f5e' },
    white: '#ffffff',
    black: '#000000',
  },
  spacing: (n: number) => `${n * 0.25}rem`,
  fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
  borderRadius: { sm: '0.25rem', base: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem', '3xl': '2rem', full: '9999px' },
  boxShadow: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)', inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' },
  fontFamily: { sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', serif: 'Cormorant Garamond, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
  transition: { DEFAULT: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
};

// ========== DARK MODE HOOK ==========
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

// ========== STAGE COLOR MAPPING ==========
const getStageColors = (stage: string, isDark: boolean) => {
  const stageLower = stage.toLowerCase();
  if (stageLower.includes('early') || stageLower.includes('child')) return { bgColor: isDark ? 'rgba(244, 114, 182, 0.2)' : '#fce7f3', textColor: isDark ? '#f9a8d4' : '#be185d' };
  if (stageLower.includes('school') || stageLower.includes('youth')) return { bgColor: isDark ? 'rgba(96, 165, 250, 0.2)' : '#dbeafe', textColor: isDark ? '#93c5fd' : '#1e40af' };
  if (stageLower.includes('college')) return { bgColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#d1fae5', textColor: isDark ? '#6ee7b7' : '#047857' };
  if (stageLower.includes('marriage') || stageLower.includes('relationship')) return { bgColor: isDark ? 'rgba(251, 146, 60, 0.2)' : '#ffedd5', textColor: isDark ? '#fdba74' : '#c2410c' };
  if (stageLower.includes('career')) return { bgColor: isDark ? 'rgba(129, 140, 248, 0.2)' : '#e0e7ff', textColor: isDark ? '#a5b4fc' : '#3730a3' };
  if (stageLower.includes('retirement')) return { bgColor: isDark ? 'rgba(196, 181, 253, 0.2)' : '#f3e8ff', textColor: isDark ? '#c4b5fd' : '#6b21a8' };
  return { bgColor: isDark ? 'rgba(148, 163, 184, 0.2)' : '#f1f5f9', textColor: isDark ? '#cbd5e1' : '#475569' };
};

// ========== HELPER: Extract user ID ==========
const getUserId = (user: any): string | null => {
  if (!user) return null;
  if (typeof user === 'string') return user;
  if (typeof user === 'object') {
    if (user._id) return user._id;
    if (user.id) return user.id;
  }
  return null;
};

// ========== COMPONENT ==========
interface MemoryCardProps {
  memory: Memory;
  layout?: 'grid' | 'timeline';
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
  onPlayVideo?: (url: string, title: string) => void;
  onClick?: (memory: Memory) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  layout = 'grid',
  onEdit,
  onDelete,
  onPlayVideo,
  onClick,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [reacting, setReacting] = useState(false);

  const { updateMemoryReactions, filterState } = useMemories();
  const isDark = useIsDark();

  // Reaction logic (uppercase to match Reaction.type)
  const validReactions = (memory.reactions || []).filter((r) => r && r.type);
  const reactionCounts = {
    HEART: validReactions.filter((r) => r.type === 'HEART').length,
    LIKE: validReactions.filter((r) => r.type === 'LIKE').length,
    SMILE: validReactions.filter((r) => r.type === 'SMILE').length,
  };

  const currentUserId = CURRENT_USER.id;
  const userReaction = validReactions.find(
    (r) => getUserId(r.userId) === currentUserId
  )?.type || null;

  const StageIcon = LIFE_STAGE_CONFIG[memory.lifeStage]?.icon;
  const stageLabel = LIFE_STAGE_CONFIG[memory.lifeStage]?.label || memory.lifeStage;
  const { bgColor: stageBgColor, textColor: stageTextColor } = getStageColors(memory.lifeStage, isDark);

  // Safe icon lookup (MediaType.TEXT is not in the map)
  const MediaTypeIcon =
    (MEDIA_TYPE_ICONS as Record<MediaType, any>)[memory.mediaType] || ImageIcon;

  const handleDelete = () => {
    onDelete(memory.id);
    setShowDeleteConfirm(false);
  };

  // FIXED handleReaction – uses uppercase to match types
  const handleReaction = async (type: 'HEART' | 'LIKE' | 'SMILE') => {
    if (reacting) return;
    setReacting(true);

    try {
      const response = await axios.post(
        `/api/auth/reaction/${memory.id}`,
        { type },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { userReaction: newUserReaction } = response.data;

        const oldReactions = memory.reactions || [];
        const otherReactions = oldReactions.filter(
          (r) => getUserId(r.userId) !== currentUserId
        );

        let newReactions: Reaction[] = [...otherReactions];

        if (newUserReaction) {
          newReactions.push({
            userId: currentUserId,
            userName: CURRENT_USER.name || 'You',   // required by Reaction type
            type: newUserReaction as 'HEART' | 'LIKE' | 'SMILE',
          });
        }

        updateMemoryReactions(memory.id, newReactions);
      }
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
    } finally {
      setReacting(false);
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick(memory);
  };

  // Colors
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.8)' : theme.colors.white;
  const cardBorder = isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)';
  const cardShadow = isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : theme.boxShadow.lg;
  const cardHoverShadow = isDark ? '0 20px 30px -10px rgba(0, 0, 0, 0.6)' : theme.boxShadow.xl;
  const titleColor = isDark ? '#f1f5f9' : '#0f172a';
  const titleHoverColor = isDark ? '#38bdf8' : '#0284c7';
  const metaColor = isDark ? '#94a3b8' : '#64748b';
  const descriptionColor = isDark ? '#cbd5e1' : '#334155';
  const borderColor = isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)';
  const placeholderBg = isDark ? '#1e293b' : '#f1f5f9';
  const placeholderIconColor = isDark ? '#475569' : '#94a3b8';

  const overlayBg = isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const overlayText = isDark ? '#f1f5f9' : '#0f172a';
  const cancelBtnBg = isDark ? '#334155' : '#f1f5f9';
  const cancelBtnHoverBg = isDark ? '#475569' : '#e2e8f0';
  const cancelBtnText = isDark ? '#cbd5e1' : '#334155';
  const deleteBtnBg = '#dc2626';
  const deleteBtnHoverBg = '#b91c1c';
  const deleteBtnText = '#ffffff';

  const heartColor = '#f43f5e';
  const likeColor = '#3b82f6';
  const smileColor = '#f59e0b';

  return (
    <>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>

      <div
        style={{
          position: 'relative',
          backgroundColor: cardBg,
          borderRadius: theme.borderRadius['2xl'],
          boxShadow: isHovered ? cardHoverShadow : cardShadow,
          transition: theme.transition.DEFAULT,
          border: `1px solid ${cardBorder}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: layout === 'timeline' ? '100%' : 'auto',
          height: layout === 'grid' ? '100%' : 'auto',
          cursor: onClick ? 'pointer' : 'default',
          backdropFilter: isDark ? 'blur(4px)' : 'none',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Delete Confirmation Overlay */}
        {showDeleteConfirm && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              backgroundColor: overlayBg,
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: theme.spacing(6),
              textAlign: 'center',
              animation: 'scale-in 0.2s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AlertCircle size={40} style={{ color: theme.colors.red[500], marginBottom: theme.spacing(3) }} />
            <h4 style={{ fontWeight: 600, color: overlayText, marginBottom: theme.spacing(1), fontSize: theme.fontSize.lg }}>
              Delete this memory?
            </h4>
            <p style={{ fontSize: theme.fontSize.sm, color: isDark ? '#94a3b8' : '#64748b', marginBottom: theme.spacing(5) }}>
              This can be undone from Trash.
            </p>
            <div style={{ display: 'flex', gap: theme.spacing(3) }}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }}
                style={{
                  padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
                  backgroundColor: cancelBtnBg,
                  border: 'none',
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: cancelBtnText,
                  cursor: 'pointer',
                  transition: theme.transition.DEFAULT,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = cancelBtnHoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = cancelBtnBg)}
              >
                Cancel
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                style={{
                  padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
                  backgroundColor: deleteBtnBg,
                  border: 'none',
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: deleteBtnText,
                  cursor: 'pointer',
                  transition: theme.transition.DEFAULT,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = deleteBtnHoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = deleteBtnBg)}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Media Section */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            overflow: 'hidden',
            backgroundColor: placeholderBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {memory.mediaUrl && !imageError ? (
            <>
              <img
                src={memory.mediaUrl}
                alt={memory.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.7s',
                  transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                }}
                loading="lazy"
                onError={() => setImageError(true)}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)', zIndex: 1 }} />

              {memory.mediaType === MediaType.VIDEO && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: isHovered ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <PlayCircle
                      size={56}
                      style={{
                        color: 'rgba(255,255,255,0.9)',
                        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.2s',
                        filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.2s',
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayVideo?.(memory.mediaUrl!, memory.title);
                      }}
                      style={{
                        padding: `${theme.spacing(2.5)} ${theme.spacing(8)}`,
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: '#0f172a',
                        borderRadius: theme.borderRadius.full,
                        fontWeight: 600,
                        fontSize: theme.fontSize.sm,
                        boxShadow: theme.boxShadow.xl,
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing(2),
                        border: 'none',
                        cursor: 'pointer',
                        transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'all 0.3s',
                      }}
                    >
                      <Play size={16} fill="currentColor" /> Play
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: placeholderIconColor }}>
              <MediaTypeIcon size={48} style={{ marginBottom: theme.spacing(2), opacity: 0.4 }} />
              <span style={{ fontSize: theme.fontSize.xs, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {memory.mediaType}
              </span>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              top: theme.spacing(3),
              left: theme.spacing(3),
              padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
              borderRadius: theme.borderRadius.full,
              backgroundColor: stageBgColor,
              color: stageTextColor,
              fontSize: theme.fontSize.xs,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(1.5),
              boxShadow: theme.boxShadow.sm,
              zIndex: 10,
              backdropFilter: 'blur(4px)',
            }}
          >
            {StageIcon && <StageIcon size={12} />}
            <span>{stageLabel}</span>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: theme.spacing(5), flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: theme.fontSize.xs, color: metaColor, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
              <Calendar size={12} />
              <span>
                {new Date(memory.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          <h3
            style={{
              fontFamily: theme.fontFamily.serif,
              fontWeight: 600,
              fontSize: theme.fontSize.xl,
              color: isHovered ? titleHoverColor : titleColor,
              lineHeight: 1.3,
              transition: 'color 0.2s',
              margin: 0,
            }}
          >
            <HighlightedText text={memory.title} highlight={filterState.searchQuery} />
          </h3>

          <p
            style={{
              color: descriptionColor,
              fontSize: theme.fontSize.sm,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            <HighlightedText text={memory.description} highlight={filterState.searchQuery} />
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: theme.spacing(3), paddingTop: theme.spacing(3), borderTop: `1px solid ${borderColor}` }}>
            {/* Reactions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(3) }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleReaction('HEART'); }}
                disabled={reacting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(1),
                  color: heartColor,
                  background: 'none',
                  border: 'none',
                  cursor: reacting ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.15s',
                  padding: 0,
                  opacity: reacting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!reacting) e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { if (!reacting) e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Heart size={16} style={userReaction === 'HEART' ? { fill: heartColor } : {}} />
                <span style={{ fontSize: theme.fontSize.xs, fontWeight: 600 }}>{reactionCounts.HEART}</span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleReaction('LIKE'); }}
                disabled={reacting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(1),
                  color: likeColor,
                  background: 'none',
                  border: 'none',
                  cursor: reacting ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.15s',
                  padding: 0,
                  opacity: reacting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!reacting) e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { if (!reacting) e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <ThumbsUp size={16} style={userReaction === 'LIKE' ? { fill: likeColor } : {}} />
                <span style={{ fontSize: theme.fontSize.xs, fontWeight: 600 }}>{reactionCounts.LIKE}</span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleReaction('SMILE'); }}
                disabled={reacting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(1),
                  color: smileColor,
                  background: 'none',
                  border: 'none',
                  cursor: reacting ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.15s',
                  padding: 0,
                  opacity: reacting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!reacting) e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { if (!reacting) e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Smile size={16} style={userReaction === 'SMILE' ? { fill: smileColor } : {}} />
                <span style={{ fontSize: theme.fontSize.xs, fontWeight: 600 }}>{reactionCounts.SMILE}</span>
              </button>
            </div>

            {/* Edit / Delete */}
            <div style={{ display: 'flex', gap: theme.spacing(1) }}>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(memory); }}
                style={{
                  padding: theme.spacing(1.5),
                  color: isDark ? '#94a3b8' : '#64748b',
                  background: 'none',
                  border: 'none',
                  borderRadius: theme.borderRadius.full,
                  cursor: 'pointer',
                  transition: theme.transition.DEFAULT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f1f5f9';
                  e.currentTarget.style.color = isDark ? '#38bdf8' : '#0284c7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b';
                }}
              >
                <Edit2 size={14} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                style={{
                  padding: theme.spacing(1.5),
                  color: isDark ? '#94a3b8' : '#64748b',
                  background: 'none',
                  border: 'none',
                  borderRadius: theme.borderRadius.full,
                  cursor: 'pointer',
                  transition: theme.transition.DEFAULT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(220, 38, 38, 0.2)' : '#fee2e2';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b';
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoryCard;