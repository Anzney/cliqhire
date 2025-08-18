"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '@/services/authService';
import { initializeAuth } from '@/lib/axios-config';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with true to show loading state
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setIsLoading(true); // Set loading to true when starting auth check
      console.log('AuthContext: Starting authentication check');
      
      // Use the new initializeAuth function that handles token refresh
      const authInitialized = await initializeAuth();
      console.log('AuthContext: Auth initialization result:', authInitialized);
      
      if (authInitialized) {
        // Get user data from localStorage after potential token refresh
        const userData = authService.getUserData();
        console.log('AuthContext: User data from localStorage:', !!userData);
        
        if (userData) {
          // Set user immediately for faster UI response
          setUser(userData);
          setIsAuthenticated(true);
          console.log('AuthContext: Authentication successful with stored data');
        } else {
          console.log('AuthContext: No user data found after auth initialization');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('AuthContext: Auth initialization failed');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('AuthContext: Error checking authentication:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false); // Set loading to false when auth check completes
      console.log('AuthContext: Authentication check completed');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true); // Show loading during login
      console.log('AuthContext: Starting login process');
      const response = await authService.login({ email, password });
      console.log('AuthContext: Login response:', response);
      
      if (response.success && response.user && response.token) {
        console.log('AuthContext: Login successful, setting state');
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      } else {
        console.log('AuthContext: Login failed - missing data');
        return false;
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return false;
    } finally {
      setIsLoading(false); // Hide loading after login attempt
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true); // Show loading during logout
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false); // Hide loading after logout
    }
  };

  const refreshAuth = async () => {
    try {
      setIsLoading(true); // Show loading during refresh
      const authInitialized = await initializeAuth();
      
      if (authInitialized) {
        const userData = authService.getUserData();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error refreshing authentication:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false); // Hide loading after refresh
    }
  };

  useEffect(() => {
    // Remove the delay since we now have proper loading state
    checkAuth();
  }, []);

  // Note: Removed window focus event listener since /auth/me endpoint is not available
  // This was causing authentication to fail on page refresh

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    refreshAuth,
  };

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center justify-center gap-2 flex-col">
          <Loader className="size-6 animate-spin" />
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
