// app/components/SessionExpiryChecker.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function SessionExpiryChecker() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const checkSessionExpiry = () => {
      const createdAt = localStorage.getItem('createdAt');
      
      if (!createdAt) return;

      try {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const diffTime = currentDate.getTime() - createdDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        // If session is older than 2 days
        if (diffDays > 2) {
          // Remove session-related items from localStorage
          const keysToRemove = [
            'createdAt',
            'user',
            'userId', 
            'username',
            'roots_theme',
            'token' // if you store a token
          ];
          
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          // Clear all auth-related data (optional: use localStorage.clear() if safe)
          // localStorage.clear(); // Uncomment if you want to clear everything
          
          // Redirect to login only if not already there
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error parsing createdAt date:', error);
        // If date parsing fails, treat as expired and clear
        localStorage.removeItem('createdAt');
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    };

    checkSessionExpiry();
  }, [router, pathname]);

  return null; // This component doesn't render anything
}