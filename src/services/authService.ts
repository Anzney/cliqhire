import axios, { AxiosError } from "axios";
import bcrypt from "bcryptjs";

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
  _id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
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

/**
 * Hash a password using bcrypt with salt
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Recommended for production
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise<boolean> - True if passwords match
 */
async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

class AuthService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  /**
   * Register a new user
   */
  async register(userData: RegisterUserData): Promise<RegisterResponse> {
    try {
      console.log('Registering user with data:', userData);
      
      // Hash the passwords before sending
      const hashedPassword = await hashPassword(userData.password);
      const hashedConfirmPassword = await hashPassword(userData.confirmPassword);
      
      // Create payload with hashed passwords
      const payload = {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
      };
      
      console.log('Sending bcrypt hashed password data to API');
      
      // Make real API call
      const response = await axios.post(`${this.baseURL}/api/auth/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;
        throw new Error(
          errorData?.message || 
          axiosError.message || 
          'Registration failed'
        );
      }
      
      // Handle other errors
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  /**
   * Login user
   */
  async login(userData: LoginUserData): Promise<LoginResponse> {
    try {
      console.log('Logging in user with data:', userData);
      
      // Hash the password before sending
      const hashedPassword = await hashPassword(userData.password);
      
      // Create payload with hashed password
      const payload = {
        email: userData.email,
        password: hashedPassword,
      };
      
      console.log('Sending bcrypt hashed password data to API');
      
      // Make real API call
      const response = await axios.post(`${this.baseURL}/api/auth/login`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error logging in user:', error);
      
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;
        throw new Error(
          errorData?.message || 
          axiosError.message || 
          'Login failed'
        );
      }
      
      // Handle other errors
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call with dummy data
      console.log('Logging out user');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate successful logout
      const mockResponse = {
        success: true,
        message: 'User logged out successfully',
      };

      // Simulate API call using axios (commented out for dummy implementation)
      /*
      const response = await axios.post(`${this.baseURL}/api/auth/logout`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token from localStorage or context
        },
      });

      return response.data;
      */

      return mockResponse;
    } catch (error) {
      console.error('Error logging out user:', error);
      
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;
        throw new Error(
          errorData?.message || 
          axiosError.message || 
          'Logout failed'
        );
      }
      
      // Handle other errors
      throw new Error(error instanceof Error ? error.message : 'Logout failed');
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      // Simulate API call with dummy data
      console.log('Fetching current user profile');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate successful user fetch
      const mockUser: User = {
        _id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call using axios (commented out for dummy implementation)
      /*
      const response = await axios.get(`${this.baseURL}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token from localStorage or context
        },
      });

      return response.data.data;
      */

      return mockUser;
    } catch (error) {
      console.error('Error fetching current user:', error);
      
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;
        throw new Error(
          errorData?.message || 
          axiosError.message || 
          'Failed to fetch user profile'
        );
      }
      
      // Handle other errors
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user profile');
    }
  }

  /**
   * Validate token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // Simulate API call with dummy data
      console.log('Validating token');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simulate successful token validation
      const isValid = true; // Mock validation result

      // Simulate API call using axios (commented out for dummy implementation)
      /*
      const response = await axios.post(`${this.baseURL}/api/auth/validate-token`, { token }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data.valid;
      */

      return isValid;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
