import axios from 'axios';
import { 
  TeamMember, 
  TeamMemberResponse, 
  TeamMemberFilters, 
  CreateTeamMemberData, 
  UpdateTeamMemberData 
} from '@/types/teamMember';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";
console.log('Team Members Service - API_URL:', API_URL);

// Get all team members with optional filters
export const getTeamMembers = async (filters?: TeamMemberFilters): Promise<{ teamMembers: TeamMember[] }> => {
  try {
    console.log('Making API call to:', `${API_URL}/api/users`);
    
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config = {
      params: filters,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
    
    const response = await axios.get(`${API_URL}/api/users`, config);
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
    
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
    
    const response = await axios.get(`${API_URL}/api/users/${id}`, config);
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
    const response = await axios.post(`${API_URL}/api/users/add-member`, teamMemberData);
    
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
    const response = await axios.put(`${API_URL}/api/users/${_id}`, updateData);
    
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
    const response = await axios.delete(`${API_URL}/api/users/${id}`);
    
    if (!response.data || response.data.status !== 'success') {
      throw new Error(response.data?.message || 'Failed to delete team member');
    }
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete team member');
  }
};

// Update team member status
export const updateTeamMemberStatus = async (id: string, status: string): Promise<TeamMember> => {
  try {
    const response = await axios.patch(`${API_URL}/api/users/${id}/status`, { status });
    
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
    
    const response = await axios.post(`${API_URL}/api/users/${id}/resume`, formData, {
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
    const response = await axios.get(`${API_URL}/api/users/${id}/stats`);
    
    if (response.data && response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch team member stats');
  } catch (error: any) {
    console.error('Error fetching team member stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch team member stats');
  }
}; 