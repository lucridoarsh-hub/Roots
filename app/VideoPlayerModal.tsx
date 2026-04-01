import React, { useState, useEffect } from 'react';
import { X, Play, Maximize } from 'lucide-react';

// ========== THEME CONSTANTS ==========
const theme = {
  colors: {
    brand: {
      600: '#2563eb',
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
  },
  borderRadius: {
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  boxShadow: {
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  fontFamily: {
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  transition: {
    DEFAULT: 'all 0.3s ease',
  },
};

// ========== COMPONENT ==========
interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title,
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Global animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: theme.spacing(4),
          animation: 'fade-in 0.2s ease-out',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1024px', // max-w-5xl
            aspectRatio: '16 / 9',
            backgroundColor: theme.colors.black,
            borderRadius: theme.borderRadius['2xl'],
            overflow: 'hidden',
            boxShadow: theme.boxShadow['2xl'],
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onMouseEnter={() => setIsHeaderVisible(true)}
          onMouseLeave={() => setIsHeaderVisible(false)}
        >
          {/* Header Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: theme.spacing(6),
              zIndex: 10,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: isHeaderVisible ? 1 : 0,
              transition: `opacity 300ms ${theme.transition.DEFAULT}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(3) }}>
              <div
                style={{
                  padding: theme.spacing(2),
                  backgroundColor: theme.colors.brand[600],
                  borderRadius: theme.borderRadius.lg,
                  color: theme.colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play size={18} fill="currentColor" />
              </div>
              <h3
                style={{
                  color: theme.colors.white,
                  fontFamily: theme.fontFamily.serif,
                  fontWeight: 'bold',
                  fontSize: theme.fontSize.lg,
                }}
              >
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: theme.spacing(2),
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: theme.borderRadius.full,
                color: theme.colors.white,
                cursor: 'pointer',
                transition: theme.transition.DEFAULT,
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')
              }
            >
              <X size={24} />
            </button>
          </div>

          {/* Video Player */}
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          >
            Your browser does not support the video tag.
          </video>

          {/* Footer Info */}
          <div
            style={{
              position: 'absolute',
              bottom: theme.spacing(4),
              left: theme.spacing(6),
              color: 'rgba(255,255,255,0.4)',
              fontSize: '10px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(2),
            }}
          >
            <Maximize size={10} /> Roots Secure Media Player
          </div>
        </div>

        {/* Click outside to close */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -10,
          }}
          onClick={onClose}
        ></div>
      </div>
    </>
  );
};

export default VideoPlayerModal;