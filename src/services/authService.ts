import axios, { AxiosError } from "axios";

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



class AuthService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  /**
   * Register a new user
   */
  async register(userData: RegisterUserData): Promise<RegisterResponse> {
    try {
      console.log('Registering user with data:', userData);
      
      // Create payload with plain passwords
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      };
      
      console.log('Sending registration request to API');
      
      // Make real API call
      const response = await axios.post(`${this.baseURL}/api/auth/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Extract data from response
      const { token, user } = response.data.data;
      
      // Store token in axios defaults for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
      }

      return {
        success: true,
        message: 'Registration successful',
        user: user,
        token: token
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
      console.log('Logging in user with data:', userData);
      
      // Create payload with plain password
      const payload = {
        email: userData.email,
        password: userData.password,
      };
      
      console.log('Sending login request to API');
      
      // Make real API call
      const response = await axios.post(`${this.baseURL}/api/auth/login`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Extract data from response
      const { token, user } = response.data.data;
      
      // Store token in axios defaults for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
      }

      return {
        success: true,
        message: 'Login successful',
        user: user,
        token: token
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      
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
      console.log('Logging out user');
      
      // Clear token from axios defaults
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
      
      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        message: 'User logged out successfully',
      };
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
   * Get stored authentication token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Get stored user data
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
    const token = this.getToken();
    return token !== null;
  }

  /**
   * Initialize authentication state (call this on app startup)
   */
  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
