"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User is authenticated, redirect to protected dashboard
        router.push('/dashboard');
      } else {
        // User is not authenticated, redirect to login
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Return null to prevent any rendering while redirecting
  return null;
}
