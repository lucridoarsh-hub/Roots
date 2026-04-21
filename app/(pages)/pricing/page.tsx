// app/pricing/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Shield,
  Lock,
  Heart,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { APP_NAME } from "../../../constants";
import theme from "../../theme";
import Footer from "@/app/components/Footer";

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

// ========== MAIN PRICING COMPONENT ==========
const PricingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const isDark = useDarkMode();
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  const palette = isDark ? theme.dark : theme.light;
  const textPrimary = palette.text;
  const textSecondary = palette.textMuted;
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const brandColor = theme.colors.brand[600];
  const greenDark = theme.colors.brand[800];
  const greenMid = theme.colors.brand[600];
  const greenLight = theme.colors.brand[500];
  const greenPale = isDark ? theme.colors.brand[900] : "#e8f0ea";
  const amber = "#e8a020";
  const amberHover = "#d4911a";
  const amberLight = isDark ? "rgba(232,160,32,0.2)" : "#fef3e2";
  const white = "#ffffff";
  const cream = isDark ? theme.colors.brand[950] : "#fafaf7";

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Scroll animation (fade-up)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const fadeElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeElementsRef.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const faqItems = [
    {
      q: "Is the Seed plan really free forever?",
      a: "Yes, completely. The Seed plan has no time limit and requires no credit card. Preserve up to 100 images and access all Chapters of Life at absolutely zero cost — forever.",
    },
    {
      q: "When will Heritage and Legacy plans launch?",
      a: "We're finalising pricing and features. Click 'Notify Me When Live' on the Heritage card to get an early-access discount the moment we launch.",
    },
    {
      q: "How do you keep my family's memories secure?",
      a: "All photos, videos, and audio files are encrypted both at rest and in transit using bank-level security. We never share, sell, or use your personal data for any purpose.",
    },
    {
      q: "Can I upgrade from Seed to a paid plan later?",
      a: "Absolutely. When paid plans launch you can upgrade at any time and every memory you've already preserved will carry over automatically — nothing is ever lost.",
    },
    {
      q: "What are 'Chapters of Life'?",
      a: "Chapters are life-stage categories (childhood, education, career, family, travels, etc.) that help you organise memories into a meaningful, structured timeline. All plans include every chapter.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>Pricing — Enduring Roots</title>
        <meta
          name="description"
          content="Simple, transparent pricing for preserving your family's legacy. Start for free, upgrade when you need more space."
        />
      </Head>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: cream,
          fontFamily: theme.fontFamily.sans,
          color: textPrimary,
          transition: `background-color 500ms ${theme.transition.DEFAULT}`,
        }}
      >
        {/* ===== NAVIGATION (same as LandingPage) ===== */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            zIndex: 50,
            backgroundColor: isDark
              ? "rgba(20, 35, 20, 0.95)"
              : "rgba(252, 251, 248, 0.97)",
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${
              isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"
            }`,
            boxShadow: isDark
              ? "0 1px 24px rgba(0,0,0,0.4)"
              : "0 1px 20px rgba(44, 74, 46, 0.08)",
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
                {["Home", "About","Pricing", "Success Stories","Blog", "Contact"].map(
                  (label) => {
                    const href =
                      label === "Home"
                        ? "/"
                        : `/${label.toLowerCase().replace(/\s+/g, "-")}`;
                    const isActive = label === "Pricing";
                    return (
                      <Link
                        key={label}
                        href={href}
                        style={{
                          fontSize: "13.5px",
                          fontWeight: isActive ? 600 : 500,
                          color: isActive
                            ? isDark
                              ? "#fff"
                              : "#2C4A2E"
                            : isDark
                            ? "rgba(200,220,200,0.85)"
                            : "#4A6741",
                          textDecoration: "none",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          transition: "all 0.18s ease",
                          letterSpacing: "0.01em",
                          backgroundColor: isActive
                            ? isDark
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(44,74,46,0.07)"
                            : "transparent",
                        }}
                      >
                        {label}
                      </Link>
                    );
                  }
                )}
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
                        color: isDark
                          ? "rgba(200,220,200,0.85)"
                          : "#4A6741",
                        textDecoration: "none",
                        padding: "9px 16px",
                        borderRadius: "10px",
                        transition: "all 0.18s ease",
                        border: `1px solid ${
                          isDark
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(74,103,65,0.2)"
                        }`,
                      }}
                    >
                      Sign In
                    </Link>
                  )}
                  <Link
                    href="/signup"
                    style={{
                      padding: "9px 20px",
                      background:
                        "linear-gradient(135deg, #2C4A2E 0%, #3d6640 100%)",
                      color: "#fff",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      borderRadius: "10px",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 8px rgba(44,74,46,0.3)",
                      letterSpacing: "0.01em",
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
                    background: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(44,74,46,0.07)",
                    border: `1px solid ${
                      isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(44,74,46,0.15)"
                    }`,
                    cursor: "pointer",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    color: isDark ? "#a8c5a0" : "#2C4A2E",
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
                backgroundColor: isDark
                  ? "rgba(20,35,20,0.98)"
                  : "rgba(252,251,248,0.98)",
                backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${
                  isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"
                }`,
                padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                zIndex: 40,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              {["Home", "About","Pricing", "Blog", "Success Stories", "Contact"].map(
                (label) => {
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
                        color: isDark
                          ? "rgba(200,220,200,0.85)"
                          : "#4A6741",
                        textDecoration: "none",
                        padding: "10px 14px",
                        borderRadius: "8px",
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  );
                }
              )}
              <div
                style={{
                  marginTop: "8px",
                  paddingTop: "12px",
                  borderTop: `1px solid ${
                    isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"
                  }`,
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
                    color: isDark
                      ? "rgba(200,220,200,0.85)"
                      : "#4A6741",
                    textDecoration: "none",
                    borderRadius: "8px",
                    border: `1px solid ${
                      isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(74,103,65,0.2)"
                    }`,
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
                    background:
                      "linear-gradient(135deg, #2C4A2E 0%, #3d6640 100%)",
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

        {/* ===== HERO ===== */}
        <section
          style={{
            background: `linear-gradient(170deg, #edf5ef 0%, #f5faf6 50%, ${cream} 100%)`,
            textAlign: "center",
            padding: isMdUp ? "80px 24px 72px" : "60px 16px 48px",
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: greenPale,
              color: greenMid,
              border: `1px solid ${isDark ? theme.colors.brand[700] : "#c8ddc8"}`,
              borderRadius: 20,
              padding: "6px 18px",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            🌿 &nbsp;Simple, Transparent Pricing
          </div>
          <h1
            style={{
              fontFamily: theme.fontFamily.serif,
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight: 600,
              color: greenDark,
              lineHeight: 1.15,
              marginBottom: 18,
            }}
          >
            Choose your plan,<br />
            <em style={{ fontStyle: "italic", color: greenLight }}>
              preserve your legacy.
            </em>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: textSecondary,
              maxWidth: 500,
              margin: "0 auto 36px",
              lineHeight: 1.75,
            }}
          >
            Start for free — no credit card needed. Upgrade when your story grows
            larger.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: amberLight,
              border: "1px solid rgba(232,160,32,0.3)",
              borderRadius: 20,
              padding: "8px 20px",
              fontSize: "0.8rem",
              color: "#7a500e",
              fontWeight: 500,
            }}
          >
            ✨ &nbsp;All plans include 100% Data Security and access to every
            Chapter of Life
          </div>
        </section>

        {/* ===== PLANS ===== */}
        <section
          style={{
            padding: isMdUp ? "72px 24px 80px" : "48px 16px 64px",
            maxWidth: 1080,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMdUp ? "repeat(3, 1fr)" : "1fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* Seed (Free) */}
            <div
              ref={(el) => {
                if (el) fadeElementsRef.current[0] = el;
              }}
              data-index={0}
              style={{
                opacity: visibleItems.has(0) ? 1 : 0,
                transform: visibleItems.has(0) ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
                background: white,
                border: `1px solid ${borderColor}`,
                borderRadius: 20,
                padding: "36px 30px 32px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: 20,
                  marginBottom: 18,
                  background: greenPale,
                  color: greenMid,
                  border: `1px solid ${isDark ? theme.colors.brand[700] : "#c8ddc8"}`,
                }}
              >
                Free Forever
              </span>
              <div
                style={{
                  fontFamily: theme.fontFamily.serif,
                  fontSize: "1.55rem",
                  fontWeight: 600,
                  color: greenDark,
                  marginBottom: 5,
                }}
              >
                Seed
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: textSecondary,
                  marginBottom: 26,
                  lineHeight: 1.55,
                }}
              >
                Start documenting your story today — completely free, no strings
                attached.
              </div>
              <div
                style={{
                  padding: "22px 0",
                  borderTop: `1px solid ${borderColor}`,
                  borderBottom: `1px solid ${borderColor}`,
                  marginBottom: 26,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fontFamily.serif,
                    fontSize: "2.8rem",
                    fontWeight: 600,
                    color: greenDark,
                    lineHeight: 1,
                  }}
                >
                  <sup style={{ fontSize: "1.1rem" }}>₹</sup>0
                </div>
                <div
                  style={{
                    fontSize: "0.76rem",
                    color: textSecondary,
                    marginTop: 6,
                  }}
                >
                  No credit card required · Always free
                </div>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                  marginBottom: 30,
                }}
              >
                {[
                  "Free Forever",
                  "Preserve up to 100 images",
                  "100% Data Security",
                  "Access to all Chapters of Life",
                ].map((feat, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 11,
                      fontSize: "0.875rem",
                      color: textPrimary,
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: greenPale,
                        border: `1px solid ${isDark ? theme.colors.brand[700] : "#c8ddc8"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <CheckCircle size={10} color={greenMid} />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href={'/login'}>
              <button
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  backgroundColor: greenDark,
                  color: white,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = greenMid)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = greenDark)
                }
              >
                Start Your Timeline — It's Free →
              </button>
              </Link>
            </div>

            {/* Heritage (Featured) */}
            <div
              ref={(el) => {
                if (el) fadeElementsRef.current[1] = el;
              }}
              data-index={1}
              style={{
                opacity: visibleItems.has(1) ? 1 : 0,
                transform: visibleItems.has(1) ? "translateY(0)" : isMdUp ? "translateY(-10px)" : "translateY(20px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
                background: greenDark,
                border: `1px solid ${greenDark}`,
                borderRadius: 20,
                padding: "36px 30px 32px",
                position: "relative",
                overflow: "hidden",
                boxShadow: theme.boxShadow.lg,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: amber,
                  color: white,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "5px 18px",
                  borderRadius: "0 0 10px 10px",
                }}
              >
                Most Popular
              </div>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: 20,
                  marginBottom: 18,
                  background: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Coming Soon
              </span>
              <div
                style={{
                  fontFamily: theme.fontFamily.serif,
                  fontSize: "1.55rem",
                  fontWeight: 600,
                  color: white,
                  marginBottom: 5,
                }}
              >
                Heritage
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 26,
                  lineHeight: 1.55,
                }}
              >
                More space for families with richer stories to preserve.
              </div>
              <div
                style={{
                  padding: "22px 0",
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  marginBottom: 26,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fontFamily.serif,
                    fontSize: "1.4rem",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1,
                  }}
                >
                  Pricing coming soon
                </div>
                <div
                  style={{
                    fontSize: "0.76rem",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 6,
                  }}
                >
                  Be the first to know at launch
                </div>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                  marginBottom: 30,
                }}
              >
                {[
                  "Upload up to 300 images",
                  "Upload up to 10 videos",
                  "100% Data Security",
                  "Access to all Chapters of Life",
                ].map((feat, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 11,
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <CheckCircle size={10} color={amber} />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                disabled
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  background: greenPale,
                  color: textSecondary,
                  border: `1px solid ${borderColor}`,
                  cursor: "not-allowed",
                }}
              >
                Coming Soon
              </button>
            </div>

            {/* Legacy */}
            <div
              ref={(el) => {
                if (el) fadeElementsRef.current[2] = el;
              }}
              data-index={2}
              style={{
                opacity: visibleItems.has(2) ? 1 : 0,
                transform: visibleItems.has(2) ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
                background: white,
                border: `1px solid ${borderColor}`,
                borderRadius: 20,
                padding: "36px 30px 32px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: 20,
                  marginBottom: 18,
                  background: amberLight,
                  color: "#7a500e",
                  border: "1px solid rgba(232,160,32,0.3)",
                }}
              >
                Coming Soon
              </span>
              <div
                style={{
                  fontFamily: theme.fontFamily.serif,
                  fontSize: "1.55rem",
                  fontWeight: 600,
                  color: greenDark,
                  marginBottom: 5,
                }}
              >
                Legacy
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: textSecondary,
                  marginBottom: 26,
                  lineHeight: 1.55,
                }}
              >
                The complete family archive — every memory, every format.
              </div>
              <div
                style={{
                  padding: "22px 0",
                  borderTop: `1px solid ${borderColor}`,
                  borderBottom: `1px solid ${borderColor}`,
                  marginBottom: 26,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fontFamily.serif,
                    fontSize: "1.4rem",
                    fontStyle: "italic",
                    color: textSecondary,
                    lineHeight: 1,
                  }}
                >
                  Pricing coming soon
                </div>
                <div
                  style={{
                    fontSize: "0.76rem",
                    color: textSecondary,
                    marginTop: 6,
                  }}
                >
                  Full launch details announced soon
                </div>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                  marginBottom: 30,
                }}
              >
                {[
                  "Upload up to 500 images",
                  "Upload up to 20 videos",
                  "10 audio memories",
                  "100% Data Security",
                  "Access to all Chapters of Life",
                ].map((feat, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 11,
                      fontSize: "0.875rem",
                      color: textPrimary,
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: greenPale,
                        border: `1px solid ${isDark ? theme.colors.brand[700] : "#c8ddc8"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <CheckCircle size={10} color={greenMid} />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                disabled
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  background: greenPale,
                  color: textSecondary,
                  border: `1px solid ${borderColor}`,
                  cursor: "not-allowed",
                }}
              >
                Coming Soon
              </button>
            </div>
          </div>
        </section>

        {/* ===== TRUST BAR ===== */}
        <div
          style={{
            background: greenDark,
            padding: "52px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: isMdUp ? "repeat(3, 1fr)" : "1fr",
              gap: 24,
            }}
          >
            {[
              {
                icon: "🔒",
                label: "Bank-level Security",
                sub: "All data encrypted at rest & in transit — private always",
              },
              {
                icon: "🌿",
                label: "No Lock-in",
                sub: "Export your memories anytime, in any format you choose",
              },
              {
                icon: "❤️",
                label: "10,000+ Families",
                sub: "Trusted across India to preserve their stories and heritage",
              },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontSize: "1.8rem",
                    marginBottom: 10,
                    display: "block",
                  }}
                >
                  {item.icon}
                </span>
                <div
                  style={{
                    fontFamily: theme.fontFamily.serif,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: white,
                    marginBottom: 4,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== COMPARE TABLE (hidden on mobile) ===== */}
        {isMdUp && (
          <section
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: "72px 24px 80px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: greenMid,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Compare Plans
            </div>
            <h2
              style={{
                fontFamily: theme.fontFamily.serif,
                fontSize: "clamp(1.7rem, 3vw, 2.3rem)",
                fontWeight: 600,
                color: greenDark,
                textAlign: "center",
                marginBottom: 48,
                lineHeight: 1.2,
              }}
            >
              Everything you need to preserve
              <br />
              your family's story
            </h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      fontFamily: theme.fontFamily.serif,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      padding: "14px 18px",
                      textAlign: "left",
                      color: greenDark,
                      borderBottom: `2px solid ${greenDark}`,
                    }}
                  >
                    Feature
                  </th>
                  <th
                    style={{
                      fontFamily: theme.fontFamily.serif,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      padding: "14px 18px",
                      textAlign: "center",
                      color: greenDark,
                      borderBottom: `2px solid ${greenDark}`,
                    }}
                  >
                    Seed
                  </th>
                  <th
                    style={{
                      fontFamily: theme.fontFamily.serif,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      padding: "14px 18px",
                      textAlign: "center",
                      color: greenDark,
                      borderBottom: `2px solid ${greenDark}`,
                      background: greenPale,
                    }}
                  >
                    Heritage
                  </th>
                  <th
                    style={{
                      fontFamily: theme.fontFamily.serif,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      padding: "14px 18px",
                      textAlign: "center",
                      color: greenDark,
                      borderBottom: `2px solid ${greenDark}`,
                    }}
                  >
                    Legacy
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Image Storage", seed: "100 images", heritage: "300 images", legacy: "500 images" },
                  { feature: "Video Upload", seed: "—", heritage: "10 videos", legacy: "20 videos" },
                  { feature: "Audio Memories", seed: "—", heritage: "—", legacy: "10 audios" },
                  { feature: "100% Data Security", seed: "✓", heritage: "✓", legacy: "✓" },
                  { feature: "All Chapters of Life", seed: "✓", heritage: "✓", legacy: "✓" },
                  { feature: "Free Forever", seed: "✓", heritage: "Coming Soon", legacy: "Coming Soon" },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td
                      style={{
                        padding: "14px 18px",
                        textAlign: "left",
                        fontWeight: 500,
                        color: textPrimary,
                        borderBottom: `1px solid ${borderColor}`,
                      }}
                    >
                      {row.feature}
                    </td>
                    <td
                      style={{
                        padding: "14px 18px",
                        textAlign: "center",
                        color: textSecondary,
                        borderBottom: `1px solid ${borderColor}`,
                      }}
                    >
                      {row.seed === "✓" ? (
                        <span style={{ color: greenMid, fontSize: "1.05rem", fontWeight: 600 }}>✓</span>
                      ) : row.seed === "—" ? (
                        <span style={{ color: textSecondary }}>—</span>
                      ) : (
                        row.seed
                      )}
                    </td>
                    <td
                      style={{
                        padding: "14px 18px",
                        textAlign: "center",
                        color: textSecondary,
                        borderBottom: `1px solid ${borderColor}`,
                        background: greenPale,
                      }}
                    >
                      {row.heritage === "✓" ? (
                        <span style={{ color: greenMid, fontSize: "1.05rem", fontWeight: 600 }}>✓</span>
                      ) : row.heritage === "—" ? (
                        <span style={{ color: textSecondary }}>—</span>
                      ) : row.heritage === "Coming Soon" ? (
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            color: "#7a500e",
                            background: amberLight,
                            padding: "3px 10px",
                            borderRadius: 10,
                          }}
                        >
                          Coming Soon
                        </span>
                      ) : (
                        row.heritage
                      )}
                    </td>
                    <td
                      style={{
                        padding: "14px 18px",
                        textAlign: "center",
                        color: textSecondary,
                        borderBottom: `1px solid ${borderColor}`,
                      }}
                    >
                      {row.legacy === "✓" ? (
                        <span style={{ color: greenMid, fontSize: "1.05rem", fontWeight: 600 }}>✓</span>
                      ) : row.legacy === "—" ? (
                        <span style={{ color: textSecondary }}>—</span>
                      ) : row.legacy === "Coming Soon" ? (
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            color: "#7a500e",
                            background: amberLight,
                            padding: "3px 10px",
                            borderRadius: 10,
                          }}
                        >
                          Coming Soon
                        </span>
                      ) : (
                        row.legacy
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ===== FAQ ===== */}
        <section
          style={{
            background: greenPale,
            padding: isMdUp ? "72px 24px 80px" : "48px 16px 64px",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div
              style={{
                textAlign: "center",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: greenMid,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Got Questions?
            </div>
            <h2
              style={{
                fontFamily: theme.fontFamily.serif,
                fontSize: "clamp(1.7rem, 3vw, 2.3rem)",
                fontWeight: 600,
                color: greenDark,
                textAlign: "center",
                marginBottom: 48,
                lineHeight: 1.2,
              }}
            >
              Frequently asked questions
            </h2>
            <div>
              {faqItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    borderBottom: `1px solid ${isDark ? theme.colors.brand[700] : "#c8ddc8"}`,
                    ...(idx === 0 && {
                      borderTop: `1px solid ${isDark ? theme.colors.brand[700] : "#c8ddc8"}`,
                    }),
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      padding: "20px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: theme.fontFamily.sans,
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: textPrimary,
                      textAlign: "left",
                      transition: "color 0.2s",
                    }}
                  >
                    {item.q}
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: openFaqIndex === idx ? greenDark : white,
                        border: `1px solid ${isDark ? theme.colors.brand[700] : "#c8ddc8"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "1.1rem",
                        color: openFaqIndex === idx ? white : greenMid,
                        transform: openFaqIndex === idx ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s, background 0.3s, color 0.3s",
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      fontSize: "0.84rem",
                      color: textSecondary,
                      lineHeight: 1.85,
                      maxHeight: openFaqIndex === idx ? 200 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.4s ease, padding 0.3s",
                      paddingBottom: openFaqIndex === idx ? 20 : 0,
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section
          style={{
            background: greenDark,
            padding: isMdUp ? "72px 24px" : "48px 16px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: theme.fontFamily.serif,
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 600,
              color: white,
              marginBottom: 14,
              lineHeight: 1.2,
            }}
          >
            Bring your family's history <em style={{ fontStyle: "italic", color: amber }}>to life.</em>
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: 460,
              margin: "0 auto 32px",
              lineHeight: 1.75,
            }}
          >
            Upload your first memory today. It takes just a few minutes to get started — and it's completely free.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <Link href={'/dashboard'}>
            <button
              style={{
                background: amber,
                color: white,
                border: "none",
                borderRadius: 8,
                padding: "13px 30px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = amberHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = amber)}
            >
              Upload Your First Memory →
            </button>
            </Link>
          </div>
        </section>

        {/* No Footer – removed as requested */}
        <Footer/>
      </div>
    </>
  );
};

export default PricingPage;