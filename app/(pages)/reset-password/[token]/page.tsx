// app/reset-password/[token]/page.tsx (or pages/reset-password/[token].tsx)
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import theme from "../../../theme"; // <-- imported design system

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

  // Choose light/dark palette from theme
  const palette = isDark ? theme.dark : theme.light;

  // Derived styles using theme primitives
  const bgColor = palette.bg;
  const cardBg = palette.bgCard;
  const textColor = palette.text;
  const textMuted = palette.textMuted;
  const inputBg = palette.bgInput;
  const inputBorder = palette.border;
  const borderColor = palette.border;

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
            fontFamily: theme.fontFamily.serif,
          }}
        >
          Reset Password
        </h1>
        <p
          style={{
            fontSize: theme.fontSize.sm,
            color: textMuted,
            marginBottom: theme.spacing(8),
            fontFamily: theme.fontFamily.sans,
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
                fontFamily: theme.fontFamily.sans,
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
                  fontFamily: theme.fontFamily.sans,
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
                fontFamily: theme.fontFamily.sans,
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
                  fontFamily: theme.fontFamily.sans,
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
                backgroundColor: `${theme.colors.rose[400]}20`,
                border: `1px solid ${theme.colors.rose[400]}`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing(3),
                color: theme.colors.rose[400],
                fontSize: theme.fontSize.sm,
                textAlign: "center",
                marginBottom: theme.spacing(4),
                fontFamily: theme.fontFamily.sans,
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                backgroundColor: `${theme.colors.brand[400]}20`,
                border: `1px solid ${theme.colors.brand[400]}`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing(3),
                color: isDark ? theme.colors.white : theme.colors.brand[700],
                fontSize: theme.fontSize.sm,
                textAlign: "center",
                marginBottom: theme.spacing(4),
                fontFamily: theme.fontFamily.sans,
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
              backgroundColor: theme.colors.brand[500],
              color: theme.colors.white,
              borderRadius: theme.borderRadius["2xl"],
              fontWeight: "bold",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: theme.transition.DEFAULT,
              marginTop: theme.spacing(2),
              boxShadow: theme.boxShadow.green,
              fontFamily: theme.fontFamily.sans,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = theme.colors.brand[600];
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = theme.colors.brand[500];
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
              fontFamily: theme.fontFamily.sans,
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