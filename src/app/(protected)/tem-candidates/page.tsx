'use client';

import React from 'react';
import { useTemporaryCandidates } from '@/hooks/useTem-candidate';
import { CandidateList } from '@/components/tem-candidates';

const TemporaryCandidatesPage = () => {
  const {
    candidates,
    results,
    isLoading,
    error,
    refetch,
  } = useTemporaryCandidates();

  return (
    <div className="container mx-auto py-6 px-4">
      <CandidateList
        candidates={candidates}
        isLoading={isLoading}
        error={error}
        results={results}
        onRefresh={refetch}
      />
    </div>
  );
};

export default TemporaryCandidatesPage;