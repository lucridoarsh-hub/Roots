"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Info, AlertCircle, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../constants";
import Footer from "../Footer";

// ========== THEME (same as blog page) ==========
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

// ========== HELPER HOOKS ==========
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

// ========== MAIN COMPONENT ==========
export default function About() {
  const { isAuthenticated } = useAuth();
  const router = useRouter(); // kept in case needed, but not used in this component
  const isDark = useDarkMode();
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  // Local settings (announcement, logo, maintenance)
  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Conditional colors
  const bgColor = isDark ? theme.colors.brand[950] : theme.colors.white;
  const navBg = isDark
    ? theme.colors.brand[900] + "E6"
    : "rgba(255,255,255,0.9)";
  const navBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const textSecondary = isDark ? theme.colors.brand[400] : theme.colors.gray[600];
  const linkHoverColor = isDark ? theme.colors.brand[200] : theme.colors.brand[700];

  // Responsive values
  const sectionPaddingX = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const sectionPaddingY = isMdUp ? theme.spacing(16) : theme.spacing(12);
  const heroPadding = isMdUp ? "8rem 4rem 6rem" : "5rem 2rem 4rem";
  const heroTitleSize = isLgUp ? 72 : isMdUp ? 56 : 42;
  const heroDescSize = isMdUp ? 18 : 16;
  const sectionTitleSize = isMdUp ? 44 : 32;
  const sectionSubtitleSize = isMdUp ? 40 : 30;
  const statBarGrid = isMdUp ? "repeat(3, 1fr)" : "1fr";
  const twoColGrid = isMdUp ? "1fr 1fr" : "1fr";
  const threeColGrid = isLgUp ? "repeat(3, 1fr)" : isMdUp ? "repeat(2, 1fr)" : "1fr";
  const problemGrid = isMdUp ? "repeat(2, 1fr)" : "1fr";
  const promiseGrid = isMdUp ? "1fr 1fr" : "1fr";
  const valueGrid = threeColGrid;
  const diffGrid = threeColGrid;
  const ctaTitleSize = isMdUp ? 52 : 36;
  const ctaDescSize = isMdUp ? 18 : 16;
  const statBarMargin = isMdUp ? "3.5rem 4rem 0" : "2rem 2rem 0";
  const statBarBorderRadius = 16;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        transition: "background-color 0.2s ease",
        fontFamily: theme.fontFamily.sans,
      }}
    >
      {/* Global styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Announcement bar (if present) */}
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

      {/* Navigation bar */}
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

          {/* Desktop navigation links */}
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
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                Home
              </Link>
              <Link
                href="/about"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: theme.colors.brand[700],
                  textDecoration: "none",
                }}
              >
                About
              </Link>
              <Link
                href="/blog"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
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
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
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
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
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
            {/* Mobile menu button */}
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
              About
            </Link>
            <Link
              href="/blog"
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

      {/* Main content - completely replaced with new content */}
      <main style={{ position: "relative", zIndex: 1 }}>
        {/* Hero section (updated) */}
        <section
          style={{
            background: "linear-gradient(165deg, #eaf0fb 0%, #dde8f7 50%, #ccdaf2 100%)",
            padding: heroPadding,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(74,111,212,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(30,45,107,0.06) 0%, transparent 50%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(74,111,212,0.2)",
                color: "#3a4a8a",
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.1em",
                padding: "7px 18px",
                borderRadius: 24,
                marginBottom: "2rem",
                textTransform: "uppercase",
                animation: "fadeUp 0.6s ease both",
              }}
            >
              <svg viewBox="0 0 12 12" fill="none" width={12} height={12}>
                <path
                  d="M6 1.5C4.5 1.5 3 2.8 3 4.5C3 7 6 10.5 6 10.5C6 10.5 9 7 9 4.5C9 2.8 7.5 1.5 6 1.5Z"
                  fill="#4a6fd4"
                />
              </svg>
              Our Story
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: heroTitleSize,
                fontWeight: 800,
                lineHeight: 1.05,
                color: "#1e2d6b",
                letterSpacing: "-0.02em",
                animation: "fadeUp 0.6s 0.1s ease both",
                margin: 0,
              }}
            >
              Preserving Memories,
              <em
                style={{
                  fontStyle: "italic",
                  color: "#4a6fd4",
                  display: "block",
                }}
              >
                Connecting Generations
              </em>
            </h1>
            <p
              style={{
                fontSize: heroDescSize,
                color: "#5a6a7e",
                lineHeight: 1.8,
                maxWidth: 520,
                margin: "1.75rem auto 0",
                fontWeight: 300,
                animation: "fadeUp 0.6s 0.2s ease both",
              }}
            >
              A digital sanctuary where every family's story is preserved, shared,
              and celebrated for generations to come.
            </p>
          </div>
        </section>

        {/* StatBar (updated) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: statBarGrid,
            border: "1px solid #e0e8f5",
            borderRadius: statBarBorderRadius,
            overflow: "hidden",
            margin: statBarMargin,
            background: "#fff",
            boxShadow: "0 2px 20px rgba(30,45,107,0.06)",
          }}
        >
          {[
            {
              num: "Private",
              label: "Invitation‑only family space — never public",
            },
            {
              num: "🔒 Bank‑level",
              label: "Security protecting your family’s history",
            },
            { num: "Any Device", label: "Accessible from anywhere, anytime" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                padding: isMdUp ? "2rem 1.5rem" : "1.5rem 1rem",
                textAlign: "center",
                borderRight:
                  i < 2 && statBarGrid !== "1fr" ? "1px solid #e0e8f5" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isMdUp ? 32 : 28,
                  fontWeight: 800,
                  color: "#1e2d6b",
                  marginBottom: "0.3rem",
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: isMdUp ? 13 : 12, color: "#5a6a7e" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Who We Are (updated) */}
        <section style={{ padding: `${sectionPaddingY} ${sectionPaddingX}` }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: twoColGrid,
                gap: isMdUp ? "5rem" : "2.5rem",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: theme.fontSize.xs,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "#4a6fd4",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  Who We Are
                </div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: sectionTitleSize,
                    fontWeight: 800,
                    color: "#1e2d6b",
                    lineHeight: 1.15,
                    marginBottom: "1.5rem",
                  }}
                >
                  A digital sanctuary for your life's journey
                </h2>
                {[
                  "Enduring Roots is a digital platform designed to help families preserve and share their life stories across generations. We exist because we believe that every family holds a universe of stories — wisdom passed down over dinner tables, photographs tucked in dusty albums, conversations half‑remembered, and traditions carried quietly through time.",
                  "We built Enduring Roots because too many of these stories disappear. An elder passes away. A childhood home is sold. A generation grows up without knowing where they came from. The memories exist somewhere — in photographs, in the minds of family members, in the texture of old letters — but they are scattered, fragile, and at risk of being lost forever.",
                  "Enduring Roots changes that. We give every family a beautiful, private, secure digital space to gather those memories, organise them, enrich them, and pass them on — not just as files in a folder, but as a living, breathing family narrative.",
                ].map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: isMdUp ? 16 : 14,
                      color: "#5a6a7e",
                      lineHeight: 1.85,
                      marginBottom: "1rem",
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div
                style={{
                  background: "#141d4a",
                  borderRadius: 24,
                  padding: isMdUp ? "2.5rem" : "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "rgba(74,111,212,0.15)",
                    right: -50,
                    bottom: -50,
                  }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      gridColumn: "span 2",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #2a3d8f, #1e2d6b)",
                      minHeight: 90,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMdUp ? 12 : 10,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    Family Heritage Archive
                  </div>
                  <div
                    style={{
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #3a5299, #2a3d8f)",
                      minHeight: 90,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMdUp ? 12 : 10,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    1962 — Grandparents
                  </div>
                  <div
                    style={{
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #1a2555, #141d4a)",
                      minHeight: 130,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMdUp ? 12 : 10,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    Childhood Memories
                  </div>
                </div>
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "1.5rem",
                    fontSize: isMdUp ? 12 : 10,
                    color: "rgba(255,255,255,0.4)",
                    fontStyle: "italic",
                  }}
                >
                  Your memories, beautifully organised and forever preserved
                </p>
              </div>
            </div>

            {/* Quote */}
            <div
              style={{
                borderLeft: "4px solid #4a6fd4",
                padding: isMdUp ? "1.5rem 2rem" : "1rem 1.5rem",
                background: "#eef2ff",
                borderRadius: "0 12px 12px 0",
                margin: "2rem 0",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isMdUp ? 22 : 18,
                  fontStyle: "italic",
                  color: "#1e2d6b",
                  lineHeight: 1.5,
                  marginBottom: "0.75rem",
                }}
              >
                "Every family has a story worth telling. Enduring Roots makes sure
                it is never forgotten."
              </p>
              <cite
                style={{
                  fontSize: isMdUp ? 13 : 12,
                  color: "#4a6fd4",
                  fontWeight: 600,
                  fontStyle: "normal",
                }}
              >
                — The Enduring Roots Team
              </cite>
            </div>

            {/* CTA Box */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e2d6b 0%, #2a3d8f 100%)",
                borderRadius: 20,
                padding: isMdUp ? "3rem" : "2rem",
                textAlign: "center",
                margin: "3rem 0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)",
                  right: -80,
                  top: -80,
                }}
              />
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isMdUp ? 28 : 22,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.75rem",
                  position: "relative",
                }}
              >
                Start Preserving Your Family's Story Today
              </h3>
              <p
                style={{
                  fontSize: isMdUp ? 15 : 14,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "2rem",
                  position: "relative",
                }}
              >
                Create your free account in minutes. No credit card required.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/dashboard"
                  style={{
                    background: "#f5a623",
                    color: "#1a0a00",
                    padding: "13px 32px",
                    borderRadius: 10,
                    border: "none",
                    fontSize: isMdUp ? 15 : 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Get Started Free →
                </Link>
                <Link
                  href="/"
                  style={{
                    background: "transparent",
                    color: "#fff",
                    padding: "11px 28px",
                    borderRadius: 10,
                    border: "1.5px solid rgba(255,255,255,0.4)",
                    fontSize: isMdUp ? 14 : 13,
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem We Solve (updated) */}
        <section
          style={{
            background: "#f7f9ff",
            padding: `${sectionPaddingY} ${sectionPaddingX}`,
          }}
        >
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#4a6fd4",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              The Problem We Solve
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: "#1e2d6b",
                marginBottom: "1.5rem",
              }}
            >
              Precious memories are disappearing every day
            </h2>
            <p
              style={{
                fontSize: isMdUp ? 16 : 14,
                color: "#5a6a7e",
                lineHeight: 1.85,
                marginBottom: "1rem",
                maxWidth: 680,
              }}
            >
              The inspiration behind Enduring Roots came from a moment many of us
              have experienced — finding an old photograph and realising you do
              not know the names of the people in it. Or sitting with an elderly
              grandparent and thinking: I should be recording this.
            </p>
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: problemGrid,
                  gap: 16,
                  marginTop: "2rem",
                }}
              >
                {[
                  "Old photographs sitting in physical albums or cardboard boxes, deteriorating over time",
                  "Personal stories and family histories stored only in the minds of elders — and nowhere else",
                  "Home videos on obsolete media formats — VHS tapes, CDs, old hard drives — slowly becoming unreadable",
                  "Conversations, traditions, and wisdom passed down informally and incompletely across generations",
                  "Family histories fragmented across relatives who have never shared what they know with each other",
                  "Digital photos scattered across multiple devices and messaging apps with no context or story attached",
                ].map((p, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: isMdUp ? "1.25rem 1.5rem" : "1rem 1rem",
                      border: "1px solid #e0e8f5",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#4a6fd4",
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                    />
                    <p
                      style={{
                        fontSize: isMdUp ? 14 : 13,
                        color: "#5a6a7e",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What Enduring Roots Does (new) */}
        <section style={{ padding: `${sectionPaddingY} ${sectionPaddingX}` }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#4a6fd4",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              What Enduring Roots Does
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: "#1e2d6b",
                marginBottom: "1rem",
              }}
            >
              More than storage — a complete family heritage platform
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: twoColGrid,
                gap: "2rem",
                marginTop: "3rem",
              }}
            >
              {[
                {
                  title: "Document Life’s Different Phases",
                  desc: "Life is not a single story — it is a collection of chapters. Document childhood, education, career, family moments, travels, and transitions. Each phase becomes a rich chapter for future generations.",
                },
                {
                  title: "Private Family Collaboration",
                  desc: "Create an invitation‑only space where family members can contribute their own memories and perspectives. A grandchild in Bangalore can collaborate with grandparents in a village, building a shared legacy.",
                },
                {
                  title: "Preserve and Revisit Memories",
                  desc: "Transform scattered media into richly annotated memories. Every photograph can carry names, every video its story, every document its context — creating a navigable, beautiful family archive.",
                },
                {
                  title: "Turn Moments into Lasting Narratives",
                  desc: "Everyday moments — a Sunday lunch, a child’s first day, a grandparent’s birthday — become living narratives. Over time, these weave together the full, multi‑generational story of your family.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: isMdUp ? "2rem" : "1.5rem",
                    border: "1px solid #e0e8f5",
                    transition: "all 0.2s",
                  }}
                >
                  <h3
                    style={{
                      fontSize: isMdUp ? 18 : 16,
                      fontWeight: 600,
                      color: "#1e2d6b",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: isMdUp ? 14 : 13,
                      color: "#5a6a7e",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <a
                href="https://enduringroots.in/signup"
                style={{
                  background: "#1e2d6b",
                  color: "#fff",
                  padding: "13px 32px",
                  borderRadius: 10,
                  fontSize: isMdUp ? 15 : 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Upload Your First Memory →
              </a>
            </div>
          </div>
        </section>

        {/* Our Mission (updated) */}
        <section style={{ padding: `${sectionPaddingY} ${sectionPaddingX}` }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: twoColGrid,
                gap: isMdUp ? "5rem" : "2.5rem",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: theme.fontSize.xs,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "#4a6fd4",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  Our Mission
                </div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: sectionSubtitleSize,
                    fontWeight: 800,
                    color: "#1e2d6b",
                    lineHeight: 1.2,
                    marginBottom: "1.5rem",
                  }}
                >
                  To give every story a voice and a future.
                </h2>
                {[
                  "We believe that the stories of our elders, the laughter of our children, and the traditions that define us deserve to live forever. Our mission is to make it effortless for every family — regardless of technical ability or location — to document, organise, and pass on their unique history to the generations that follow.",
                  "We are building a world where no family story is lost. Where a grandchild born twenty years from now can sit with a digital window into the life of a great-grandparent they never met. Where the wisdom, humour, struggles, and triumphs of ordinary families are honoured and preserved with the same care we give to history books and museums.",
                  "Because your family’s story is just as important as any story ever told.",
                ].map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: isMdUp ? 16 : 14,
                      color: "#5a6a7e",
                      lineHeight: 1.85,
                      marginBottom: "1rem",
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: isMdUp ? "3rem" : "2rem",
                  border: "1px solid #e0e8f5",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background: "#eef2ff",
                    right: -50,
                    bottom: -50,
                    zIndex: 0,
                  }}
                />
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: "#f5a623",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    marginBottom: "1.5rem",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  💛
                </div>
                <blockquote
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: isMdUp ? 22 : 18,
                    fontWeight: 700,
                    color: "#1e2d6b",
                    lineHeight: 1.4,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  "Every memory tells a beautiful story. We are here to make sure it
                  is never forgotten."
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values (updated) */}
        <section
          style={{
            background: "#f7f9ff",
            padding: `${sectionPaddingY} ${sectionPaddingX}`,
          }}
        >
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#4a6fd4",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Our Values
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: "#1e2d6b",
                marginBottom: "1rem",
              }}
            >
              Built on principles families can trust
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: valueGrid,
                gap: 20,
                marginTop: "3rem",
              }}
            >
              {[
                {
                  icon: "🔒",
                  title: "Privacy First",
                  desc: "Your family's memories are fully private — invitation‑only, never public, never indexed. What you share on Enduring Roots stays entirely within your chosen family circle.",
                },
                {
                  icon: "🛡️",
                  title: "Security You Can Trust",
                  desc: "We protect your family's history with bank‑level security. All content is encrypted in transit and at rest, using the same standards as financial and medical platforms.",
                },
                {
                  icon: "📱",
                  title: "Accessibility for Every Family",
                  desc: "Designed to be used by everyone — from tech‑savvy young adults to grandparents who rarely use smartphones. Across all devices, anywhere in the world.",
                },
                {
                  icon: "👨‍👩‍👧‍👦",
                  title: "Collaborative at Heart",
                  desc: "The richest family stories emerge when many voices contribute. Enduring Roots is built from the ground up for family collaboration across distances and generations.",
                },
                {
                  icon: "⏳",
                  title: "Purpose Over Profit",
                  desc: "Every decision we make is guided by what serves families best. We will never sell your data or show you advertising. Your trust is not for sale.",
                },
                {
                  icon: "💛",
                  title: "Built for the Long Term",
                  desc: "We are building Enduring Roots to last for decades — not just for you, but for the children and grandchildren who will inherit this legacy.",
                },
              ].map((v, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: isMdUp ? "2rem" : "1.5rem",
                    border: "1px solid #e0e8f5",
                    transition:
                      "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "#eef2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {v.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: isMdUp ? 16 : 15,
                      fontWeight: 600,
                      color: "#1e2d6b",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontSize: isMdUp ? 14 : 13,
                      color: "#5a6a7e",
                      lineHeight: 1.75,
                    }}
                  >
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Matters (new) */}
        <section style={{ padding: `${sectionPaddingY} ${sectionPaddingX}` }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#4a6fd4",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
                textAlign: "center",
              }}
            >
              Why This Matters
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: "#1e2d6b",
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              More than nostalgia — a gift for future generations
            </h2>
            <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
              <p
                style={{
                  fontSize: isMdUp ? 17 : 15,
                  color: "#5a6a7e",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                }}
              >
                We live in an age of extraordinary digital abundance. More
                photographs are taken every year than in all of human history
                combined. Yet paradoxically, we are losing more family stories
                than ever. Photos are buried in camera rolls. Stories go
                unrecorded. Elders pass away with their memories intact but
                unshared.
              </p>
              <p
                style={{
                  fontSize: isMdUp ? 17 : 15,
                  color: "#5a6a7e",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                }}
              >
                Research consistently shows that children who know their family
                history — who understand where they came from, what their ancestors
                overcame, what their family stands for — demonstrate greater
                resilience, stronger identity, and a deeper sense of belonging.
                Preserving family stories is not just an act of memory. It is an
                investment in the emotional wellbeing of future generations.
              </p>
              <div
                style={{
                  background: "#eef2ff",
                  borderRadius: 16,
                  padding: isMdUp ? "2rem" : "1.5rem",
                  margin: "2rem 0",
                }}
              >
                <p
                  style={{
                    fontSize: isMdUp ? 18 : 16,
                    fontWeight: 500,
                    color: "#1e2d6b",
                    fontStyle: "italic",
                  }}
                >
                  "Children who know their family history show greater resilience
                  and a deeper sense of who they are."
                </p>
                <p
                  style={{
                    fontSize: isMdUp ? 12 : 11,
                    color: "#4a6fd4",
                    marginTop: "0.5rem",
                  }}
                >
                  — Research on family narratives and child development
                </p>
              </div>
              <a
                href="https://enduringroots.in/signup"
                style={{
                  background: "#1e2d6b",
                  color: "#fff",
                  padding: "13px 32px",
                  borderRadius: 10,
                  fontSize: isMdUp ? 15 : 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Give Your Family the Gift of Their Own Story →
              </a>
            </div>
          </div>
        </section>

        {/* What Makes Enduring Roots Different (new) */}
        <section
          style={{
            background: "#f7f9ff",
            padding: `${sectionPaddingY} ${sectionPaddingX}`,
          }}
        >
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#4a6fd4",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              What Makes Us Different
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: "#1e2d6b",
                marginBottom: "2rem",
              }}
            >
              A narrative platform, not just a storage platform
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: diffGrid,
                gap: 20,
              }}
            >
              {[
                {
                  title: "It is a narrative platform",
                  desc: "Generic cloud storage keeps files. Enduring Roots keeps stories. Every memory can be enriched with the human context that transforms a digital file into a living piece of family history.",
                },
                {
                  title: "It is built for families, not individuals",
                  desc: "Social media platforms are built for public sharing. Enduring Roots is built exclusively for private family collaboration — a closed, trusted space where families share what they would never share publicly.",
                },
                {
                  title: "It is built for the long term",
                  desc: "Social media platforms come and go. Cloud storage accounts are deleted. Enduring Roots is built with the explicit goal of preserving your family’s story for decades — for you and for the children who will inherit this legacy.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: isMdUp ? "2rem" : "1.5rem",
                    border: "1px solid #e0e8f5",
                  }}
                >
                  <h3
                    style={{
                      fontSize: isMdUp ? 18 : 16,
                      fontWeight: 600,
                      color: "#1e2d6b",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: isMdUp ? 14 : 13,
                      color: "#5a6a7e",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Promise to You (updated) */}
        <section style={{ padding: `${sectionPaddingY} ${sectionPaddingX}` }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: promiseGrid,
                gap: isMdUp ? "5rem" : "2.5rem",
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: theme.fontSize.xs,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "#4a6fd4",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  Our Promise
                </div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: sectionTitleSize,
                    fontWeight: 800,
                    color: "#1e2d6b",
                    marginBottom: "1.5rem",
                    lineHeight: 1.15,
                  }}
                >
                  Your memories are irreplaceable. We treat them that way.
                </h2>
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {[
                    "Your content belongs to you — always, completely, and without exception",
                    "Your family’s memories will never be seen by anyone outside your chosen family circle",
                    "We will never sell your data, show you targeted advertisements, or use your content for any commercial purpose",
                    "We will protect your family’s history with the highest available security standards",
                    "We will build Enduring Roots to be here for generations — for you, your children, and their children",
                    "We will continue to improve the platform based on what families actually need",
                  ].map((p, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        fontSize: isMdUp ? 15 : 14,
                        color: "#5a6a7e",
                        lineHeight: 1.6,
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "#eef2ff",
                          border: "1.5px solid #c8d4f5",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#4a6fd4",
                          fontSize: 11,
                          fontWeight: 700,
                          marginTop: 1,
                        }}
                      >
                        ✓
                      </div>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: isMdUp ? "2.5rem" : "2rem",
                  border: "1px solid #e0e8f5",
                  position: isMdUp ? "sticky" : "relative",
                  top: isMdUp ? 100 : "auto",
                }}
              >
                <h4
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: isMdUp ? 22 : 18,
                    fontWeight: 700,
                    color: "#1e2d6b",
                    marginBottom: "1.5rem",
                  }}
                >
                  Why families choose Enduring Roots
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: "2rem",
                  }}
                >
                  {[
                    "100% content ownership",
                    "No ads, ever",
                    "Your data stays yours",
                    "Bank-level encryption",
                    "Private & invitation-only",
                    "Multi-generation access",
                    "Export memory books",
                    "Accessible on any device",
                  ].map((pill, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#eef2ff",
                        color: "#3a4a9a",
                        fontSize: isMdUp ? 12 : 11,
                        fontWeight: 500,
                        padding: "6px 14px",
                        borderRadius: 20,
                        border: "1px solid #c8d4f5",
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    borderLeft: "4px solid #4a6fd4",
                    padding: isMdUp ? "1.5rem 2rem" : "1rem 1.5rem",
                    background: "#eef2ff",
                    borderRadius: "0 12px 12px 0",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: isMdUp ? 22 : 18,
                      fontStyle: "italic",
                      color: "#1e2d6b",
                      lineHeight: 1.5,
                      marginBottom: "0.75rem",
                    }}
                  >
                    "Your family's story is the most important story you will ever
                    be part of. We are honoured to help you tell it."
                  </p>
                  <cite
                    style={{
                      fontSize: isMdUp ? 13 : 12,
                      color: "#4a6fd4",
                      fontWeight: 600,
                      fontStyle: "normal",
                    }}
                  >
                    — Enduring Roots
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA (updated) */}
        <section
          style={{
            background:
              "linear-gradient(135deg, #141d4a 0%, #1e2d6b 50%, #2a3d8f 100%)",
            padding: isMdUp ? "8rem 4rem" : "4rem 2rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(74,111,212,0.2) 0%, transparent 60%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: ctaTitleSize,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Your family's story
                <br />
                <em style={{ fontStyle: "italic", color: "#93b5ff" }}>
                  deserves a permanent home
                </em>
              </h2>
              <p
                style={{
                  fontSize: ctaDescSize,
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: "3rem",
                  lineHeight: 1.7,
                }}
              >
                Join families across India who are already preserving their
                heritage, connecting their generations, and building a legacy that
                will endure long after they are gone.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="https://enduringroots.in/signup"
                  style={{
                    background: "#f5a623",
                    color: "#1a0a00",
                    padding: "13px 32px",
                    borderRadius: 10,
                    fontSize: isMdUp ? 15 : 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Create Your Family Archive — Free →
                </a>
                <a
                  href="https://enduringroots.in/contact"
                  style={{
                    background: "transparent",
                    color: "#fff",
                    padding: "11px 28px",
                    borderRadius: 10,
                    border: "1.5px solid rgba(255,255,255,0.4)",
                    fontSize: isMdUp ? 14 : 13,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Talk to Our Team
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Get in Touch (updated) */}
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #e0e8f5",
            padding: isMdUp ? "2.5rem 4rem" : "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: isMdUp ? 15 : 13, color: "#5a6a7e" }}>
            Have a question? We'd love to hear from you —{" "}
            <a
              href="mailto:support@enduringroots.in"
              style={{ color: "#4a6fd4", fontWeight: 500, textDecoration: "none" }}
            >
              support@enduringroots.in
            </a>
          </p>
          <a
            href="https://enduringroots.in/contact"
            style={{
              background: "#1e2d6b",
              color: "#fff",
              padding: "9px 22px",
              borderRadius: 8,
              fontSize: isMdUp ? 14 : 13,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Get in Touch
          </a>
        </div>
        <Footer />
      </main>
    </div>
  );
}