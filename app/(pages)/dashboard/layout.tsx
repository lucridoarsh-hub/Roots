// app/(protected)/layout.tsx
"use client";

import React from "react";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";
import { useTheme } from "@/context/ThemeContext";

// You may also need to use the AuthProvider if it's not already in the root layout
// import { AuthProvider } from "@/context/AuthContext"; // usually already in root

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Optional: for styling based on theme
  const { isDark } = useTheme();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-brand-950 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 w-full relative">
        {children}
      </div>
      <MobileNav />
    </div>
  );
}