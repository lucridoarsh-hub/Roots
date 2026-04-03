"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Clock, Users, HelpCircle, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { APP_NAME } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import theme from "../theme"; // <-- Imported external theme (green brand)

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
    { name: "Help", path: "/help", icon: HelpCircle },
  ];

  // Theme-based colors
  const sidebarBg = isDark ? theme.dark.bgCard : theme.colors.brand[900];
  const sidebarBorder = isDark ? theme.dark.border : theme.colors.brand[800];
  const textPrimary = isDark ? theme.dark.text : theme.colors.brand[100];
  const textSecondary = isDark ? theme.dark.textMuted : theme.colors.brand[300];
  const navActiveBg = isDark ? theme.colors.brand[800] : theme.colors.brand[700];
  const navActiveText = theme.colors.white;
  const navInactiveText = isDark ? theme.colors.brand[200] : theme.colors.brand[200];
  const navInactiveHoverBg = isDark ? "rgba(255,255,255,0.05)" : theme.colors.brand[800];
  const navInactiveHoverText = theme.colors.white;
  const logoutHoverBg = isDark ? "rgba(255,255,255,0.05)" : theme.colors.brand[800];

  // Hide on mobile
  if (!isMdUp) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "16rem",
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
            color: textPrimary,
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
          Where memories become a legacy
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

      {/* Logout */}
      <div
        style={{
          padding: theme.spacing(4),
          borderTop: `1px solid ${sidebarBorder}`,
        }}
      >
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