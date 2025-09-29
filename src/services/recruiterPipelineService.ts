import { api } from '@/lib/axios-config';

export interface StageFieldUpdate {
  fields: Record<string, any>;
  notes?: string;
}

export interface StageFieldUpdateResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export class RecruiterPipelineService {
  /**
   * Update stage fields for a specific candidate in a pipeline
   * @param pipelineId - The ID of the pipeline
   * @param candidateId - The ID of the candidate
   * @param stageName - The stage name (Sourcing, Screening, Client Screening, Interview, Verification, Onboarding, Hired)
   * @param updateData - The fields to update and optional notes
   * @returns Promise with the update response
   */
  static async updateStageFields(
    pipelineId: string,
    candidateId: string,
    stageName: string,
    updateData: StageFieldUpdate
  ): Promise<StageFieldUpdateResponse> {
    try {
      console.log('Updating stage fields:', {
        pipelineId,
        candidateId,
        stageName,
        updateData
      });

      const response = await api.patch(
        `/api/recruiter-pipeline/${pipelineId}/candidate/${candidateId}/stage/${encodeURIComponent(stageName)}/fields`,
        updateData
      );

      console.log('Stage fields update response:', response.data);

      return {
        success: true,
        message: 'Stage fields updated successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Error updating stage fields:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        message: 'Failed to update stage fields',
        error: error.response?.data?.message || error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Get stage fields for a specific candidate in a pipeline
   * @param pipelineId - The ID of the pipeline
   * @param candidateId - The ID of the candidate
   * @param stageName - The stage name
   * @returns Promise with the stage fields data
   */
  static async getStageFields(
    pipelineId: string,
    candidateId: string,
    stageName: string
  ): Promise<StageFieldUpdateResponse> {
    try {
      console.log('Getting stage fields:', {
        pipelineId,
        candidateId,
        stageName
      });

      const response = await api.get(
        `/api/recruiter-pipeline/${pipelineId}/candidate/${candidateId}/stage/${encodeURIComponent(stageName)}/fields`
      );

      console.log('Stage fields response:', response.data);

      return {
        success: true,
        message: 'Stage fields retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching stage fields:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        message: 'Failed to fetch stage fields',
        error: error.response?.data?.message || error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all candidates in a pipeline
   * @param pipelineId - The ID of the pipeline
   * @returns Promise with the candidates data
   */
  static async getPipelineCandidates(pipelineId: string): Promise<StageFieldUpdateResponse> {
    try {
      const response = await api.get(`/api/recruiter-pipeline/${pipelineId}/candidates`);

      return {
        success: true,
        message: 'Pipeline candidates retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching pipeline candidates:', error);
      
      return {
        success: false,
        message: 'Failed to fetch pipeline candidates',
        error: error.response?.data?.message || error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Move a candidate to a different stage
   * @param pipelineId - The ID of the pipeline
   * @param candidateId - The ID of the candidate
   * @param newStage - The new stage name
   * @param notes - Optional notes for the stage change
   * @returns Promise with the move response
   */
  static async moveCandidateToStage(
    pipelineId: string,
    candidateId: string,
    newStage: string,
    notes?: string
  ): Promise<StageFieldUpdateResponse> {
    try {
      console.log('Moving candidate to stage:', {
        pipelineId,
        candidateId,
        newStage,
        notes
      });

      const response = await api.patch(
        `/api/recruiter-pipeline/${pipelineId}/candidate/${candidateId}/move`,
        {
          newStage,
          notes
        }
      );

      console.log('Move candidate response:', response.data);

      return {
        success: true,
        message: 'Candidate moved to new stage successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Error moving candidate to stage:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        message: 'Failed to move candidate to new stage',
        error: error.response?.data?.message || error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Get current pipeline entry data for debugging
   * @param pipelineId - The ID of the pipeline
   * @returns Promise with the pipeline data
   */
  static async getPipelineEntry(pipelineId: string): Promise<StageFieldUpdateResponse> {
    try {
      console.log('Getting pipeline entry:', { pipelineId });

      const response = await api.get(`/api/recruiter-pipeline/${pipelineId}`);

      console.log('Pipeline entry response:', response.data);

      return {
        success: true,
        message: 'Pipeline entry retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching pipeline entry:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        message: 'Failed to fetch pipeline entry',
        error: error.response?.data?.message || error.message || 'Unknown error occurred'
      };
    }
  }
}
