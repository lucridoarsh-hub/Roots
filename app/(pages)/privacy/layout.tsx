import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Enduring Roots | How We Protect Your Data",
  description:
    "Read the Enduring Roots Privacy Policy to understand how we collect, store, and protect your personal data. Your privacy and security are our highest priority.",
  keywords: [
    "enduring roots privacy policy",
    "data protection",
    "user privacy",
    "personal data security",
    "memory platform privacy",
  ],
  authors: [{ name: "Enduring Roots" }],
  metadataBase: new URL("https://www.enduringroots.in"),
  alternates: {
    canonical: "/privacy-policy",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.enduringroots.in/privacy-policy",
    title: "Privacy Policy — Enduring Roots | How We Protect Your Data",
    description:
      "Understand how Enduring Roots collects, stores, and protects your personal data. Your privacy is our highest priority.",
    images: [
      {
        url: "/assets/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Enduring Roots",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Privacy Policy — Enduring Roots | How We Protect Your Data",
    description:
      "Understand how Enduring Roots collects, stores, and protects your personal data. Your privacy is our highest priority.",
    images: ["/assets/og-default.jpg"],
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}