import axios from 'axios';

// You can configure this base URL to point to your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CreateTempCandidateRequest {
  name: string;
  profileLink: string;
  email?: string;
  phone?: string;
  pipelineId: string;
}

export interface TempCandidate {
  id: string;
  name: string;
  profileLink: string;
  email?: string;
  phone?: string;
  pipelineId: string;
  createdAt: string;
  updatedAt: string;
}

export const tempCandidateService = {
  async createTempCandidate(data: CreateTempCandidateRequest): Promise<TempCandidate> {
    const response = await axios.post(`${API_BASE_URL}/api/temp-candidates`, data);
    return response.data;
  },

  async getTempCandidates(pipelineId?: string): Promise<TempCandidate[]> {
    const params = pipelineId ? { pipelineId } : {};
    const response = await axios.get(`${API_BASE_URL}/api/temp-candidates`, { params });
    return response.data;
  },

  async getTempCandidateById(id: string): Promise<TempCandidate> {
    const response = await axios.get(`${API_BASE_URL}/api/temp-candidates/${id}`);
    return response.data;
  },

  async updateTempCandidate(id: string, data: Partial<CreateTempCandidateRequest>): Promise<TempCandidate> {
    const response = await axios.put(`${API_BASE_URL}/api/temp-candidates/${id}`, data);
    return response.data;
  },

  async deleteTempCandidate(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/temp-candidates/${id}`);
  }
};
