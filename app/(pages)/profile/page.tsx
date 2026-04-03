// app/profile/page.tsx (or pages/profile.tsx) — FIXED VERSION
"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMemories } from "@/context/MemoryContext";
import { useNotification } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import {
  User, Mail, Calendar, Camera, Book, Edit2, ShieldCheck,
  CreditCard, Download, Cloud, Settings, Type, Eye, Palette, Lock, Save, X, BarChart,
  CheckCircle2, AlertCircle, Trash2, Key, Upload, EyeOff
} from "lucide-react";
import { LifeStage } from "@/types";
import { LIFE_STAGE_CONFIG } from "@/constants";
import theme from "../../theme"; // <-- imported design system

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

// ========== STYLE UTILITIES ==========
const flexBetween = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as const;
const absoluteFill = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const;

// ========== COMPONENT ==========
const Profile: React.FC = () => {
  const { user } = useAuth();
  const { memories } = useMemories();
  const { showToast } = useNotification();
  const { theme: themeMode } = useTheme();
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemDark);
  const isMdUp = useMediaQuery('(min-width: 768px)');

  // State for fetched profile
  const [fetchedProfile, setFetchedProfile] = useState<null | {
    name: string;
    email: string;
    avatarUrl: string;
  }>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Modal States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Form States
  const [editForm, setEditForm] = useState({ name: '', email: '', avatarUrl: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Choose light/dark palette from theme
  const palette = isDark ? theme.dark : theme.light;

  // Derived styles using theme primitives
  const bgPage = palette.bg;
  const textBase = palette.text;
  const textMuted = palette.textMuted;
  const textSecondary = isDark ? theme.colors.stone[400] : theme.colors.stone[600];
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const cardBg = palette.bgCard;
  const cardBorder = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const inputBg = palette.bgInput;
  const inputBorder = palette.border;
  const inputText = palette.text;
  const labelColor = isDark ? theme.colors.brand[400] : theme.colors.stone[500];
  const headerBg = isDark ? theme.colors.brand[950] : theme.colors.brand[800];
  const modalBg = palette.bgCard;
  const modalHeaderBg = isDark ? theme.colors.brand[900] + '80' : theme.colors.stone[100];
  const modalBorder = isDark ? theme.colors.brand[800] : theme.colors.stone[200];

  const getIconColor = (lightColor: string) => isDark ? theme.colors.white : lightColor;

  // Default avatar generator
  const getDefaultAvatar = (name: string) => {
    const encodedName = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?name=${encodedName}&size=150&background=${theme.colors.brand[500].slice(1)}&color=fff&bold=true`;
  };

  // Determine which user data to display
  const displayUser = fetchedProfile || user;

  // Fetch profile from Next.js API
  useEffect(() => {
    setLoadingProfile(true);
    axios
      .get('/api/auth/fetch-profile', { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          const fetchedUser = response.data.user;
          const name = fetchedUser.username || 'User';
          const email = fetchedUser.email || '';
          const avatarUrl = fetchedUser.profileImage?.url || getDefaultAvatar(name);
          const profile = { name, email, avatarUrl };
          setFetchedProfile(profile);
          setEditForm(profile);
        } else {
          showToast('Failed to load profile', 'ERROR');
        }
      })
      .catch((error) => {
        console.error('Profile fetch error:', error);
        showToast('Error loading profile', 'ERROR');
      })
      .finally(() => setLoadingProfile(false));
  }, [user, showToast]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!displayUser) return null;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Update profile (using Next.js API)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('username', editForm.name);
      if (selectedFile) formData.append('profileImage', selectedFile);
      const response = await axios.patch('/api/auth/update-profile', formData, {
        withCredentials: true,
      });
      if (response.data.success) {
        const updatedUser = response.data.user;
        const newProfile = {
          name: updatedUser.username || editForm.name,
          email: updatedUser.email,
          avatarUrl: updatedUser.profileImage?.url || editForm.avatarUrl,
        };
        setFetchedProfile(newProfile);
        setEditForm(newProfile);
        showToast("Profile updated successfully", "SUCCESS");
        setIsEditProfileOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        showToast(response.data.message || 'Update failed', 'ERROR');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error updating profile';
      showToast(message, 'ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update password (using Next.js API)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      showToast("New passwords do not match", "ERROR");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        '/api/auth/change-password',
        { currentPassword: passwordForm.current, newPassword: passwordForm.new },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsChangePasswordOpen(false);
        setPasswordForm({ current: '', new: '', confirm: '' });
        showToast("Password changed successfully", "SUCCESS");
      } else {
        showToast(response.data.message || 'Password change failed', 'ERROR');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error changing password';
      showToast(message, 'ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate Stats
  const statsByStage = Object.values(LifeStage).map(stage => ({
    stage,
    count: memories.filter(m => m.lifeStage === stage && !m.isDeleted).length,
    color: LIFE_STAGE_CONFIG[stage].color.split(' ')[0],
  }));

  const totalMemories = memories.filter(m => !m.isDeleted).length;

  // FIXED: Safe color lookup — eliminates the TS2352 error
  // (string → specific literal union "300"|"400"|"500" etc. was causing the assertion warning)
  const getStageColorValue = (colorClass: string): string => {
    const match = colorClass.match(/([a-z]+)-([0-9]+)/);
    if (!match) return theme.colors.brand[500];

    const [, colorName, shade] = match;

    // Treat all color groups as string-keyed records (safe at runtime + no TS error)
    const colors = theme.colors as {
      stone: Record<string, string>;
      brand: Record<string, string>;
      amber: Record<string, string>;
      rose: Record<string, string>;
    };

    return colors[colorName as keyof typeof colors]?.[shade] ?? theme.colors.brand[500];
  };

  // Responsive values
  const mainPadding = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const headerMinHeight = isMdUp ? theme.spacing(64) : theme.spacing(48);
  const avatarSize = isMdUp ? theme.spacing(32) : theme.spacing(24);
  const headerButtonPadding = isMdUp ? `${theme.spacing(2.5)} ${theme.spacing(6)}` : `${theme.spacing(2)} ${theme.spacing(4)}`;

  return (
    <>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: bgPage,
          paddingBottom: theme.spacing(20),
          transition: `background-color 300ms ${theme.transition.DEFAULT}`,
          fontSize: theme.fontSize.base,
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        {/* Header - Fixed for safe area & responsive height */}
        <div
          style={{
            minHeight: headerMinHeight,
            backgroundColor: headerBg,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              ...absoluteFill,
              backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.2,
            }}
          />
          <div
            style={{
              ...absoluteFill,
              background: `linear-gradient(to bottom, transparent, ${theme.colors.brand[950]}E6)`,
            }}
          />
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: `0 ${mainPadding}`,
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              paddingBottom: isMdUp ? theme.spacing(12) : theme.spacing(8),
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: isMdUp ? 'row' : 'column',
                alignItems: isMdUp ? 'flex-end' : 'flex-start',
                gap: theme.spacing(6),
                width: '100%',
                flexWrap: 'wrap',
              }}
            >
              {/* Avatar with hover effect */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: theme.borderRadius['3xl'],
                    border: `4px solid ${isDark ? theme.colors.brand[800] : theme.colors.white}`,
                    boxShadow: theme.boxShadow['2xl'],
                    overflow: 'hidden',
                    backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.brand[100],
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <img
                    src={(displayUser as any).avatarUrl}
                    alt={(displayUser as any).name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e:any) => (e.currentTarget.src = getDefaultAvatar((displayUser as any).name))}
                  />
                </div>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  style={{
                    position: 'absolute',
                    bottom: theme.spacing(-2),
                    right: theme.spacing(-2),
                    padding: theme.spacing(2),
                    backgroundColor: isDark ? theme.colors.brand[700] : theme.colors.white,
                    color: isDark ? theme.colors.white : theme.colors.brand[900],
                    borderRadius: theme.borderRadius.xl,
                    boxShadow: theme.boxShadow.lg,
                    border: 'none',
                    cursor: 'pointer',
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? theme.colors.brand[600] : theme.colors.brand[50]; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isDark ? theme.colors.brand[700] : theme.colors.white; }}
                >
                  <Camera size={18} />
                </button>
              </div>

              {/* User info */}
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <h1
                  style={{
                    fontSize: isMdUp ? theme.fontSize['4xl'] : theme.fontSize['3xl'],
                    fontFamily: theme.fontFamily.serif,
                    fontWeight: 'bold',
                    color: theme.colors.white,
                    marginBottom: theme.spacing(2),
                    wordBreak: 'break-word',
                  }}
                >
                  {(displayUser as any).name}
                </h1>
                <p style={{ color: theme.colors.brand[200], display: 'flex', alignItems: 'center', gap: theme.spacing(2), flexWrap: 'wrap' }}>
                  <Mail size={16} style={{ color: getIconColor(theme.colors.brand[200]) }} /> {displayUser.email}
                </p>
                {loadingProfile && (
                  <p style={{ color: theme.colors.brand[300], fontSize: theme.fontSize.sm, marginTop: theme.spacing(2) }}>
                    Loading profile...
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: theme.spacing(3), flexWrap: 'wrap', marginBottom: theme.spacing(2) }}>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(2),
                    padding: headerButtonPadding,
                    backgroundColor: theme.colors.white,
                    color: theme.colors.brand[900],
                    borderRadius: theme.borderRadius.xl,
                    fontSize: isMdUp ? theme.fontSize.sm : theme.fontSize.xs,
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: theme.boxShadow.xl,
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.stone[100])}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.white)}
                >
                  <Edit2 size={isMdUp ? 16 : 14} /> Edit Profile
                </button>
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(2),
                    padding: headerButtonPadding,
                    backgroundColor: theme.colors.brand[800],
                    color: theme.colors.white,
                    borderRadius: theme.borderRadius.xl,
                    fontSize: isMdUp ? theme.fontSize.sm : theme.fontSize.xs,
                    fontWeight: 'bold',
                    border: `1px solid rgba(255,255,255,0.1)`,
                    cursor: 'pointer',
                    boxShadow: theme.boxShadow.xl,
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.brand[700])}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.brand[800])}
                >
                  <Key size={isMdUp ? 16 : 14} /> Security
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: `0 ${mainPadding}`,
            marginTop: theme.spacing(12),
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(6) }}>
            {/* Legacy Insights */}
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: theme.borderRadius['3xl'],
                boxShadow: theme.boxShadow.sm,
                border: `1px solid ${cardBorder}`,
                padding: theme.spacing(6),
                textAlign: 'left',
              }}
            >
              <div style={flexBetween}>
                <h3 style={{ fontSize: theme.fontSize.lg, fontWeight: 'bold', color: textBase, display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
                  <BarChart size={20} style={{ color: getIconColor(theme.colors.brand[600]) }} /> Legacy Insights
                </h3>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: isDark ? theme.colors.brand[400] : theme.colors.brand[500],
                  backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
                  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                  borderRadius: theme.borderRadius.base,
                }}>
                  Real-time
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(5), marginTop: theme.spacing(6) }}>
                {statsByStage.map((item) => {
                  const stageConfig = LIFE_STAGE_CONFIG[item.stage];
                  const Icon = stageConfig.icon;
                  const colorValue = getStageColorValue(item.color);
                  return (
                    <div key={item.stage} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
                      <div style={flexBetween}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2), fontSize: theme.fontSize.sm, fontWeight: 'bold', color: textSecondary }}>
                          {Icon && <Icon size={14} style={{ color: getIconColor(textSecondary) }} />}
                          {item.stage}
                        </span>
                        <span style={{ fontSize: theme.fontSize.sm, fontWeight: 'bold', color: textSecondary }}>{item.count}</span>
                      </div>
                      <div style={{
                        height: theme.spacing(2),
                        width: '100%',
                        backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.stone[200],
                        borderRadius: theme.borderRadius.full,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min((item.count / 10) * 100, 100)}%`,
                          backgroundColor: colorValue,
                          transition: 'width 1000ms ease',
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{
                marginTop: theme.spacing(8),
                padding: theme.spacing(4),
                backgroundColor: isDark ? theme.colors.brand[800] + '66' : theme.colors.brand[50],
                borderRadius: theme.borderRadius['2xl'],
                border: `1px solid ${isDark ? theme.colors.brand[700] : theme.colors.brand[100]}`,
              }}>
                <p style={{ fontSize: theme.fontSize.xs, color: isDark ? theme.colors.brand[300] : theme.colors.brand[800], fontWeight: 500, lineHeight: 1.625 }}>
                  Preservation Milestone: You've documented <strong>{totalMemories} moments</strong>. Keep building your story!
                </p>
              </div>
            </div>

            {/* Account Integrity */}
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: theme.borderRadius['2xl'],
                boxShadow: theme.boxShadow.sm,
                border: `1px solid ${cardBorder}`,
                padding: theme.spacing(6),
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(4),
                textAlign: 'left',
              }}
            >
              <h3 style={{ fontSize: theme.fontSize.xs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: isDark ? theme.colors.brand[500] : theme.colors.stone[500] }}>
                Account Integrity
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(3), color: textSecondary, fontSize: theme.fontSize.sm, flexWrap: 'wrap' }}>
                <Calendar size={16} style={{ color: getIconColor(theme.colors.brand[500]) }} /> Member since{' '}
                {new Date((user as any)?.joinDate || Date.now()).toLocaleDateString(
                  undefined,
                  { month: 'long', year: 'numeric' }
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(3), color: textSecondary, fontSize: theme.fontSize.sm }}>
                <ShieldCheck size={16} style={{ color: getIconColor(theme.colors.emerald[400]) }} /> End-to-end Encrypted
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(3), color: textSecondary, fontSize: theme.fontSize.sm }}>
                <CheckCircle2 size={16} style={{ color: getIconColor(theme.colors.brand[500]) }} /> Verified Family Owner
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(4),
            animation: 'fade-in 0.2s ease-out',
          }}
        >
          <div
            style={{
              backgroundColor: modalBg,
              width: '100%',
              maxWidth: '32rem',
              borderRadius: theme.borderRadius['2xl'],
              boxShadow: theme.boxShadow['2xl'],
              overflow: 'hidden',
              border: `1px solid ${modalBorder}`,
            }}
          >
            <div
              style={{
                padding: `${theme.spacing(6)} ${theme.spacing(8)}`,
                borderBottom: `1px solid ${modalBorder}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: modalHeaderBg,
              }}
            >
              <h3 style={{ fontSize: theme.fontSize['2xl'], fontFamily: theme.fontFamily.serif, fontWeight: 'bold', color: textBase }}>
                Edit Profile
              </h3>
              <button
                onClick={() => {
                  setIsEditProfileOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                style={{
                  padding: theme.spacing(2),
                  background: 'none',
                  border: 'none',
                  borderRadius: theme.borderRadius.full,
                  color: isDark ? theme.colors.brand[400] : theme.colors.stone[600],
                  cursor: 'pointer',
                  transition: theme.transition.DEFAULT,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? theme.colors.brand[800] : theme.colors.stone[200]; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} style={{ padding: theme.spacing(8), display: 'flex', flexDirection: 'column', gap: theme.spacing(6), textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 900, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing(2) }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: theme.spacing(4), top: '50%', transform: 'translateY(-50%)', color: getIconColor(theme.colors.stone[400]) }} />
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: `${theme.spacing(3.5)} ${theme.spacing(4)} ${theme.spacing(3.5)} ${theme.spacing(12)}`,
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius['2xl'],
                      color: inputText,
                      fontWeight: 'bold',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.brand[500]}80`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 900, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing(2) }}>
                  Profile Picture
                </label>
                <div style={{ display: 'flex', flexDirection: isMdUp ? 'row' : 'column', alignItems: 'center', gap: theme.spacing(4) }}>
                  <div
                    style={{
                      width: theme.spacing(20),
                      height: theme.spacing(20),
                      borderRadius: theme.borderRadius['2xl'],
                      overflow: 'hidden',
                      backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.stone[100],
                      border: `2px solid ${isDark ? theme.colors.brand[700] : theme.colors.stone[200]}`,
                    }}
                  >
                    <img
                      src={previewUrl || editForm.avatarUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = getDefaultAvatar(editForm.name); }}
                    />
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    style={{
                      flex: 1,
                      padding: theme.spacing(3),
                      backgroundColor: isDark ? theme.colors.brand[800] + '80' : theme.colors.stone[50],
                      border: `2px dashed ${isDark ? theme.colors.brand[700] : theme.colors.stone[200]}`,
                      borderRadius: theme.borderRadius['2xl'],
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: theme.transition.DEFAULT,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.colors.brand[400]; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? theme.colors.brand[700] : theme.colors.stone[200]; }}
                  >
                    <Upload size={24} color={getIconColor(isDark ? theme.colors.brand[400] : theme.colors.stone[400])} />
                    <p style={{ fontSize: theme.fontSize.xs, color: textMuted, marginTop: theme.spacing(1) }}>
                      {selectedFile ? selectedFile.name : 'Click to upload new image'}
                    </p>
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: theme.spacing(4),
                  backgroundColor: theme.colors.brand[500],
                  color: theme.colors.white,
                  borderRadius: theme.borderRadius['2xl'],
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: theme.boxShadow.green,
                  transition: theme.transition.DEFAULT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing(2),
                  opacity: isSubmitting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = theme.colors.brand[600]; }}
                onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = theme.colors.brand[500]; }}
              >
                {isSubmitting ? 'Preserving Changes...' : ( <> <Save size={20} /> Update Profile </> )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(4),
            animation: 'fade-in 0.2s ease-out',
          }}
        >
          <div
            style={{
              backgroundColor: modalBg,
              width: '100%',
              maxWidth: '32rem',
              borderRadius: theme.borderRadius['2xl'],
              boxShadow: theme.boxShadow['2xl'],
              overflow: 'hidden',
              border: `1px solid ${modalBorder}`,
            }}
          >
            <div
              style={{
                padding: `${theme.spacing(6)} ${theme.spacing(8)}`,
                borderBottom: `1px solid ${modalBorder}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: modalHeaderBg,
              }}
            >
              <h3 style={{ fontSize: theme.fontSize['2xl'], fontFamily: theme.fontFamily.serif, fontWeight: 'bold', color: textBase }}>
                Account Security
              </h3>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                style={{
                  padding: theme.spacing(2),
                  background: 'none',
                  border: 'none',
                  borderRadius: theme.borderRadius.full,
                  color: isDark ? theme.colors.brand[400] : theme.colors.stone[600],
                  cursor: 'pointer',
                  transition: theme.transition.DEFAULT,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? theme.colors.brand[800] : theme.colors.stone[200]; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdatePassword} style={{ padding: theme.spacing(8), display: 'flex', flexDirection: 'column', gap: theme.spacing(6), textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 900, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing(2) }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: theme.spacing(4), top: '50%', transform: 'translateY(-50%)', color: getIconColor(theme.colors.stone[400]) }} />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    style={{
                      width: '100%',
                      padding: `${theme.spacing(3.5)} ${theme.spacing(12)} ${theme.spacing(3.5)} ${theme.spacing(12)}`,
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius['2xl'],
                      color: inputText,
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.amber[400]}80`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    style={{
                      position: 'absolute',
                      right: theme.spacing(4),
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: getIconColor(isDark ? theme.colors.brand[400] : theme.colors.stone[400]),
                    }}
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div style={{ height: '1px', backgroundColor: modalBorder, width: '100%' }} />
              <div>
                <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 900, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing(2) }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: theme.spacing(4), top: '50%', transform: 'translateY(-50%)', color: getIconColor(theme.colors.stone[400]) }} />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    style={{
                      width: '100%',
                      padding: `${theme.spacing(3.5)} ${theme.spacing(12)} ${theme.spacing(3.5)} ${theme.spacing(12)}`,
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius['2xl'],
                      color: inputText,
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.amber[400]}80`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: 'absolute',
                      right: theme.spacing(4),
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: getIconColor(isDark ? theme.colors.brand[400] : theme.colors.stone[400]),
                    }}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 900, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: theme.spacing(2) }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={18} style={{ position: 'absolute', left: theme.spacing(4), top: '50%', transform: 'translateY(-50%)', color: getIconColor(theme.colors.stone[400]) }} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    style={{
                      width: '100%',
                      padding: `${theme.spacing(3.5)} ${theme.spacing(12)} ${theme.spacing(3.5)} ${theme.spacing(12)}`,
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius['2xl'],
                      color: inputText,
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.amber[400]}80`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute',
                      right: theme.spacing(4),
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: getIconColor(isDark ? theme.colors.brand[400] : theme.colors.stone[400]),
                    }}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: theme.spacing(4),
                  backgroundColor: theme.colors.brand[500],
                  color: theme.colors.white,
                  borderRadius: theme.borderRadius['2xl'],
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: theme.boxShadow.green,
                  transition: theme.transition.DEFAULT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing(2),
                  opacity: isSubmitting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = theme.colors.brand[600]; }}
                onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = theme.colors.brand[500]; }}
              >
                {isSubmitting ? 'Securing Account...' : ( <> <Lock size={20} /> Change Password </> )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;