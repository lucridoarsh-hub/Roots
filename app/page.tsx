"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import Footer from "./Footer"; // adjust the import path as needed
import { useAuth } from "../context/AuthContext"; // adjust the import path as needed
import { APP_NAME, TESTIMONIALS } from "../constants"; // adjust the import path as needed

// ========== THEME CONSTANTS (exact Tailwind values) ==========
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
    },
    amber: {
      400: "#fbbf24",
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
    "7xl": "4.5rem",
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
  transition: {
    DEFAULT: "all 0.3s ease",
  },
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    60: 60,
  },
};

// ========== RESPONSIVE HOOK ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

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

const flexCol = {
  display: "flex",
  flexDirection: "column",
} as const;

// ========== COMPONENT ==========
const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
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

  // Responsive breakpoints
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
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
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.white,
        fontFamily: theme.fontFamily.sans,
        color: theme.colors.gray[800],
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
            background: linear-gradient(90deg, #c8d4f5, #4a6fd4);
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
            zIndex: theme.zIndex[60],
          }}
        >
          <Info size={14} style={{ animation: "bounce 1s infinite" }} />
          {dynamicSettings.announcement}
        </div>
      )}

      {/* ===== NAVIGATION ===== */}
      <nav
        style={{
          position: "fixed",
          width: "100%",
          zIndex: theme.zIndex[50],
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${theme.colors.gray[100]}`,
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
         <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}>
  {dynamicSettings.logoUrl ? (
    <img
      src={dynamicSettings.logoUrl}
      style={{
        width: theme.spacing(10),
        height: theme.spacing(10),
        borderRadius: theme.borderRadius.lg,
        objectFit: "cover",
      }}
      alt="Logo"
    />
  ) : (
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
  )}
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
</div>
          {/* Desktop nav links */}
          {isMdUp && (
            <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(5) }}>
              <Link
                href="/"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: theme.colors.gray[600],
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = theme.colors.brand[700])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = theme.colors.gray[600])
                }
              >
                Home
              </Link>
              <Link
                href="/about"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: theme.colors.gray[600],
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = theme.colors.brand[700])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = theme.colors.gray[600])
                }
              >
                About
              </Link>
              <Link
                href="/blog"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: theme.colors.gray[600],
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = theme.colors.brand[700])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = theme.colors.gray[600])
                }
              >
                Blog
              </Link>
              <Link
                href="/success-stories"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: theme.colors.gray[600],
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = theme.colors.brand[700])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = theme.colors.gray[600])
                }
              >
                Success Stories
              </Link>
              <Link
                href="/contact"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: theme.colors.gray[600],
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = theme.colors.brand[700])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = theme.colors.gray[600])
                }
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
                {isMdUp ? "Go to Dashboard" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    color: theme.colors.gray[600],
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: isMdUp ? "inline" : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[600])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.gray[600])
                  }
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
                  color: theme.colors.brand[900],
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
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              borderBottom: `1px solid ${theme.colors.gray[100]}`,
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
                color: theme.colors.gray[700],
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.brand[50])
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
                color: theme.colors.gray[700],
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.brand[50])
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
                color: theme.colors.gray[700],
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.brand[50])
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
                color: theme.colors.gray[700],
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.brand[50])
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
                color: theme.colors.gray[700],
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.brand[50])
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
            background:
              "radial-gradient(circle at top right, #bfdbfe, #f9fafb, white)",
          }}
        ></div>
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
              backgroundColor: theme.colors.brand[50],
              border: `1px solid ${theme.colors.brand[100]}`,
              borderRadius: theme.borderRadius.full,
              color: theme.colors.brand[700],
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
              color: theme.colors.brand[900],
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
                backgroundImage: `linear-gradient(to right, ${theme.colors.brand[600]}, ${theme.colors.brand[400]})`,
                fontStyle: "italic",
              }}
            >
              become a legacy.
            </span>
          </h1>
          <p
            style={{
              fontSize: isMdUp ? theme.fontSize.xl : theme.fontSize.lg,
              color: theme.colors.gray[600],
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
                  backgroundColor: theme.colors.brand[900],
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
                  e.currentTarget.style.backgroundColor = theme.colors.brand[800];
                  e.currentTarget.style.boxShadow = theme.boxShadow["2xl"];
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.brand[900];
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
                  backgroundColor: theme.colors.brand[900],
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
                  e.currentTarget.style.backgroundColor = theme.colors.brand[800];
                  e.currentTarget.style.boxShadow = theme.boxShadow["2xl"];
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.brand[900];
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
          background: "#141d4a",
          padding: isMdUp ? "6rem 2rem" : "4rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: theme.fontSize.xs,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.5)",
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
                  borderRadius: "14px",
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
          backgroundColor: theme.colors.gray[50],
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
                color: theme.colors.brand[900],
                marginBottom: theme.spacing(4),
                letterSpacing: "-0.025em",
              }}
            >
              Preserving History, One Story at a Time
            </h2>
            <p
              style={{
                color: theme.colors.gray[600],
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
            {/* Carousel Controls - always visible on mobile, hover on desktop */}
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
                        backgroundColor: theme.colors.white,
                        padding: theme.spacing(6),
                        borderRadius: "1.5rem",
                        boxShadow: theme.boxShadow.sm,
                        border: `1px solid ${theme.colors.gray[100]}`,
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
                        e.currentTarget.style.borderColor = theme.colors.gray[100];
                      }}
                    >
                      {/* Avatar replaced with User icon */}
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
                            border: `2px solid ${theme.colors.brand[100]}`,
                            transition: "border-color 0.2s",
                            boxShadow: theme.boxShadow.md,
                            backgroundColor: theme.colors.brand[50],
                            ...flexCenter,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = theme.colors.brand[500])
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor = theme.colors.brand[100])
                          }
                        >
                          <User size={28} color={theme.colors.brand[600]} />
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <h4
                            style={{
                              fontWeight: "bold",
                              color: theme.colors.gray[900],
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
                            color: theme.colors.brand[100],
                            position: "absolute",
                            top: -12,
                            left: -12,
                          }}
                          size={32}
                        />
                        <p
                          style={{
                            color: theme.colors.gray[700],
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
                      activeIndex === i ? theme.colors.brand[600] : theme.colors.brand[200],
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
                backgroundColor: theme.colors.brand[900],
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
        border: `2px solid ${theme.colors.brand[900]}`,
        marginRight: `-${theme.spacing(2)}`,   // fixed
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
                    border: `2px solid ${theme.colors.brand[900]}`,
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
              ></div>
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
              borderRadius: "2rem",
              backgroundColor: theme.colors.brand[900],
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
                backgroundColor: "rgba(37,99,235,0.3)",
                filter: "blur(128px)",
                marginRight: theme.spacing(-32),
                marginTop: theme.spacing(-32),
                borderRadius: theme.borderRadius.full,
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: theme.spacing(48),
                height: theme.spacing(48),
                backgroundColor: "rgba(251,191,36,0.1)",
                filter: "blur(128px)",
                marginLeft: theme.spacing(-24),
                marginBottom: theme.spacing(-24),
                borderRadius: theme.borderRadius.full,
              }}
            ></div>

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
                        ></div>
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
          background: "#f7f9ff",
          padding: isMdUp ? "6rem 2rem" : "4rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
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
            Your Journey
          </div>
          <h2
            style={{
              fontFamily: theme.fontFamily.serif,
              fontSize: isMdUp ? theme.fontSize["5xl"] : theme.fontSize["3xl"],
              fontWeight: 800,
              color: "#1e2d6b",
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
              color: "#5a6a7e",
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
                    background: "#1e2d6b",
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
                    border: "4px solid #fff",
                    boxShadow: "0 0 0 2px #4a6fd4",
                  }}
                >
                  {s.num}
                </div>
                <h3
                  style={{
                    fontSize: isMdUp ? 16 : 15,
                    fontWeight: 600,
                    color: "#1e2d6b",
                    marginBottom: "0.5rem",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: isMdUp ? 13 : 12,
                    color: "#5a6a7e",
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
              background: "linear-gradient(135deg, #1e2d6b 0%, #2a3d8f 100%)",
              borderRadius: "20px",
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
            <a
              href="https://enduringroots.in/signup"
              style={{
                background: "#f5a623",
                color: "#1a0a00",
                padding: isMdUp ? "13px 32px" : "11px 24px",
                borderRadius: "10px",
                border: "none",
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

      <Footer />
    </div>
  );
};

export default LandingPage;