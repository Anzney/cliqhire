import { useQuery, useQueryClient } from '@tanstack/react-query';
import { temCandidateService } from '@/services/temCandidateService';
import { TemporaryCandidate, TemporaryCandidatesResponse } from '@/types/temCandidate';

export const useTemporaryCandidates = () => {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery<TemporaryCandidatesResponse>({
    queryKey: ['temporary-candidates'],
    queryFn: () => temCandidateService.getAllTemporaryCandidates(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const candidates = response?.data || [];
  const results = response?.results || 0;

  const invalidateCandidates = () => {
    queryClient.invalidateQueries({ queryKey: ['temporary-candidates'] });
  };

  return {
    candidates,
    results,
    isLoading,
    error,
    refetch,
    invalidateCandidates,
  };
};