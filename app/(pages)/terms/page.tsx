// app/terms-of-service/page.tsx (or pages/terms-of-service.tsx)
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