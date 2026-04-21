"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Info, AlertCircle, LayoutDashboard, ChevronRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { APP_NAME } from "../../../constants";
import Footer from "../../components/Footer";

// ========== THEME (from theme.ts) ==========
const theme = {
  colors: {
    brand: {
      50: "#f0f7f2",
      100: "#d9ede0",
      200: "#b3dcbf",
      300: "#7ec094",
      400: "#55a36d",
      500: "#55825E", // exact site green
      600: "#3e6b47",
      700: "#2f5237",
      800: "#1f3824",
      900: "#132217",
      950: "#0a1410",
    },
    stone: {
      50: "#fafaf9",
      100: "#f5f5f0",
      200: "#e8e8e0",
      300: "#d4d4c8",
      400: "#a8a898",
      500: "#7a7a6a",
      600: "#5c5c4e",
      700: "#3d3d31",
      800: "#282820",
      900: "#1a1a14",
      950: "#0d0d09",
    },
    amber: {
      300: "#fcd34d",
      400: "#f59e0b",
      500: "#d97706",
    },
    rose: { 400: "#fb7185", 500: "#f43f5e" },
    emerald: { 300: "#6ee7b7", 400: "#34d399" },
    white: "#ffffff",
    black: "#000000",
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
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    green: "0 10px 30px -8px rgba(85,130,94,0.35)",
    greenLg: "0 20px 40px -10px rgba(85,130,94,0.4)",
  },
  fontFamily: {
    sans: '"Lato", ui-sans-serif, system-ui, sans-serif',
    serif: '"Playfair Display", ui-serif, Georgia, serif',
    display: '"Cormorant Garamond", Georgia, serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  transition: {
    fast: "all 0.15s ease",
    DEFAULT: "all 0.2s ease",
    slow: "all 0.4s ease",
  },
  dark: {
    bg: "#0d1a10",
    bgCard: "#132217",
    bgInput: "#1f3824cc",
    border: "#2f5237",
    borderSubtle: "#1f3824",
    text: "#f0f7f2",
    textMuted: "#7ec094",
  },
  light: {
    bg: "#fafaf9",
    bgCard: "#ffffff",
    bgInput: "#f0f7f2",
    border: "#d9ede0",
    text: "#132217",
    textMuted: "#3e6b47",
  },
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

// ========== MAIN COMPONENT ==========
export default function About() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isDark = useDarkMode();
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

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

  // Dynamic color variables based on theme and dark mode
  const bgColor = isDark ? theme.dark.bg : theme.light.bg;
  const cardBg = isDark ? theme.dark.bgCard : theme.light.bgCard;
  const borderColor = isDark ? theme.dark.border : theme.light.border;
  const textPrimary = isDark ? theme.dark.text : theme.light.text;
  const textSecondary = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const brandColor = theme.colors.brand[500];
  const brandLight = theme.colors.brand[100];
  const brandBgLight = isDark ? theme.colors.brand[800] : theme.colors.brand[50];
  const linkHoverColor = isDark ? theme.colors.brand[300] : theme.colors.brand[700];

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
        color: textPrimary,
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .nav-link {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
          letter-spacing: 0.01em;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 2px;
          background: ${brandColor};
          transition: width 0.25s ease;
          border-radius: 2px;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link.active::after {
          width: 100%;
          background: ${brandColor};
        }
        .mobile-menu-item {
          animation: slideInRight 0.2s ease forwards;
          opacity: 0;
        }
        .btn-hover-scale {
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .btn-hover-scale:hover {
          transform: scale(1.02);
        }
        @media (max-width: 767px) {
          .mobile-menu-item:nth-child(1) { animation-delay: 0.05s; }
          .mobile-menu-item:nth-child(2) { animation-delay: 0.1s; }
          .mobile-menu-item:nth-child(3) { animation-delay: 0.15s; }
          .mobile-menu-item:nth-child(4) { animation-delay: 0.2s; }
          .mobile-menu-item:nth-child(5) { animation-delay: 0.25s; }
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
            fontWeight: 500,
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing(2),
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
        >
          <Info size={14} style={{ animation: "pulse 1s infinite" }} />
          <span>{dynamicSettings.announcement}</span>
        </div>
      )}

      {/* Header */}
    <nav
    style={{
      position: "relative",
      width: "100%",
      zIndex: 50,
      backgroundColor: isDark
        ? "rgba(20, 35, 20, 0.95)"
        : "rgba(252, 251, 248, 0.97)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
      boxShadow: isDark
        ? "0 1px 24px rgba(0,0,0,0.4)"
        : "0 1px 20px rgba(44, 74, 46, 0.08)",
      transition: "all 0.3s ease",
      top: dynamicSettings.announcement ? theme.spacing(8) : 0,
    }}
  >
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: `0 ${theme.spacing(8)}`,
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <img
          src="/logo.png"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "contain",
            transition: "transform 0.2s ease",
          }}
          alt="Enduring Roots Logo"
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </Link>
  
      {/* Desktop nav links */}
      {isMdUp && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {["Home", "About", "Blog", "Pricing","Success Stories", "Contact"].map((label) => {
            const href =
              label === "Home"
                ? "/"
                : `/${label.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <Link
                key={label}
                href={href}
                style={{
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: isDark ? "rgba(200,220,200,0.85)" : "#4A6741",
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  transition: "all 0.18s ease",
                  letterSpacing: "0.01em",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? "#fff" : "#2C4A2E";
                  e.currentTarget.style.backgroundColor = isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(44,74,46,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark
                    ? "rgba(200,220,200,0.85)"
                    : "#4A6741";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
  
      {/* Auth buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing(2),
          flexShrink: 0,
        }}
      >
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            style={{
              padding: "9px 20px",
              backgroundColor: "#2C4A2E",
              color: "#fff",
              fontSize: "13.5px",
              fontWeight: 600,
              borderRadius: "10px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(44,74,46,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#3a5e3c";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(44,74,46,0.4)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2C4A2E";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(44,74,46,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </Link>
        ) : (
          <>
            {isMdUp && (
              <Link
                href="/login"
                style={{
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: isDark ? "rgba(200,220,200,0.85)" : "#4A6741",
                  textDecoration: "none",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  transition: "all 0.18s ease",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(74,103,65,0.2)"}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? "#fff" : "#2C4A2E";
                  e.currentTarget.style.backgroundColor = isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(44,74,46,0.06)";
                  e.currentTarget.style.borderColor = isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(44,74,46,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark
                    ? "rgba(200,220,200,0.85)"
                    : "#4A6741";
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(74,103,65,0.2)";
                }}
              >
                Sign In
              </Link>
            )}
            <Link
              href="/signup"
              style={{
                padding: "9px 20px",
                background: "linear-gradient(135deg, #2C4A2E 0%, #3d6640 100%)",
                color: "#fff",
                fontSize: "13.5px",
                fontWeight: 600,
                borderRadius: "10px",
                textDecoration: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(44,74,46,0.3)",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(44,74,46,0.45)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(44,74,46,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
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
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(44,74,46,0.07)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(44,74,46,0.15)"}`,
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              color: isDark ? "#a8c5a0" : "#2C4A2E",
              transition: "all 0.18s ease",
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>
    </div>
  
    {/* Mobile dropdown */}
    {!isMdUp && mobileMenuOpen && (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: isDark ? "rgba(20,35,20,0.98)" : "rgba(252,251,248,0.98)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          zIndex: 40,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        {["Home", "About", "Blog", "Success Stories", "Contact"].map((label) => {
          const href =
            label === "Home"
              ? "/"
              : `/${label.toLowerCase().replace(/\s+/g, "-")}`;
          return (
            <Link
              key={label}
              href={href}
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: isDark ? "rgba(200,220,200,0.85)" : "#4A6741",
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "8px",
                transition: "all 0.18s ease",
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(44,74,46,0.07)";
                e.currentTarget.style.color = isDark ? "#fff" : "#2C4A2E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = isDark
                  ? "rgba(200,220,200,0.85)"
                  : "#4A6741";
              }}
            >
              {label}
            </Link>
          );
        })}
  
        {/* Mobile Sign In row */}
        <div
          style={{
            marginTop: "8px",
            paddingTop: "12px",
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
            display: "flex",
            gap: "8px",
          }}
        >
          <Link
            href="/login"
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px",
              fontSize: "13.5px",
              fontWeight: 500,
              color: isDark ? "rgba(200,220,200,0.85)" : "#4A6741",
              textDecoration: "none",
              borderRadius: "8px",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(74,103,65,0.2)"}`,
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #2C4A2E 0%, #3d6640 100%)",
              boxShadow: "0 2px 8px rgba(44,74,46,0.3)",
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    )}
  </nav>
      <main style={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <section
          style={{
            background: isDark
              ? `linear-gradient(135deg, ${theme.colors.brand[900]} 0%, ${theme.colors.brand[800]} 100%)`
              : `linear-gradient(135deg, ${theme.colors.stone[50]} 0%, ${theme.colors.brand[50]} 50%, ${theme.colors.brand[100]} 100%)`,
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
              backgroundImage: isDark
                ? "radial-gradient(circle at 20% 50%, rgba(85,130,94,0.15) 0%, transparent 60%)"
                : "radial-gradient(circle at 20% 50%, rgba(85,130,94,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(62,107,71,0.06) 0%, transparent 50%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: isDark ? "rgba(85,130,94,0.2)" : "rgba(255,255,255,0.75)",
                border: `1px solid ${isDark ? theme.colors.brand[600] : "rgba(85,130,94,0.2)"}`,
                color: isDark ? theme.colors.brand[300] : theme.colors.brand[600],
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
                  fill={theme.colors.brand[500]}
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
                color: theme.colors.brand[500],
                letterSpacing: "-0.02em",
                animation: "fadeUp 0.6s 0.1s ease both",
                margin: 0,
              }}
            >
              Preserving Memories,
              <em
                style={{
                  fontStyle: "italic",
                  color: theme.colors.brand[400],
                  display: "block",
                }}
              >
                Connecting Generations
              </em>
            </h1>
            <p
              style={{
                fontSize: heroDescSize,
                color: isDark ? theme.colors.stone[300] : theme.colors.stone[600],
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

        {/* StatBar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: statBarGrid,
            border: `1px solid ${borderColor}`,
            borderRadius: statBarBorderRadius,
            overflow: "hidden",
            margin: statBarMargin,
            background: cardBg,
            boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
          }}
        >
          {[
            { num: "Private", label: "Invitation‑only family space — never public" },
            { num: "🔒 Bank‑level", label: "Security protecting your family’s history" },
            { num: "Any Device", label: "Accessible from anywhere, anytime" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                padding: isMdUp ? "2rem 1.5rem" : "1.5rem 1rem",
                textAlign: "center",
                borderRight: i < 2 && statBarGrid !== "1fr" ? `1px solid ${borderColor}` : "none",
              }}
            >
              <div
                style={{
                  fontFamily: theme.fontFamily.serif,
                  fontSize: isMdUp ? 32 : 28,
                  fontWeight: 800,
                  color: isDark ? theme.colors.brand[300] : theme.colors.brand[700],
                  marginBottom: "0.3rem",
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: isMdUp ? 13 : 12, color: textSecondary }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Who We Are */}
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
                    color: brandColor,
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  Who We Are
                </div>
                <h2
                  style={{
                    fontFamily: theme.fontFamily.serif,
                    fontSize: sectionTitleSize,
                    fontWeight: 800,
                    color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
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
                      color: textSecondary,
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
                  background: isDark ? theme.colors.brand[800] : "#141d4a",
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
                    background: `rgba(85,130,94,0.15)`,
                    right: -50,
                    bottom: -50,
                  }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div
                    style={{
                      gridColumn: "span 2",
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${theme.colors.brand[600]}, ${theme.colors.brand[800]})`,
                      minHeight: 90,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMdUp ? 12 : 10,
                      color: "white",
                    }}
                  >
                    Family Heritage Archive
                  </div>
                  <div
                    style={{
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${theme.colors.brand[500]}, ${theme.colors.brand[700]})`,
                      minHeight: 90,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMdUp ? 12 : 10,
                      color: "white",
                    }}
                  >
                    1962 — Grandparents
                  </div>
                  <div
                    style={{
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${theme.colors.brand[400]}, ${theme.colors.brand[900]})`,
                      minHeight: 130,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMdUp ? 12 : 10,
                      color: 'white',
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
                    color: "white",
                    fontStyle: "italic",
                  }}
                >
                  Your memories, beautifully organised and forever preserved
                </p>
              </div>
            </div>

            <div
              style={{
                borderLeft: `4px solid ${brandColor}`,
                padding: isMdUp ? "1.5rem 2rem" : "1rem 1.5rem",
                background: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
                borderRadius: "0 12px 12px 0",
                margin: "2rem 0",
              }}
            >
              <p
                style={{
                  fontFamily: theme.fontFamily.serif,
                  fontSize: isMdUp ? 22 : 18,
                  fontStyle: "italic",
                  color: isDark ? theme.colors.brand[200] : theme.colors.brand[700],
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
                  color: brandColor,
                  fontWeight: 600,
                  fontStyle: "normal",
                }}
              >
                — The Enduring Roots Team
              </cite>
            </div>

            <div
              style={{
                background: `linear-gradient(135deg, ${theme.colors.brand[700]} 0%, ${theme.colors.brand[600]} 100%)`,
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
                  fontFamily: theme.fontFamily.serif,
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
                  href="/signup"
                  style={{
                    background: theme.colors.amber[500],
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

        {/* The Problem We Solve */}
        <section
          style={{
            background: isDark ? theme.dark.bgCard : "#f7f9ff",
            padding: `${sectionPaddingY} ${sectionPaddingX}`,
          }}
        >
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: brandColor,
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              The Problem We Solve
            </div>
            <h2
              style={{
                fontFamily: theme.fontFamily.serif,
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
                marginBottom: "1.5rem",
              }}
            >
              Precious memories are disappearing every day
            </h2>
            <p
              style={{
                fontSize: isMdUp ? 16 : 14,
                color: textSecondary,
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
                      background: cardBg,
                      borderRadius: 12,
                      padding: isMdUp ? "1.25rem 1.5rem" : "1rem 1rem",
                      border: `1px solid ${borderColor}`,
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
                        background: brandColor,
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                    />
                    <p
                      style={{
                        fontSize: isMdUp ? 14 : 13,
                        color: textSecondary,
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

        {/* What Enduring Roots Does */}
        <section style={{ padding: `${sectionPaddingY} ${sectionPaddingX}` }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: brandColor,
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              What Enduring Roots Does
            </div>
            <h2
              style={{
                fontFamily: theme.fontFamily.serif,
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
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
                    background: cardBg,
                    borderRadius: 16,
                    padding: isMdUp ? "2rem" : "1.5rem",
                    border: `1px solid ${borderColor}`,
                    transition: "all 0.2s",
                  }}
                >
                  <h3
                    style={{
                      fontSize: isMdUp ? 18 : 16,
                      fontWeight: 600,
                      color: isDark ? theme.colors.brand[200] : theme.colors.brand[800],
                      marginBottom: "1rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: isMdUp ? 14 : 13,
                      color: textSecondary,
                      lineHeight: 1.7,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <Link
                href="/signup"
                style={{
                  background: theme.colors.brand[600],
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
              </Link>
            </div>
          </div>
        </section>

        {/* Our Mission */}
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
                    color: brandColor,
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  Our Mission
                </div>
                <h2
                  style={{
                    fontFamily: theme.fontFamily.serif,
                    fontSize: sectionSubtitleSize,
                    fontWeight: 800,
                    color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
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
                      color: textSecondary,
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
                  background: cardBg,
                  borderRadius: 20,
                  padding: isMdUp ? "3rem" : "2rem",
                  border: `1px solid ${borderColor}`,
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
                    background: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
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
                    background: theme.colors.amber[500],
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
                    fontFamily: theme.fontFamily.serif,
                    fontSize: isMdUp ? 22 : 18,
                    fontWeight: 700,
                    color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
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

        {/* Our Values */}
        <section
          style={{
            background: isDark ? theme.dark.bgCard : "#f7f9ff",
            padding: `${sectionPaddingY} ${sectionPaddingX}`,
          }}
        >
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: brandColor,
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Our Values
            </div>
            <h2
              style={{
                fontFamily: theme.fontFamily.serif,
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
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
                    background: cardBg,
                    borderRadius: 16,
                    padding: isMdUp ? "2rem" : "1.5rem",
                    border: `1px solid ${borderColor}`,
                    transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
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
                      color: isDark ? theme.colors.brand[200] : theme.colors.brand[800],
                      marginBottom: "0.5rem",
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontSize: isMdUp ? 14 : 13,
                      color: textSecondary,
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

        {/* Why This Matters */}
        <section style={{ padding: `${sectionPaddingY} ${sectionPaddingX}` }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: brandColor,
                textTransform: "uppercase",
                marginBottom: "0.75rem",
                textAlign: "center",
              }}
            >
              Why This Matters
            </div>
            <h2
              style={{
                fontFamily: theme.fontFamily.serif,
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
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
                  color: textSecondary,
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
                  color: textSecondary,
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
                  background: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
                  borderRadius: 16,
                  padding: isMdUp ? "2rem" : "1.5rem",
                  margin: "2rem 0",
                }}
              >
                <p
                  style={{
                    fontSize: isMdUp ? 18 : 16,
                    fontWeight: 500,
                    color: isDark ? theme.colors.brand[200] : theme.colors.brand[700],
                    fontStyle: "italic",
                  }}
                >
                  "Children who know their family history show greater resilience
                  and a deeper sense of who they are."
                </p>
                <p
                  style={{
                    fontSize: isMdUp ? 12 : 11,
                    color: brandColor,
                    marginTop: "0.5rem",
                  }}
                >
                  — Research on family narratives and child development
                </p>
              </div>
              <Link
                href="/signup"
                style={{
                  background: theme.colors.brand[600],
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
              </Link>
            </div>
          </div>
        </section>

        {/* What Makes Enduring Roots Different */}
        <section
          style={{
            background: isDark ? theme.dark.bgCard : "#f7f9ff",
            padding: `${sectionPaddingY} ${sectionPaddingX}`,
          }}
        >
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: brandColor,
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              What Makes Us Different
            </div>
            <h2
              style={{
                fontFamily: theme.fontFamily.serif,
                fontSize: sectionTitleSize,
                fontWeight: 800,
                color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
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
                    background: cardBg,
                    borderRadius: 16,
                    padding: isMdUp ? "2rem" : "1.5rem",
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: isMdUp ? 18 : 16,
                      fontWeight: 600,
                      color: isDark ? theme.colors.brand[200] : theme.colors.brand[800],
                      marginBottom: "1rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: isMdUp ? 14 : 13,
                      color: textSecondary,
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

        {/* Our Promise to You */}
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
                    color: brandColor,
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  Our Promise
                </div>
                <h2
                  style={{
                    fontFamily: theme.fontFamily.serif,
                    fontSize: sectionTitleSize,
                    fontWeight: 800,
                    color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
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
                        color: textSecondary,
                        lineHeight: 1.6,
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
                          border: `1.5px solid ${isDark ? theme.colors.brand[600] : theme.colors.brand[200]}`,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: brandColor,
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
                  background: cardBg,
                  borderRadius: 20,
                  padding: isMdUp ? "2.5rem" : "2rem",
                  border: `1px solid ${borderColor}`,
                  position: isMdUp ? "sticky" : "relative",
                  top: isMdUp ? 100 : "auto",
                }}
              >
                <h4
                  style={{
                    fontFamily: theme.fontFamily.serif,
                    fontSize: isMdUp ? 22 : 18,
                    fontWeight: 700,
                    color: isDark ? theme.colors.brand[100] : theme.colors.brand[800],
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
                        background: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
                        color: isDark ? theme.colors.brand[300] : theme.colors.brand[600],
                        fontSize: isMdUp ? 12 : 11,
                        fontWeight: 500,
                        padding: "6px 14px",
                        borderRadius: 20,
                        border: `1px solid ${isDark ? theme.colors.brand[600] : theme.colors.brand[200]}`,
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    borderLeft: `4px solid ${brandColor}`,
                    padding: isMdUp ? "1.5rem 2rem" : "1rem 1.5rem",
                    background: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
                    borderRadius: "0 12px 12px 0",
                  }}
                >
                  <p
                    style={{
                      fontFamily: theme.fontFamily.serif,
                      fontSize: isMdUp ? 22 : 18,
                      fontStyle: "italic",
                      color: isDark ? theme.colors.brand[200] : theme.colors.brand[700],
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
                      color: brandColor,
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

        {/* Final CTA */}
        <section
          style={{
            background: `linear-gradient(135deg, ${theme.colors.brand[800]} 0%, ${theme.colors.brand[700]} 50%, ${theme.colors.brand[600]} 100%)`,
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
              backgroundImage: "radial-gradient(circle at 30% 50%, rgba(85,130,94,0.2) 0%, transparent 60%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
            <div>
              <h2
                style={{
                  fontFamily: theme.fontFamily.serif,
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
                <em style={{ fontStyle: "italic", color: theme.colors.amber[300] }}>
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
                <Link
                  href="/signup"
                  style={{
                    background: theme.colors.amber[500],
                    color: "#1a0a00",
                    padding: "13px 32px",
                    borderRadius: 10,
                    fontSize: isMdUp ? 15 : 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Create Your Family Archive — Free →
                </Link>
                <Link
                  href="/contact"
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
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Get in Touch */}
        <div
          style={{
            background: cardBg,
            borderTop: `1px solid ${borderColor}`,
            padding: isMdUp ? "2.5rem 4rem" : "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: isMdUp ? 15 : 13, color: textSecondary }}>
            Have a question? We'd love to hear from you —{" "}
            <a
              href="mailto:support@enduringroots.in"
              style={{ color: brandColor, fontWeight: 500, textDecoration: "none" }}
            >
              support@enduringroots.in
            </a>
          </p>
          <Link
            href="/contact"
            style={{
              background: theme.colors.brand[600],
              color: "#fff",
              padding: "9px 22px",
              borderRadius: 8,
              fontSize: isMdUp ? 14 : 13,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Get in Touch
          </Link>
        </div>
        <Footer />
      </main>
    </div>
  );
}