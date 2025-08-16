"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '@/services/authService';
import { useRouter } from 'next/navigation';

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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Starting authentication check');
      
      // Initialize auth service (sets up axios headers)
      authService.initializeAuth();
      
      const token = authService.getToken();
      console.log('AuthContext: Token found:', !!token);
      
      if (token) {
        // Get user data from localStorage
        const userData = authService.getUserData();
        console.log('AuthContext: User data from localStorage:', !!userData);
        
        if (userData) {
          // We have user data, validate token
          try {
            const isValid = await authService.validateToken(token);
            console.log('AuthContext: Token validation result:', isValid);
            
            if (isValid) {
              setUser(userData);
              setIsAuthenticated(true);
              console.log('AuthContext: Authentication successful with stored data');
            } else {
              setUser(null);
              setIsAuthenticated(false);
              console.log('AuthContext: Token validation failed');
            }
          } catch (error) {
            console.error('AuthContext: Token validation failed:', error);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('AuthContext: No user data found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('AuthContext: No token found');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('AuthContext: Error checking authentication:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Authentication check completed');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
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
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshAuth = async () => {
    try {
      setIsLoading(true);
      const isRefreshed = await authService.refreshAuth();
      
      if (isRefreshed) {
        const userData = authService.getUserData();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
