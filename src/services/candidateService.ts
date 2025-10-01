// Types for candidate data
import { api } from "@/lib/axios-config";
import axios, { AxiosError } from "axios";

export interface Candidate {
  _id?: string; // MongoDB ID from API response
  name?: string;
  location?: string;
  experience?: string;
  totalRelevantExperience?: string;
  noticePeriod?: string;
  skills?: string[];
  resume?: string;
  status?: string;
  referredBy?: string;
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  country?: string;
  nationality?: string;
  universityName?: string;
  educationDegree?: string;
  primaryLanguage?: string;
  willingToRelocate?: string;
  description?: string;
  phone?: string;
  email?: string;
  otherPhone?: string;
  linkedin?: string;
  currentSalary?: string | number;
  currentSalaryCurrency?: string;
  expectedSalary?: string | number;
  expectedSalaryCurrency?: string;
  previousCompanyName?: string;
  currentJobTitle?: string;
  reportingTo?: string;
  totalStaffReporting?: string;
  softSkill?: string[];
  technicalSkill?: string[];
  recruitmentManager?: string;
  recruiter?: string;
  teamLead?: string;
  cv?: File; // For file upload during creation
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateFieldRequest {
  fieldKey: string;
  value: any;
}

// API Response interfaces
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  results?: number;
}

export interface UpdateFieldResponse {
  success: boolean;
  message: string;
  candidate?: Candidate;
}

export interface ApplyJobResponse {
  success: boolean;
  data?: any;
  message?: string;
}

class CandidateService {

  /**
   * Fetch candidate details by ID
   */
  async getCandidateById(candidateId: string): Promise<Candidate> {
    try {
      const response = await api.get(`/api/candidates/${candidateId}`);
      const apiResponse: ApiResponse<Candidate> = response.data;
      return apiResponse.data || apiResponse as any;
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  }

  /**
   * Update a specific field for a candidate
   */
  async updateCandidateField(
    candidateId: string, 
    fieldKey: string, 
    value: any
  ): Promise<UpdateFieldResponse> {
    try {
      const response = await api.patch(`/api/candidates/${candidateId}`, {
        fieldKey,
        value,
      });

      const apiResponse: ApiResponse<Candidate> = response.data;
      return {
        success: apiResponse.status === 'success',
        message: apiResponse.message || 'Field updated successfully',
        candidate: apiResponse.data
      };
    } catch (error) {
      console.error('Error updating candidate field:', error);
      throw error;
    }
  }

  /**
   * Update multiple fields for a candidate
   */
  async updateCandidateFields(
    candidateId: string, 
    updates: Record<string, any>
  ): Promise<UpdateFieldResponse> {
    try {
      const response = await api.patch(`/api/candidates/${candidateId}/fields`, { updates });

      const apiResponse: ApiResponse<Candidate> = response.data;
      return {
        success: apiResponse.status === 'success',
        message: apiResponse.message || 'Fields updated successfully',
        candidate: apiResponse.data
      };
    } catch (error) {
      console.error('Error updating candidate fields:', error);
      throw error;
    }
  }

  /**
   * Update candidate details (partial updates supported)
   */
  async updateCandidate(
    candidateId: string, 
    candidateData: Partial<Candidate>
  ): Promise<Candidate> {
    try {
      const response = await api.patch(`/api/candidates/${candidateId}`, candidateData);

      const apiResponse: ApiResponse<Candidate> = response.data;
      return apiResponse.data || apiResponse as any;
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  }

  /**
   * Delete a candidate
   */
  async deleteCandidate(candidateId: string): Promise<void> {
    try {
      await api.delete(`/api/candidates/${candidateId}`);
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  }

  /**
   * Apply candidate to a job
   * Endpoint: POST /api/candidates/:candidateId/apply/:jobId
   */
  async applyToJob(candidateId: string, jobId: string): Promise<ApplyJobResponse> {
    try {
      const response = await api.post(`/api/candidates/${candidateId}/apply/${jobId}`);
      return response.data as ApplyJobResponse;
    } catch (error) {
      console.error('Error applying candidate to job:', error);
      throw error;
    }
  }

  /**
   * Get all candidates with optional filtering
   */
  async getCandidates(params?: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ candidates: Candidate[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `/api/candidates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await api.get(url);

      const apiResponse: ApiResponse<Candidate[]> = response.data;
      return {
        candidates: apiResponse.data || [],
        total: apiResponse.results || 0
      };
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }

  /**
   * Upload candidate resume
   */
  async uploadResume(candidateId: string, file: File): Promise<{ resumeUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post(`/api/candidates/${candidateId}/resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  /**
   * Create a new candidate
   * Supports both FormData (for file uploads) and JSON payloads
   */
  async createCandidate(candidateData: FormData | Partial<Candidate>): Promise<Candidate> {
    try {
      let response: any;
      
      if (candidateData instanceof FormData) {
        // FormData for file uploads
        response = await api.post(`/api/candidates`, candidateData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // JSON payload
        response = await api.post(`/api/candidates`, candidateData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const apiResponse: ApiResponse<Candidate> = response.data;
      return apiResponse.data || apiResponse as any;
    } catch (error) {
      console.error('Error creating candidate:', error);
      // Surface backend validation messages (e.g., duplicate email/phone)
      if (axios.isAxiosError(error)) {
        const respData: any = error.response?.data;
        const backendMessage =
          (respData && (respData.message || respData.error || respData.errors?.[0]?.message)) ||
          error.message;
        throw new Error(backendMessage);
      }
      throw error;
    }
  }

  /**
   * Get candidate statistics
   */
  async getCandidateStats(): Promise<{
    total: number;
    active: number;
    placed: number;
    pending: number;
  }> {
    try {
      const response = await api.get(`/api/candidates/stats`);

      const apiResponse: ApiResponse<{
        total: number;
        active: number;
        placed: number;
        pending: number;
      }> = response.data;
      return apiResponse.data || apiResponse as any;
    } catch (error) {
      console.error('Error fetching candidate stats:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const candidateService = new CandidateService();

// Export the class for testing purposes
export default CandidateService; 