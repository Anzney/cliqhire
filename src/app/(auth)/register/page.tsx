"use client";

import { RegisterForm } from "@/components/register-form"
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to dashboard
  if (!isLoading && isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center justify-center">
      <div className="w-full max-h-screen overflow-y-auto">
        <RegisterForm />
      </div>
    </div>
  )
}
