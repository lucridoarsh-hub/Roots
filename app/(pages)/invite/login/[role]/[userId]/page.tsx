"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Heart,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import theme from "@/app/theme"; // <-- Imported external theme (green brand)

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
const InviteLoginUserPage: React.FC = () => {
  const isLgUp = useMediaQuery("(min-width: 1024px)");
  const isDark = useDarkMode();
  const router = useRouter();
  const params = useParams();
  const { login } = useAuth();

  // Extract role and userId from dynamic route
  const role = params?.role as string;
  const userId = params?.userId as string;

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Theme-based dynamic colors
  const bgColor = isDark ? theme.dark.bg : theme.light.bg;
  const textColor = isDark ? theme.dark.text : theme.light.text;
  const borderColor = isDark ? theme.dark.border : theme.light.border;
  const textMuted = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const inputBg = isDark ? theme.dark.bgInput : theme.light.bgInput;
  const inputBorder = isDark ? theme.dark.borderSubtle : theme.light.border;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (!role || !userId) {
      setError("Invalid invitation link");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/auth/invitation-login/${role}/${userId}`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (response.data.user?.username) {
          localStorage.setItem("username", response.data.user.username);
          localStorage.setItem("auth", "true");
        }
        login(email);
        router.push("/dashboard");
      } else {
        setError(response.data.message || "Login failed");
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
      {/* Global styles for animations */}
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
            left: "-10%",
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
            right: "-10%",
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

        {/* Left Side - Visible only on lg screens */}
        {isLgUp && (
          <div
            style={{
              display: "flex",
              width: "55%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Image */}
            <div
              style={{
                ...absoluteFill,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1470173274384-c4e8e2f9ea4c?q=80&w=2550&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 10000ms linear",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            {/* Overlay 1: blend multiply */}
            <div
              style={{
                ...absoluteFill,
                backgroundColor: theme.colors.brand[900],
                opacity: 0.6,
                mixBlendMode: "multiply",
              }}
            />
            {/* Overlay 2: gradient */}
            <div
              style={{
                ...absoluteFill,
                background: `linear-gradient(to top right, ${theme.colors.brand[950]}, ${theme.colors.brand[900]}66, transparent)`,
              }}
            />

            {/* Content */}
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
                    (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")
                  }
                >
                  <ChevronLeft size={20} />
                </div>
                <span style={{ fontWeight: 500, letterSpacing: "0.025em" }}>
                  Back to Home
                </span>
              </Link>

              <div style={{ animation: "fade-in-up 0.6s ease-out" }}>
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
                  <Sparkles size={12} color={theme.colors.amber[300]} />
                  <span>You're invited!</span>
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
                  Sign in as a <br />
                  <span
                    style={{
                      fontStyle: "italic",
                      color: theme.colors.brand[200],
                    }}
                  >
                    {role}
                  </span>
                </h1>
                <p
                  style={{
                    fontSize: theme.fontSize.xl,
                    color: "rgba(219,234,254,0.8)",
                    lineHeight: 1.625,
                    maxWidth: "28rem",
                    fontWeight: 300,
                  }}
                >
                  You've been invited to join a family circle.
                </p>
                <div
                  style={{
                    marginTop: theme.spacing(4),
                    height: "4px",
                    width: theme.spacing(20),
                    backgroundColor: theme.colors.brand[400],
                    borderRadius: theme.borderRadius.full,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Side - Form */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
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
                      : theme.colors.brand[500],
                    borderRadius: theme.borderRadius.xl,
                    ...flexCenter,
                    color: theme.colors.white,
                    fontFamily: theme.fontFamily.serif,
                    fontWeight: "bold",
                    fontSize: theme.fontSize["2xl"],
                    boxShadow: theme.boxShadow.green,
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
                    color: isDark ? theme.dark.text : theme.colors.brand[950],
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
                  color: textColor,
                  letterSpacing: "-0.025em",
                  marginBottom: theme.spacing(2),
                }}
              >
                Sign in to Accept Invitation
              </h2>
              <p style={{ color: textMuted }}>
                You're joining as{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: isDark
                      ? theme.colors.brand[400]
                      : theme.colors.brand[700],
                  }}
                >
                  {role}
                </span>
                . New here?{" "}
                <Link
                  href={`/invite/register/${role}/${userId}`}
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
                  Create an account
                </Link>
              </p>
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(4),
              }}
            >
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

              {/* Terms & Privacy */}
              <div
                style={{
                  backgroundColor: isDark
                    ? theme.dark.bgCard
                    : theme.colors.brand[50],
                  padding: theme.spacing(4),
                  borderRadius: theme.borderRadius["2xl"],
                  border: `1px solid ${borderColor}`,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: theme.spacing(3),
                  marginTop: theme.spacing(2),
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
                  By signing in, you agree to our{" "}
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
                    : theme.colors.brand[500],
                  color: theme.colors.white,
                  borderRadius: theme.borderRadius["2xl"],
                  boxShadow: isDark ? theme.boxShadow.green : theme.boxShadow.greenLg,
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
                      : theme.colors.brand[600];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = isDark
                      ? theme.colors.brand[600]
                      : theme.colors.brand[500];
                  }
                }}
              >
                {isLoading ? "Signing in..." : "Accept Invitation & Sign In"}{" "}
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
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Sparkles
                  size={20}
                  style={{
                    color: isDark ? theme.dark.text : theme.colors.brand[900],
                    marginBottom: theme.spacing(1),
                  }}
                />
              </div>
              <div
                style={{
                  width: "1px",
                  height: theme.spacing(6),
                  backgroundColor: borderColor,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ShieldCheck
                  size={20}
                  style={{
                    color: isDark ? theme.dark.text : theme.colors.brand[900],
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
                  backgroundColor: borderColor,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Heart
                  size={20}
                  style={{
                    color: isDark ? theme.dark.text : theme.colors.brand[900],
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

export default InviteLoginUserPage;