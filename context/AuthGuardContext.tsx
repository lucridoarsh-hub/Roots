'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Define the routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/family', '/help', '/profile'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only run on the client side
    const auth = localStorage.getItem('user');
    const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (isProtected && !auth) {
      router.replace('/login');
    }
    setIsChecking(false);
  }, [pathname, router]);

  // Show a loading indicator while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}