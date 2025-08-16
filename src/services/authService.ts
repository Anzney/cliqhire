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
  id?: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  lastLogin?: string;
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
  private baseURL = process.env.NEXT_PUBLIC_API_URL ;
  
  constructor() {
    console.log('AuthService: Base URL:', this.baseURL);
  }

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
      
      // Make real API call to Express backend
      const response = await axios.post(`${this.baseURL}/auth/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Extract data from response - your API returns accessToken and user
      const { accessToken, user } = response.data.data;
      
      // Store token in axios defaults for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Store in localStorage
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
      console.log('AuthService: Starting login process');
      console.log('AuthService: Login URL:', `${this.baseURL}/api/auth/login`);
      
      // Create payload with plain password
      const payload = {
        email: userData.email,
        password: userData.password,
      };
      
      console.log('AuthService: Login payload:', { email: userData.email, password: '***' });
      
      // Make real API call to Express backend
      const response = await axios.post(`${this.baseURL}/api/auth/login`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('AuthService: API Response:', response.data);

      // Extract data from response - your API returns accessToken and user
      const { accessToken, user } = response.data.data;
      
      console.log('AuthService: Extracted token:', !!accessToken);
      console.log('AuthService: Extracted user:', !!user);
      
      // Store token in axios defaults for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('userData', JSON.stringify(user));
        console.log('AuthService: Stored token and user data in localStorage');
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
      console.log('Logging out user');
      
      // Get current token for logout request
      const token = this.getToken();
      
      // Make logout request to Express backend if token exists
      if (token) {
        try {
          await axios.post(`${this.baseURL}/auth/logout`, {}, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.warn('Logout API call failed, but continuing with local cleanup:', error);
        }
      }
      
      // Clear token from axios defaults
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
      
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
      const token = localStorage.getItem('authToken');
      console.log('AuthService: Getting token from localStorage:', !!token);
      return token;
    }
    return null;
  }

  /**
   * Get stored user data
   */
  getUserData(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      console.log('AuthService: Getting user data from localStorage:', !!userData);
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          console.log('AuthService: Parsed user data:', !!parsed);
          return parsed;
        } catch (error) {
          console.error('AuthService: Error parsing user data:', error);
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
    console.log('AuthService: Initializing auth with token:', !!token);
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('AuthService: Set axios authorization header');
    }
  }

  /**
   * Refresh authentication state
   */
  async refreshAuth(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Check if we have user data in localStorage
      const userData = this.getUserData();
      if (userData) {
        console.log('AuthService: Refresh successful (using stored data)');
        return true;
      }
      
      console.log('AuthService: Refresh failed (no stored user data)');
      return false;
    } catch (error) {
      console.error('Error refreshing authentication:', error);
      return false;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      console.log('AuthService: Fetching current user profile');
      console.log('AuthService: Get current user URL:', `${this.baseURL}/auth/me`);
      
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('AuthService: Using token for current user request:', !!token);
      
      // Make API call to Express backend
      const response = await axios.get(`${this.baseURL}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('AuthService: Current user response:', response.data);
      return response.data.user || response.data.data || response.data;
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
      console.log('AuthService: Validating token');
      
      if (!token || token.trim() === '') {
        console.log('AuthService: Token is empty or invalid');
        return false;
      }
      
      // For now, just check if token exists and has a valid format
      // Since /auth/me endpoint is not available, we'll rely on localStorage data
      const userData = this.getUserData();
      if (userData) {
        console.log('AuthService: Token validation successful (using stored data)');
        return true;
      }
      
      console.log('AuthService: Token validation failed (no stored user data)');
      return false;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
