import axios from 'axios';
import { api } from '@/lib/axios-config';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('Team Service - API_URL:', API_URL);

export interface CreateTeamData {
  teamName: string;
  hiringManagerId: string;
  teamLeadId: string;
  recruiterIds: string[];
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  teamRole: string;
  department: string;
  phone: string;
  location: string;
  experience: string;
  status: string;
}

export interface Team {
  _id: string;
  teamName: string;
  hiringManagerId: TeamMember;
  teamLeadId: TeamMember;
  recruiters: TeamMember[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalMembers: number;
  recruiterCount: number;
}

export interface TeamResponse {
  status: string;
  message?: string;
  count?: number;
  data: Team[] | Team;
}

// Create a new team
export const createTeam = async (teamData: CreateTeamData): Promise<Team> => {
  try {
    console.log('Making API call to create team: /api/teams/create-team');
    console.log('Team data:', teamData);
    
    const response = await api.post('/api/teams/create-team', teamData);
    console.log('API response for team creation:', response.data);

    if (response.data && response.data.status === 'success') {
      return response.data.data.team || response.data.data;
    }
    
    // Handle specific error messages from the backend
    if (response.data && response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to create team');
    }
    
    throw new Error(response.data?.message || 'Failed to create team');
  } catch (error: any) {
    console.error('Error creating team:', error);
    
    // If it's a network error (like 404), provide a more helpful message
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      throw new Error('Unable to reach the team creation service. Please check your connection.');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to create team');
  }
};

// Get all teams
export const getTeams = async (): Promise<{ teams: Team[] }> => {
  try {
    console.log('Making API call to:', `${API_URL}/api/teams`);
    
    const response = await api.get('/api/teams');
    console.log('API response for teams list:', response.data);

    if (response.data && response.data.status === 'success') {
      return {
        teams: Array.isArray(response.data.data) ? response.data.data : []
      };
    }
    throw new Error(response.data?.message || 'Failed to fetch teams');
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch teams');
  }
};

// Get a single team by ID
export const getTeamById = async (id: string): Promise<Team> => {
  try {
    console.log('Making API call to:', `/api/teams/${id}`);
    
    const response = await api.get(`/api/teams/${id}`);
    console.log('API response:', response.data);
    
    if (response.data && response.data.status === 'success') {
      const team = response.data.data;
      console.log('Extracted team:', team);
      return team;
    }
    
    throw new Error(response.data?.message || 'Failed to fetch team');
  } catch (error: any) {
    console.error('Error fetching team:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to fetch team');
  }
};

// Update a team
export const updateTeam = async (id: string, teamData: Partial<CreateTeamData>): Promise<Team> => {
  try {
    console.log('Making API call to update team:', `/api/teams/${id}`);
    console.log('Update data:', teamData);
    
    const response = await api.put(`/api/teams/${id}`, teamData);
    console.log('API response for team update:', response.data);

    if (response.data && response.data.status === 'success') {
      return response.data.data.team || response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to update team');
  } catch (error: any) {
    console.error('Error updating team:', error);
    throw new Error(error.response?.data?.message || 'Failed to update team');
  }
};

// Delete a team
export const deleteTeam = async (id: string): Promise<void> => {
  try {
    console.log('Making API call to delete team:', `${API_URL}/api/teams/${id}`);
    
    const response = await api.delete(`/api/teams/${id}`);
    console.log('API response for team deletion:', response.data);

    if (response.data && response.data.status === 'success') {
      return;
    }
    throw new Error(response.data?.message || 'Failed to delete team');
  } catch (error: any) {
    console.error('Error deleting team:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete team');
  }
};
