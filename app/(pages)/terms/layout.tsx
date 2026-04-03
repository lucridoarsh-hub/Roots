import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Terms of Service — Enduring Roots | Platform Usage Guidelines",
  description:
    "Review the Enduring Roots Terms of Service. Learn about your rights, responsibilities, and the rules governing your use of our memory preservation platform.",
  keywords: [
    "enduring roots terms of service",
    "platform terms",
    "user agreement",
    "usage policy",
    "terms and conditions",
  ],
  authors: [{ name: "Enduring Roots" }],
  metadataBase: new URL("https://www.enduringroots.in"),
  alternates: {
    canonical: "/terms-of-service",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.enduringroots.in/terms-of-service",
    title:
      "Terms of Service — Enduring Roots | Platform Usage Guidelines",
    description:
      "Review your rights, responsibilities, and the rules governing your use of the Enduring Roots platform.",
    images: [
      {
        url: "/assets/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Terms of Service - Enduring Roots",
      },
    ],
  },

  twitter: {
    card: "summary",
    title:
      "Terms of Service — Enduring Roots | Platform Usage Guidelines",
    description:
      "Review your rights, responsibilities, and the rules governing your use of the Enduring Roots platform.",
    images: ["/assets/og-default.jpg"],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}