// app/blog/[id]/page.tsx (or pages/blog/[id].tsx)
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Menu,
  X,
  Info,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import Footer from "../../../components/Footer";
import { useAuth } from "../../../../context/AuthContext";
import { APP_NAME } from "../../../../constants";
import theme from "../../../theme"; // <-- imported design system

// ========== BLOG POST TYPE (matching API) ==========
interface ApiBlogResponse {
  success: boolean;
  blog: {
    _id: string;
    userId: string | { _id: string; username?: string; name?: string };
    title: string;
    description: string;
    images: Array<{ public_id: string; url: string; _id: string }>;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  date: string;
  author: string;
  category: string;
}

// ========== RESPONSIVE & DARK MODE HOOKS ==========
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

// ========== COMPONENT ==========
const BlogPostDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isDark = useDarkMode();
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

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
  const categoryBg = isDark ? theme.colors.brand[900] : theme.colors.brand[50];
  const categoryBorder = isDark ? theme.colors.brand[800] : theme.colors.brand[100];
  const categoryText = isDark ? theme.colors.brand[400] : theme.colors.brand[600];
  const authorBg = isDark ? theme.colors.brand[800] : theme.colors.brand[100];
  const authorIconColor = isDark ? theme.colors.brand[300] : theme.colors.brand[700];
  const excerptColor = isDark ? theme.colors.brand[300] : theme.colors.stone[600];
  const excerptBorder = isDark ? theme.colors.brand[800] : theme.colors.brand[100];
  const bodyText = isDark ? theme.colors.brand[200] : theme.colors.stone[800];
  const headingColor = isDark ? theme.colors.brand[100] : theme.colors.brand[900];
  const shareIconBg = isDark ? theme.colors.brand[900] : theme.colors.stone[50];
  const shareIconColor = isDark ? theme.colors.brand[400] : theme.colors.brand[600];
  const shareBorder = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const buttonBg = theme.colors.brand[500];
  const buttonHoverBg = theme.colors.brand[600];
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const metaColor = isDark ? theme.colors.brand[500] : theme.colors.stone[400];

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Dynamic settings from localStorage
  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  // Load settings on mount
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

  // Set document title
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | ${dynamicSettings.appName}`;
    } else {
      document.title = dynamicSettings.appName;
    }
    return () => {
      document.title = dynamicSettings.appName;
    };
  }, [post, dynamicSettings.appName]);

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        router.push("/blog");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<ApiBlogResponse>(
          `/api/auth/admin/blog/${id}`,
          { withCredentials: true }
        );

        if (!response.data || !response.data.blog) {
          throw new Error("Invalid API response");
        }

        const apiBlog = response.data.blog;

        // Extract author name if userId is an object with username/name
        let authorName = "Roots Team";
        if (apiBlog.userId && typeof apiBlog.userId === "object") {
          if ("username" in apiBlog.userId && apiBlog.userId.username)
            authorName = apiBlog.userId.username;
          else if ("name" in apiBlog.userId && apiBlog.userId.name)
            authorName = apiBlog.userId.name;
        }

        const mappedPost: BlogPost = {
          id: apiBlog._id,
          title: apiBlog.title,
          content: apiBlog.description,
          excerpt:
            apiBlog.description.length > 150
              ? apiBlog.description.substring(0, 150) + "..."
              : apiBlog.description,
          coverImageUrl:
            apiBlog.images && apiBlog.images.length > 0
              ? apiBlog.images[0].url
              : "https://via.placeholder.com/1200x600?text=No+Image",
          date: apiBlog.createdAt,
          author: authorName,
          category:
            apiBlog.tags && apiBlog.tags.length > 0
              ? apiBlog.tags[0]
              : "Uncategorized",
        };

        setPost(mappedPost);
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [id, router]);

  // Share handler
  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: `Check out this article: ${post.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareFeedback("Link copied to clipboard!");
        setTimeout(() => setShareFeedback(null), 3000);
      }
    } catch (error) {
      console.error("Share failed:", error);
      if (!navigator.share) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setShareFeedback("Link copied to clipboard!");
          setTimeout(() => setShareFeedback(null), 3000);
        } catch {
          setShareFeedback("Unable to share. You can copy the URL manually.");
          setTimeout(() => setShareFeedback(null), 3000);
        }
      } else {
        setShareFeedback("Sharing cancelled or failed.");
        setTimeout(() => setShareFeedback(null), 3000);
      }
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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: textSecondary,
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!post) return null;

  // Responsive values
  const mainPaddingX = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const headerPaddingTop = isMdUp ? theme.spacing(8) : theme.spacing(6);
  const headerPaddingBottom = isMdUp ? theme.spacing(12) : theme.spacing(8);
  const featuredImageMarginBottom = isMdUp ? theme.spacing(16) : theme.spacing(12);
  const articlePaddingBottom = isMdUp ? theme.spacing(24) : theme.spacing(16);
  const backLinkPadding = isMdUp
    ? `${theme.spacing(8)} ${theme.spacing(6)} 0 ${theme.spacing(6)}`
    : `${theme.spacing(6)} ${theme.spacing(4)} 0 ${theme.spacing(4)}`;

  // Responsive font sizes
  const titleFontSize = isLgUp
    ? theme.fontSize["6xl"]
    : isMdUp
    ? theme.fontSize["5xl"]
    : theme.fontSize["4xl"];
  const bodyFontSize = isMdUp ? theme.fontSize.lg : theme.fontSize.base;
  const excerptFontSize = isMdUp ? theme.fontSize.xl : theme.fontSize.lg;
  const metaGap = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const metaWrap = isMdUp ? "nowrap" : "wrap";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        transition: `background-color 500ms ${theme.transition.DEFAULT}`,
        fontFamily: theme.fontFamily.sans,
      }}
    >
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>

      {/* Announcement bar */}
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

      {/* Navigation */}
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


      {/* Back to Journal Button */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: backLinkPadding,
        }}
      >
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: theme.spacing(2),
            fontSize: theme.fontSize.sm,
            fontWeight: 500,
            color: textSecondary,
            textDecoration: "none",
            transition: theme.transition.fast,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = linkHoverColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textSecondary;
          }}
        >
          <ArrowLeft size={18} /> Back to Journal
        </Link>
      </div>

      {/* Article Header */}
      <header
        style={{
          paddingTop: headerPaddingTop,
          paddingBottom: headerPaddingBottom,
          paddingLeft: mainPaddingX,
          paddingRight: mainPaddingX,
        }}
      >
        <div style={{ maxWidth: "768px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: theme.spacing(2),
              padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
              backgroundColor: categoryBg,
              border: `1px solid ${categoryBorder}`,
              borderRadius: theme.borderRadius.full,
              fontSize: theme.fontSize.xs,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: categoryText,
              marginBottom: theme.spacing(6),
            }}
          >
            {post.category}
          </div>
          <h1
            style={{
              fontSize: titleFontSize,
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              color: headingColor,
              marginBottom: theme.spacing(8),
              lineHeight: 1.25,
            }}
          >
            {post.title}
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: metaWrap,
              alignItems: "center",
              justifyContent: "center",
              gap: metaGap,
              fontSize: theme.fontSize.sm,
              color: metaColor,
              fontWeight: 500,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <div
                style={{
                  width: theme.spacing(8),
                  height: theme.spacing(8),
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: authorBg,
                  ...flexCenter,
                  color: authorIconColor,
                }}
              >
                <User size={16} />
              </div>
              <span>By {post.author}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <Calendar size={16} />
              <span>
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <Clock size={16} />
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: `0 ${mainPaddingX}`,
          marginBottom: featuredImageMarginBottom,
        }}
      >
        <div
          style={{
            aspectRatio: "21/9",
            borderRadius: theme.borderRadius["2xl"],
            overflow: "hidden",
            boxShadow: theme.boxShadow["2xl"],
          }}
        >
          <img
            src={post.coverImageUrl}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/1200x600?text=Article+Image";
            }}
          />
        </div>
      </div>

      {/* Article Content */}
      <article
        style={{
          maxWidth: "768px",
          margin: "0 auto",
          padding: `0 ${mainPaddingX}`,
          paddingBottom: articlePaddingBottom,
          textAlign: "left",
        }}
      >
        <div
          style={{
            color: bodyText,
            fontSize: bodyFontSize,
            lineHeight: 1.8,
            fontFamily: theme.fontFamily.sans,
          }}
        >
          <p
            style={{
              fontSize: excerptFontSize,
              fontFamily: theme.fontFamily.serif,
              color: excerptColor,
              lineHeight: 1.625,
              fontStyle: "italic",
              borderLeft: `4px solid ${excerptBorder}`,
              paddingLeft: theme.spacing(6),
              marginBottom: theme.spacing(12),
            }}
          >
            {post.excerpt}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(6),
            }}
          >
            {post.content.split("\n").map((para, i) => (
              <p key={i} style={{ margin: 0 }}>
                {para}
              </p>
            ))}
            {post.content.length < 500 && (
              <>
                <p>
                  Preserving family stories is more than just a hobby—it's an act of
                  love for future generations. When we document our history, we
                  provide a roadmap for those who follow, helping them understand
                  their roots and the values that shaped their family tree.
                </p>
                <h3
                  style={{
                    fontSize: theme.fontSize["2xl"],
                    fontFamily: theme.fontFamily.serif,
                    fontWeight: "bold",
                    color: headingColor,
                    marginTop: theme.spacing(12),
                    marginBottom: theme.spacing(4),
                  }}
                >
                  Start Small, Think Long Term
                </h3>
                <p>
                  You don't need to write a full autobiography in one sitting. Start
                  by choosing one photo that brings back a strong emotion. Describe
                  where you were, who was with you, and how you felt in that exact
                  moment. These small snippets are the building blocks of a rich,
                  multifaceted legacy.
                </p>
                <p>
                  Roots was designed to make this process as intuitive as possible.
                  By organizing your life into stages, you can tackle your history
                  one chapter at a time. Whether it's the adventurous days of your
                  youth or the quiet reflections of later years, every moment
                  deserves a place in your timeline.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Share & More Articles */}
        <div
          style={{
            marginTop: theme.spacing(16),
            paddingTop: theme.spacing(12),
            borderTop: `1px solid ${borderColor}`,
            display: "flex",
            flexDirection: isMdUp ? "row" : "column",
            alignItems: isMdUp ? "center" : "stretch",
            justifyContent: "space-between",
            gap: theme.spacing(6),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(3),
            }}
          >
            <span
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: metaColor,
              }}
            >
              Share Story:
            </span>
            <div style={{ display: "flex", gap: theme.spacing(2) }}>
              <button
                onClick={handleShare}
                style={{
                  width: theme.spacing(10),
                  height: theme.spacing(10),
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: shareIconBg,
                  ...flexCenter,
                  color: shareIconColor,
                  border: `1px solid ${shareBorder}`,
                  cursor: "pointer",
                  transition: theme.transition.fast,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? theme.colors.brand[800]
                    : theme.colors.brand[100];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = shareIconBg;
                }}
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
          <Link
            href="/blog"
            style={{
              padding: `${theme.spacing(3)} ${theme.spacing(8)}`,
              backgroundColor: buttonBg,
              color: theme.colors.white,
              borderRadius: theme.borderRadius.full,
              fontWeight: "bold",
              boxShadow: theme.boxShadow.green,
              textDecoration: "none",
              transition: theme.transition.fast,
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = buttonHoverBg;
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttonBg;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            View More Articles
          </Link>
        </div>
      </article>

      {/* Share Feedback Toast */}
      {shareFeedback && (
        <div
          style={{
            position: "fixed",
            bottom: theme.spacing(8),
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.stone[800],
            color: theme.colors.white,
            padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
            borderRadius: theme.borderRadius.full,
            fontSize: theme.fontSize.sm,
            fontWeight: 500,
            boxShadow: theme.boxShadow.lg,
            zIndex: 60,
            animation: "fadeInOut 3s ease forwards",
            whiteSpace: "nowrap",
          }}
        >
          {shareFeedback}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostDetail;