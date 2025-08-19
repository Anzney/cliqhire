import axios from 'axios';
import { api } from '@/lib/axios-config';
import { 
  TeamMember, 
  TeamMemberResponse, 
  TeamMemberFilters, 
  CreateTeamMemberData, 
  UpdateTeamMemberData 
} from '@/types/teamMember';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('Team Members Service - API_URL:', API_URL);

// Get all team members with optional filters
export const getTeamMembers = async (filters?: TeamMemberFilters): Promise<{ teamMembers: TeamMember[] }> => {
  try {
    console.log('Making API call to:', `${API_URL}/api/users`);
    
    const response = await api.get('/api/users', { params: filters });
    console.log('API response for team members list:', response.data);

    if (response.data && response.data.status === 'success') {
      return {
        teamMembers: response.data.data.users || []
      };
    }
    throw new Error(response.data?.message || 'Failed to fetch team members');
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch team members');
  }
};

// Get a single team member by ID
export const getTeamMemberById = async (id: string): Promise<TeamMember> => {
  try {
    console.log('Making API call to:', `${API_URL}/api/users/${id}`);
    
    const response = await api.get(`/api/users/${id}`);
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
  } catch (error: any) {
    console.error('Error fetching team member:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to fetch team member');
  }
};

// Create a new team member
export const createTeamMember = async (teamMemberData: CreateTeamMemberData): Promise<TeamMember> => {
  try {
    const response = await api.post('/api/users/add-member', teamMemberData);
    
    if (response.data && response.data.status === 'success') {
      return response.data.data.user || response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to create team member');
  } catch (error: any) {
    console.error('Error creating team member:', error);
    throw new Error(error.response?.data?.message || 'Failed to create team member');
  }
};

// Update a team member
export const updateTeamMember = async (teamMemberData: UpdateTeamMemberData): Promise<TeamMember> => {
  try {
    const { _id, ...updateData } = teamMemberData;
    const response = await api.put(`/api/users/${_id}`, updateData);
    
    if (response.data && response.data.status === 'success') {
      return response.data.data.user || response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to update team member');
  } catch (error: any) {
    console.error('Error updating team member:', error);
    throw new Error(error.response?.data?.message || 'Failed to update team member');
  }
};

// Delete a team member
export const deleteTeamMember = async (id: string): Promise<void> => {
  try {
    console.log('Making DELETE API call to:', `${API_URL}/api/users/${id}`);
    
    const response = await api.delete(`/api/users/${id}`);
    console.log('Delete API response:', response.data);
    
    if (!response.data || response.data.status !== 'success') {
      throw new Error(response.data?.message || 'Failed to delete team member');
    }
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    
    if (error.response?.status === 403) {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Team member not found');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to delete team member');
  }
};

// Update team member status
export const updateTeamMemberStatus = async (id: string, status: string): Promise<TeamMember> => {
  try {
    const response = await api.patch(`/api/users/${id}/status`, { status });
    
    if (response.data && response.data.status === 'success') {
      return response.data.data.user || response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to update team member status');
  } catch (error: any) {
    console.error('Error updating team member status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update team member status');
  }
};

// Upload team member resume
export const uploadResume = async (id: string, file: File): Promise<{ resumeUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post(`/api/users/${id}/resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data && response.data.status === 'success') {
      return { resumeUrl: response.data.data.resumeUrl };
    }
    throw new Error(response.data?.message || 'Failed to upload resume');
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload resume');
  }
};

// Get team member statistics
export const getTeamMemberStats = async (id: string): Promise<{
  activeJobs: number;
  completedPlacements: number;
  performanceRating: number;
}> => {
  try {
    const response = await api.get(`/api/users/${id}/stats`);
    
    if (response.data && response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch team member stats');
  } catch (error: any) {
    console.error('Error fetching team member stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch team member stats');
  }
}; 

// Register team member with authentication credentials (Admin only)
// export const registerTeamMember = async (registrationData: {
//   teamMemberId: string;
//   teamMemberName: string;
//   email: string;
//   password: string;
// }): Promise<{
//   success: boolean;
//   message: string;
//   user?: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//     teamMemberId: string;
//     isActive: boolean;
//     createdAt: string;
//   };
// }> => {
//   try {
//     // Get token from localStorage
//     const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
//     if (!token) {
//       throw new Error('Authentication token not found. Please log in again.');
//     }

//     const response = await axios.post(`${API_URL}/api/auth/register-member`, registrationData, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (response.data && response.data.success) {
//       return {
//         success: true,
//         message: response.data.message || 'Team member registered successfully',
//         user: response.data.data?.user
//       };
//     }

//     throw new Error(response.data?.message || 'Failed to register team member');
//   } catch (error: any) {
//     console.error('Error registering team member:', error);
    
//     if (error.response?.status === 403) {
//       throw new Error('Access denied. Admin privileges required.');
//     }
    
//     if (error.response?.status === 404) {
//       throw new Error('Team member not found');
//     }
    
//     if (error.response?.status === 409) {
//       throw new Error('User with this email already exists');
//     }
    
//     if (error.response?.status === 400) {
//       throw new Error(error.response.data?.message || 'Invalid request data');
//     }

//     throw new Error(error.response?.data?.message || error.message || 'Failed to register team member');
//   }
// }; 

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
  try {
    const response = await api.post('/api/auth/register-member', registrationData);

    if (response.data && response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Team member registered successfully',
        user: response.data.data?.user
      };
    }

    throw new Error(response.data?.message || 'Failed to register team member');
  } catch (error: any) {
    console.error('Error registering team member:', error);
    
    if (error.response?.status === 403) {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Team member not found');
    }
    
    if (error.response?.status === 409) {
      throw new Error('User with this email already exists');
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid request data');
    }

    throw new Error(error.response?.data?.message || error.message || 'Failed to register team member');
  }
}; 