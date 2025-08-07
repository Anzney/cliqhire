// Types for candidate data
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

class CandidateService {

  /**
   * Fetch candidate details by ID
   */
  async getCandidateById(candidateId: string): Promise<Candidate> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/${candidateId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch candidate: ${response.statusText}`);
      }

      const apiResponse: ApiResponse<Candidate> = await response.json();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldKey,
          value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update field: ${response.statusText}`);
      }

      const apiResponse: ApiResponse<Candidate> = await response.json();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/${candidateId}/fields`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update fields: ${response.statusText}`);
      }

      const apiResponse: ApiResponse<Candidate> = await response.json();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update candidate: ${response.statusText}`);
      }

      const apiResponse: ApiResponse<Candidate> = await response.json();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete candidate: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
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

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/candidates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch candidates: ${response.statusText}`);
      }

      const apiResponse: ApiResponse<Candidate[]> = await response.json();
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/${candidateId}/resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload resume: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
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
      let response: Response;
      
      if (candidateData instanceof FormData) {
        // FormData for file uploads
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates`, {
          method: 'POST',
          body: candidateData,
          // Note: Don't set Content-Type header when sending FormData
          // The browser will automatically set it with the boundary
        });
      } else {
        // JSON payload
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(candidateData),
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to create candidate: ${response.statusText}`);
      }

      const apiResponse: ApiResponse<Candidate> = await response.json();
      return apiResponse.data || apiResponse as any;
    } catch (error) {
      console.error('Error creating candidate:', error);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch candidate stats: ${response.statusText}`);
      }

      const apiResponse: ApiResponse<{
        total: number;
        active: number;
        placed: number;
        pending: number;
      }> = await response.json();
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