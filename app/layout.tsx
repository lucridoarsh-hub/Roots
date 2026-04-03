import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import { NotificationProvider } from "@/context/NotificationContext";
import { MemoryProvider } from "@/context/MemoryContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FamilyProvider } from "@/context/FamilyContext";
import AuthGuard from "@/context/AuthGuardContext";
import { SessionExpiryChecker } from "./components/SessionExpiryChecker"; // Import the checker

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enduring Roots — Preserve Your Life's Most Cherished Memories",
  description:
    "Enduring Roots helps you capture, organize, and share your personal legacy. Build a beautiful timeline of life memories to pass down to the people who matter most.",
  keywords: [
    "memory preservation",
    "digital legacy",
    "family history",
    "life timeline",
    "personal memories",
    "legacy platform",
    "memory journal",
  ],
  authors: [{ name: "Enduring Roots" }],
  metadataBase: new URL("https://www.enduringroots.in"),

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.enduringroots.in/",
    title: "Enduring Roots — Preserve Your Life's Most Cherished Memories",
    description:
      "Capture, organize, and share your personal legacy. Build a beautiful timeline of life memories for the people who matter most.",
    images: [
      {
        url: "/assets/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Enduring Roots",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Enduring Roots — Preserve Your Life's Most Cherished Memories",
    description:
      "Capture, organize, and share your personal legacy. Build a beautiful timeline of life memories for the people who matter most.",
    images: ["/assets/og-home.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <MemoryProvider>
            <NotificationProvider>
              <ThemeProvider>
                <FamilyProvider>
                  <AuthGuard>
                    <SessionExpiryChecker /> {/* Add the checker here */}
                    {children}
                  </AuthGuard>
                </FamilyProvider>
              </ThemeProvider>
            </NotificationProvider>
          </MemoryProvider>
        </Providers>
      </body>
    </html>
  );
}