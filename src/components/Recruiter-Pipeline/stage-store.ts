import { create } from 'zustand';

interface StageChange {
  jobId: string;
  candidateId: string;
  stage: string;
  timestamp: number;
}

interface StageStore {
  stageChanges: StageChange[];
  updateCandidateStage: (jobId: string, candidateId: string, newStage: string) => void;
  getCandidateStage: (jobId: string, candidateId: string) => string | null;
  clearStageChanges: () => void;
}

export const useStageStore = create<StageStore>((set, get) => ({
  stageChanges: [],
  
  updateCandidateStage: (jobId: string, candidateId: string, newStage: string) => {
    set((state) => {
      // Remove any existing stage change for this candidate in this job
      const filteredChanges = state.stageChanges.filter(
        change => !(change.jobId === jobId && change.candidateId === candidateId)
      );
      
      // Add the new stage change
      const newChange: StageChange = {
        jobId,
        candidateId,
        stage: newStage,
        timestamp: Date.now(),
      };
      
      return {
        stageChanges: [...filteredChanges, newChange],
      };
    });
  },
  
  getCandidateStage: (jobId: string, candidateId: string) => {
    const state = get();
    const stageChange = state.stageChanges.find(
      change => change.jobId === jobId && change.candidateId === candidateId
    );
    return stageChange ? stageChange.stage : null;
  },
  
  clearStageChanges: () => {
    set({ stageChanges: [] });
  },
}));
