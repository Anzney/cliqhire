import axios, { AxiosError } from "axios";
import { api, setAccessToken, clearAccessToken } from "@/lib/axios-config";

// Types for authentication data
export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  permissions?: string[];
  defaultPermissions?: string[];
}

// API Response interfaces
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  results?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

class AuthService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL ;
  
  constructor() {
    // AuthService initialization
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterUserData): Promise<RegisterResponse> {
    try {
      // Create payload with plain passwords
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      };
      
      // Make real API call to Express backend using the configured api instance
      const response = await api.post('/auth/register', payload);

      // Extract data from response - your API returns accessToken and user
      const { accessToken, user } = response.data.data;
      
      // Store token in memory and localStorage for persistence
      setAccessToken(accessToken);
      
      // Store token in localStorage for persistence (in development)
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('userData', JSON.stringify(user));
      }

      return {
        success: true,
        message: 'Registration successful',
        user: user,
        token: accessToken
      };
    } catch (error) {
      console.error('Error registering user:', error);
      
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;
        
        return {
          success: false,
          message: errorData?.message || axiosError.message || 'Registration failed'
        };
      }
      
      // Handle other errors
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  /**
   * Login user
   */
  async login(userData: LoginUserData): Promise<LoginResponse> {
    try {
      // Create payload with plain password
      const payload = {
        email: userData.email,
        password: userData.password,
      };
      
      // Make real API call to Express backend using the configured api instance
      const response = await api.post('/api/auth/login', payload);

      // Extract data from response - your API returns accessToken and user
      const { accessToken, user } = response.data.data;
      
      // Store token in memory and localStorage for persistence
      setAccessToken(accessToken);
      
      // Store token in localStorage for persistence (in development)
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('userData', JSON.stringify(user));
      }

      return {
        success: true,
        message: 'Login successful',
        user: user,
        token: accessToken
      };
    } catch (error) {
      console.error('AuthService: Error logging in user:', error);
      
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;
        
        return {
          success: false,
          message: errorData?.message || axiosError.message || 'Login failed'
        };
      }
      
      // Handle other errors
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      // Make logout request to Express backend using the configured api instance
      // This will clear the refresh token cookie on the server
      await api.post('/api/auth/logout');
      
      // Clear access token from memory
      clearAccessToken();
      
      // Clear user data and token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
      }
      
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Even if the API call fails, clear local data
      clearAccessToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
      }
      
      return {
        success: false,
        message: 'Logout completed (local cleanup)'
      };
    }
  }

  /**
   * Get user data from localStorage
   */
  getUserData(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getUserData() !== null;
  }
}

// Export a singleton instance
export const authService = new AuthService();
