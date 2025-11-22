import { api } from "@/lib/axios-config";

export interface HeadhunterCandidatePayload {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  description?: string;
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  nationality?: string;
  willingToRelocate?: string;
}

export interface HeadhunterCandidateResponse {
  success: boolean;
  data?: any;
  message?: string;
}

class HeadhunterCandidatesService {
  async createCandidate(candidateData: FormData | HeadhunterCandidatePayload): Promise<any> {
    if (candidateData instanceof FormData) {
      const response = await api.post(`/api/headhunter-candidates`, candidateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.data || response.data;
    } else {
      const response = await api.post(`/api/headhunter-candidates`, candidateData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data?.data || response.data;
    }
  }

  async getCandidates(): Promise<any[]> {
    const response = await api.get(`/api/headhunter-candidates`);
    return response.data?.data || response.data || [];
  }

  async deleteCandidate(id: string): Promise<void> {
    await api.delete(`/api/headhunter-candidates/${id}`);
  }

  async getJobsSummary(headhunterId: string): Promise<any[]> {
    const response = await api.get(`/api/jobs/headhunter/${headhunterId}/summary`);
    const data = response.data?.data || response.data?.jobs || [];
    return Array.isArray(data) ? data : [];
  }
}

export const headhunterCandidatesService = new HeadhunterCandidatesService();