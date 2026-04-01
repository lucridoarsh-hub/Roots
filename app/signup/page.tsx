"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Heart,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // adjust path as needed

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
    amber: {
      300: "#fcd34d",
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
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
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

const absoluteFill = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

// ========== COMPONENT ==========
const SignupPage: React.FC = () => {
  const isLgUp = useMediaQuery("(min-width: 1024px)");
  const isDark = useDarkMode();
  const router = useRouter();
  const { login } = useAuth();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Conditional colors based on dark mode
  const bgColor = isDark ? theme.colors.brand[950] : theme.colors.white;
  const textColor = isDark ? theme.colors.white : theme.colors.gray[900];
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.gray[100];
  const textMuted = isDark ? theme.colors.brand[400] : theme.colors.gray[500];
  const inputBg = isDark
    ? theme.colors.brand[900] + "80"
    : theme.colors.gray[50];
  const inputBorder = isDark ? theme.colors.brand[700] : theme.colors.gray[200];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/register", // Updated to Next.js API route
        { username, email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("auth","true")
        login(email); // Update AuthContext
        router.push("/dashboard");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          backgroundColor: bgColor,
          transition: `background-color 500ms ${theme.transition.DEFAULT}`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Decorative Blur Blobs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "40%",
            height: "40%",
            backgroundColor: isDark
              ? theme.colors.brand[900] + "33"
              : theme.colors.brand[200] + "4D",
            borderRadius: theme.borderRadius.full,
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: "40%",
            height: "40%",
            backgroundColor: isDark
              ? theme.colors.brand[800] + "33"
              : theme.colors.brand[100] + "4D",
            borderRadius: theme.borderRadius.full,
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />

        {/* Right Side - Immersive Image (visible on lg screens, order-2) */}
        {isLgUp && (
          <div
            style={{
              display: "flex",
              width: "55%",
              position: "relative",
              overflow: "hidden",
              order: 2,
            }}
          >
            <div
              style={{
                ...absoluteFill,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2664&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 10000ms linear",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div
              style={{
                ...absoluteFill,
                backgroundColor: theme.colors.brand[900],
                opacity: 0.6,
                mixBlendMode: "multiply",
              }}
            />
            <div
              style={{
                ...absoluteFill,
                background: `linear-gradient(to top left, ${theme.colors.brand[950]}, ${theme.colors.brand[900]}66, transparent)`,
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: theme.spacing(20),
                width: "100%",
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  href="/"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing(3),
                    color: theme.colors.white,
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontWeight: 500, letterSpacing: "0.025em" }}>
                    Back to Home
                  </span>
                  <div
                    style={{
                      width: theme.spacing(10),
                      height: theme.spacing(10),
                      backgroundColor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(8px)",
                      borderRadius: theme.borderRadius.xl,
                      ...flexCenter,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.2)")
                    }
                  >
                    <ChevronLeft size={20} style={{ transform: "rotate(180deg)" }} />
                  </div>
                </Link>
              </div>

              <div style={{ animation: "fade-in-up 0.6s ease-out", textAlign: "right" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing(2),
                    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: theme.borderRadius.full,
                    color: theme.colors.white,
                    fontSize: theme.fontSize.xs,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: theme.spacing(6),
                  }}
                >
                  <Heart size={12} color={theme.colors.rose[400]} />
                  <span>Join our community</span>
                </div>
                <h1
                  style={{
                    fontSize: theme.fontSize["6xl"],
                    fontFamily: theme.fontFamily.serif,
                    fontWeight: "bold",
                    color: theme.colors.white,
                    marginBottom: theme.spacing(8),
                    lineHeight: 1.1,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Begin your <br />
                  <span
                    style={{
                      fontStyle: "italic",
                      color: theme.colors.brand[200],
                    }}
                  >
                    legacy.
                  </span>
                </h1>
                <p
                  style={{
                    fontSize: theme.fontSize.xl,
                    color: "rgba(219,234,254,0.8)",
                    lineHeight: 1.625,
                    maxWidth: "28rem",
                    marginLeft: "auto",
                    fontWeight: 300,
                  }}
                >
                  "The best thing about memories is making them."
                </p>
                <div
                  style={{
                    marginTop: theme.spacing(4),
                    height: "4px",
                    width: theme.spacing(20),
                    backgroundColor: theme.colors.brand[400],
                    borderRadius: theme.borderRadius.full,
                    marginLeft: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Left Side - Form (order-1) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
            order: 1,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "28rem",
              margin: "0 auto",
              padding: `${theme.spacing(12)} ${theme.spacing(8)}`,
            }}
          >
            {/* Logo and Header */}
            <div
              style={{
                textAlign: isLgUp ? "left" : "center",
                marginBottom: theme.spacing(10),
              }}
            >
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                  marginBottom: theme.spacing(10),
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: theme.spacing(10),
                    height: theme.spacing(10),
                    backgroundColor: isDark
                      ? theme.colors.brand[600]
                      : theme.colors.brand[900],
                    borderRadius: theme.borderRadius.xl,
                    ...flexCenter,
                    color: theme.colors.white,
                    fontFamily: theme.fontFamily.serif,
                    fontWeight: "bold",
                    fontSize: theme.fontSize["2xl"],
                    boxShadow: `0 10px 15px -3px ${theme.colors.brand[900]}33`,
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  E
                </div>
                <span
                  style={{
                    fontSize: theme.fontSize["3xl"],
                    fontFamily: theme.fontFamily.serif,
                    fontWeight: "bold",
                    color: isDark ? theme.colors.white : theme.colors.brand[950],
                    letterSpacing: "-0.025em",
                  }}
                >
                  Enduring Roots.
                </span>
              </Link>
              <h2
                style={{
                  fontSize: theme.fontSize["3xl"],
                  fontWeight: "bold",
                  color: isDark ? theme.colors.white : theme.colors.gray[900],
                  letterSpacing: "-0.025em",
                  marginBottom: theme.spacing(2),
                }}
              >
                Create Account
              </h2>
              <p style={{ color: textMuted }}>
                Already a member?{" "}
                <Link
                  href="/login"
                  style={{
                    fontWeight: "bold",
                    color: isDark
                      ? theme.colors.brand[400]
                      : theme.colors.brand[700],
                    textDecoration: "none",
                    borderBottom: `1px solid ${theme.colors.brand[300]}`,
                    paddingBottom: "2px",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[500])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isDark
                      ? theme.colors.brand[400]
                      : theme.colors.brand[700])
                  }
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Registration Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(4),
              }}
            >
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(1),
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    color: textMuted,
                  }}
                >
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={18}
                    style={{
                      position: "absolute",
                      left: theme.spacing(3),
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: textMuted,
                    }}
                  />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(10)}`,
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius["2xl"],
                      color: textColor,
                      fontSize: theme.fontSize.sm,
                      outline: "none",
                      transition: theme.transition.DEFAULT,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        theme.colors.brand[500])
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = inputBorder)
                    }
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(1),
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    color: textMuted,
                  }}
                >
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={18}
                    style={{
                      position: "absolute",
                      left: theme.spacing(3),
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: textMuted,
                    }}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(10)}`,
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius["2xl"],
                      color: textColor,
                      fontSize: theme.fontSize.sm,
                      outline: "none",
                      transition: theme.transition.DEFAULT,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        theme.colors.brand[500])
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = inputBorder)
                    }
                    required
                  />
                </div>
              </div>

              {/* Password with eye toggle */}
              <div>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(1),
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    color: textMuted,
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={18}
                    style={{
                      position: "absolute",
                      left: theme.spacing(3),
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: textMuted,
                    }}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: `${theme.spacing(3)} ${theme.spacing(10)} ${theme.spacing(3)} ${theme.spacing(10)}`,
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius["2xl"],
                      color: textColor,
                      fontSize: theme.fontSize.sm,
                      outline: "none",
                      transition: theme.transition.DEFAULT,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        theme.colors.brand[500])
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = inputBorder)
                    }
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: theme.spacing(3),
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: textMuted,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password with eye toggle */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(1),
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    color: textMuted,
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={18}
                    style={{
                      position: "absolute",
                      left: theme.spacing(3),
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: textMuted,
                    }}
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: `${theme.spacing(3)} ${theme.spacing(10)} ${theme.spacing(3)} ${theme.spacing(10)}`,
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      borderRadius: theme.borderRadius["2xl"],
                      color: textColor,
                      fontSize: theme.fontSize.sm,
                      outline: "none",
                      transition: theme.transition.DEFAULT,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        theme.colors.brand[500])
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = inputBorder)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: theme.spacing(3),
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: textMuted,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
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
                    color: isDark
                      ? theme.colors.white
                      : theme.colors.rose[400],
                    fontSize: theme.fontSize.sm,
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Terms & Privacy */}
              <div
                style={{
                  backgroundColor: isDark
                    ? theme.colors.brand[900] + "4D"
                    : theme.colors.brand[50],
                  padding: theme.spacing(4),
                  borderRadius: theme.borderRadius["2xl"],
                  border: `1px solid ${borderColor}`,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: theme.spacing(3),
                }}
              >
                <ShieldCheck
                  size={18}
                  style={{
                    color: theme.colors.brand[600],
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                />
                <p
                  style={{
                    fontSize: "10px",
                    color: textMuted,
                    lineHeight: 1.625,
                    fontWeight: 500,
                  }}
                >
                  By signing up, you agree to our{" "}
                  <Link
                    href="/terms"
                    style={{
                      color: isDark
                        ? theme.colors.brand[200]
                        : theme.colors.brand[700],
                      textDecoration: "underline",
                    }}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    style={{
                      color: isDark
                        ? theme.colors.brand[200]
                        : theme.colors.brand[700],
                      textDecoration: "underline",
                    }}
                  >
                    Privacy Policy
                  </Link>
                  . We prioritize your data ownership.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: theme.spacing(2),
                  padding: `${theme.spacing(4)} ${theme.spacing(4)}`,
                  backgroundColor: isDark
                    ? theme.colors.brand[600]
                    : theme.colors.brand[900],
                  color: theme.colors.white,
                  borderRadius: theme.borderRadius["2xl"],
                  boxShadow: `0 20px 25px -5px ${
                    isDark
                      ? theme.colors.brand[600] + "33"
                      : theme.colors.brand[900] + "33"
                  }`,
                  fontWeight: "bold",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  transition: "all 0.2s",
                  marginTop: theme.spacing(4),
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
                {isLoading ? "Creating Account..." : "Create Account"}{" "}
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Bottom badges */}
            <div
              style={{
                marginTop: theme.spacing(12),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: theme.spacing(6),
                opacity: 0.4,
                filter: "grayscale(1)",
                transition: "all 0.5s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.filter = "grayscale(0)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.4";
                e.currentTarget.style.filter = "grayscale(1)";
              }}
            >
              <div
                style={{
                  width: "1px",
                  height: theme.spacing(6),
                  backgroundColor: isDark
                    ? theme.colors.brand[800]
                    : theme.colors.gray[300],
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ShieldCheck
                  size={20}
                  style={{
                    color: isDark ? theme.colors.white : theme.colors.brand[900],
                    marginBottom: theme.spacing(1),
                  }}
                />
                <span
                  style={{
                    fontSize: "8px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Secure
                </span>
              </div>
              <div
                style={{
                  width: "1px",
                  height: theme.spacing(6),
                  backgroundColor: isDark
                    ? theme.colors.brand[800]
                    : theme.colors.gray[300],
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Heart
                  size={20}
                  style={{
                    color: isDark ? theme.colors.white : theme.colors.brand[900],
                    marginBottom: theme.spacing(1),
                  }}
                />
                <span
                  style={{
                    fontSize: "8px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Family
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;