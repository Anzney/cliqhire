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

  async applyJobToCandidates(jobId: string, candidates: string[] | string): Promise<any> {
    const payload = Array.isArray(candidates)
      ? { jobId, candidateIds: candidates }
      : { jobId, candidateId: candidates };
    const response = await api.post(`/api/headhunter-candidates/apply-job`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.data || response.data;
  }

  async getJobCandidates(jobId: string): Promise<any[]> {
    const response = await api.get(`/api/jobs/${jobId}/headhunter-candidates`);
    const data = response.data?.data || response.data?.candidates || [];
    return Array.isArray(data) ? data : [];
  }

  async updateCandidate(id: string, payload: Record<string, any>): Promise<any> {
    const response = await api.patch(`/api/headhunter-candidates/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.data || response.data;
  }
}

export const headhunterCandidatesService = new HeadhunterCandidatesService();