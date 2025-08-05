// Types for candidate data
export interface Candidate {
  id: string;
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
  phone?: string;
  email?: string;
  otherPhone?: string;
  linkedin?: string;
  previousCompanyName?: string;
  currentJobTitle?: string;
  reportingTo?: string;
  totalStaffReporting?: string;
  softSkill?: string;
  technicalSkill?: string;
  // Add other fields as needed
}

export interface UpdateFieldRequest {
  fieldKey: string;
  value: any;
}

export interface UpdateFieldResponse {
  success: boolean;
  message: string;
  candidate?: Candidate;
}

class CandidateService {
  private baseUrl: string;

  constructor() {
    // You can configure this based on your environment
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * Fetch candidate details by ID
   */
  async getCandidateById(candidateId: string): Promise<Candidate> {
    try {
      const response = await fetch(`${this.baseUrl}/candidates/${candidateId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch candidate: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
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
      const response = await fetch(`${this.baseUrl}/candidates/${candidateId}/field`, {
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

      const data = await response.json();
      return data;
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
      const response = await fetch(`${this.baseUrl}/candidates/${candidateId}/fields`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update fields: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating candidate fields:', error);
      throw error;
    }
  }

  /**
   * Update candidate details (full object)
   */
  async updateCandidate(
    candidateId: string, 
    candidateData: Partial<Candidate>
  ): Promise<Candidate> {
    try {
      const response = await fetch(`${this.baseUrl}/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update candidate: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
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
      const response = await fetch(`${this.baseUrl}/candidates/${candidateId}`, {
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

      const url = `${this.baseUrl}/candidates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch candidates: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
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

      const response = await fetch(`${this.baseUrl}/candidates/${candidateId}/resume`, {
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
   * Get candidate statistics
   */
  async getCandidateStats(): Promise<{
    total: number;
    active: number;
    placed: number;
    pending: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/candidates/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch candidate stats: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
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