// app/privacy-policy/page.tsx (or pages/privacy-policy.tsx)
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Info, AlertCircle, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { APP_NAME } from "../../../constants";
import Footer from "../../components/Footer";
import theme from "../../theme"; // <-- imported design system

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

// ========== STATIC PRIVACY POLICY CONTENT ==========
const privacySections = [
  {
    heading: "1. Introduction",
    content: `Welcome to Enduring Roots ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at https://enduringroots.in or use our digital heritage platform.

Please read this policy carefully. If you disagree with its terms, please discontinue use of our platform immediately.`,
  },
  {
    heading: "2. Information We Collect",
    content: `2.1 Personal Information You Provide
When you register an account or use our services, we may collect:
• Full name and email address
• Profile information and account credentials
• Billing and payment information (processed securely via third-party providers)
• Communications you send us via email or support channels

2.2 Content You Upload
As a heritage preservation platform, you may upload:
• Photographs, videos, and documents
• Names, dates, locations, and personal stories associated with your memories
• Information about family members and relatives

This content belongs to you. We store it solely to provide the services you have requested.

2.3 Automatically Collected Information
When you access our platform, we automatically collect:
• IP address and device identifiers
• Browser type and operating system
• Pages visited and time spent on the platform
• Referring URLs and clickstream data

This data is collected via cookies and similar tracking technologies to improve your experience and maintain platform security.`,
  },
  {
    heading: "3. How We Use Your Information",
    content: `We use the information we collect to:
1. Create and manage your account
2. Provide, operate, and improve the Enduring Roots platform
3. Process transactions and send related information
4. Enable collaboration features with family members you invite
5. Send service-related communications and important updates
6. Respond to your comments, questions, and support requests
7. Monitor and analyse usage to improve our services
8. Detect, prevent, and address technical issues and security threats
9. Comply with legal obligations`,
  },
  {
    heading: "4. How We Share Your Information",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:

4.1 Service Providers
We may share data with trusted third-party service providers who assist us in operating the platform, including cloud storage providers, payment processors, and analytics services. These providers are contractually obligated to keep your information confidential.

4.2 Family Collaboration
When you invite family members to collaborate on your heritage collection, those individuals will have access to the memories and content you choose to share with them. You control who is invited and what they can access.

4.3 Legal Requirements
We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).

4.4 Business Transfers
In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you before your information becomes subject to a different privacy policy.`,
  },
  {
    heading: "5. Data Security",
    content: `We implement bank-level security measures to protect your personal information and uploaded content. These measures include:
• End-to-end encryption for data in transit and at rest
• Secure HTTPS connections across the platform
• Regular security audits and vulnerability assessments
• Strict access controls for our team members

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.`,
  },
  {
    heading: "6. Data Retention",
    content: `We retain your personal information and uploaded content for as long as your account is active or as needed to provide our services. If you delete your account, we will delete or anonymise your information within 30 days, except where we are required by law to retain it longer.`,
  },
  {
    heading: "7. Your Rights",
    content: `Depending on your location, you may have the following rights regarding your personal data:
• Right to access — request a copy of the data we hold about you
• Right to rectification — request correction of inaccurate data
• Right to erasure — request deletion of your personal data
• Right to restrict processing — request that we limit how we use your data
• Right to data portability — receive your data in a portable format
• Right to object — object to our processing of your data

To exercise any of these rights, please contact us at support@enduringroots.in.`,
  },
  {
    heading: "8. Cookies",
    content: `We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, understand how you use our service, and improve our platform over time.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our platform may not function properly.`,
  },
  {
    heading: "9. Children's Privacy",
    content: `Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.`,
  },
  {
    heading: "10. Third-Party Links",
    content: `Our platform may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. We encourage you to review the privacy policy of every site you visit.`,
  },
  {
    heading: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date. We encourage you to review this Privacy Policy periodically for any changes.`,
  },
  {
    heading: "12. Contact Us",
    content: `If you have any questions about this Privacy Policy or our data practices, please contact us:

Email: support@enduringroots.in
Website: https://enduringroots.in
Brand: Enduring Roots`,
  },
];

const policyTitle = "Privacy Policy";
const effectiveDate = "March 25, 2026";

// ========== MAIN COMPONENT ==========
export default function PrivacyPolicy() {
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

  // Choose light/dark palette from theme
  const palette = isDark ? theme.dark : theme.light;

  // Derived styles using theme primitives
  const bgColor = palette.bg;
  const textPrimary = palette.text;
  const textSecondary = palette.textMuted;
  const navBg = isDark
    ? theme.colors.brand[900] + "E6"
    : "rgba(255,255,255,0.9)";
  const navBorder = isDark ? theme.colors.brand[700] : theme.colors.stone[200];
  const linkHoverColor = isDark ? theme.colors.brand[300] : theme.colors.brand[600];
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
            borderRadius: theme.borderRadius["3xl"],
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            maxWidth: "448px",
            boxShadow: theme.boxShadow["2xl"],
          }}
        >
          <AlertCircle
            size={64}
            color={theme.colors.amber[400]}
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
          />
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
        transition: `background-color 500ms ${theme.transition.DEFAULT}`,
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
            zIndex: 60,
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
          width: "220px",
          height: "220px",
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
      {/* Main content - privacy policy */}
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
            {policyTitle}
          </h1>
          <p
            style={{
              color: textSecondary,
              marginBottom: theme.spacing(8),
              fontSize: isMdUp ? theme.fontSize.base : theme.fontSize.sm,
            }}
          >
            Effective Date: {effectiveDate}
          </p>

          <div
            style={{
              color: textBody,
              display: "flex",
              flexDirection: "column",
              gap: sectionGap,
            }}
          >
            {privacySections.map((section, index) => (
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