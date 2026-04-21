"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Info, AlertCircle, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { APP_NAME } from "../../../constants";
import Footer from "../../components/Footer";
import theme from "../../theme"; // <-- Imported external theme (green brand)

// ========== HELPER HOOKS ==========
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
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

const flexBetween = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
} as const;

// ========== STATIC DISCLAIMER CONTENT ==========
const disclaimerSections = [
  {
    heading: "1. General Disclaimer",
    content:
      "The information and services provided on the Enduring Roots platform at https://enduringroots.in are for general informational and personal use only. While we make every effort to ensure the accuracy, reliability, and completeness of our platform and its features, we make no warranties or guarantees of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the platform or the information, products, services, or related graphics contained on the platform.",
  },
  {
    heading: "2. No Professional Advice",
    content:
      "Enduring Roots is a personal memory and heritage preservation platform. Nothing on this platform constitutes legal, financial, genealogical, archival, or any other form of professional advice. The features and tools provided are intended to assist with personal memory organisation and family storytelling only.\n\nFor specific legal, genealogical, or professional archival matters, we strongly recommend consulting a qualified professional.",
  },
  {
    heading: "3. User-Generated Content",
    content:
      "Enduring Roots is a platform that stores and displays content uploaded by users (\"User Content\"). We do not verify, endorse, or take responsibility for the accuracy, completeness, or legality of any User Content uploaded to the platform.\n\nAll User Content — including photographs, stories, names, dates, and personal histories — is provided solely by the user. We are not responsible for:\n- The accuracy of family histories, genealogical records, or personal narratives uploaded by users\n- Any inaccuracies, errors, or omissions in User Content\n- Any content that may infringe upon the privacy or rights of third parties\n- Content uploaded without the consent of the individuals depicted or described",
  },
  {
    heading: "4. Data and Content Preservation",
    content:
      "While Enduring Roots implements bank-level security and robust backup systems to protect your content, we cannot guarantee against data loss in all circumstances. We strongly recommend that users maintain independent backups of all original files, photographs, videos, and documents uploaded to the platform.\n\nEnduring Roots shall not be liable for any loss of data, content, or memories resulting from technical failures, force majeure events, cyberattacks, or any other circumstances beyond our reasonable control.",
  },
  {
    heading: "5. Third-Party Content and Links",
    content:
      "The Enduring Roots platform may contain links to external websites or reference third-party services. These links are provided for your convenience and informational purposes only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.\n\nThe inclusion of any link does not imply our endorsement of the linked site or its content.",
  },
  {
    heading: "6. Platform Availability",
    content:
      "We strive to ensure that Enduring Roots is available 24 hours a day, 7 days a week. However, we do not accept liability for the platform being temporarily unavailable due to technical issues, maintenance, upgrades, or circumstances beyond our control.\n\nWe reserve the right to suspend, modify, or discontinue any aspect of the platform at any time without prior notice.",
  },
  {
    heading: "7. Intellectual Property of Uploaded Content",
    content:
      "Users are solely responsible for ensuring they have the legal right to upload, store, and share all content they add to the platform. By uploading content, you confirm that you own the content or have obtained all necessary permissions, licences, and consents from the rightful owners.\n\nEnduring Roots accepts no liability for any intellectual property infringement resulting from content uploaded by users.",
  },
  {
    heading: "8. Family Collaboration Features",
    content:
      "The platform's collaboration features allow users to invite family members and share memories with others. By using these features, users accept full responsibility for:\n- The appropriateness of content shared with invited collaborators\n- Obtaining consent from individuals before sharing content about them\n- Managing access permissions to their heritage collections\n\nWe are not liable for any disputes, misunderstandings, or harm arising from the sharing of family content between collaborating users.",
  },
  {
    heading: "9. Limitation of Liability",
    content:
      "To the fullest extent permitted by applicable law, Enduring Roots accepts no liability for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, the platform, including but not limited to loss of data, loss of memories, or any other intangible losses.",
  },
  {
    heading: "10. Changes to This Disclaimer",
    content:
      "We reserve the right to update or modify this Disclaimer at any time without prior notice. Any changes will be effective immediately upon posting to the platform. Your continued use of the platform following the posting of changes constitutes your acceptance of those changes.",
  },
  {
    heading: "11. Contact Us",
    content:
      "If you have any questions or concerns about this Disclaimer, please contact us:\n\nEmail: support@enduringroots.in\nWebsite: https://enduringroots.in\nBrand: Enduring Roots",
  },
];

const disclaimerTitle = "Disclaimer";
const disclaimerEffectiveDate = "March 25, 2026";

// ========== MAIN COMPONENT ==========
export default function Disclaimer() {
  const { isAuthenticated } = useAuth();
  const isDark = useDarkMode();
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  // Local settings (announcement, logo, maintenance)
  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load local settings
  useEffect(() => {
    const saved = localStorage.getItem("roots_app_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDynamicSettings({
        appName: parsed.appName || APP_NAME,
        logoUrl: parsed.logoUrl || "",
        announcement: parsed.announcement || "",
        maintenanceMode: parsed.maintenanceMode || false,
      });
    }
  }, []);

  // Theme-based dynamic colors
  const bgColor = isDark ? theme.dark.bg : theme.light.bg;
  const navBg = isDark
    ? theme.colors.brand[900] + "E6"
    : "rgba(255,255,255,0.9)";
  const navBorder = isDark ? theme.dark.border : theme.light.border;
  const textSecondary = isDark ? theme.dark.textMuted : theme.light.textMuted;
  const linkHoverColor = isDark ? theme.colors.brand[300] : theme.colors.brand[700];
  const textPrimary = isDark ? theme.dark.text : theme.light.text;
  const textBody = isDark ? theme.colors.stone[300] : theme.colors.stone[700];
  const headingBorder = isDark ? theme.colors.brand[800] : theme.colors.brand[200];

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
          <AlertCircle
            size={64}
            color={theme.colors.brand[400]}
            style={{
              margin: "0 auto",
              marginBottom: theme.spacing(6),
              animation: "pulse 2s infinite",
            }}
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
            {dynamicSettings.appName} is currently undergoing scheduled
            improvements. We'll be back shortly!
          </p>
          <div
            style={{
              height: "4px",
              width: theme.spacing(24),
              backgroundColor: theme.colors.brand[500],
              margin: "0 auto",
              borderRadius: theme.borderRadius.full,
            }}
          ></div>
        </div>
      </div>
    );
  }

  // Responsive padding for main container
  const mainPaddingTop = isMdUp
    ? dynamicSettings.announcement
      ? theme.spacing(28)
      : theme.spacing(24)
    : dynamicSettings.announcement
    ? theme.spacing(20)
    : theme.spacing(16);

  const mainPaddingX = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const mainPaddingBottom = isMdUp ? theme.spacing(16) : theme.spacing(12);

  // Responsive font sizes
  const heading1Size = isMdUp ? theme.fontSize["4xl"] : theme.fontSize["3xl"];
  const heading2Size = isMdUp ? theme.fontSize["2xl"] : theme.fontSize["xl"];
  const sectionGap = isMdUp ? theme.spacing(8) : theme.spacing(6);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        transition: "background-color 0.2s ease",
        fontFamily: theme.fontFamily.sans,
      }}
    >
      {/* Global styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Announcement bar (if present) */}
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
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <Info size={14} style={{ animation: "pulse 1s infinite" }} />
          {dynamicSettings.announcement}
        </div>
      )}

      {/* Navigation bar */}
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

      {/* Main content - disclaimer */}
      <main style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: "896px",
            margin: "0 auto",
            padding: `${mainPaddingTop} ${mainPaddingX} ${mainPaddingBottom}`,
          }}
        >
          <h1
            style={{
              fontSize: heading1Size,
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              color: textPrimary,
              marginBottom: theme.spacing(4),
            }}
          >
            {disclaimerTitle}
          </h1>
          <p
            style={{
              color: textSecondary,
              marginBottom: theme.spacing(8),
              fontSize: isMdUp ? theme.fontSize.base : theme.fontSize.sm,
            }}
          >
            Last Updated: {disclaimerEffectiveDate}
          </p>

          <div
            style={{
              color: textBody,
              display: "flex",
              flexDirection: "column",
              gap: sectionGap,
            }}
          >
            {disclaimerSections.map((section, index) => (
              <section key={index}>
                <h2
                  style={{
                    fontSize: heading2Size,
                    fontWeight: "bold",
                    color: textPrimary,
                    marginBottom: theme.spacing(3),
                    borderBottom: `2px solid ${headingBorder}`,
                    paddingBottom: theme.spacing(2),
                  }}
                >
                  {section.heading}
                </h2>
                <p
                  style={{
                    lineHeight: 1.625,
                    whiteSpace: "pre-wrap",
                    fontSize: isMdUp ? theme.fontSize.base : theme.fontSize.sm,
                  }}
                >
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}