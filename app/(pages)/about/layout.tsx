import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Enduring Roots | Our Story & Mission",
  description:
    "Learn about Enduring Roots — a platform built to help families preserve their most meaningful memories and create lasting digital legacies for generations to come.",
  keywords: [
    "about enduring roots",
    "memory platform mission",
    "digital legacy company",
    "family heritage platform",
    "our story",
  ],
  authors: [{ name: "Enduring Roots" }],
  metadataBase: new URL("https://www.enduringroots.in"),
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.enduringroots.in/about",
    title: "About Us — Enduring Roots | Our Story & Mission",
    description:
      "We built Enduring Roots to help families preserve their most meaningful memories and create lasting legacies for generations to come.",
    images: [
      {
        url: "/assets/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Enduring Roots",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Us — Enduring Roots | Our Story & Mission",
    description:
      "We built Enduring Roots to help families preserve their most meaningful memories and create lasting legacies for generations to come.",
    images: ["/assets/og-about.jpg"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}