import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — Enduring Roots",
  description:
    "Read the Enduring Roots disclaimer. Understand the limitations of liability, accuracy of information, and the nature of content shared on our platform.",
  keywords: [
    "enduring roots disclaimer",
    "platform liability",
    "content disclaimer",
    "legal notice",
  ],
  authors: [{ name: "Enduring Roots" }],
  metadataBase: new URL("https://www.enduringroots.in"),
  alternates: {
    canonical: "/disclaimer",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.enduringroots.in/disclaimer",
    title: "Disclaimer — Enduring Roots",
    description:
      "Read the Enduring Roots disclaimer regarding limitations of liability, accuracy, and platform content.",
    images: [
      {
        url: "/assets/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Disclaimer - Enduring Roots",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Disclaimer — Enduring Roots",
    description:
      "Read the Enduring Roots disclaimer regarding limitations of liability, accuracy, and platform content.",
    images: ["/assets/og-default.jpg"],
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}