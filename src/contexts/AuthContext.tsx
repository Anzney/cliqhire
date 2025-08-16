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
      const token = authService.getToken();
      
      if (token) {
        // First check if we have user data in localStorage
        const userData = authService.getUserData();
        if (userData) {
          // We have user data, validate token
          const isValid = await authService.validateToken(token);
          if (isValid) {
            setUser(userData);
            setIsAuthenticated(true);
            return; // Exit early if we have valid data
          }
        }
        
        // If we don't have user data or token is invalid, try to fetch current user
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching current user:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
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
