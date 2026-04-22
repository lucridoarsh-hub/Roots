import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/blog",
          "/success-stories",
          "/contact",
          "/faqs",
          "/privacy-policy",
          "/terms-of-service",
          "/disclaimer",
          "/assets/",
          "/images/",
          "/pricing",
        ],
        disallow: [
          "/profile",
          "/timeline",
          "/settings",
          "/dashboard",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/admin",
          "/api/",
          "/cdn-cgi/",
          "/_next/",
          "/static/",
          "/tmp/",
          "/dev/",
          "/test/",
        ],
      },

      // Googlebot
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/profile",
          "/timeline",
          "/settings",
          "/dashboard",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/admin",
          "/api/",
        ],
      },

      // Google Images
      {
        userAgent: "Googlebot-Image",
        allow: ["/assets/", "/images/"],
        disallow: ["/"],
      },

      // Bing
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/profile",
          "/timeline",
          "/settings",
          "/dashboard",
          "/login",
          "/register",
          "/admin",
          "/api/",
        ],
      },

      // Block AI scrapers
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ChatGPT-User", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "Claude-Web", disallow: "/" },
      { userAgent: "Omgilibot", disallow: "/" },
      { userAgent: "FacebookBot", disallow: "/" },
    ],

    sitemap: "https://www.enduringroots.in/sitemap.xml",
  };
}