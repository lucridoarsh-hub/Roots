// app/contact/page.tsx (or pages/contact.tsx)
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

import { useAuth } from "../../../context/AuthContext";
import { APP_NAME } from "../../../constants";
import Footer from "../../components/Footer";
import theme from "../../theme"; // <-- imported design system

// ========== RESPONSIVE & DARK MODE HOOKS ==========
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
      <CheckCircle size={48} color={theme.colors.emerald[400]} />
    ) : (
      <AlertCircle size={48} color={theme.colors.rose[400]} />
    );

  const bgColor = type === "success" ? theme.colors.emerald[300] : theme.colors.rose[400];
  const borderColor = type === "success" ? theme.colors.emerald[300] : theme.colors.rose[400];
  const textColor = type === "success" ? theme.colors.emerald[300] : theme.colors.rose[400];
  const buttonBg = type === "success" ? theme.colors.emerald[300] : theme.colors.rose[400];
  const buttonHoverBg = type === "success" ? theme.colors.emerald[300] : theme.colors.rose[400];

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
          zIndex: 60,
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
                color: textColor,
                marginBottom: theme.spacing(2),
              }}
            >
              {title}
            </h3>
            <p style={{ color: theme.colors.stone[600] }}>{message}</p>
          </div>
          <div style={{ padding: theme.spacing(4), textAlign: "center" }}>
            <button
              onClick={onClose}
              style={{
                padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
                backgroundColor: buttonBg,
                color: theme.colors.white,
                border: "none",
                borderRadius: theme.borderRadius.full,
                fontSize: theme.fontSize.sm,
                fontWeight: 500,
                cursor: "pointer",
                transition: theme.transition.DEFAULT,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = buttonHoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = buttonBg;
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

// ========== CONTACT PAGE ==========
const Contact: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const isDark = useDarkMode();
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Choose light/dark palette from theme
  const palette = isDark ? theme.dark : theme.light;

  // Derived styles using theme primitives
  const bgPage = palette.bg;
  const textPrimary = palette.text;
  const textSecondary = palette.textMuted;
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const navBg = isDark
    ? theme.colors.brand[900] + "E6"
    : "rgba(255,255,255,0.9)";
  const navBorder = isDark ? theme.colors.brand[700] : theme.colors.stone[200];
  const linkHoverColor = isDark ? theme.colors.brand[300] : theme.colors.brand[600];
  const heroGradient = isDark
    ? `linear-gradient(135deg, ${theme.colors.brand[950]} 0%, ${theme.colors.brand[900]} 100%)`
    : `linear-gradient(135deg, ${theme.colors.brand[50]} 0%, ${theme.colors.white} 100%)`;
  const cardBg = palette.bgCard;
  const cardBorder = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const inputBg = palette.bgInput;
  const inputBorder = palette.border;
  const faqBg = isDark ? theme.colors.brand[800] : theme.colors.stone[100];
  const ctaBg = isDark ? theme.colors.brand[800] : theme.colors.brand[900];

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
            borderRadius: theme.borderRadius["3xl"],
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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgPage,
        fontFamily: theme.fontFamily.sans,
        color: textPrimary,
        transition: `background-color 500ms ${theme.transition.DEFAULT}`,
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
            zIndex: 60,
          }}
        >
          <Info size={14} style={{ animation: "pulse 1s infinite" }} />
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
        {["Home", "About", "Blog","Pricing", "Success Stories", "Contact"].map((label) => {
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
      {/* ===== HERO ===== */}
      <header
        style={{
          paddingTop: isMdUp ? theme.spacing(48) : theme.spacing(32),
          paddingBottom: isMdUp ? theme.spacing(24) : theme.spacing(16),
          background: heroGradient,
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
              backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.brand[100],
              border: `1px solid ${isDark ? theme.colors.brand[700] : theme.colors.brand[200]}`,
              borderRadius: theme.borderRadius.full,
              color: isDark ? theme.colors.brand[200] : theme.colors.brand[700],
              fontSize: theme.fontSize.xs,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: theme.spacing(5),
            }}
          >
            <Heart size={12} color={theme.colors.rose[400]} />
            Get in Touch
          </div>

          <h1
            style={{
              fontSize: isMdUp ? theme.fontSize["6xl"] : theme.fontSize["4xl"],
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              color: isDark ? theme.colors.white : theme.colors.brand[900],
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
                backgroundImage: `linear-gradient(to right, ${theme.colors.brand[400]}, ${theme.colors.brand[600]})`,
                fontStyle: "italic",
              }}
            >
              From You
            </span>
          </h1>

          <p
            style={{
              fontSize: isMdUp ? theme.fontSize.xl : theme.fontSize.lg,
              color: isDark ? theme.colors.stone[400] : theme.colors.stone[600],
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
          backgroundColor: bgPage,
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
          
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    flex: isMdUp ? "0 0 calc(50% - 2rem)" : "0 0 100%",
                    maxWidth: isMdUp ? "320px" : "100%",
                    padding: theme.spacing(8),
                    backgroundColor: cardBg,
                    borderRadius: theme.borderRadius["3xl"],
                    border: `1px solid ${cardBorder}`,
                    textAlign: "center",
                    boxShadow: theme.boxShadow.sm,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = theme.boxShadow.xl;
                    e.currentTarget.style.borderColor = theme.colors.brand[400];
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = theme.boxShadow.sm;
                    e.currentTarget.style.borderColor = cardBorder;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: theme.spacing(16),
                      height: theme.spacing(16),
                      backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.brand[50],
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
                      color: textPrimary,
                      marginBottom: theme.spacing(2),
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: theme.fontSize.lg,
                      color: textPrimary,
                      marginBottom: theme.spacing(1),
                    }}
                  >
                    {item.content}
                  </p>
                  <p style={{ color: textSecondary }}>{item.sub}</p>
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
          backgroundColor: isDark ? theme.colors.brand[950] : theme.colors.stone[50],
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
                  color: textPrimary,
                  marginBottom: theme.spacing(4),
                  lineHeight: 1.2,
                }}
              >
                Let's Start a Conversation
              </h2>
              <p
                style={{
                  color: textSecondary,
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
                    color: textSecondary,
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
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: theme.borderRadius.xl,
                    fontSize: theme.fontSize.base,
                    color: textPrimary,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: theme.transition.DEFAULT,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = theme.colors.brand[500])
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = inputBorder)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(2),
                    fontWeight: 500,
                    color: textSecondary,
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
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: theme.borderRadius.xl,
                    fontSize: theme.fontSize.base,
                    color: textPrimary,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: theme.transition.DEFAULT,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = theme.colors.brand[500])
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = inputBorder)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(2),
                    fontWeight: 500,
                    color: textSecondary,
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
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: theme.borderRadius.xl,
                    fontSize: theme.fontSize.base,
                    color: textPrimary,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: theme.transition.DEFAULT,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = theme.colors.brand[500])
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = inputBorder)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    marginBottom: theme.spacing(2),
                    fontWeight: 500,
                    color: textSecondary,
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
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: theme.borderRadius.xl,
                    fontSize: theme.fontSize.base,
                    color: textPrimary,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    transition: theme.transition.DEFAULT,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = theme.colors.brand[500])
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = inputBorder)
                  }
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === "sending" || formStatus === "success"}
                style={{
                  padding: `${theme.spacing(4)} ${theme.spacing(8)}`,
                  backgroundColor:
                    formStatus === "success" ? theme.colors.emerald[300] : theme.colors.brand[500],
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
                  transition: theme.transition.DEFAULT,
                  boxShadow: theme.boxShadow.green,
                }}
                onMouseEnter={(e) => {
                  if (formStatus !== "sending" && formStatus !== "success") {
                    e.currentTarget.style.backgroundColor = theme.colors.brand[600];
                  }
                }}
                onMouseLeave={(e) => {
                  if (formStatus !== "sending" && formStatus !== "success") {
                    e.currentTarget.style.backgroundColor = theme.colors.brand[500];
                  }
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
          backgroundColor: bgPage,
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
                color: textPrimary,
                marginBottom: theme.spacing(4),
              }}
            >
              Frequently Asked Questions
            </h2>
            <p style={{ color: textSecondary, maxWidth: "36rem", margin: "0 auto" }}>
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
                a: "Yes, our team speaks English, Hindi and Punjabi. Let us know your preference.",
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
                  backgroundColor: faqBg,
                  borderRadius: theme.borderRadius["2xl"],
                  border: `1px solid ${cardBorder}`,
                }}
              >
                <h3
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: "bold",
                    color: textPrimary,
                    marginBottom: theme.spacing(2),
                  }}
                >
                  {faq.q}
                </h3>
                <p style={{ color: textSecondary }}>{faq.a}</p>
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
              borderRadius: theme.borderRadius["3xl"],
              backgroundColor: ctaBg,
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
                  transition: theme.transition.DEFAULT,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.amber[500])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.amber[400])
                }
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