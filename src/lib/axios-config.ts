import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

// Create axios instance with credentials support
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: This allows cookies to be sent
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Refresh token function
export const refreshToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    console.log('Attempting to refresh token...');
    
    // Call refresh token endpoint - refresh token is automatically sent via HTTP-only cookie
    const response = await api.post('/api/auth/refresh', {});

    if (response.data && response.data.success) {
      const newToken = response.data.data.accessToken;
      
      // Store new access token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', newToken);
      }
      
      // Update axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      console.log('Token refreshed successfully');
      processQueue(null, newToken);
      return newToken;
    } else {
      throw new Error(response.data?.message || 'Failed to refresh token');
    }
  } catch (error: any) {
    console.error('Error refreshing token:', error);
    
    // Clear access token on refresh failure
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    delete axios.defaults.headers.common['Authorization'];
    
    processQueue(error, null);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

// Initialize axios interceptors for global token refresh
export const initializeAxiosInterceptors = () => {
  // Request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await refreshToken();
          // Retry the original request with new token
          const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // Redirect to login on refresh failure
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Also set up interceptors for the default axios instance
  axios.interceptors.request.use(
    (config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await refreshToken();
          // Retry the original request with new token
          const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // Redirect to login on refresh failure
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Function to initialize authentication state (call this on app startup)
export const initializeAuth = async (): Promise<boolean> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    if (token) {
      console.log('Access token exists, setting up axios headers');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    } else {
      console.log('No access token found');
      return false;
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    return false;
  }
};

// Export the configured api instance
export { api };

// Initialize the interceptors immediately
initializeAxiosInterceptors();
