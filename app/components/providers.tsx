// app/providers.tsx
"use client";

import { AuthProvider } from "@/context/AuthContext"; // adjust path
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}