"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Mail,
  Phone,
  Send,
  Heart,
  LayoutDashboard,
  ArrowRight,
  CheckCircle,
  Info,
  Menu,
  X,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../constants";
import Footer from "../Footer";

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
    },
    amber: { 400: "#fbbf24" },
    green: { 600: "#16a34a" },
    red: { 600: "#dc2626" },
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
  transition: { DEFAULT: "all 0.3s ease" },
  zIndex: { 0: 0, 10: 10, 20: 20, 30: 30, 40: 40, 50: 50, 60: 60 },
};

// ========== RESPONSIVE HOOK ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
};

// ========== MODAL COMPONENT ==========
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, type }) => {
  if (!isOpen) return null;

  const icon =
    type === "success" ? (
      <CheckCircle size={48} color={theme.colors.green[600]} />
    ) : (
      <AlertCircle size={48} color={theme.colors.red[600]} />
    );

const bgColor = type === "success" ? theme.colors.green[600] : theme.colors.red[600];
const borderColor = type === "success" ? theme.colors.green[600] : theme.colors.red[600];

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: theme.zIndex[60],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing(4),
        }}
        onClick={onClose}
      >
        <div
          style={{
            maxWidth: "28rem",
            width: "100%",
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius["2xl"],
            boxShadow: theme.boxShadow["2xl"],
            overflow: "hidden",
            animation: "fade-in-up 0.3s ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: theme.spacing(6),
              textAlign: "center",
              borderBottom: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
            }}
          >
            <div style={{ marginBottom: theme.spacing(4) }}>{icon}</div>
            <h3
              style={{
                fontSize: theme.fontSize.xl,
                fontWeight: "bold",
          color: type === "success" ? theme.colors.green[600] : theme.colors.red[600],
                marginBottom: theme.spacing(2),
              }}
            >
              {title}
            </h3>
            <p style={{ color: theme.colors.gray[600] }}>{message}</p>
          </div>
          <div style={{ padding: theme.spacing(4), textAlign: "center" }}>
            <button
              onClick={onClose}
              style={{
                padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
                backgroundColor: type === "success" ? theme.colors.green[600] : theme.colors.red[600],
                color: theme.colors.white,
                border: "none",
                borderRadius: theme.borderRadius.full,
                fontSize: theme.fontSize.sm,
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
               type === "success" ? theme.colors.green[600] : theme.colors.red[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  type === "success" ? theme.colors.green[600] : theme.colors.red[600];
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

// ========== CONTACT PAGE ==========
const Contact: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
const flexBetween: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const flexCenter: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("roots_app_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDynamicSettings({
          appName: parsed.appName || APP_NAME,
          logoUrl: parsed.logoUrl || "",
          announcement: parsed.announcement || "",
          maintenanceMode: parsed.maintenanceMode || false,
        });
      } catch (error) {
        console.error("Failed to parse settings", error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setModalOpen(false);
    // Reset form status if needed
    if (formStatus === "success" || formStatus === "error") {
      setFormStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");

    try {
      const response = await axios.post("/api/auth/email-quary", formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setModalType("success");
        setModalTitle("Message Sent!");
        setModalMessage("Thank you for reaching out. We'll get back to you soon.");
        setModalOpen(true);
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      setFormStatus("error");
      setModalType("error");
      setModalTitle("Something went wrong");
      setModalMessage("We couldn't send your message. Please try again later.");
      setModalOpen(true);
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
          <Info
            size={64}
            color={theme.colors.amber[400]}
            style={{ margin: "0 auto", marginBottom: theme.spacing(6) }}
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
            {dynamicSettings.appName} is currently undergoing scheduled improvements. We'll be back shortly!
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

  // Conditional colors for navigation (light mode only, but consistent)
  const navBg = "rgba(255,255,255,0.9)";
  const navBorder = theme.colors.gray[100];
  const textSecondary = theme.colors.gray[600];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.white,
        fontFamily: theme.fontFamily.sans,
        color: theme.colors.gray[800],
      }}
    >
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(3deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
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
            position: "sticky",
            top: 0,
            zIndex: theme.zIndex[60],
          }}
        >
          <Info size={14} />
          {dynamicSettings.announcement}
        </div>
      )}

      {/* ===== NAVIGATION ===== */}
      <nav
        style={{
          position: "fixed",
          width: "100%",
          zIndex: theme.zIndex[50],
          backgroundColor: navBg,
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${navBorder}`,
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
        <Link
  href="/"
  style={{
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    textDecoration: "none",
  }}
>
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
</Link>

          {isMdUp && (
            <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(5) }}>
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Success Stories", href: "/success-stories" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    color: textSecondary,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: theme.colors.brand[700],
                  textDecoration: "none",
                }}
              >
                Contact
              </Link>
            </div>
          )}

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
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(1.5),
                }}
              >
                <LayoutDashboard size={isMdUp ? 16 : 14} />
                {isMdUp ? "Dashboard" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: theme.fontSize.sm,
                    fontWeight: 500,
                    color: textSecondary,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: isMdUp ? "inline" : "none",
                  }}
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
                  }}
                >
                  {isMdUp ? "Get Started" : "Sign Up"}
                </Link>
              </>
            )}
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
              borderBottom: `1px solid ${navBorder}`,
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
                color: textSecondary,
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: 500,
                color: textSecondary,
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/success-stories"
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: 500,
                color: textSecondary,
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Success Stories
            </Link>
            <Link
              href="/blog"
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: 500,
                color: textSecondary,
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: 500,
                color: theme.colors.brand[700],
                textDecoration: "none",
                padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                transition: "background-color 0.2s",
                borderRadius: theme.borderRadius.md,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <header
        style={{
          paddingTop: isMdUp ? theme.spacing(48) : theme.spacing(32),
          paddingBottom: isMdUp ? theme.spacing(24) : theme.spacing(16),
          background: `linear-gradient(135deg, ${theme.colors.brand[50]} 0%, ${theme.colors.white} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
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
              backgroundColor: theme.colors.brand[100],
              border: `1px solid ${theme.colors.brand[200]}`,
              borderRadius: theme.borderRadius.full,
              color: theme.colors.brand[700],
              fontSize: theme.fontSize.xs,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: theme.spacing(5),
            }}
          >
            <Heart size={12} />
            Get in Touch
          </div>

          <h1
            style={{
              fontSize: isMdUp ? theme.fontSize["6xl"] : theme.fontSize["4xl"],
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              color: theme.colors.brand[900],
              marginBottom: theme.spacing(4),
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
            }}
          >
            We'd Love to Hear
            <br />
            <span
              style={{
                color: "transparent",
                backgroundClip: "text",
                backgroundImage: `linear-gradient(to right, ${theme.colors.brand[600]}, ${theme.colors.brand[400]})`,
                fontStyle: "italic",
              }}
            >
              From You
            </span>
          </h1>

          <p
            style={{
              fontSize: isMdUp ? theme.fontSize.xl : theme.fontSize.lg,
              color: theme.colors.gray[600],
              maxWidth: "48rem",
              margin: "0 auto",
              lineHeight: 1.625,
            }}
          >
            Have questions about preserving your family's legacy? Want to share your story?
            Our team is here to help you every step of the way.
          </p>
        </div>
      </header>

      {/* ===== CONTACT INFO CARDS ===== */}
      <section
        style={{
          padding: `${isMdUp ? theme.spacing(24) : theme.spacing(16)} 0`,
          backgroundColor: theme.colors.white,
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: `0 ${theme.spacing(4)}` }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: theme.spacing(6),
            }}
          >
            {[
              {
                icon: Mail,
                title: "Email",
                content: "support@enduringroots.in",
                sub: "We reply within 24 hours",
              },
              {
                icon: Phone,
                title: "Phone",
                content: "+91 9818394549",
                sub: "Mon-Fri, 9am-6pm IST",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    flex: isMdUp ? "0 0 calc(50% - 2rem)" : "0 0 100%",
                    maxWidth: isMdUp ? "320px" : "100%",
                    padding: theme.spacing(8),
                    backgroundColor: theme.colors.white,
                    borderRadius: theme.borderRadius["3xl"],
                    border: `1px solid ${theme.colors.gray[100]}`,
                    textAlign: "center",
                    boxShadow: theme.boxShadow.sm,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = theme.boxShadow.xl;
                    e.currentTarget.style.borderColor = theme.colors.brand[500];
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = theme.boxShadow.sm;
                    e.currentTarget.style.borderColor = theme.colors.gray[100];
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: theme.spacing(16),
                      height: theme.spacing(16),
                      backgroundColor: theme.colors.brand[50],
                      borderRadius: theme.borderRadius.full,
                      ...flexCenter,
                      margin: "0 auto",
                      marginBottom: theme.spacing(5),
                      color: theme.colors.brand[600],
                    }}
                  >
                    <Icon size={32} />
                  </div>
                  <h3
                    style={{
                      fontSize: theme.fontSize.xl,
                      fontWeight: "bold",
                      color: theme.colors.gray[900],
                      marginBottom: theme.spacing(2),
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: theme.fontSize.lg,
                      color: theme.colors.gray[800],
                      marginBottom: theme.spacing(1),
                    }}
                  >
                    {item.content}
                  </p>
                  <p style={{ color: theme.colors.gray[500] }}>{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section
        style={{
          padding: `${isMdUp ? theme.spacing(24) : theme.spacing(16)} 0`,
          backgroundColor: theme.colors.gray[50],
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: `0 ${theme.spacing(4)}` }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: theme.spacing(10) }}>
              <span
                style={{
                  color: theme.colors.brand[600],
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: theme.fontSize.xs,
                  display: "block",
                  marginBottom: theme.spacing(3),
                }}
              >
                Send a Message
              </span>
              <h2
                style={{
                  fontSize: isMdUp ? theme.fontSize["4xl"] : theme.fontSize["3xl"],
                  fontFamily: theme.fontFamily.serif,
                  fontWeight: "bold",
                  color: theme.colors.brand[900],
                  marginBottom: theme.spacing(4),
                  lineHeight: 1.2,
                }}
              >
                Let's Start a Conversation
              </h2>
              <p
                style={{
                  color: theme.colors.gray[500],
                  fontSize: theme.fontSize.base,
                  lineHeight: 1.6,
                }}
              >
                Fill in the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: theme.spacing(5) }}
            >
              <div>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(2),
                    fontWeight: 500,
                    color: theme.colors.gray[700],
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: theme.spacing(4),
                    border: `1px solid ${theme.colors.gray[200]}`,
                    borderRadius: theme.borderRadius.xl,
                    fontSize: theme.fontSize.base,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(2),
                    fontWeight: 500,
                    color: theme.colors.gray[700],
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: theme.spacing(4),
                    border: `1px solid ${theme.colors.gray[200]}`,
                    borderRadius: theme.borderRadius.xl,
                    fontSize: theme.fontSize.base,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(2),
                    fontWeight: 500,
                    color: theme.colors.gray[700],
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: theme.spacing(4),
                    border: `1px solid ${theme.colors.gray[200]}`,
                    borderRadius: theme.borderRadius.xl,
                    fontSize: theme.fontSize.base,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(2),
                    fontWeight: 500,
                    color: theme.colors.gray[700],
                  }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: theme.spacing(4),
                    border: `1px solid ${theme.colors.gray[200]}`,
                    borderRadius: theme.borderRadius.xl,
                    fontSize: theme.fontSize.base,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === "sending" || formStatus === "success"}
                style={{
                  padding: `${theme.spacing(4)} ${theme.spacing(8)}`,
                  backgroundColor:
                    formStatus === "success" ? theme.colors.green[600] : theme.colors.brand[900],
                  color: theme.colors.white,
                  fontSize: theme.fontSize.lg,
                  fontWeight: 600,
                  borderRadius: theme.borderRadius.full,
                  border: "none",
                  cursor: formStatus === "sending" ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.spacing(2),
                  width: "100%",
                }}
              >
                {formStatus === "sending" && "Sending..."}
                {formStatus === "success" && (
                  <>
                    <CheckCircle size={20} />
                    Sent!
                  </>
                )}
                {formStatus === "idle" && (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
                {formStatus === "error" && "Try Again"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section
        style={{
          padding: `${isMdUp ? theme.spacing(24) : theme.spacing(16)} 0`,
          backgroundColor: theme.colors.white,
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: `0 ${theme.spacing(4)}` }}>
          <div style={{ textAlign: "center", marginBottom: theme.spacing(12) }}>
            <span
              style={{
                color: theme.colors.brand[600],
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: theme.fontSize.xs,
                display: "block",
                marginBottom: theme.spacing(3),
              }}
            >
              Quick Answers
            </span>
            <h2
              style={{
                fontSize: isMdUp ? theme.fontSize["4xl"] : theme.fontSize["3xl"],
                fontFamily: theme.fontFamily.serif,
                fontWeight: "bold",
                color: theme.colors.brand[900],
                marginBottom: theme.spacing(4),
              }}
            >
              Frequently Asked Questions
            </h2>
            <p style={{ color: theme.colors.gray[600], maxWidth: "36rem", margin: "0 auto" }}>
              Can't find what you're looking for? Just drop us a message.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMdUp ? "repeat(2, 1fr)" : "1fr",
              gap: theme.spacing(6),
            }}
          >
            {[
              {
                q: "How quickly do you respond?",
                a: "We aim to reply to all inquiries within 24 hours on business days.",
              },
              {
                q: "Can I schedule a demo?",
                a: "Absolutely! Just mention it in your message and we'll set up a time that works for you.",
              },
              {
                q: "Do you offer support in regional languages?",
                a: "Yes, our team speaks Hindi, Tamil, Bengali, and more. Let us know your preference.",
              },
              {
                q: "Is there a phone number I can call?",
                a: "We prioritize email for detailed support, but you can request a call back in your message.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                style={{
                  padding: theme.spacing(6),
                  backgroundColor: theme.colors.gray[50],
                  borderRadius: theme.borderRadius["2xl"],
                }}
              >
                <h3
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: "bold",
                    color: theme.colors.gray[900],
                    marginBottom: theme.spacing(2),
                  }}
                >
                  {faq.q}
                </h3>
                <p style={{ color: theme.colors.gray[600] }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section
        style={{
          padding: `${isMdUp ? theme.spacing(20) : theme.spacing(12)} ${theme.spacing(4)}`,
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "3.5rem",
              backgroundColor: theme.colors.brand[900],
              color: theme.colors.white,
              overflow: "hidden",
              boxShadow: theme.boxShadow["2xl"],
              padding: isMdUp ? theme.spacing(20) : theme.spacing(12),
              textAlign: "center",
            }}
          >
            <div style={{ position: "relative", zIndex: 10 }}>
              <h2
                style={{
                  fontSize: isMdUp ? theme.fontSize["5xl"] : theme.fontSize["3xl"],
                  fontFamily: theme.fontFamily.serif,
                  fontWeight: "bold",
                  marginBottom: theme.spacing(5),
                  lineHeight: 1.2,
                }}
              >
                Ready to start your family's legacy?
              </h2>
              <p
                style={{
                  fontSize: isMdUp ? theme.fontSize.xl : theme.fontSize.lg,
                  color: "rgba(219,234,254,0.8)",
                  maxWidth: "36rem",
                  margin: "0 auto",
                  marginBottom: theme.spacing(8),
                  lineHeight: 1.625,
                }}
              >
                Join thousands of families preserving their history with {dynamicSettings.appName}.
              </p>
              <Link
                href="/signup"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: theme.spacing(3),
                  padding: `${theme.spacing(4)} ${theme.spacing(8)}`,
                  backgroundColor: theme.colors.amber[400],
                  color: theme.colors.brand[900],
                  fontSize: theme.fontSize.lg,
                  fontWeight: 900,
                  borderRadius: theme.borderRadius.full,
                  textDecoration: "none",
                }}
              >
                Start Your Story
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ===== MODAL ===== */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default Contact;