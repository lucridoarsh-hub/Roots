// app/blog/page.tsx (or pages/blog.tsx)
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  ArrowRight,
  Menu,
  X,
  Info,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import axios from "axios";
import Footer from "../../components/Footer";
import { useAuth } from "../../../context/AuthContext";
import { APP_NAME } from "../../../constants";
import theme from "../../theme"; // <-- imported design system

// ========== BLOG POST TYPE ==========
interface BlogPost {
  _id: string;
  title: string;
  description: string;
  category?: string;
  author?: string;
  date?: string;
  coverImageUrl?: string;
  images: Array<{ url: string; public_id: string }>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string | { username?: string; name?: string };
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

// ========== HELPER: Get author name ==========
const getAuthorName = (post: BlogPost): string | null => {
  if (post.author) return post.author;
  if (post.userId && typeof post.userId === "object") {
    if ("username" in post.userId && post.userId.username) return post.userId.username;
    if ("name" in post.userId && post.userId.name) return post.userId.name;
  }
  return null;
};

// ========== MAIN COMPONENT ==========
const BlogPage: React.FC = () => {
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
  const headerBg = isDark ? theme.colors.brand[900] + "4D" : theme.colors.brand[50];
  const cardBg = palette.bgCard;
  const cardBorder = isDark ? theme.colors.brand[800] : theme.colors.stone[200];
  const categoryBg = isDark ? theme.colors.brand[800] + "E6" : "rgba(255,255,255,0.9)";
  const categoryText = isDark ? theme.colors.brand[200] : theme.colors.brand[800];
  const metaText = isDark ? theme.colors.brand[400] : theme.colors.stone[500];
  const titleColor = textPrimary;
  const excerptColor = textSecondary;
  const borderColor = isDark ? theme.colors.brand[800] : theme.colors.stone[100];
  const linkColor = theme.colors.brand[500];
  const emptyBg = isDark ? theme.colors.brand[900] : theme.colors.stone[50];
  const emptyBorder = isDark ? theme.colors.brand[700] : theme.colors.stone[300];

  // Local settings
  const [dynamicSettings, setDynamicSettings] = useState({
    appName: APP_NAME,
    logoUrl: "",
    announcement: "",
    maintenanceMode: false,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/auth/admin/blog", {
          withCredentials: true,
        });
        if (response.data.success) {
          setPosts(response.data.blogs);
        } else {
          setError("Failed to load blogs");
        }
      } catch (err) {
        setError("Error fetching blogs");
        console.error("Blog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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

  // Responsive values
  const headerPaddingTop = isMdUp ? theme.spacing(32) : theme.spacing(24);
  const headerPaddingBottom = isMdUp ? theme.spacing(12) : theme.spacing(8);
  const mainPaddingTop = isMdUp ? theme.spacing(16) : theme.spacing(12);
  const mainPaddingX = isMdUp ? theme.spacing(6) : theme.spacing(4);
  const mainPaddingBottom = isMdUp ? theme.spacing(16) : theme.spacing(12);
  const headerTitleSize = isMdUp ? theme.fontSize["5xl"] : theme.fontSize["4xl"];
  const headerSubtitleSize = isMdUp ? theme.fontSize.xl : theme.fontSize.lg;
  const getGridColumns = () => {
    if (isLgUp) return "repeat(3, 1fr)";
    if (isMdUp) return "repeat(2, 1fr)";
    return "1fr";
  };
  const gridGap = isMdUp ? theme.spacing(8) : theme.spacing(6);

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
        <p style={{ color: textSecondary }}>Loading stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: theme.spacing(4),
        }}
      >
        <p style={{ color: textSecondary }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
            backgroundColor: theme.colors.brand[600],
            color: theme.colors.white,
            border: "none",
            borderRadius: theme.borderRadius.lg,
            cursor: "pointer",
            transition: theme.transition.DEFAULT,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = theme.colors.brand[700])
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = theme.colors.brand[600])
          }
        >
          Retry
        </button>
      </div>
    );
  }

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
 

      {/* Header */}
      <div
        style={{
          paddingTop: headerPaddingTop,
          paddingBottom: headerPaddingBottom,
          backgroundColor: headerBg,
          marginTop: dynamicSettings.announcement ? theme.spacing(8) : 0,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${theme.spacing(4)}`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
              backgroundColor: isDark ? theme.colors.brand[800] : theme.colors.brand[200],
              color: categoryText,
              borderRadius: theme.borderRadius.full,
              fontSize: theme.fontSize.xs,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: theme.spacing(4),
            }}
          >
            The Journal
          </span>
          <h1
            style={{
              fontSize: headerTitleSize,
              fontFamily: theme.fontFamily.serif,
              fontWeight: "bold",
              color: isDark ? theme.colors.brand[100] : theme.colors.brand[900],
              marginBottom: theme.spacing(4),
            }}
          >
            Stories & Insights
          </h1>
          <p
            style={{
              fontSize: headerSubtitleSize,
              color: textSecondary,
              maxWidth: "42rem",
              margin: "0 auto",
            }}
          >
            Tips on preservation, family history features, and stories from our
            community.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: `${mainPaddingTop} ${mainPaddingX} ${mainPaddingBottom}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: getGridColumns(),
            gap: gridGap,
          }}
        >
          {posts.map((post) => {
            const authorName = getAuthorName(post);
            return (
              <article
                key={post._id}
                onClick={() => router.push(`/blog/${post._id}`)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: cardBg,
                  borderRadius: theme.borderRadius["2xl"],
                  overflow: "hidden",
                  border: `1px solid ${cardBorder}`,
                  boxShadow: theme.boxShadow.sm,
                  transition: "all 0.3s",
                  cursor: "pointer",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = theme.boxShadow.xl;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = theme.boxShadow.sm;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    height: "12rem",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={
                      post.images?.[0]?.url ||
                      "https://placehold.co/600x400/1e3a8a/white?text=No+Image"
                    }
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s",
                    }}
                    loading="lazy"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/600x400/1e3a8a/white?text=Image+Unavailable")
                    }
                  />
                  {post.tags && post.tags.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: theme.spacing(4),
                        left: theme.spacing(4),
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: categoryBg,
                          backdropFilter: "blur(4px)",
                          padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fontSize.xs,
                          fontWeight: "bold",
                          color: categoryText,
                          textTransform: "uppercase",
                          letterSpacing: "0.025em",
                          boxShadow: theme.boxShadow.sm,
                        }}
                      >
                        {post.tags[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    padding: theme.spacing(6),
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing(3),
                      fontSize: theme.fontSize.xs,
                      color: metaText,
                      marginBottom: theme.spacing(3),
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(1),
                      }}
                    >
                      <Calendar size={12} />{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {authorName && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: theme.spacing(1),
                        }}
                      >
                        <User size={12} /> {authorName}
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontSize: theme.fontSize.xl,
                      fontWeight: "bold",
                      color: titleColor,
                      marginBottom: theme.spacing(3),
                      fontFamily: theme.fontFamily.serif,
                      lineHeight: 1.25,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.colors.brand[600];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = titleColor;
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    style={{
                      color: excerptColor,
                      fontSize: theme.fontSize.sm,
                      lineHeight: 1.625,
                      marginBottom: theme.spacing(4),
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.description}
                  </p>
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: theme.spacing(4),
                      borderTop: `1px solid ${borderColor}`,
                      ...flexBetween,
                    }}
                  >
                    <button
                      style={{
                        color: linkColor,
                        fontWeight: "bold",
                        fontSize: theme.fontSize.sm,
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(1),
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        transition: "gap 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.gap = theme.spacing(2);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.gap = theme.spacing(1);
                      }}
                    >
                      Read Full Article <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: theme.spacing(20),
              backgroundColor: emptyBg,
              borderRadius: theme.borderRadius["2xl"],
              border: `1px dashed ${emptyBorder}`,
            }}
          >
            <p
              style={{
                color: isDark ? theme.colors.brand[400] : theme.colors.stone[500],
                fontWeight: 500,
              }}
            >
              No stories have been published yet.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;