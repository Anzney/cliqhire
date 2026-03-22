import { TemporaryCandidatesResponse } from '@/types/temCandidate';
import { api } from '@/lib/axios-config';

export const temCandidateService = {
  async getAllTemporaryCandidates(): Promise<TemporaryCandidatesResponse> {
    const response = await api.get('/api/temp-candidates');
    return response.data;
  }
};