import { useMutation, useQuery } from '@tanstack/react-query';
import { RecruiterPipelineService, StageFieldUpdate } from '@/services/recruiterPipelineService';
import { mapUIStageToBackendStage } from '@/components/Recruiter-Pipeline/dummy-data';
import { toast } from 'sonner';

export interface UseRecruiterPipelineProps {
  pipelineId: string;
  candidateId: string;
}

export const useRecruiterPipeline = ({ pipelineId, candidateId }: UseRecruiterPipelineProps) => {
  const updateStageFieldMutation = useMutation({
    mutationFn: async ({
      stageName,
      fieldKey,
      fieldValue,
      notes,
    }: {
      stageName: string;
      fieldKey: string;
      fieldValue: any;
      notes?: string;
    }) => {
      const updateData: StageFieldUpdate = {
        fields: {
          [fieldKey]: fieldValue,
        },
        notes: notes || `Updated ${fieldKey} to: ${fieldValue}`,
      };

      const backendStage = mapUIStageToBackendStage(stageName);
      const response = await RecruiterPipelineService.updateStageFields(
        pipelineId,
        candidateId,
        backendStage,
        updateData
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to update field');
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success('Field updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update field');
    },
  });

  const getStageFieldsQuery = useQuery({
    queryKey: ['stageFields', pipelineId, candidateId],
    queryFn: async () => {
      const response = await RecruiterPipelineService.getStageFields(
        pipelineId,
        candidateId,
        ''
      );
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch stage fields');
      }
      return response.data;
    },
    // Only fetching if we explicitly want to, since stageName is required usually, 
    // it's better to provide a way to pass the stageName dynamically or keep as a function if we can't do it via useQuery directly.
    enabled: false, 
  });

  // Re-implemented as a simple async function wrapping the service because stageName is dynamic
  const getStageFields = async (stageName: string) => {
    try {
      const response = await RecruiterPipelineService.getStageFields(
        pipelineId,
        candidateId,
        stageName
      );
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const moveCandidateToStageMutation = useMutation({
    mutationFn: async ({ newStage, notes }: { newStage: string; notes?: string }) => {
      const backendStage = mapUIStageToBackendStage(newStage);
      const response = await RecruiterPipelineService.moveCandidateToStage(
        pipelineId,
        candidateId,
        backendStage,
        notes
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to move candidate');
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success('Candidate moved to new stage successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to move candidate');
    },
  });

  return {
    isLoading: updateStageFieldMutation.isPending || moveCandidateToStageMutation.isPending,
    error: updateStageFieldMutation.error?.message || moveCandidateToStageMutation.error?.message || null,
    updateStageField: async (stageName: string, fieldKey: string, fieldValue: any, notes?: string) => {
      try {
        await updateStageFieldMutation.mutateAsync({ stageName, fieldKey, fieldValue, notes });
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },
    getStageFields,
    moveCandidateToStage: async (newStage: string, notes?: string) => {
      try {
        await moveCandidateToStageMutation.mutateAsync({ newStage, notes });
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },
    clearError: () => {
      updateStageFieldMutation.reset();
      moveCandidateToStageMutation.reset();
    },
  };
};
