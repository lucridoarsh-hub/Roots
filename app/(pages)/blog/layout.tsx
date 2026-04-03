import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Enduring Roots | Tips, Stories & Memory Preservation Guides",
  description:
    "Explore the Enduring Roots blog for expert tips on preserving family history, building personal timelines, digital legacy planning, and heartfelt memory storytelling.",
  keywords: [
    "memory preservation tips",
    "digital legacy blog",
    "family history guide",
    "life story writing",
    "personal timeline",
    "heritage preservation",
  ],
  authors: [{ name: "Enduring Roots" }],
  metadataBase: new URL("https://www.enduringroots.in"),
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.enduringroots.in/blog",
    title:
      "Blog — Enduring Roots | Tips, Stories & Memory Preservation Guides",
    description:
      "Expert tips on preserving family history, building personal timelines, digital legacy planning, and heartfelt memory storytelling.",
    images: [
      {
        url: "/assets/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Enduring Roots Blog",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Blog — Enduring Roots | Tips, Stories & Memory Preservation Guides",
    description:
      "Expert tips on preserving family history, building personal timelines, digital legacy planning, and heartfelt memory storytelling.",
    images: ["/assets/og-blog.jpg"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}