"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";

// ========== THEME CONSTANTS (light + dark) ==========
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
    emerald: {
      100: "#d1fae5",
      400: "#34d399",
      600: "#059669",
      900: "#064e3b",
    },
    rose: {
      400: "#fb7185",
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
    DEFAULT: "all 0.2s ease",
  },
};

// ========== RESPONSIVE & DARK MODE HOOKS ==========
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

const useDarkMode = () => {
  return useMediaQuery("(prefers-color-scheme: dark)");
};

// ========== STYLE UTILITIES ==========
const flexCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

// ========== COMPONENT ==========
const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const isDark = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/forget-password",
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsSubmitted(true);
      } else {
        setError(response.data.message || "Failed to send reset email");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Conditional colors based on dark mode
  const bgColor = isDark ? theme.colors.brand[950] : theme.colors.gray[50];
  const cardBg = isDark ? theme.colors.brand[900] : theme.colors.white;
  const textColor = isDark ? theme.colors.white : theme.colors.gray[900];
  const textMuted = isDark ? theme.colors.brand[400] : theme.colors.gray[600];
  const labelColor = isDark ? theme.colors.brand[300] : theme.colors.gray[700];
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.gray[300];
  const inputBg = isDark ? theme.colors.brand[950] : theme.colors.white;
  const focusRing = `0 0 0 2px ${theme.colors.brand[500]}80`;

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: theme.spacing(12),
          paddingBottom: theme.spacing(12),
          backgroundColor: bgColor,
          transition: `background-color 500ms ${theme.transition.DEFAULT}`,
        }}
      >
        <div
          style={{
            maxWidth: "448px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Logo and header */}
          <div style={{ textAlign: "center", marginBottom: theme.spacing(8) }}>
            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: theme.spacing(2),
                color: isDark ? theme.colors.brand[100] : theme.colors.brand[900],
                fontFamily: theme.fontFamily.serif,
                fontWeight: "bold",
                fontSize: theme.fontSize["2xl"],
                textDecoration: "none",
                marginBottom: theme.spacing(8),
              }}
            >
              <div
                style={{
                  width: theme.spacing(8),
                  height: theme.spacing(8),
                  backgroundColor: isDark ? theme.colors.brand[600] : theme.colors.brand[900],
                  borderRadius: theme.borderRadius.lg,
                  ...flexCenter,
                  color: theme.colors.white,
                  fontSize: theme.fontSize.lg,
                }}
              >
                E
              </div>
              <span>Enduring Roots.</span>
            </Link>
            <h2
              style={{
                textAlign: "center",
                fontSize: theme.fontSize["3xl"],
                fontWeight: 800,
                color: isDark ? theme.colors.white : theme.colors.gray[900],
              }}
            >
              Reset your password
            </h2>
            <p
              style={{
                marginTop: theme.spacing(2),
                textAlign: "center",
                fontSize: theme.fontSize.sm,
                color: textMuted,
              }}
            >
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              backgroundColor: cardBg,
              padding: `${theme.spacing(8)} ${theme.spacing(4)}`,
              boxShadow: theme.boxShadow.DEFAULT,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${
                isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100]
              }`,
            }}
          >
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: theme.spacing(6) }}
              >
                <div>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontSize: theme.fontSize.sm,
                      fontWeight: 500,
                      color: labelColor,
                      marginBottom: theme.spacing(1),
                    }}
                  >
                    Email address
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        paddingLeft: theme.spacing(3),
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                        color: theme.colors.gray[400],
                      }}
                    >
                      <Mail size={20} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      style={{
                        display: "block",
                        width: "100%",
                        paddingLeft: theme.spacing(10),
                        paddingRight: theme.spacing(3),
                        paddingTop: theme.spacing(3),
                        paddingBottom: theme.spacing(3),
                        border: `1px solid ${borderColor}`,
                        borderRadius: theme.borderRadius.lg,
                        color: textColor,
                        fontSize: theme.fontSize.sm,
                        backgroundColor: inputBg,
                        outline: "none",
                        transition: "all 0.2s",
                        boxShadow: focused ? focusRing : "none",
                      }}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    style={{
                      backgroundColor: theme.colors.rose[400] + "20",
                      border: `1px solid ${theme.colors.rose[400]}`,
                      borderRadius: theme.borderRadius.lg,
                      padding: theme.spacing(3),
                      color: isDark ? theme.colors.white : theme.colors.rose[400],
                      fontSize: theme.fontSize.sm,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: theme.spacing(2),
                      padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                      border: "none",
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.boxShadow.sm,
                      fontSize: theme.fontSize.sm,
                      fontWeight: 500,
                      color: theme.colors.white,
                      backgroundColor: isDark ? theme.colors.brand[600] : theme.colors.brand[900],
                      transition: "all 0.2s",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = isDark
                          ? theme.colors.brand[500]
                          : theme.colors.brand[800];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = isDark
                          ? theme.colors.brand[600]
                          : theme.colors.brand[900];
                      }
                    }}
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: `${theme.spacing(4)} 0` }}>
                <div
                  style={{
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: theme.spacing(12),
                    height: theme.spacing(12),
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: isDark
                      ? theme.colors.emerald[900] + "4D"
                      : theme.colors.emerald[100],
                    marginBottom: theme.spacing(4),
                  }}
                >
                  <CheckCircle
                    size={24}
                    style={{
                      color: isDark ? theme.colors.emerald[400] : theme.colors.emerald[600],
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: 500,
                    color: isDark ? theme.colors.white : theme.colors.gray[900],
                  }}
                >
                  Check your email
                </h3>
                <p
                  style={{
                    marginTop: theme.spacing(2),
                    fontSize: theme.fontSize.sm,
                    color: textMuted,
                  }}
                >
                  We've sent a password reset link to{" "}
                  <span
                    style={{
                      fontWeight: 600,
                      color: isDark ? theme.colors.brand[100] : theme.colors.gray[900],
                    }}
                  >
                    {email}
                  </span>
                  .
                </p>
                <div style={{ marginTop: theme.spacing(6) }}>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    style={{
                      fontSize: theme.fontSize.sm,
                      fontWeight: 500,
                      color: isDark ? theme.colors.brand[400] : theme.colors.brand[600],
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = isDark
                        ? theme.colors.brand[300]
                        : theme.colors.brand[500])
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = isDark
                        ? theme.colors.brand[400]
                        : theme.colors.brand[600])
                    }
                  >
                    Try a different email
                  </button>
                </div>
              </div>
            )}

            {/* Back to Sign In */}
            <div
              style={{
                marginTop: theme.spacing(6),
                borderTop: `1px solid ${
                  isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100]
                }`,
                paddingTop: theme.spacing(6),
              }}
            >
              <Link
                href="/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.spacing(2),
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textMuted,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark
                    ? theme.colors.white
                    : theme.colors.brand[900];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textMuted;
                }}
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;