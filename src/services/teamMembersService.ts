import axios from 'axios';
import { 
  TeamMember, 
  TeamMemberResponse, 
  TeamMemberFilters, 
  CreateTeamMemberData, 
  UpdateTeamMemberData 
} from '@/types/teamMember';
import { api } from '@/lib/axios-config';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";
console.log('Team Members Service - API_URL:', API_URL);

// Helper function to make authenticated requests with automatic token refresh
const makeAuthenticatedRequest = async <T>(
  requestFn: (token: string) => Promise<T>,
  retryCount: number = 0
): Promise<T> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return await requestFn(token);
  } catch (error: any) {
    // Check if error is due to token expiration
    if (error.response?.status === 401 && 
        (error.response?.data?.message?.includes('Token expired') || 
         error.response?.data?.message?.includes('Invalid token') ||
         error.response?.data?.message?.includes('Unauthorized'))) {
      
      if (retryCount === 0) {
        console.log('Token expired, attempting to refresh...');
        try {
          // Use the configured api instance which handles refresh automatically
          const response = await api.post('/api/auth/refresh', {});
          if (response.data && response.data.success) {
            const newToken = response.data.data.accessToken;
            localStorage.setItem('authToken', newToken);
            // Retry the request once with new token
            return await makeAuthenticatedRequest(requestFn, retryCount + 1);
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // Redirect to login or handle authentication failure
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
          }
          throw new Error('Authentication failed. Please log in again.');
        }
      }
    }
    
    throw error;
  }
};

// Get all team members with optional filters
export const getTeamMembers = async (filters?: TeamMemberFilters): Promise<{ teamMembers: TeamMember[] }> => {
  return makeAuthenticatedRequest(async (token) => {
    console.log('Making API call to:', `${API_URL}/api/users`);
    
    const config = {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await api.get('/api/users', config);
    console.log('API response for team members list:', response.data);

    if (response.data && response.data.status === 'success') {
      return {
        teamMembers: response.data.data.users || []
      };
    }
    throw new Error(response.data?.message || 'Failed to fetch team members');
  });
};

// Get a single team member by ID
export const getTeamMemberById = async (id: string): Promise<TeamMember> => {
  return makeAuthenticatedRequest(async (token) => {
    console.log('Making API call to:', `${API_URL}/api/users/${id}`);
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await api.get(`/api/users/${id}`, config);
    console.log('API response:', response.data);
    
    if (response.data && response.data.status === 'success') {
      const teamMember = response.data.data.user || response.data.data || response.data;
      console.log('Extracted team member:', teamMember);
      return teamMember;
    }
    
    // If the response doesn't have a status field, try to extract data directly
    if (response.data) {
      const teamMember = response.data.user || response.data;
      console.log('Extracted team member (no status):', teamMember);
      return teamMember;
    }
    
    throw new Error(response.data?.message || 'Failed to fetch team member');
  });
};

// Create a new team member
export const createTeamMember = async (teamMemberData: CreateTeamMemberData): Promise<TeamMember> => {
  return makeAuthenticatedRequest(async (token) => {
    const response = await api.post('/api/users/add-member', teamMemberData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data && response.data.status === 'success') {
      return response.data.data.user || response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to create team member');
  });
};

// Update a team member
export const updateTeamMember = async (teamMemberData: UpdateTeamMemberData): Promise<TeamMember> => {
  return makeAuthenticatedRequest(async (token) => {
    const { _id, ...updateData } = teamMemberData;
    const response = await api.put(`/api/users/${_id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data && response.data.status === 'success') {
      return response.data.data.user || response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to update team member');
  });
};

// Delete a team member
export const deleteTeamMember = async (id: string): Promise<void> => {
  return makeAuthenticatedRequest(async (token) => {
    console.log('Making DELETE API call to:', `${API_URL}/api/users/${id}`);
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await api.delete(`/api/users/${id}`, config);
    console.log('Delete API response:', response.data);
    
    if (!response.data || response.data.status !== 'success') {
      throw new Error(response.data?.message || 'Failed to delete team member');
    }
  });
};

// Update team member status
export const updateTeamMemberStatus = async (id: string, status: string): Promise<TeamMember> => {
  return makeAuthenticatedRequest(async (token) => {
    const response = await api.patch(`/api/users/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data && response.data.status === 'success') {
      return response.data.data.user || response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to update team member status');
  });
};

// Upload team member resume
export const uploadResume = async (id: string, file: File): Promise<{ resumeUrl: string }> => {
  return makeAuthenticatedRequest(async (token) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post(`/api/users/${id}/resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (response.data && response.data.status === 'success') {
      return { resumeUrl: response.data.data.resumeUrl };
    }
    throw new Error(response.data?.message || 'Failed to upload resume');
  });
};

// Get team member statistics
export const getTeamMemberStats = async (id: string): Promise<{
  activeJobs: number;
  completedPlacements: number;
  performanceRating: number;
}> => {
  return makeAuthenticatedRequest(async (token) => {
    const response = await api.get(`/api/users/${id}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data && response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch team member stats');
  });
}; 

// Register team member with authentication credentials (Admin only)
export const registerTeamMember = async (registrationData: {
  teamMemberId: string;
  teamMemberName: string;
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    teamMemberId: string;
    isActive: boolean;
    createdAt: string;
  };
}> => {
  return makeAuthenticatedRequest(async (token) => {
    const response = await api.post('/api/auth/register-member', registrationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.data && response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Team member registered successfully',
        user: response.data.data?.user
      };
    }

    throw new Error(response.data?.message || 'Failed to register team member');
  });
}; 