// app/signup/page.tsx (or pages/signup.tsx)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowRight,
  ChevronLeft,
  Heart,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import theme from "../../theme"; // <-- imported design system

// ========== RESPONSIVE & DARK MODE HOOKS ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
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

  // Choose light/dark palette from theme
  const palette = isDark ? theme.dark : theme.light;

  // Derived styles using theme primitives
  const bgColor = palette.bg;
  const textColor = palette.text;
  const textMuted = palette.textMuted;
  const inputBg = palette.bgInput;
  const inputBorder = palette.border;
  const cardBg = palette.bgCard;
  const borderColor = palette.border; // ✅ FIXED: use 'border' instead of 'borderSubtle'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
        "/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("auth", "true");
        login(email);
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
        {/* Decorative Blur Blobs with brand green & stone tints */}
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
              : theme.colors.stone[200] + "4D",
            borderRadius: theme.borderRadius.full,
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />

        {/* Right Side - Immersive Image (visible on lg screens) */}
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
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
                      transition: theme.transition.fast,
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

              <div
                style={{
                  animation: "fade-in-up 0.6s ease-out",
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing(2),
                    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${theme.colors.white}33`,
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
                    backgroundColor: theme.colors.amber[400],
                    borderRadius: theme.borderRadius.full,
                    marginLeft: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Left Side - Form */}
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
                    backgroundColor: theme.colors.brand[500],
                    borderRadius: theme.borderRadius.xl,
                    ...flexCenter,
                    color: theme.colors.white,
                    fontFamily: theme.fontFamily.serif,
                    fontWeight: "bold",
                    fontSize: theme.fontSize["2xl"],
                    boxShadow: theme.boxShadow.green,
                    transition: theme.transition.fast,
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
                    fontFamily: theme.fontFamily.display,
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
                  color: textColor,
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
                    color: theme.colors.brand[500],
                    textDecoration: "none",
                    borderBottom: `1px solid ${theme.colors.brand[300]}`,
                    paddingBottom: "2px",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[400])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[500])
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

              {/* Password */}
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
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
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
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
                  }}
                >
                  {error}
                </div>
              )}

              {/* Terms & Privacy */}
              <div
                style={{
                  backgroundColor: isDark
                    ? theme.dark.bgCard + "80"
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
                      color: theme.colors.brand[500],
                      textDecoration: "underline",
                    }}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    style={{
                      color: theme.colors.brand[500],
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
                  backgroundColor: theme.colors.brand[500],
                  color: theme.colors.white,
                  borderRadius: theme.borderRadius["2xl"],
                  boxShadow: theme.boxShadow.green,
                  fontWeight: "bold",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  transition: theme.transition.DEFAULT,
                  marginTop: theme.spacing(4),
                }}
                onMouseEnter={(e) => {
                  if (!isLoading)
                    e.currentTarget.style.backgroundColor = theme.colors.brand[600];
                }}
                onMouseLeave={(e) => {
                  if (!isLoading)
                    e.currentTarget.style.backgroundColor = theme.colors.brand[500];
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
                transition: theme.transition.slow,
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
                  backgroundColor: borderColor,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ShieldCheck
                  size={20}
                  style={{ color: textColor, marginBottom: theme.spacing(1) }}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Heart
                  size={20}
                  style={{ color: textColor, marginBottom: theme.spacing(1) }}
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