"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Menu,
  X,
  Info,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import Footer from "../../Footer";
import { useAuth } from "../../../context/AuthContext";
import { APP_NAME } from "../../../constants";

// ========== BLOG POST TYPE (matching API) ==========
interface ApiBlogResponse {
  success: boolean;
  blog: {
    _id: string;
    userId: string | { _id: string; username?: string; name?: string };
    title: string;
    description: string;
    images: Array<{ public_id: string; url: string; _id: string }>;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  date: string;
  author: string;
  category: string;
}

// ========== THEME CONSTANTS ==========
const theme = {
  colors: {
    brand: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },
  spacing: (n: number) => `${n * 0.25}rem`,
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT:
      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  transition: { DEFAULT: "all 0.3s ease" },
  zIndex: { 0: 0, 10: 10, 20: 20, 30: 30, 40: 40, 50: 50, 60: 60 },
};

// ========== RESPONSIVE HOOKS ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

const useDarkMode = () => useMediaQuery("(prefers-color-scheme: dark)");

// ========== STYLE UTILITIES ==========
const flexCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;
const flexBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
} as const;

// ========== COMPONENT ==========
const BlogPostDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isDark = useDarkMode();
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Dynamic settings from localStorage
  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  // Load settings on mount
  useEffect(() => {
    const saved = localStorage.getItem("roots_app_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDynamicSettings({
        appName: parsed.appName || APP_NAME,
        logoUrl: parsed.logoUrl || "",
        announcement: parsed.announcement || "",
        maintenanceMode: parsed.maintenanceMode || false,
      });
    }
  }, []);

  // Set document title
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | ${dynamicSettings.appName}`;
    } else {
      document.title = dynamicSettings.appName;
    }
    return () => {
      document.title = dynamicSettings.appName;
    };
  }, [post, dynamicSettings.appName]);

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        router.push("/blog");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<ApiBlogResponse>(
          `/api/auth/admin/blog/${id}`,
          { withCredentials: true }
        );

        if (!response.data || !response.data.blog) {
          throw new Error("Invalid API response");
        }

        const apiBlog = response.data.blog;

        // Extract author name if userId is an object with username/name
        let authorName = "Roots Team";
        if (apiBlog.userId && typeof apiBlog.userId === "object") {
          if ("username" in apiBlog.userId && apiBlog.userId.username)
            authorName = apiBlog.userId.username;
          else if ("name" in apiBlog.userId && apiBlog.userId.name)
            authorName = apiBlog.userId.name;
        }

        const mappedPost: BlogPost = {
          id: apiBlog._id,
          title: apiBlog.title,
          content: apiBlog.description,
          excerpt:
            apiBlog.description.length > 150
              ? apiBlog.description.substring(0, 150) + "..."
              : apiBlog.description,
          coverImageUrl:
            apiBlog.images && apiBlog.images.length > 0
              ? apiBlog.images[0].url
              : "https://via.placeholder.com/1200x600?text=No+Image",
          date: apiBlog.createdAt,
          author: authorName,
          category:
            apiBlog.tags && apiBlog.tags.length > 0
              ? apiBlog.tags[0]
              : "Uncategorized",
        };

        setPost(mappedPost);
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [id, router]);

  // Share handler
  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: `Check out this article: ${post.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareFeedback("Link copied to clipboard!");
        setTimeout(() => setShareFeedback(null), 3000);
      }
    } catch (error) {
      console.error("Share failed:", error);
      if (!navigator.share) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setShareFeedback("Link copied to clipboard!");
          setTimeout(() => setShareFeedback(null), 3000);
        } catch {
          setShareFeedback("Unable to share. You can copy the URL manually.");
          setTimeout(() => setShareFeedback(null), 3000);
        }
      } else {
        setShareFeedback("Sharing cancelled or failed.");
        setTimeout(() => setShareFeedback(null), 3000);
      }
    }
  };

  // Maintenance mode
  if (dynamicSettings.maintenanceMode) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.colors.brand[900],
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing(6),
          textAlign: "center",
          color: theme.colors.white,
          fontFamily: theme.fontFamily.sans,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: theme.spacing(8),
            borderRadius: "3rem",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            maxWidth: "448px",
            boxShadow: theme.boxShadow["2xl"],
          }}
        >
          <AlertCircle
            size={64}
            color={theme.colors.brand[400]}
            style={{
              margin: "0 auto",
              marginBottom: theme.spacing(6),
              animation: "pulse 2s infinite",
            }}
          />
          <h1
            style={{
              fontSize: theme.fontSize["4xl"],
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              marginBottom: theme.spacing(4),
            }}
          >
            Under Maintenance
          </h1>
          <p
            style={{
              color: theme.colors.brand[200],
              lineHeight: 1.625,
              marginBottom: theme.spacing(8),
            }}
          >
            {dynamicSettings.appName} is currently undergoing scheduled
            improvements. We'll be back shortly!
          </p>
          <div
            style={{
              height: "4px",
              width: theme.spacing(24),
              backgroundColor: theme.colors.brand[500],
              margin: "0 auto",
              borderRadius: theme.borderRadius.full,
            }}
          ></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: isDark ? theme.colors.brand[950] : theme.colors.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: isDark ? theme.colors.brand[400] : theme.colors.gray[500],
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!post) return null;

  // Conditional colors based on dark mode
  const bgColor = isDark ? theme.colors.brand[950] : theme.colors.white;
  const navBg = isDark
    ? theme.colors.brand[900] + "E6"
    : "rgba(255,255,255,0.9)";
  const navBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const textSecondary = isDark ? theme.colors.brand[400] : theme.colors.gray[600];
  const categoryBg = isDark ? theme.colors.brand[900] : theme.colors.brand[50];
  const categoryBorder = isDark ? theme.colors.brand[800] : theme.colors.brand[100];
  const categoryText = isDark ? theme.colors.brand[400] : theme.colors.brand[600];
  const authorBg = isDark ? theme.colors.brand[800] : theme.colors.brand[100];
  const authorIconColor = isDark ? theme.colors.brand[300] : theme.colors.brand[700];
  const excerptColor = isDark ? theme.colors.brand[300] : theme.colors.gray[600];
  const excerptBorder = isDark ? theme.colors.brand[800] : theme.colors.brand[100];
  const bodyText = isDark ? theme.colors.brand[200] : theme.colors.gray[800];
  const headingColor = isDark ? theme.colors.brand[100] : theme.colors.brand[900];
  const shareIconBg = isDark ? theme.colors.brand[900] : theme.colors.gray[50];
  const shareIconColor = isDark ? theme.colors.brand[400] : theme.colors.brand[600];
  const shareBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const buttonBg = isDark ? theme.colors.brand[600] : theme.colors.brand[900];
  const buttonHoverBg = isDark ? theme.colors.brand[500] : theme.colors.brand[800];
  const borderColor = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const metaColor = isDark ? theme.colors.brand[500] : theme.colors.gray[400];

  // Responsive paddings
  const mainPaddingX = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const headerPaddingTop = isMdUp ? theme.spacing(8) : theme.spacing(6);
  const headerPaddingBottom = isMdUp ? theme.spacing(12) : theme.spacing(8);
  const featuredImageMarginBottom = isMdUp ? theme.spacing(16) : theme.spacing(12);
  const articlePaddingBottom = isMdUp ? theme.spacing(24) : theme.spacing(16);
  const backLinkPadding = isMdUp
    ? `${theme.spacing(8)} ${theme.spacing(6)} 0 ${theme.spacing(6)}`
    : `${theme.spacing(6)} ${theme.spacing(4)} 0 ${theme.spacing(4)}`;

  // Responsive font sizes
  const titleFontSize = isLgUp
    ? theme.fontSize["6xl"]
    : isMdUp
    ? theme.fontSize["5xl"]
    : theme.fontSize["4xl"];
  const bodyFontSize = isMdUp ? theme.fontSize.lg : theme.fontSize.base;
  const excerptFontSize = isMdUp ? theme.fontSize.xl : theme.fontSize.lg;
  const metaGap = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const metaWrap = isMdUp ? "nowrap" : "wrap";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        transition: "background-color 0.2s ease",
        fontFamily: theme.fontFamily.sans,
      }}
    >
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>

      {/* Announcement bar */}
      {dynamicSettings.announcement && (
        <div
          style={{
            backgroundColor: theme.colors.brand[600],
            color: theme.colors.white,
            padding: `${theme.spacing(2)} 0`,
            textAlign: "center",
            fontSize: theme.fontSize.xs,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing(2),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            position: "sticky",
            top: 0,
            zIndex: theme.zIndex[60],
          }}
        >
          <Info size={14} style={{ animation: "pulse 1s infinite" }} />
          {dynamicSettings.announcement}
        </div>
      )}

      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          width: "100%",
          zIndex: theme.zIndex[50],
          backgroundColor: navBg,
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${navBorder}`,
          transition: theme.transition.DEFAULT,
          top: dynamicSettings.announcement ? theme.spacing(8) : 0,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
            ...flexBetween,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(2),
              textDecoration: "none",
            }}
          >
            {dynamicSettings.logoUrl ? (
              <img
                src={dynamicSettings.logoUrl}
                style={{
                  width: theme.spacing(7),
                  height: theme.spacing(7),
                  borderRadius: theme.borderRadius.lg,
                  objectFit: "cover",
                }}
                alt="Logo"
              />
            ) : (
              <div
                style={{
                  width: theme.spacing(7),
                  height: theme.spacing(7),
                  backgroundColor: isDark ? theme.colors.brand[600] : theme.colors.brand[900],
                  borderRadius: theme.borderRadius.lg,
                  ...flexCenter,
                  color: theme.colors.white,
                  fontFamily: theme.fontFamily.serif,
                  fontWeight: "bold",
                  fontSize: theme.fontSize.lg,
                }}
              >
                {dynamicSettings.appName[0]}
              </div>
            )}
            <span
              style={{
                fontSize: isMdUp ? theme.fontSize["2xl"] : theme.fontSize.xl,
                fontFamily: theme.fontFamily.serif,
                fontWeight: "bold",
                color: isDark ? theme.colors.brand[100] : theme.colors.brand[900],
                letterSpacing: "-0.025em",
              }}
            >
              {dynamicSettings.appName}.
            </span>
          </Link>

          {/* Desktop nav links */}
          {isMdUp && (
            <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(5) }}>
              <Link
                href="/"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = isDark
                    ? theme.colors.brand[200]
                    : theme.colors.brand[700])
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                Home
              </Link>
              <Link
                href="/about"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = isDark
                    ? theme.colors.brand[200]
                    : theme.colors.brand[700])
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                About
              </Link>
              <Link
                href="/blog"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: theme.colors.brand[700],
                  textDecoration: "none",
                }}
              >
                Blog
              </Link>
              <Link
                href="/success-stories"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = isDark
                    ? theme.colors.brand[200]
                    : theme.colors.brand[700])
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                Success Stories
              </Link>
              <Link
                href="/contact"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = isDark
                    ? theme.colors.brand[200]
                    : theme.colors.brand[700])
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                Contact
              </Link>
            </div>
          )}

          {/* Auth buttons & mobile menu toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(3) }}>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                style={{
                  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                  backgroundColor: theme.colors.brand[900],
                  color: theme.colors.white,
                  fontSize: isMdUp ? theme.fontSize.sm : theme.fontSize.xs,
                  fontWeight: 500,
                  borderRadius: theme.borderRadius.full,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow: `0 10px 15px -3px ${theme.colors.brand[900]}33`,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(1.5),
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.brand[800])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.brand[900])
                }
              >
                <LayoutDashboard size={isMdUp ? 16 : 14} />
                {isMdUp ? "Dashboard" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    color: textSecondary,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: isMdUp ? "inline" : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = isDark
                      ? theme.colors.brand[200]
                      : theme.colors.brand[600])
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  style={{
                    padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                    backgroundColor: theme.colors.brand[900],
                    color: theme.colors.white,
                    fontSize: isMdUp ? theme.fontSize.sm : theme.fontSize.xs,
                    fontWeight: 500,
                    borderRadius: theme.borderRadius.full,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    boxShadow: `0 10px 15px -3px ${theme.colors.brand[900]}33`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.colors.brand[800])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.colors.brand[900])
                  }
                >
                  {isMdUp ? "Get Started" : "Sign Up"}
                </Link>
              </>
            )}
            {!isMdUp && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: theme.spacing(1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isDark ? theme.colors.brand[100] : theme.colors.brand[900],
                }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {!isMdUp && mobileMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: isDark
                ? theme.colors.brand[900]
                : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              borderBottom: `1px solid ${navBorder}`,
              padding: theme.spacing(4),
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(3),
              zIndex: theme.zIndex[40],
              boxShadow: theme.boxShadow.lg,
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: 500,
                color: textSecondary,
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Home
            </Link>
            <Link
              href="/about"
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: 500,
                color: textSecondary,
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              About
            </Link>
            <Link
              href="/blog"
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: 500,
                color: theme.colors.brand[700],
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Blog
            </Link>
            <Link
              href="/success-stories"
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: 500,
                color: textSecondary,
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Success Stories
            </Link>
            <Link
              href="/contact"
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: 500,
                color: textSecondary,
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Contact
            </Link>
          </div>
        )}
      </nav>

      {/* Back to Journal Button */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: backLinkPadding,
        }}
      >
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: theme.spacing(2),
            fontSize: theme.fontSize.sm,
            fontWeight: 500,
            color: textSecondary,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = isDark
              ? theme.colors.brand[100]
              : theme.colors.brand[900];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textSecondary;
          }}
        >
          <ArrowLeft size={18} /> Back to Journal
        </Link>
      </div>

      {/* Article Header */}
      <header
        style={{
          paddingTop: headerPaddingTop,
          paddingBottom: headerPaddingBottom,
          paddingLeft: mainPaddingX,
          paddingRight: mainPaddingX,
        }}
      >
        <div style={{ maxWidth: "768px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: theme.spacing(2),
              padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
              backgroundColor: categoryBg,
              border: `1px solid ${categoryBorder}`,
              borderRadius: theme.borderRadius.full,
              fontSize: theme.fontSize.xs,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: categoryText,
              marginBottom: theme.spacing(6),
            }}
          >
            {post.category}
          </div>
          <h1
            style={{
              fontSize: titleFontSize,
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              color: isDark ? theme.colors.brand[100] : theme.colors.brand[900],
              marginBottom: theme.spacing(8),
              lineHeight: 1.25,
            }}
          >
            {post.title}
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: metaWrap,
              alignItems: "center",
              justifyContent: "center",
              gap: metaGap,
              fontSize: theme.fontSize.sm,
              color: metaColor,
              fontWeight: 500,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <div
                style={{
                  width: theme.spacing(8),
                  height: theme.spacing(8),
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: authorBg,
                  ...flexCenter,
                  color: authorIconColor,
                }}
              >
                <User size={16} />
              </div>
              <span>By {post.author}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <Calendar size={16} />
              <span>
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <Clock size={16} />
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: `0 ${mainPaddingX}`,
          marginBottom: featuredImageMarginBottom,
        }}
      >
      <div
  style={{
    aspectRatio: "21/9",
    borderRadius: theme.borderRadius["2xl"], // ✅ valid
    overflow: "hidden",
    boxShadow: theme.boxShadow["2xl"],
  }}
>
          <img
            src={post.coverImageUrl}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/1200x600?text=Article+Image";
            }}
          />
        </div>
      </div>

      {/* Article Content */}
      <article
        style={{
          maxWidth: "768px",
          margin: "0 auto",
          padding: `0 ${mainPaddingX}`,
          paddingBottom: articlePaddingBottom,
          textAlign: "left",
        }}
      >
        <div
          style={{
            color: bodyText,
            fontSize: bodyFontSize,
            lineHeight: 1.8,
            fontFamily: theme.fontFamily.sans,
          }}
        >
          <p
            style={{
              fontSize: excerptFontSize,
              fontFamily: theme.fontFamily.serif,
              color: excerptColor,
              lineHeight: 1.625,
              fontStyle: "italic",
              borderLeft: `4px solid ${excerptBorder}`,
              paddingLeft: theme.spacing(6),
              marginBottom: theme.spacing(12),
            }}
          >
            {post.excerpt}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(6),
            }}
          >
            {post.content.split("\n").map((para, i) => (
              <p key={i} style={{ margin: 0 }}>
                {para}
              </p>
            ))}
            {post.content.length < 500 && (
              <>
                <p>
                  Preserving family stories is more than just a hobby—it's an act of
                  love for future generations. When we document our history, we
                  provide a roadmap for those who follow, helping them understand
                  their roots and the values that shaped their family tree.
                </p>
                <h3
                  style={{
                    fontSize: theme.fontSize["2xl"],
                    fontFamily: theme.fontFamily.serif,
                    fontWeight: "bold",
                    color: headingColor,
                    marginTop: theme.spacing(12),
                    marginBottom: theme.spacing(4),
                  }}
                >
                  Start Small, Think Long Term
                </h3>
                <p>
                  You don't need to write a full autobiography in one sitting. Start
                  by choosing one photo that brings back a strong emotion. Describe
                  where you were, who was with you, and how you felt in that exact
                  moment. These small snippets are the building blocks of a rich,
                  multifaceted legacy.
                </p>
                <p>
                  Roots was designed to make this process as intuitive as possible.
                  By organizing your life into stages, you can tackle your history
                  one chapter at a time. Whether it's the adventurous days of your
                  youth or the quiet reflections of later years, every moment
                  deserves a place in your timeline.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Share & More Articles */}
        <div
          style={{
            marginTop: theme.spacing(16),
            paddingTop: theme.spacing(12),
            borderTop: `1px solid ${borderColor}`,
            display: "flex",
            flexDirection: isMdUp ? "row" : "column",
            alignItems: isMdUp ? "center" : "stretch",
            justifyContent: "space-between",
            gap: theme.spacing(6),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(3),
            }}
          >
            <span
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: metaColor,
              }}
            >
              Share Story:
            </span>
            <div style={{ display: "flex", gap: theme.spacing(2) }}>
              <button
                onClick={handleShare}
                style={{
                  width: theme.spacing(10),
                  height: theme.spacing(10),
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: shareIconBg,
                  ...flexCenter,
                  color: shareIconColor,
                  border: `1px solid ${shareBorder}`,
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? theme.colors.brand[800]
                    : theme.colors.brand[100];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = shareIconBg;
                }}
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
          <Link
            href="/blog"
            style={{
              padding: `${theme.spacing(3)} ${theme.spacing(8)}`,
              backgroundColor: buttonBg,
              color: theme.colors.white,
              borderRadius: theme.borderRadius.full,
              fontWeight: "bold",
              boxShadow: theme.boxShadow.lg,
              textDecoration: "none",
              transition: "all 0.2s",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = buttonHoverBg;
              e.currentTarget.style.transform = "scale(0.95)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttonBg;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            View More Articles
          </Link>
        </div>
      </article>

      {/* Share Feedback Toast */}
      {shareFeedback && (
        <div
          style={{
            position: "fixed",
            bottom: theme.spacing(8),
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.gray[800],
            color: theme.colors.white,
            padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
            borderRadius: theme.borderRadius.full,
            fontSize: theme.fontSize.sm,
            fontWeight: 500,
            boxShadow: theme.boxShadow.lg,
            zIndex: theme.zIndex[60],
            animation: "fadeInOut 3s ease forwards",
            whiteSpace: "nowrap",
          }}
        >
          {shareFeedback}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostDetail;