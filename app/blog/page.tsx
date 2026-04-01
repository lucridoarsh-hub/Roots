"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  ArrowRight,
  Menu,
  X,
  Info,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import axios from "axios";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../constants";

// ========== BLOG POST TYPE ==========
interface BlogPost {
  _id: string;
  title: string;
  description: string;
  category?: string;
  author?: string;
  date?: string;
  coverImageUrl?: string;
  images: Array<{ url: string; public_id: string }>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string | { username?: string; name?: string };
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

// ========== HELPER: Get author name ==========
const getAuthorName = (post: BlogPost): string | null => {
  if (post.author) return post.author;
  if (post.userId && typeof post.userId === "object") {
    if ("username" in post.userId && post.userId.username) return post.userId.username;
    if ("name" in post.userId && post.userId.name) return post.userId.name;
  }
  return null;
};

// ========== MAIN COMPONENT ==========
const BlogPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isDark = useDarkMode();
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  // Local settings
  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Updated API endpoint
        const response = await axios.get("/api/auth/admin/blog", {
          withCredentials: true,
        });
        if (response.data.success) {
          setPosts(response.data.blogs);
        } else {
          setError("Failed to load blogs");
        }
      } catch (err) {
        setError("Error fetching blogs");
        console.error("Blog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Load local settings
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

  // Conditional colors based on dark mode
  const bgColor = isDark ? theme.colors.brand[950] : theme.colors.white;
  const navBg = isDark
    ? theme.colors.brand[900] + "E6"
    : "rgba(255,255,255,0.9)";
  const navBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const textSecondary = isDark ? theme.colors.brand[400] : theme.colors.gray[600];
  const headerBg = isDark ? theme.colors.brand[900] + "4D" : theme.colors.brand[50];
  const cardBg = isDark ? theme.colors.brand[900] : theme.colors.white;
  const cardBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const categoryBg = isDark ? theme.colors.brand[800] + "E6" : "rgba(255,255,255,0.9)";
  const categoryText = isDark ? theme.colors.brand[200] : theme.colors.brand[800];
  const metaText = isDark ? theme.colors.brand[400] : theme.colors.gray[500];
  const titleColor = isDark ? theme.colors.white : theme.colors.gray[900];
  const excerptColor = isDark ? theme.colors.brand[400] : theme.colors.gray[600];
  const borderColor = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[50];
  const linkColor = isDark ? theme.colors.brand[400] : theme.colors.brand[600];
  const emptyBg = isDark ? theme.colors.brand[900] : theme.colors.gray[50];
  const emptyBorder = isDark ? "rgba(255,255,255,0.1)" : theme.colors.gray[300];

  // Responsive padding for header and main container
  const headerPaddingTop = isMdUp ? theme.spacing(32) : theme.spacing(24);
  const headerPaddingBottom = isMdUp ? theme.spacing(12) : theme.spacing(8);
  const mainPaddingTop = isMdUp ? theme.spacing(16) : theme.spacing(12);
  const mainPaddingX = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const mainPaddingBottom = isMdUp ? theme.spacing(16) : theme.spacing(12);

  // Responsive font sizes
  const headerTitleSize = isMdUp ? theme.fontSize["5xl"] : theme.fontSize["4xl"];
  const headerSubtitleSize = isMdUp ? theme.fontSize.xl : theme.fontSize.lg;

  // Grid columns based on breakpoint
  const getGridColumns = () => {
    if (isLgUp) return "repeat(3, 1fr)";
    if (isMdUp) return "repeat(2, 1fr)";
    return "1fr";
  };
  const gridGap = isMdUp ? theme.spacing(8) : theme.spacing(6);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: textSecondary }}>Loading stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: theme.spacing(4),
        }}
      >
        <p style={{ color: textSecondary }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
            backgroundColor: theme.colors.brand[600],
            color: theme.colors.white,
            border: "none",
            borderRadius: theme.borderRadius.lg,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        transition: "background-color 0.2s ease",
        fontFamily: theme.fontFamily.sans,
      }}
    >
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>

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
  <img
    src="/logo.png"
    style={{
      width: theme.spacing(10),
      height: theme.spacing(10),
      borderRadius: theme.borderRadius.lg,
      objectFit: "cover",
    }}
    alt="Logo"
  />
  <span
    style={{
      fontSize: isMdUp ? theme.fontSize["2xl"] : theme.fontSize.xl,
      fontFamily: theme.fontFamily.serif,
      fontWeight: "bold",
      color: theme.colors.brand[900],
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

      {/* Header */}
      <div
        style={{
          paddingTop: headerPaddingTop,
          paddingBottom: headerPaddingBottom,
          backgroundColor: headerBg,
          marginTop: dynamicSettings.announcement ? theme.spacing(8) : 0,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${theme.spacing(4)}`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
              backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.brand[200],
              color: categoryText,
              borderRadius: theme.borderRadius.full,
              fontSize: theme.fontSize.xs,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: theme.spacing(4),
            }}
          >
            The Journal
          </span>
          <h1
            style={{
              fontSize: headerTitleSize,
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              color: isDark ? theme.colors.brand[100] : theme.colors.brand[900],
              marginBottom: theme.spacing(4),
            }}
          >
            Stories & Insights
          </h1>
          <p
            style={{
              fontSize: headerSubtitleSize,
              color: textSecondary,
              maxWidth: "42rem",
              margin: "0 auto",
            }}
          >
            Tips on preservation, family history features, and stories from our
            community.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: `${mainPaddingTop} ${mainPaddingX} ${mainPaddingBottom}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: getGridColumns(),
            gap: gridGap,
          }}
        >
          {posts.map((post) => {
            const authorName = getAuthorName(post);
            return (
              <article
                key={post._id}
                onClick={() => router.push(`/blog/${post._id}`)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: cardBg,
                  borderRadius: theme.borderRadius["2xl"],
                  overflow: "hidden",
                  border: `1px solid ${cardBorder}`,
                  boxShadow: theme.boxShadow.sm,
                  transition: "all 0.3s",
                  cursor: "pointer",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = theme.boxShadow.xl;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = theme.boxShadow.sm;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    height: "12rem",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={
                      post.images?.[0]?.url ||
                      "https://placehold.co/600x400/1e3a8a/white?text=No+Image"
                    }
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s",
                    }}
                    loading="lazy"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/600x400/1e3a8a/white?text=Image+Unavailable")
                    }
                  />
                  {post.tags && post.tags.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: theme.spacing(4),
                        left: theme.spacing(4),
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: categoryBg,
                          backdropFilter: "blur(4px)",
                          padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fontSize.xs,
                          fontWeight: "bold",
                          color: categoryText,
                          textTransform: "uppercase",
                          letterSpacing: "0.025em",
                          boxShadow: theme.boxShadow.sm,
                        }}
                      >
                        {post.tags[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    padding: theme.spacing(6),
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing(3),
                      fontSize: theme.fontSize.xs,
                      color: metaText,
                      marginBottom: theme.spacing(3),
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(1),
                      }}
                    >
                      <Calendar size={12} />{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {authorName && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: theme.spacing(1),
                        }}
                      >
                        <User size={12} /> {authorName}
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontSize: theme.fontSize.xl,
                      fontWeight: "bold",
                      color: titleColor,
                      marginBottom: theme.spacing(3),
                      fontFamily: theme.fontFamily.serif,
                      lineHeight: 1.25,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = isDark
                        ? theme.colors.brand[400]
                        : theme.colors.brand[700];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = titleColor;
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    style={{
                      color: excerptColor,
                      fontSize: theme.fontSize.sm,
                      lineHeight: 1.625,
                      marginBottom: theme.spacing(4),
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.description}
                  </p>
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: theme.spacing(4),
                      borderTop: `1px solid ${borderColor}`,
                      ...flexBetween,
                    }}
                  >
                    <button
                      style={{
                        color: linkColor,
                        fontWeight: "bold",
                        fontSize: theme.fontSize.sm,
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(1),
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        transition: "gap 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.gap = theme.spacing(2);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.gap = theme.spacing(1);
                      }}
                    >
                      Read Full Article <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: theme.spacing(20),
              backgroundColor: emptyBg,
              borderRadius: theme.borderRadius["2xl"],
              border: `1px dashed ${emptyBorder}`,
            }}
          >
            <p
              style={{
                color: isDark ? theme.colors.brand[400] : theme.colors.gray[500],
                fontWeight: 500,
              }}
            >
              No stories have been published yet.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;