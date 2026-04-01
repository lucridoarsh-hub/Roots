"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

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

// ========== DARK MODE HOOK ==========
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

// ========== COMPONENT ==========
const ResetPassword: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const isDark = useDarkMode();

  // Extract token from dynamic route
  const token = params?.token as string;

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dynamic colors based on dark mode
  const bgColor = isDark ? theme.colors.brand[950] : theme.colors.gray[50];
  const cardBg = isDark ? theme.colors.brand[900] : theme.colors.white;
  const textColor = isDark ? theme.colors.white : theme.colors.gray[900];
  const textMuted = isDark ? theme.colors.brand[400] : theme.colors.gray[500];
  const inputBg = isDark
    ? theme.colors.brand[900] + "80"
    : theme.colors.gray[50];
  const inputBorder = isDark ? theme.colors.brand[700] : theme.colors.gray[200];
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.gray[200];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `/api/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(response.data.message || "Reset failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        padding: theme.spacing(4),
        transition: `background-color 500ms ${theme.transition.DEFAULT}`,
      }}
    >
      <div
        style={{
          backgroundColor: cardBg,
          borderRadius: theme.borderRadius["3xl"],
          boxShadow: theme.boxShadow["2xl"],
          maxWidth: "28rem",
          width: "100%",
          padding: `${theme.spacing(10)} ${theme.spacing(8)}`,
          border: `1px solid ${borderColor}`,
        }}
      >
        <h1
          style={{
            fontSize: theme.fontSize["3xl"],
            fontWeight: "bold",
            color: textColor,
            marginBottom: theme.spacing(2),
            letterSpacing: "-0.025em",
          }}
        >
          Reset Password
        </h1>
        <p
          style={{
            fontSize: theme.fontSize.sm,
            color: textMuted,
            marginBottom: theme.spacing(8),
          }}
        >
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div style={{ marginBottom: theme.spacing(4) }}>
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
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: `${theme.spacing(3)} ${theme.spacing(10)} ${theme.spacing(3)} ${theme.spacing(4)}`,
                  backgroundColor: inputBg,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: theme.borderRadius["2xl"],
                  color: textColor,
                  fontSize: theme.fontSize.sm,
                  outline: "none",
                  transition: theme.transition.DEFAULT,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = theme.colors.brand[500])
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div style={{ marginBottom: theme.spacing(4) }}>
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
              Confirm New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: `${theme.spacing(3)} ${theme.spacing(10)} ${theme.spacing(3)} ${theme.spacing(4)}`,
                  backgroundColor: inputBg,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: theme.borderRadius["2xl"],
                  color: textColor,
                  fontSize: theme.fontSize.sm,
                  outline: "none",
                  transition: theme.transition.DEFAULT,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = theme.colors.brand[500])
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Messages */}
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
                marginBottom: theme.spacing(4),
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                backgroundColor: isDark
                  ? theme.colors.brand[800] + "80"
                  : theme.colors.brand[50],
                border: `1px solid ${theme.colors.brand[400]}`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing(3),
                color: isDark ? theme.colors.white : theme.colors.brand[700],
                fontSize: theme.fontSize.sm,
                textAlign: "center",
                marginBottom: theme.spacing(4),
              }}
            >
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
              backgroundColor: isDark
                ? theme.colors.brand[600]
                : theme.colors.brand[900],
              color: theme.colors.white,
              borderRadius: theme.borderRadius["2xl"],
              fontWeight: "bold",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: theme.transition.DEFAULT,
              marginTop: theme.spacing(2),
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[500]
                  : theme.colors.brand[800];
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[600]
                  : theme.colors.brand[900];
              }
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login Link */}
        <div style={{ textAlign: "center", marginTop: theme.spacing(6) }}>
          <Link
            href="/login"
            style={{
              fontSize: theme.fontSize.sm,
              color: textMuted,
              textDecoration: "underline",
              transition: theme.transition.DEFAULT,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = theme.colors.brand[500])
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = textMuted)
            }
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;