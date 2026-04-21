// MemoryCard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Memory, MediaType, Reaction } from '../../types';
import { LIFE_STAGE_CONFIG, MEDIA_TYPE_ICONS, CURRENT_USER } from '../../constants';
import theme from '../theme';
import {
  Calendar,
  Edit2,
  PlayCircle,
  Heart,
  ThumbsUp,
  Smile,
  Play,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import HighlightedText from './HighlightedText';
import { useTheme } from '../../context/ThemeContext';

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
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [reacting, setReacting] = useState(false);

  const { updateMemoryReactions, filterState } = useMemories();
  const isDark = useIsDark();

  // Reaction logic
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

  const MediaTypeIcon =
    (MEDIA_TYPE_ICONS as Record<MediaType, any>)[memory.mediaType] || ImageIcon;

  // Theme variables
  const textColor = isDark ? theme.dark.text : theme.light.text;
  const textMuted = isDark ? theme.dark.textMuted : theme.light.textMuted;

  const cardBg = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const cardBorder = isDark ? theme.dark.borderSubtle : theme.light.border;
  const cardShadow = theme.boxShadow.lg;
  const cardHoverShadow = isDark ? theme.boxShadow['2xl'] : theme.boxShadow.greenLg;

  const titleColor = textColor;
  const titleHoverColor = isDark ? theme.colors.brand[300] : theme.colors.brand[600];

  const metaColor = textMuted;
  const descriptionColor = textMuted;

  const placeholderBg = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const placeholderIconColor = textMuted;

  const heartColor = theme.colors.rose[500];
  const likeColor = theme.colors.brand[500];
  const smileColor = theme.colors.amber[500];

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
            userName: CURRENT_USER.name || 'You',
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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this memory?')) {
      onDelete(memory.id);
    }
  };

  return (
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

        {/* Life Stage Badge */}
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: theme.spacing(3), paddingTop: theme.spacing(3), borderTop: `1px solid ${cardBorder}` }}>
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

          {/* Action Buttons (Edit & Delete) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(memory); }}
              style={{
                padding: theme.spacing(1.5),
                color: textMuted,
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
                e.currentTarget.style.backgroundColor = isDark ? '#2f5237' : '#d9ede0';
                e.currentTarget.style.color = titleHoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = textMuted;
              }}
            >
              <Edit2 size={14} />
            </button>

            <button
              onClick={handleDeleteClick}
              style={{
                padding: theme.spacing(1.5),
                color: textMuted,
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
                e.currentTarget.style.backgroundColor = isDark ? '#7f1d1d' : '#fee2e2';
                e.currentTarget.style.color = theme.colors.rose[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = textMuted;
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;