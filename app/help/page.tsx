"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Lock, Share2, UploadCloud } from "lucide-react";

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
    blue: {
      100: "#dbeafe",
      600: "#2563eb",
    },
    amber: {
      100: "#fef3c7",
      600: "#d97706",
    },
    emerald: {
      100: "#d1fae5",
      600: "#059669",
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
    DEFAULT:
      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
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

const useDarkMode = () => {
  return useMediaQuery("(prefers-color-scheme: dark)");
};

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
const absoluteFill = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

// ========== COMPONENT ==========
const Help: React.FC = () => {
  const isDark = useDarkMode();
  const isMdUp = useMediaQuery("(min-width: 768px)");

  // For each FAQ item, we need to track its open/closed state
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});

  const toggleQuestion = (sectionIdx: number, qIdx: number) => {
    const key = `${sectionIdx}-${qIdx}`;
    setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is Roots?",
          a: "Roots is a digital sanctuary for your personal memories. It allows you to document, organize, and visualize your life journey on an interactive timeline. You can add photos, videos, and stories, tag them by life stages, and even invite family members to collaborate.",
        },
        {
          q: "Is Roots free to use?",
          a: "Yes, the basic version of Roots is free for all users. We may introduce premium features for advanced storage and printing options in the future.",
        },
        {
          q: "How do I add my first memory?",
          a: "Click the 'Add Memory' button on your dashboard. Fill in the title, date, and description. You can also upload a photo and tag the memory with a life stage.",
        },
      ],
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          q: "Are my memories private?",
          a: "Absolutely. By default, all memories you create are private and visible only to you. You can choose to share specific memories or your entire timeline with trusted individuals.",
        },
        {
          q: "How is my data stored?",
          a: "Your text data is encrypted and stored securely. Media files are kept in private storage buckets that require authenticated access.",
        },
        {
          q: "Can I export my data?",
          a: "Yes, you can export your entire timeline history as a JSON file or a printable PDF from the Settings menu (coming soon).",
        },
      ],
    },
    {
      category: "Managing Memories",
      questions: [
        {
          q: "What types of media can I upload?",
          a: "You can upload JPG and PNG photos, MP4 videos, PDF documents, and audio recordings. The maximum file size per upload is currently 10MB.",
        },
        {
          q: "How does the Smart Summary work?",
          a: "Roots uses advanced technology to analyze your detailed descriptions and generate a concise 1-2 sentence summary. This helps keep your timeline view clean while preserving the full story in the detail view.",
        },
        {
          q: "Can I edit the date of a memory?",
          a: "Yes, you can edit any detail of a memory, including the date, at any time. The timeline will automatically reorder itself based on the new date.",
        },
      ],
    },
    {
      category: "Collaboration",
      questions: [
        {
          q: "How do I invite someone to my timeline?",
          a: "When editing a memory, use the 'Collaborators' section to enter the email address of the person you want to invite. You can give them 'View' or 'Edit' permissions.",
        },
        {
          q: "What can a collaborator do?",
          a: "A collaborator with 'View' access can only see the memory. A collaborator with 'Edit' access can modify the text and tags, but they cannot delete the memory unless they are the owner.",
        },
      ],
    },
  ];

  // Conditional colors based on dark mode
  const bgPage = isDark ? theme.colors.gray[900] : theme.colors.gray[50];
  const headerBg = isDark ? theme.colors.brand[950] : theme.colors.brand[900];
  const headerText = theme.colors.white;
  const headerMuted = isDark ? theme.colors.brand[300] : theme.colors.brand[200];
  const cardBg = isDark ? theme.colors.gray[800] : theme.colors.white;
  const cardBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const cardHeaderBg = isDark ? theme.colors.gray[800] + "80" : "rgba(249,250,251,0.5)";
  const cardHeaderBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const categoryTitleColor = isDark ? theme.colors.brand[400] : theme.colors.brand[900];
  const questionColor = isDark ? theme.colors.gray[200] : theme.colors.gray[800];
  const questionHoverColor = isDark ? theme.colors.brand[400] : theme.colors.brand[700];
  const answerColor = isDark ? theme.colors.gray[400] : theme.colors.gray[600];
  const answerBorder = isDark ? theme.colors.brand[700] : theme.colors.brand[200];
  const chevronColor = isDark ? theme.colors.gray[500] : theme.colors.gray[400];
  const divideColor = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const resourceCardBg = isDark ? theme.colors.gray[800] : theme.colors.white;
  const resourceCardBorder = isDark ? "rgba(255,255,255,0.05)" : theme.colors.gray[100];
  const resourceTitleColor = isDark ? theme.colors.white : theme.colors.gray[900];
  const resourceDescColor = isDark ? theme.colors.gray[400] : theme.colors.gray[500];
  const resourceButtonColor = isDark ? theme.colors.brand[400] : theme.colors.brand[600];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgPage,
        paddingBottom: theme.spacing(20),
        transition: `background-color 300ms ${theme.transition.DEFAULT}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: headerBg,
          color: headerText,
          padding: `${theme.spacing(12)} ${theme.spacing(6)}`,
        }}
      >
        <div style={{ maxWidth: "896px", margin: "0 auto", textAlign: "center" }}>
          <HelpCircle
            size={48}
            style={{ margin: "0 auto", marginBottom: theme.spacing(4), color: headerMuted }}
          />
          <h1
            style={{
              fontSize: theme.fontSize["4xl"],
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              marginBottom: theme.spacing(4),
            }}
          >
            How can we help you?
          </h1>
          <p
            style={{
              color: headerMuted,
              fontSize: theme.fontSize.lg,
              maxWidth: "42rem",
              margin: "0 auto",
            }}
          >
            Find answers to common questions about managing your legacy, privacy settings, and
            features.
          </p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div
        style={{
          maxWidth: "896px",
          margin: "0 auto",
          padding: `${theme.spacing(12)} ${theme.spacing(6)}`,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(12),
        }}
      >
        {faqs.map((section, sectionIdx) => (
          <div
            key={sectionIdx}
            style={{
              backgroundColor: cardBg,
              borderRadius: theme.borderRadius["2xl"],
              boxShadow: theme.boxShadow.sm,
              border: `1px solid ${cardBorder}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: `${theme.spacing(6)} ${theme.spacing(8)}`,
                borderBottom: `1px solid ${cardHeaderBorder}`,
                backgroundColor: cardHeaderBg,
              }}
            >
              <h2
                style={{
                  fontSize: theme.fontSize.xl,
                  fontWeight: "bold",
                  color: categoryTitleColor,
                }}
              >
                {section.category}
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {section.questions.map((item, qIdx) => {
                const key = `${sectionIdx}-${qIdx}`;
                const isOpen = openStates[key] || false;

                return (
                  <div
                    key={qIdx}
                    style={{
                      borderBottom: `1px solid ${divideColor}`,
                      padding: theme.spacing(6),
                    }}
                  >
                    <div
                      onClick={() => toggleQuestion(sectionIdx, qIdx)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 500,
                          color: questionColor,
                          transition: theme.transition.DEFAULT,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = questionHoverColor)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = questionColor)
                        }
                      >
                        {item.q}
                      </span>
                      <span
                        style={{
                          transition: "transform 0.2s",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <ChevronDown size={20} style={{ color: chevronColor }} />
                      </span>
                    </div>
                    {isOpen && (
                      <p
                        style={{
                          color: answerColor,
                          marginTop: theme.spacing(4),
                          lineHeight: 1.625,
                          paddingLeft: theme.spacing(2),
                          borderLeft: `2px solid ${answerBorder}`,
                          marginLeft: theme.spacing(1),
                        }}
                      >
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Resource Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMdUp ? "repeat(3, 1fr)" : "1fr",
            gap: theme.spacing(6),
            marginTop: theme.spacing(12),
          }}
        >
          <div
            style={{
              backgroundColor: resourceCardBg,
              padding: theme.spacing(6),
              borderRadius: theme.borderRadius.xl,
              textAlign: "center",
              boxShadow: theme.boxShadow.sm,
              border: `1px solid ${resourceCardBorder}`,
            }}
          >
            <div
              style={{
                width: theme.spacing(12),
                height: theme.spacing(12),
                backgroundColor: theme.colors.blue[100],
                borderRadius: theme.borderRadius.full,
                ...flexCenter,
                margin: "0 auto",
                marginBottom: theme.spacing(4),
                color: theme.colors.blue[600],
              }}
            >
              <Share2 size={24} />
            </div>
            <h3
              style={{
                fontWeight: 600,
                color: resourceTitleColor,
                marginBottom: theme.spacing(2),
              }}
            >
              Community Forum
            </h3>
            <p
              style={{
                fontSize: theme.fontSize.sm,
                color: resourceDescColor,
                marginBottom: theme.spacing(4),
              }}
            >
              Connect with other storytellers.
            </p>
            <button
              style={{
                color: resourceButtonColor,
                fontWeight: 500,
                fontSize: theme.fontSize.sm,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Visit Forum
            </button>
          </div>
          <div
            style={{
              backgroundColor: resourceCardBg,
              padding: theme.spacing(6),
              borderRadius: theme.borderRadius.xl,
              textAlign: "center",
              boxShadow: theme.boxShadow.sm,
              border: `1px solid ${resourceCardBorder}`,
            }}
          >
            <div
              style={{
                width: theme.spacing(12),
                height: theme.spacing(12),
                backgroundColor: theme.colors.amber[100],
                borderRadius: theme.borderRadius.full,
                ...flexCenter,
                margin: "0 auto",
                marginBottom: theme.spacing(4),
                color: theme.colors.amber[600],
              }}
            >
              <Lock size={24} />
            </div>
            <h3
              style={{
                fontWeight: 600,
                color: resourceTitleColor,
                marginBottom: theme.spacing(2),
              }}
            >
              Privacy Center
            </h3>
            <p
              style={{
                fontSize: theme.fontSize.sm,
                color: resourceDescColor,
                marginBottom: theme.spacing(4),
              }}
            >
              Manage your data settings.
            </p>
            <button
              style={{
                color: resourceButtonColor,
                fontWeight: 500,
                fontSize: theme.fontSize.sm,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              View Settings
            </button>
          </div>
          <div
            style={{
              backgroundColor: resourceCardBg,
              padding: theme.spacing(6),
              borderRadius: theme.borderRadius.xl,
              textAlign: "center",
              boxShadow: theme.boxShadow.sm,
              border: `1px solid ${resourceCardBorder}`,
            }}
          >
            <div
              style={{
                width: theme.spacing(12),
                height: theme.spacing(12),
                backgroundColor: theme.colors.emerald[100],
                borderRadius: theme.borderRadius.full,
                ...flexCenter,
                margin: "0 auto",
                marginBottom: theme.spacing(4),
                color: theme.colors.emerald[600],
              }}
            >
              <UploadCloud size={24} />
            </div>
            <h3
              style={{
                fontWeight: 600,
                color: resourceTitleColor,
                marginBottom: theme.spacing(2),
              }}
            >
              Contact Support
            </h3>
            <p
              style={{
                fontSize: theme.fontSize.sm,
                color: resourceDescColor,
                marginBottom: theme.spacing(4),
              }}
            >
              Still need help? Email us.
            </p>
            <button
              style={{
                color: resourceButtonColor,
                fontWeight: 500,
                fontSize: theme.fontSize.sm,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              support@roots.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;