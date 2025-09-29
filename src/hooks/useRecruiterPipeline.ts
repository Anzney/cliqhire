import { useState, useCallback } from 'react';
import { RecruiterPipelineService, StageFieldUpdate } from '@/services/recruiterPipelineService';
import { mapUIStageToBackendStage } from '@/components/Recruiter-Pipeline/dummy-data';
import { toast } from 'sonner';

export interface UseRecruiterPipelineProps {
  pipelineId: string;
  candidateId: string;
}

export const useRecruiterPipeline = ({ pipelineId, candidateId }: UseRecruiterPipelineProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStageField = useCallback(async (
    stageName: string,
    fieldKey: string,
    fieldValue: any,
    notes?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData: StageFieldUpdate = {
        fields: {
          [fieldKey]: fieldValue
        },
        notes: notes || `Updated ${fieldKey} to: ${fieldValue}`
      };

      const backendStage = mapUIStageToBackendStage(stageName);
      const response = await RecruiterPipelineService.updateStageFields(
        pipelineId,
        candidateId,
        backendStage,
        updateData
      );

      if (response.success) {
        toast.success('Field updated successfully');
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to update field');
        toast.error(response.error || 'Failed to update field');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating the field';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [pipelineId, candidateId]);

  const getStageFields = useCallback(async (stageName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await RecruiterPipelineService.getStageFields(
        pipelineId,
        candidateId,
        stageName
      );

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to fetch stage fields');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching stage fields';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [pipelineId, candidateId]);

  const moveCandidateToStage = useCallback(async (newStage: string, notes?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const backendStage = mapUIStageToBackendStage(newStage);
      const response = await RecruiterPipelineService.moveCandidateToStage(
        pipelineId,
        candidateId,
        backendStage,
        notes
      );

      if (response.success) {
        toast.success('Candidate moved to new stage successfully');
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to move candidate');
        toast.error(response.error || 'Failed to move candidate');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while moving candidate';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [pipelineId, candidateId]);

  return {
    isLoading,
    error,
    updateStageField,
    getStageFields,
    moveCandidateToStage,
    clearError: () => setError(null)
  };
};
