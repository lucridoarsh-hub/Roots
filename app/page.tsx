// app/page.tsx (or pages/index.tsx)
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  ArrowRight,
  Shield,
  Users,
  Sparkles,
  Clock,
  BookOpen,
  Share2,
  Heart,
  Star,
  Quote,
  CheckCircle,
  Smartphone,
  Lock,
  Award,
  LayoutDashboard,
  Camera,
  UploadCloud,
  PenTool,
  Gift,
  Database,
  Zap,
  Map,
  Utensils,
  GraduationCap,
  Briefcase,
  Globe,
  Mic,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
} from "lucide-react";
import Footer from "./components/Footer";
import { useAuth } from "../context/AuthContext";
import { APP_NAME, TESTIMONIALS } from "../constants";
import theme from "./theme"; // <-- imported design system

// ========== RESPONSIVE & DARK MODE HOOKS ==========
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
const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const isDark = useDarkMode();
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  // Choose light/dark palette from theme
  const palette = isDark ? theme.dark : theme.light;

  // Derived styles using theme primitives
  const bgColor = palette.bg;
  const textPrimary = palette.text;
  const textSecondary = palette.textMuted;
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const navBg = isDark
    ? theme.colors.brand[900] + "E6"
    : "rgba(255,255,255,0.9)";
  const navBorder = isDark ? theme.colors.brand[700] : theme.colors.stone[200];
  const linkHoverColor = isDark ? theme.colors.brand[300] : theme.colors.brand[600];
  const heroGradient = isDark
    ? `radial-gradient(circle at top right, ${theme.colors.brand[800]}, ${theme.colors.brand[950]})`
    : `radial-gradient(circle at top right, ${theme.colors.brand[200]}, ${theme.colors.stone[50]}, ${theme.colors.white})`;
  const whoBg = isDark ? theme.colors.brand[800] : theme.colors.brand[800];
  const whoText = isDark ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.6)";
  const testimonialBg = isDark ? theme.colors.brand[950] : theme.colors.stone[50];
  const testimonialCardBg = palette.bgCard;
  const testimonialCardBorder = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const howBg = isDark ? theme.colors.brand[950] : theme.colors.stone[50];
  const stepCircleBg = theme.colors.brand[500];
  const stepText = textPrimary; 
  const stepDesc = textSecondary;

  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = Math.ceil(TESTIMONIALS.length / 3);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
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
            borderRadius: theme.borderRadius["3xl"],
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            maxWidth: "448px",
            boxShadow: theme.boxShadow["2xl"],
          }}
        >
          <AlertCircle
            size={64}
            color={theme.colors.amber[400]}
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
            improvements to better preserve your legacy. We'll be back shortly!
          </p>
          <div
            style={{
              height: "4px",
              width: theme.spacing(24),
              backgroundColor: theme.colors.brand[500],
              margin: "0 auto",
              borderRadius: theme.borderRadius.full,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
        <Head>
        {/* Primary Meta Tags */}
        <title>Enduring Roots — Preserve Your Life's Most Cherished Memories</title>
        <meta name="title" content="Enduring Roots — Preserve Your Life's Most Cherished Memories" />
        <meta name="description" content="Enduring Roots helps you capture, organize, and share your personal legacy. Build a beautiful timeline of life memories to pass down to the people who matter most." />
        <meta name="keywords" content="memory preservation, digital legacy, family history, life timeline, personal memories, legacy platform, memory journal" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Enduring Roots" />
        <link rel="canonical" href="https://www.enduringroots.in/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.enduringroots.in/" />
        <meta property="og:title" content="Enduring Roots — Preserve Your Life's Most Cherished Memories" />
        <meta property="og:description" content="Capture, organize, and share your personal legacy. Build a beautiful timeline of life memories for the people who matter most." />
        <meta property="og:image" content="https://www.enduringroots.in/assets/og-home.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.enduringroots.in/" />
        <meta name="twitter:title" content="Enduring Roots — Preserve Your Life's Most Cherished Memories" />
        <meta name="twitter:description" content="Capture, organize, and share your personal legacy. Build a beautiful timeline of life memories for the people who matter most." />
        <meta name="twitter:image" content="https://www.enduringroots.in/assets/og-home.jpg" />
      </Head>
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        fontFamily: theme.fontFamily.sans,
        color: textPrimary,
        transition: `background-color 500ms ${theme.transition.DEFAULT}`,
      }}
    >
      {/* ===== GLOBAL STYLES (animations + responsive utilities) ===== */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25%); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }

        /* Responsive grid utilities */
        .grid-responsive-2cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .grid-responsive-2cols {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }
        @media (min-width: 1024px) {
          .grid-responsive-2cols {
            gap: 3rem;
          }
        }

        .grid-responsive-4cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .grid-responsive-4cols {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .grid-responsive-4cols {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .grid-responsive-steps {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .grid-responsive-steps {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 1rem;
            position: relative;
          }
        }

        .step-connector {
          display: none;
        }
        @media (min-width: 768px) {
          .step-connector {
            display: block;
            position: absolute;
            top: 28px;
            left: calc(10% + 16px);
            right: calc(10% + 16px);
            height: 2px;
            background: linear-gradient(90deg, ${theme.colors.brand[200]}, ${theme.colors.brand[600]});
            z-index: 0;
          }
        }

        .testimonial-carousel-slide {
          width: 100%;
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .testimonial-carousel-slide {
            width: calc(33.333% - 1rem);
          }
        }
      `}</style>

      {/* ===== ANNOUNCEMENT BAR ===== */}
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
            zIndex: 60,
          }}
        >
          <Info size={14} style={{ animation: "bounce 1s infinite" }} />
          {dynamicSettings.announcement}
        </div>
      )}

      {/* ===== NAVIGATION ===== */}
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
      {/* ===== HERO SECTION ===== */}
      <header
        style={{
          position: "relative",
          paddingTop: dynamicSettings.announcement
            ? isMdUp
              ? theme.spacing(44)
              : theme.spacing(32)
            : isMdUp
            ? theme.spacing(40)
            : theme.spacing(28),
          paddingBottom: isMdUp ? theme.spacing(28) : theme.spacing(16),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: 0.3,
            background: heroGradient,
          }}
        />
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${theme.spacing(4)}`,
            position: "relative",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: theme.spacing(2),
              padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
              backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
              border: `1px solid ${isDark ? theme.colors.brand[700] : theme.colors.brand[100]}`,
              borderRadius: theme.borderRadius.full,
              color: isDark ? theme.colors.brand[200] : theme.colors.brand[700],
              fontSize: theme.fontSize.xs,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: theme.spacing(5),
              animation: "fade-in-up 0.6s ease-out",
            }}
          >
            <Sparkles size={12} />
            <span>Preserve Your Legacy</span>
          </div>
          <h1
            style={{
              fontSize: isMdUp ? theme.fontSize["6xl"] : theme.fontSize["4xl"],
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              color: isDark ? theme.colors.white : theme.colors.brand[900],
              marginBottom: theme.spacing(5),
              lineHeight: 1.25,
              letterSpacing: "-0.025em",
            }}
          >
            Where memories <br />
            <span
              style={{
                color: "transparent",
                backgroundClip: "text",
                backgroundImage: `linear-gradient(to right, ${theme.colors.brand[400]}, ${theme.colors.brand[600]})`,
                fontStyle: "italic",
              }}
            >
              become a legacy.
            </span>
          </h1>
          <p
            style={{
              fontSize: isMdUp ? theme.fontSize.xl : theme.fontSize.lg,
              color: textSecondary,
              maxWidth: "42rem",
              margin: "0 auto",
              marginBottom: theme.spacing(8),
              lineHeight: 1.625,
              padding: `0 ${theme.spacing(4)}`,
            }}
          >
            {dynamicSettings.appName} is the digital sanctuary for your life's
            journey. Document your history, organize by life stages, and leave a
            lasting legacy for generations to come.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: theme.spacing(3),
            }}
          >
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                style={{
                  padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
                  backgroundColor: theme.colors.brand[500],
                  color: theme.colors.white,
                  fontSize: theme.fontSize.base,
                  fontWeight: 500,
                  borderRadius: theme.borderRadius.full,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow: theme.boxShadow.xl,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                  width: isMdUp ? "auto" : "100%",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.brand[600];
                  e.currentTarget.style.boxShadow = theme.boxShadow["2xl"];
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.brand[500];
                  e.currentTarget.style.boxShadow = theme.boxShadow.xl;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Go to My Timeline
                <ArrowRight
                  size={18}
                  style={{ transition: "transform 0.2s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateX(4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateX(0)")
                  }
                />
              </Link>
            ) : (
              <Link
                href="/signup"
                style={{
                  padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
                  backgroundColor: theme.colors.brand[500],
                  color: theme.colors.white,
                  fontSize: theme.fontSize.base,
                  fontWeight: 500,
                  borderRadius: theme.borderRadius.full,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow: theme.boxShadow.xl,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                  width: isMdUp ? "auto" : "100%",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.brand[600];
                  e.currentTarget.style.boxShadow = theme.boxShadow["2xl"];
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.brand[500];
                  e.currentTarget.style.boxShadow = theme.boxShadow.xl;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Start Your Timeline - It's Free
                <ArrowRight
                  size={18}
                  style={{ transition: "transform 0.2s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateX(4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateX(0)")
                  }
                />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Who Is Enduring Roots For - Responsive Grid */}
      <section
        style={{
          background: whoBg,
          padding: isMdUp ? "6rem 2rem" : "4rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: theme.fontSize.xs,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: isDark ? theme.colors.brand[300] : "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
              textAlign: "center",
            }}
          >
            Who It's For
          </div>
          <h2
            style={{
              fontFamily: theme.fontFamily.serif,
              fontSize: isMdUp ? theme.fontSize["5xl"] : theme.fontSize["3xl"],
              fontWeight: 800,
              color: "#fff",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Enduring Roots is for every family
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: theme.fontSize.lg,
              color: "rgba(255,255,255,0.6)",
              marginBottom: "3rem",
            }}
          >
            If your family has a story worth preserving — and every family does
            — Enduring Roots is for you.
          </p>
          <div className="grid-responsive-4cols">
            {[
              {
                icon: "👴",
                text: "Families with elders whose stories and life experiences have never been recorded",
              },
              {
                icon: "👶",
                text: "Parents who want to document their children's growth in a meaningful, organised way",
              },
              {
                icon: "🤝",
                text: "Families spread across cities, states, or countries who share a common heritage",
              },
              {
                icon: "📸",
                text: "Anyone with boxes of old photographs who wants to give them names and meaning",
              },
              {
                icon: "🌱",
                text: "Individuals who want to document their own life journey — phases, chapters, milestones",
              },
              {
                icon: "🎁",
                text: "Families preparing for a reunion, anniversary, or special occasion who want to create a shared memory collection",
              },
              {
                icon: "📖",
                text: "Adult children who want to honour and preserve the legacy of their parents and grandparents",
              },
              {
                icon: "🏡",
                text: "Anyone who believes their family's story deserves a permanent, beautiful, secure home",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: theme.borderRadius["2xl"],
                  padding: theme.spacing(6),
                }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
                  {item.icon}
                </div>
                <p
                  style={{
                    fontSize: theme.fontSize.sm,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.65,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION (CAROUSEL) ===== */}
      <section
        id="testimonials"
        style={{
          padding: isMdUp ? `${theme.spacing(20)} 0` : `${theme.spacing(12)} 0`,
          backgroundColor: testimonialBg,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: `0 ${theme.spacing(4)}` }}
        >
          <div style={{ textAlign: "center", marginBottom: theme.spacing(12) }}>
            <span
              style={{
                color: theme.colors.brand[600],
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: theme.fontSize.xs,
                marginBottom: theme.spacing(3),
                display: "block",
              }}
            >
              Voices of India
            </span>
            <h2
              style={{
                fontSize: isMdUp ? theme.fontSize["5xl"] : theme.fontSize["3xl"],
                fontFamily: theme.fontFamily.serif,
                fontWeight: "bold",
                color: textPrimary,
                marginBottom: theme.spacing(4),
                letterSpacing: "-0.025em",
              }}
            >
              Preserving History, One Story at a Time
            </h2>
            <p
              style={{
                color: textSecondary,
                maxWidth: "42rem",
                margin: "0 auto",
                fontSize: isMdUp ? theme.fontSize.lg : theme.fontSize.base,
                lineHeight: 1.625,
              }}
            >
              Join thousands of families across India who are documenting their
              heritage and legacy on {dynamicSettings.appName}.
            </p>
          </div>

          <div className="relative group" style={{ position: "relative" }}>
            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              style={{
                position: "absolute",
                left: isMdUp ? -16 : 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                padding: theme.spacing(3),
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                borderRadius: theme.borderRadius.full,
                boxShadow: theme.boxShadow.lg,
                color: theme.colors.brand[900],
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                opacity: isMdUp ? 0 : 1,
              }}
              onMouseEnter={(e) => {
                if (isMdUp) {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(-50%) translateX(0)";
                }
              }}
              onMouseLeave={(e) => {
                if (isMdUp) {
                  e.currentTarget.style.opacity = "0";
                  e.currentTarget.style.transform = "translateY(-50%) translateX(-8px)";
                }
              }}
            >
              <ChevronLeft size={isMdUp ? 24 : 20} />
            </button>
            <button
              onClick={nextSlide}
              style={{
                position: "absolute",
                right: isMdUp ? -16 : 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                padding: theme.spacing(3),
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                borderRadius: theme.borderRadius.full,
                boxShadow: theme.boxShadow.lg,
                color: theme.colors.brand[900],
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                opacity: isMdUp ? 0 : 1,
              }}
              onMouseEnter={(e) => {
                if (isMdUp) {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(-50%) translateX(0)";
                }
              }}
              onMouseLeave={(e) => {
                if (isMdUp) {
                  e.currentTarget.style.opacity = "0";
                  e.currentTarget.style.transform = "translateY(-50%) translateX(8px)";
                }
              }}
            >
              <ChevronRight size={isMdUp ? 24 : 20} />
            </button>

            {/* Carousel Container */}
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  transition: "transform 0.7s ease-in-out",
                  gap: isMdUp ? theme.spacing(6) : theme.spacing(4),
                  transform: `translateX(-${activeIndex * 100}%)`,
                }}
              >
                {TESTIMONIALS.map((t, idx) => (
                  <div key={idx} className="testimonial-carousel-slide">
                    <div
                      style={{
                        backgroundColor: testimonialCardBg,
                        padding: theme.spacing(6),
                        borderRadius: theme.borderRadius["3xl"],
                        boxShadow: theme.boxShadow.sm,
                        border: `1px solid ${testimonialCardBorder}`,
                        transition: "all 0.3s",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = theme.boxShadow.xl;
                        e.currentTarget.style.borderColor = theme.colors.brand[500];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = theme.boxShadow.sm;
                        e.currentTarget.style.borderColor = testimonialCardBorder;
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: theme.spacing(3),
                          marginBottom: theme.spacing(4),
                        }}
                      >
                        <div
                          style={{
                            width: theme.spacing(12),
                            height: theme.spacing(12),
                            borderRadius: theme.borderRadius.full,
                            overflow: "hidden",
                            border: `2px solid ${theme.colors.brand[200]}`,
                            transition: "border-color 0.2s",
                            boxShadow: theme.boxShadow.md,
                            backgroundColor: theme.colors.brand[50],
                            ...flexCenter,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = theme.colors.brand[500])
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor = theme.colors.brand[200])
                          }
                        >
                          <img
                            src={t.avatar}
                            alt={t.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).parentElement!.innerHTML =
                                '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                            }}
                          />
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <h4
                            style={{
                              fontWeight: "bold",
                              color: textPrimary,
                              fontSize: theme.fontSize.base,
                              lineHeight: 1.25,
                            }}
                          >
                            {t.name}
                          </h4>
                          <p
                            style={{
                              fontSize: theme.fontSize.xs,
                              color: theme.colors.brand[600],
                              fontWeight: 900,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {t.location}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          marginBottom: theme.spacing(4),
                          position: "relative",
                          flex: 1,
                        }}
                      >
                        <Quote
                          style={{
                            color: isDark ? theme.colors.brand[800] : theme.colors.brand[100],
                            position: "absolute",
                            top: -12,
                            left: -12,
                          }}
                          size={32}
                        />
                        <p
                          style={{
                            color: textSecondary,
                            position: "relative",
                            zIndex: 10,
                            fontStyle: "italic",
                            lineHeight: 1.625,
                            fontWeight: 500,
                            fontSize: theme.fontSize.sm,
                          }}
                        >
                          "{t.quote}"
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: theme.spacing(1),
                          color: theme.colors.amber[400],
                          marginTop: "auto",
                        }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={theme.colors.amber[400]} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: theme.spacing(2),
                marginTop: theme.spacing(8),
              }}
            >
              {[...Array(totalSlides)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width: activeIndex === i ? theme.spacing(6) : theme.spacing(2),
                    height: theme.spacing(2),
                    borderRadius: theme.borderRadius.full,
                    backgroundColor:
                      activeIndex === i ? theme.colors.brand[600] : theme.colors.brand[300],
                    transition: "all 0.3s",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom badge - responsive */}
          <div style={{ marginTop: theme.spacing(12), textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: theme.spacing(4),
                padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
                backgroundColor: theme.colors.brand[500],
                borderRadius: theme.borderRadius.full,
                color: theme.colors.white,
                boxShadow: theme.boxShadow["2xl"],
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", marginRight: `-${theme.spacing(2)}` }}>
                {TESTIMONIALS.slice(0, 4).map((t, i) => (
                  <img
                    key={i}
                    src={t.avatar}
                    style={{
                      width: theme.spacing(8),
                      height: theme.spacing(8),
                      borderRadius: theme.borderRadius.full,
                      border: `2px solid ${theme.colors.brand[500]}`,
                      marginRight: `-${theme.spacing(2)}`,
                    }}
                    alt=""
                  />
                ))}
                <div
                  style={{
                    width: theme.spacing(8),
                    height: theme.spacing(8),
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: theme.colors.brand[700],
                    border: `2px solid ${theme.colors.brand[500]}`,
                    ...flexCenter,
                    fontSize: theme.fontSize.xs,
                    fontWeight: "bold",
                  }}
                >
                  +15
                </div>
              </div>
              <div
                style={{
                  height: theme.spacing(6),
                  width: "1px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
              />
              <p
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: "bold",
                  letterSpacing: "-0.025em",
                }}
              >
                Rated 4.9/5 by 10,000+ happy families
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROMOTIONAL BANNER ===== */}
      <section
        style={{
          padding: isMdUp
            ? `${theme.spacing(16)} ${theme.spacing(4)}`
            : `${theme.spacing(12)} ${theme.spacing(4)}`,
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              position: "relative",
              borderRadius: theme.borderRadius["3xl"],
              backgroundColor: theme.colors.brand[800],
              color: theme.colors.white,
              overflow: "hidden",
              boxShadow: theme.boxShadow["2xl"],
              padding: isMdUp ? theme.spacing(16) : theme.spacing(8),
            }}
          >
            {/* Decorative blurs */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: theme.spacing(64),
                height: theme.spacing(64),
                backgroundColor: "rgba(85,130,94,0.3)",
                filter: "blur(128px)",
                marginRight: theme.spacing(-32),
                marginTop: theme.spacing(-32),
                borderRadius: theme.borderRadius.full,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: theme.spacing(48),
                height: theme.spacing(48),
                backgroundColor: "rgba(245,158,11,0.1)",
                filter: "blur(128px)",
                marginLeft: theme.spacing(-24),
                marginBottom: theme.spacing(-24),
                borderRadius: theme.borderRadius.full,
              }}
            />

            <div className="grid-responsive-2cols">
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing(2),
                    padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    borderRadius: theme.borderRadius.full,
                    color: theme.colors.amber[400],
                    fontSize: theme.fontSize.xs,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: theme.spacing(5),
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Gift size={14} />
                  <span>The Ultimate Family Gift</span>
                </div>
                <h2
                  style={{
                    fontSize: isMdUp ? theme.fontSize["5xl"] : theme.fontSize["3xl"],
                    fontFamily: theme.fontFamily.serif,
                    fontWeight: "bold",
                    marginBottom: theme.spacing(5),
                    lineHeight: 1.25,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Your Story is Their <br />
                  <span style={{ color: theme.colors.amber[400] }}>North Star.</span>
                </h2>
                <p
                  style={{
                    fontSize: isMdUp ? theme.fontSize.lg : theme.fontSize.base,
                    color: "rgba(219,234,254,0.8)",
                    marginBottom: theme.spacing(8),
                    lineHeight: 1.625,
                  }}
                >
                  Don't let your history fade into dusty boxes. Preserve your
                  partition stories, recipes, and milestones in a digital time
                  capsule designed to last centuries.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMdUp ? "row" : "column",
                    gap: theme.spacing(3),
                  }}
                >
                  <Link
                    href="/signup"
                    style={{
                      padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
                      backgroundColor: theme.colors.amber[400],
                      color: theme.colors.brand[900],
                      borderRadius: theme.borderRadius.full,
                      fontWeight: 700,
                      fontSize: theme.fontSize.base,
                      textDecoration: "none",
                      transition: "all 0.2s",
                      boxShadow: `0 20px 25px -5px ${theme.colors.amber[400]}33`,
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.white;
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.amber[400];
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Begin Your Legacy
                  </Link>
                  <Link
                    href="/blog"
                    style={{
                      padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: theme.colors.white,
                      borderRadius: theme.borderRadius.full,
                      fontWeight: "bold",
                      fontSize: theme.fontSize.base,
                      textDecoration: "none",
                      transition: "all 0.2s",
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
                    }
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {isMdUp && (
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "relative",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: theme.spacing(6),
                      borderRadius: theme.borderRadius["3xl"],
                      transform: "rotate(3deg)",
                      boxShadow: theme.boxShadow["2xl"],
                      animation: "float 6s ease-in-out infinite",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(3),
                        marginBottom: theme.spacing(4),
                      }}
                    >
                      <div
                        style={{
                          width: theme.spacing(10),
                          height: theme.spacing(10),
                          backgroundColor: theme.colors.amber[400],
                          borderRadius: theme.borderRadius["2xl"],
                          ...flexCenter,
                          color: theme.colors.brand[900],
                        }}
                      >
                        <Clock size={20} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: theme.fontSize.xs,
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: theme.colors.brand[300],
                          }}
                        >
                          Time Capsule Status
                        </p>
                        <h3 style={{ fontSize: theme.fontSize.lg, fontWeight: "bold" }}>
                          1947 — Active
                        </h3>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing(3) }}>
                      <div
                        style={{
                          height: theme.spacing(2),
                          width: "100%",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: theme.borderRadius.full,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: "75%",
                            backgroundColor: theme.colors.amber[400],
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.fontSize.sm,
                          color: theme.colors.brand[100],
                          fontWeight: 500,
                        }}
                      >
                        Archiving Grandma's Wedding Video...
                      </p>
                    </div>
                  </div>

                  {/* Floating icons */}
                  <div
                    style={{
                      position: "absolute",
                      top: -30,
                      right: -30,
                      width: theme.spacing(16),
                      height: theme.spacing(16),
                      backgroundColor: theme.colors.brand[500],
                      borderRadius: theme.borderRadius.full,
                      ...flexCenter,
                      boxShadow: theme.boxShadow["2xl"],
                      animation: "bounce-slow 3s infinite",
                    }}
                  >
                    <Camera style={{ color: theme.colors.white }} size={24} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: -30,
                      left: -30,
                      width: theme.spacing(20),
                      height: theme.spacing(20),
                      backgroundColor: theme.colors.brand[600],
                      borderRadius: theme.borderRadius["3xl"],
                      ...flexCenter,
                      boxShadow: theme.boxShadow["2xl"],
                      transform: "rotate(12deg)",
                    }}
                  >
                    <Heart style={{ color: theme.colors.amber[400] }} size={32} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Responsive Steps */}
      <section
        id="how-it-works"
        style={{
          background: howBg,
          padding: isMdUp ? "6rem 2rem" : "4rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: theme.fontSize.xs,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: theme.colors.brand[600],
              textTransform: "uppercase",
              marginBottom: "0.75rem",
              textAlign: "center",
            }}
          >
            Your Journey
          </div>
          <h2
            style={{
              fontFamily: theme.fontFamily.serif,
              fontSize: isMdUp ? theme.fontSize["5xl"] : theme.fontSize["3xl"],
              fontWeight: 800,
              color: textPrimary,
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            How Enduring Roots Works
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: isMdUp ? theme.fontSize.lg : theme.fontSize.base,
              color: textSecondary,
              marginBottom: "3rem",
            }}
          >
            From dusty boxes to digital legacy — four simple steps to bring your
            family history to life.
          </p>

          <div className="grid-responsive-steps">
            <div className="step-connector" />
            {[
              {
                num: "1",
                title: "Upload",
                desc: "Drag and drop photos, videos, audio, or documents from any device. Every format, every era.",
              },
              {
                num: "2",
                title: "Enrich",
                desc: "Add names, dates, places, and stories. Transform an unlabelled photo into a living memory.",
              },
              {
                num: "3",
                title: "Organise",
                desc: "Memories arrange into a beautiful interactive timeline by life stage — as it was truly lived.",
              },
              {
                num: "4",
                title: "Collaborate",
                desc: "Invite family to a private space. Many voices together build a richer, truer family story.",
              },
              {
                num: "5",
                title: "Share & Gift",
                desc: "Export a beautiful memory book. Gift it for birthdays, reunions, or anniversaries.",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: isMdUp ? "0 0.5rem" : "0",
                }}
              >
                <div
                  style={{
                    width: isMdUp ? 56 : 48,
                    height: isMdUp ? 56 : 48,
                    borderRadius: "50%",
                    background: stepCircleBg,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: theme.fontFamily.serif,
                    fontSize: isMdUp ? 20 : 18,
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    position: "relative",
                    zIndex: 1,
                    border: `4px solid ${palette.bgCard}`,
                    boxShadow: `0 0 0 2px ${theme.colors.brand[600]}`,
                  }}
                >
                  {s.num}
                </div>
                <h3
                  style={{
                    fontSize: isMdUp ? 16 : 15,
                    fontWeight: 600,
                    color: textPrimary,
                    marginBottom: "0.5rem",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: isMdUp ? 13 : 12,
                    color: textSecondary,
                    lineHeight: 1.7,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              background: `linear-gradient(135deg, ${theme.colors.brand[800]} 0%, ${theme.colors.brand[700]} 100%)`,
              borderRadius: theme.borderRadius["2xl"],
              padding: isMdUp ? "3rem" : "2rem",
              textAlign: "center",
              margin: "3rem 0 0",
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
              Bring Your Family's History to Life
            </h3>
            <p
              style={{
                fontSize: isMdUp ? 15 : 14,
                color: "rgba(255,255,255,0.7)",
                marginBottom: "2rem",
                position: "relative",
              }}
            >
              Upload your first memory today. It takes just a few minutes to get
              started.
            </p>
            <Link
              href="/signup"
              style={{
                background: theme.colors.amber[400],
                color: theme.colors.brand[900],
                padding: isMdUp ? "13px 32px" : "11px 24px",
                borderRadius: theme.borderRadius.xl,
                border: "none",
                fontSize: isMdUp ? 15 : 14,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
                transition: theme.transition.fast,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.amber[500])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.amber[400])
              }
            >
              Upload Your First Memory →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
};

export default LandingPage;