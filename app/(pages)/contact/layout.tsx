import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Enduring Roots | We're Here to Help",
  description:
    "Have a question or need support? Get in touch with the Enduring Roots team. We're happy to help with anything related to your account, memories, or legacy.",
  keywords: [
    "enduring roots contact",
    "memory platform support",
    "get in touch",
    "customer support",
    "help enduring roots",
  ],
  authors: [{ name: "Enduring Roots" }],
  metadataBase: new URL("https://www.enduringroots.in"),
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.enduringroots.in/contact",
    title: "Contact Us — Enduring Roots | We're Here to Help",
    description:
      "Have a question or need support? Get in touch with the Enduring Roots team — we're always happy to help.",
    images: [
      {
        url: "/assets/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Enduring Roots",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Us — Enduring Roots | We're Here to Help",
    description:
      "Have a question or need support? Get in touch with the Enduring Roots team — we're always happy to help.",
    images: ["/assets/og-contact.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}