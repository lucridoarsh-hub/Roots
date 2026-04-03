import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success Stories — Enduring Roots | Real Families, Real Legacies",
  description:
    "Discover how families around the world are using Enduring Roots to capture, preserve, and share their most treasured memories across generations.",
  keywords: [
    "enduring roots success stories",
    "family memory testimonials",
    "digital legacy stories",
    "memory preservation examples",
    "user stories",
  ],
  authors: [{ name: "Enduring Roots" }],
  metadataBase: new URL("https://www.enduringroots.in"),
  alternates: {
    canonical: "/success-stories",
  },
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.enduringroots.in/success-stories",
    title:
      "Success Stories — Enduring Roots | Real Families, Real Legacies",
    description:
      "See how real families use Enduring Roots to preserve their most treasured memories and create living legacies across generations.",
    images: [
      {
        url: "/assets/og-success.jpg",
        width: 1200,
        height: 630,
        alt: "Success Stories - Enduring Roots",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Success Stories — Enduring Roots | Real Families, Real Legacies",
    description:
      "See how real families use Enduring Roots to preserve their most treasured memories and create living legacies across generations.",
    images: ["/assets/og-success.jpg"],
  },
};

export default function SuccessStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}