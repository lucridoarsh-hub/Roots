"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Clock, Users, HelpCircle, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { APP_NAME } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

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
  },
  borderRadius: {
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
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  transition: {
    DEFAULT: "all 0.2s ease",
  },
};

// ========== MEDIA QUERY HOOK ==========
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

// ========== DARK MODE DETERMINATION ==========
const useIsDark = () => {
  const { theme: themeMode } = useTheme();
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  if (themeMode === "dark") return true;
  if (themeMode === "light") return false;
  return systemDark; // system
};

// ========== STYLE UTILITIES ==========
const flexCenter = { display: "flex", alignItems: "center", justifyContent: "center" } as const;
const flexBetween = { display: "flex", alignItems: "center", justifyContent: "space-between" } as const;

// ========== COMPONENT ==========
const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const { theme: themeMode, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
  });

  const isDark = useIsDark();
  const isMdUp = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const saved = localStorage.getItem("roots_app_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDynamicSettings({
        appName: parsed.appName || APP_NAME,
        logoUrl: parsed.logoUrl || "",
      });
    }

    const handleStorage = () => {
      const updated = localStorage.getItem("roots_app_settings");
      if (updated) {
        const parsed = JSON.parse(updated);
        setDynamicSettings({
          appName: parsed.appName || APP_NAME,
          logoUrl: parsed.logoUrl || "",
        });
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Timeline", path: "/dashboard", icon: Clock },
    { name: "Family & Sharing", path: "/family", icon: Users },
    { name: "Help / FAQs", path: "/help", icon: HelpCircle },
  ];

  // Conditional colors based on dark mode
  const sidebarBg = isDark ? theme.colors.black : theme.colors.brand[900];
  const sidebarBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.brand[800];
  const textPrimary = isDark ? theme.colors.brand[100] : theme.colors.brand[100]; // keep light
  const textSecondary = isDark ? theme.colors.brand[300] : theme.colors.brand[300];
  const navActiveBg = isDark ? theme.colors.brand[800] : theme.colors.brand[700];
  const navActiveText = theme.colors.white;
  const navInactiveText = isDark ? theme.colors.brand[200] : theme.colors.brand[200];
  const navInactiveHoverBg = isDark ? "rgba(255,255,255,0.05)" : theme.colors.brand[800];
  const navInactiveHoverText = theme.colors.white;
  const themeToggleBg = isDark ? theme.colors.brand[900] : theme.colors.brand[950];
  const themeToggleActiveBg = isDark ? theme.colors.brand[700] : theme.colors.brand[700];
  const themeToggleActiveText = theme.colors.white;
  const themeToggleInactiveText = isDark ? theme.colors.brand[400] : theme.colors.brand[400];
  const themeToggleHoverText = isDark ? theme.colors.brand[200] : theme.colors.brand[200];
  const logoutHoverBg = isDark ? "rgba(255,255,255,0.05)" : theme.colors.brand[800];

  // Hide on mobile
  if (!isMdUp) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "16rem", // w-64
        backgroundColor: sidebarBg,
        color: textPrimary,
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        borderRight: `1px solid ${sidebarBorder}`,
        transition: `background-color 200ms ${theme.transition.DEFAULT}, border-color 200ms ${theme.transition.DEFAULT}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: theme.spacing(6),
          borderBottom: `1px solid ${sidebarBorder}`,
        }}
      >
        <h1
          style={{
            fontSize: theme.fontSize["2xl"],
            fontFamily: theme.fontFamily.serif,
            fontWeight: "bold",
            letterSpacing: "0.025em",
            color: isDark ? theme.colors.brand[100] : theme.colors.brand[100],
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(2),
          }}
        >
          {dynamicSettings.logoUrl ? (
            <img
              src={dynamicSettings.logoUrl}
              style={{
                width: theme.spacing(8),
                height: theme.spacing(8),
                borderRadius: theme.borderRadius.base,
                objectFit: "cover",
              }}
              alt="Logo"
            />
          ) : (
            <span>🌱</span>
          )}
          {dynamicSettings.appName}
        </h1>
        <p
          style={{
            fontSize: theme.fontSize.xs,
            color: textSecondary,
            marginTop: theme.spacing(2),
          }}
        >
          Because stories don't fade.
        </p>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(2),
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(3),
                padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
                borderRadius: theme.borderRadius.lg,
                transition: `all 200ms ${theme.transition.DEFAULT}`,
                textDecoration: "none",
                backgroundColor: isActive ? navActiveBg : "transparent",
                color: isActive ? navActiveText : navInactiveText,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = navInactiveHoverBg;
                  e.currentTarget.style.color = navInactiveHoverText;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = navInactiveText;
                }
              }}
            >
              <item.icon size={20} />
              <span style={{ fontWeight: 500 }}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle & Logout */}
      <div
        style={{
          padding: theme.spacing(4),
          borderTop: `1px solid ${sidebarBorder}`,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(4),
        }}
      >
        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(3),
            padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
            color: isDark ? theme.colors.brand[300] : theme.colors.brand[300],
            backgroundColor: "transparent",
            border: "none",
            borderRadius: theme.borderRadius.lg,
            cursor: "pointer",
            transition: theme.transition.DEFAULT,
            fontSize: theme.fontSize.sm,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = logoutHoverBg;
            e.currentTarget.style.color = theme.colors.white;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = isDark ? theme.colors.brand[300] : theme.colors.brand[300];
          }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500 }}>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;