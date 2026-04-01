"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { APP_NAME } from "../constants";
import { useAuth } from "../context/AuthContext";

// ========== THEME CONSTANTS (exact Tailwind values) ==========
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
    },
    amber: {
      400: "#fbbf24",
      300: "#fcd34d",
    },
    rose: {
      500: "#f43f5e",
    },
    white: "#ffffff",
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
  },
  borderRadius: {
    full: "9999px",
  },
  fontFamily: {
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  transition: {
    DEFAULT: "all 0.2s ease",
  },
  borderWidth: {
    DEFAULT: "1px",
  },
};

// ========== RESPONSIVE HOOK ==========
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

// ========== FOOTER COMPONENT ==========
const Footer: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Responsive breakpoints
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  // Helper: scroll to top instantly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // Handle the Home link: conditionally log in and always scroll to top
  const handleTestDashboard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      login("alex@example.com");
      router.push("/dashboard");
      scrollToTop();
    }
    // For authenticated users, default navigation + scroll happens naturally
  };

  // Determine grid columns based on breakpoint
  const getGridTemplateColumns = () => {
    if (isLgUp) return "repeat(4, minmax(0, 1fr))";
    if (isMdUp) return "repeat(2, minmax(0, 1fr))";
    return "1fr";
  };

  return (
    <footer
      style={{
        backgroundColor: theme.colors.brand[900],
        color: theme.colors.brand[100],
        paddingTop: theme.spacing(20),
        paddingBottom: theme.spacing(10),
      }}
    >
      {/* Inline style media query for print */}
      <style>{`
        @media print {
          footer { display: none !important; }
        }
      `}</style>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: `0 ${theme.spacing(6)}`,
        }}
      >
        {/* Grid – equal width columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: getGridTemplateColumns(),
            gap: theme.spacing(12),
            marginBottom: theme.spacing(16),
          }}
        >
          {/* ----- Brand Column (Social icons removed as requested) ----- */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(6),
            }}
          >
            <h2
              style={{
                fontSize: theme.fontSize["3xl"],
                fontFamily: theme.fontFamily.serif,
                fontWeight: "bold",
                color: theme.colors.white,
                letterSpacing: "0.025em",
                margin: 0,
              }}
            >
              {APP_NAME}
            </h2>
            <p
              style={{
                color: theme.colors.brand[200],
                lineHeight: 1.625,
                fontSize: theme.fontSize.sm,
                maxWidth: isMdUp ? "20rem" : "none",
                margin: 0,
              }}
            >
              Preserving the stories that matter most. A secure, beautiful digital
              sanctuary for your life's journey and family legacy.
            </p>
          </div>

          {/* ----- Quick Links (Product) ----- */}
          <div>
            <h3
              style={{
                color: theme.colors.white,
                fontWeight: 600,
                marginBottom: theme.spacing(6),
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: theme.fontSize.sm,
                marginTop: 0,
              }}
            >
              Quick Links
            </h3>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(4),
                fontSize: theme.fontSize.sm,
                color: theme.colors.brand[200],
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              <li>
                <Link
                  href="/"
                  onClick={handleTestDashboard}
                  style={{
                    color: theme.colors.brand[200],
                    textDecoration: "none",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.amber[300])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[200])
                  }
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={scrollToTop}
                  style={{
                    color: theme.colors.brand[200],
                    textDecoration: "none",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.white)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[200])
                  }
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  onClick={scrollToTop}
                  style={{
                    color: theme.colors.brand[200],
                    textDecoration: "none",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.white)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[200])
                  }
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* ----- Legal ----- */}
          <div>
            <h3
              style={{
                color: theme.colors.white,
                fontWeight: 600,
                marginBottom: theme.spacing(6),
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: theme.fontSize.sm,
                marginTop: 0,
              }}
            >
              LEGAL
            </h3>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(4),
                fontSize: theme.fontSize.sm,
                color: theme.colors.brand[200],
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              <li>
                <Link
                  href="/privacy"
                  onClick={scrollToTop}
                  style={{
                    color: theme.colors.brand[200],
                    textDecoration: "none",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.white)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[200])
                  }
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  onClick={scrollToTop}
                  style={{
                    color: theme.colors.brand[200],
                    textDecoration: "none",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.white)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[200])
                  }
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  onClick={scrollToTop}
                  style={{
                    color: theme.colors.brand[200],
                    textDecoration: "none",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.white)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[200])
                  }
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* ----- Contact ----- */}
          <div>
            <h3
              style={{
                color: theme.colors.white,
                fontWeight: 600,
                marginBottom: theme.spacing(6),
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: theme.fontSize.sm,
                marginTop: 0,
              }}
            >
              Contact
            </h3>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(4),
                fontSize: theme.fontSize.sm,
                color: theme.colors.brand[200],
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              <li>
                <a
                  href="mailto:support@enduringroots.in"
                  style={{
                    color: theme.colors.brand[200],
                    textDecoration: "none",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.white)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[200])
                  }
                >
                  Email: support@enduringroots.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+919818394549"
                  style={{
                    color: theme.colors.brand[200],
                    textDecoration: "none",
                    transition: theme.transition.DEFAULT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.white)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.brand[200])
                  }
                >
                  Call / WhatsApp: +91-9818394549
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${theme.colors.brand[800]}`,
            paddingTop: theme.spacing(8),
            display: "flex",
            flexDirection: isMdUp ? "row" : "column",
            justifyContent: "space-between",
            alignItems: isMdUp ? "center" : "center",
            gap: theme.spacing(4),
            fontSize: theme.fontSize.xs,
            color: theme.colors.brand[400],
          }}
        >
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(1),
              margin: 0,
            }}
          >
            Made with{" "}
            <Heart
              size={12}
              style={{
                color: theme.colors.rose[500],
                fill: theme.colors.rose[500],
              }}
            />{" "}
            for families everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;