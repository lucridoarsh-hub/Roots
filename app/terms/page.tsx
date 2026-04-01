"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Info, AlertCircle, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../constants";
import Footer from "../Footer";

// ========== THEME (same as About page) ==========
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
    transparent: "transparent",
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
  transition: { DEFAULT: "all 0.3s ease" },
  zIndex: { 0: 0, 10: 10, 20: 20, 30: 30, 40: 40, 50: 50, 60: 60 },
};

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

// ========== STATIC TERMS OF SERVICE CONTENT ==========
const termsSections = [
  {
    heading: "1. Agreement to Terms",
    content: `By accessing or using the Enduring Roots platform at https://enduringroots.in, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not access or use our platform.

These Terms apply to all visitors, users, and others who access or use our service. By using Enduring Roots, you represent that you are at least 18 years of age and have the legal capacity to enter into a binding agreement.`,
  },
  {
    heading: "2. Description of Service",
    content: `Enduring Roots is a digital heritage and memory preservation platform that allows users to:
• Upload, store, and organise photographs, videos, and documents
• Add context, names, dates, and stories to preserved memories
• Create interactive timelines organised by life stages
• Collaborate with family members to build a shared family heritage
• Export and share memory books with loved ones`,
  },
  {
    heading: "3. User Accounts",
    content: `3.1 Account Creation
To use certain features of the platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.

3.2 Account Security
You are responsible for safeguarding the password you use to access the platform and for any activities or actions under your account. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorised use of your account.

3.3 Account Termination
We reserve the right to suspend or terminate your account at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, third parties, or the integrity of the platform.`,
  },
  {
    heading: "4. User Content",
    content: `4.1 Ownership
You retain full ownership of all content you upload to Enduring Roots, including photographs, videos, documents, and written descriptions ("User Content"). We do not claim ownership of your memories.

4.2 Licence to Us
By uploading User Content, you grant Enduring Roots a limited, non-exclusive, royalty-free licence to store, display, and process your content solely for the purpose of providing the platform's services to you.

4.3 Your Responsibilities
You represent and warrant that:
1. You own or have the necessary rights to upload the content
2. Your content does not violate the privacy, intellectual property, or other rights of any third party
3. Your content does not contain unlawful, harmful, defamatory, or obscene material
4. You have obtained appropriate consent to upload content featuring other individuals`,
  },
  {
    heading: "5. Acceptable Use",
    content: `You agree not to use the Enduring Roots platform to:
• Upload, share, or distribute content that is illegal, harmful, threatening, abusive, or defamatory
• Infringe upon the intellectual property or privacy rights of others
• Upload content depicting child exploitation or abuse of any kind
• Attempt to gain unauthorised access to any portion of the platform
• Use automated tools, bots, or scrapers to extract data from the platform
• Transmit viruses, malware, or any other malicious code
• Impersonate any person or entity or misrepresent your affiliation with any person or entity
• Engage in any activity that disrupts or interferes with the platform's functionality`,
  },
  {
    heading: "6. Subscription and Payments",
    content: `Certain features of Enduring Roots may require a paid subscription. By subscribing to a paid plan:
1. You agree to pay all fees in accordance with the pricing presented at the time of purchase
2. Subscription fees are billed in advance on a recurring basis (monthly or annually)
3. You authorise us to charge your designated payment method for all applicable fees
4. All fees are non-refundable except where required by applicable law or as stated in our refund policy
5. We reserve the right to change subscription pricing with 30 days' written notice`,
  },
  {
    heading: "7. Intellectual Property",
    content: `The Enduring Roots name, logo, platform design, code, and all content created by us (excluding User Content) are the intellectual property of Enduring Roots and are protected by applicable copyright, trademark, and other intellectual property laws.

You may not copy, modify, distribute, sell, or lease any part of our platform or included software without our prior written consent.`,
  },
  {
    heading: "8. Privacy",
    content: `Your use of the platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy at https://enduringroots.in/privacy-policy to understand our practices.`,
  },
  {
    heading: "9. Third-Party Services",
    content: `Our platform may integrate with or link to third-party services (such as payment processors or cloud storage providers). These third parties have their own terms and privacy policies, and your use of their services is subject to those terms. We are not responsible for the practices of third-party services.`,
  },
  {
    heading: "10. Disclaimers",
    content: `THE ENDURING ROOTS PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

We do not warrant that the platform will be uninterrupted, error-free, or completely secure. We are not responsible for any data loss that may occur, although we take every reasonable measure to prevent it.`,
  },
  {
    heading: "11. Limitation of Liability",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ENDURING ROOTS AND ITS DIRECTORS, EMPLOYEES, PARTNERS, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR LOSS OF GOODWILL.`,
  },
  {
    heading: "12. Indemnification",
    content: `You agree to indemnify and hold harmless Enduring Roots, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in connection with your use of the platform, your violation of these Terms, or your violation of any rights of another party.`,
  },
  {
    heading: "13. Modifications to Terms",
    content: `We reserve the right to modify these Terms at any time. We will provide notice of significant changes by email or by posting a notice on our platform. Your continued use of the platform after the effective date of the revised Terms constitutes your acceptance of the changes.`,
  },
  {
    heading: "14. Governing Law",
    content: `These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.`,
  },
  {
    heading: "15. Contact Us",
    content: `If you have any questions about these Terms of Service, please contact us:

Email: support@enduringroots.in
Website: https://enduringroots.in
Brand: Enduring Roots`,
  },
];

const termsTitle = "Terms of Service";
const termsEffectiveDate = "March 25, 2026";

// ========== MAIN COMPONENT ==========
export default function TermsOfService() {
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

  // Conditional colors
  const bgColor = isDark ? theme.colors.brand[950] : theme.colors.white;
  const navBg = isDark
    ? theme.colors.brand[900] + "E6"
    : "rgba(255,255,255,0.9)";
  const navBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const textSecondary = isDark ? theme.colors.brand[400] : theme.colors.gray[600];
  const linkHoverColor = isDark ? theme.colors.brand[200] : theme.colors.brand[700];
  const textPrimary = isDark ? theme.colors.white : theme.colors.gray[900];
  const textBody = isDark ? theme.colors.gray[300] : theme.colors.gray[700];
  const headingBorder = isDark ? theme.colors.brand[800] : theme.colors.brand[200];

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
            zIndex: theme.zIndex[60],
          }}
        >
          <Info size={14} style={{ animation: "pulse 1s infinite" }} />
          {dynamicSettings.announcement}
        </div>
      )}

      {/* Navigation bar */}
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
          {/* Logo */}
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
          {/* Desktop navigation links */}
          {isMdUp && (
            <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(5) }}>
              <Link
                href="/"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                Home
              </Link>
              <Link
                href="/about"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                About
              </Link>
              <Link
                href="/blog"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                Blog
              </Link>
              <Link
                href="/success-stories"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                Success Stories
              </Link>
              <Link
                href="/contact"
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: 500,
                  color: textSecondary,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                Contact
              </Link>
            </div>
          )}

          {/* Auth buttons & mobile menu toggle */}
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
                  transition: "all 0.2s",
                  boxShadow: `0 10px 15px -3px ${theme.colors.brand[900]}33`,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(1.5),
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.brand[800])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.brand[900])
                }
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
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
                    transition: "all 0.2s",
                    boxShadow: `0 10px 15px -3px ${theme.colors.brand[900]}33`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.colors.brand[800])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.colors.brand[900])
                  }
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
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: theme.spacing(1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isDark ? theme.colors.brand[100] : theme.colors.brand[900],
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
              backgroundColor: isDark
                ? theme.colors.brand[900]
                : "rgba(255,255,255,0.95)",
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              About
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Blog
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Success Stories
            </Link>
            <Link
              href="/contact"
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark
                  ? theme.colors.brand[800]
                  : theme.colors.brand[50])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Contact
            </Link>
          </div>
        )}
      </nav>

      {/* Main content - terms of service */}
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
            {termsTitle}
          </h1>
          <p
            style={{
              color: textSecondary,
              marginBottom: theme.spacing(8),
              fontSize: isMdUp ? theme.fontSize.base : theme.fontSize.sm,
            }}
          >
            Last Updated: {termsEffectiveDate}
          </p>

          <div
            style={{
              color: textBody,
              display: "flex",
              flexDirection: "column",
              gap: sectionGap,
            }}
          >
            {termsSections.map((section, index) => (
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