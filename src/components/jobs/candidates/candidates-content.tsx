"use client"

import { AddCandidateDialog } from "./add-candidate-dialog"
import { useRef, useState } from "react"
import { Candidate } from "@/services/candidateService"
import { JobCandidatesList, JobCandidatesListRef } from "./job-candidates-list"

interface CandidatesContentProps {
  jobId: string;
  jobTitle?: string;
  reloadToken?: number;
}

export function CandidatesContent({ jobId, jobTitle = "this job", reloadToken }: CandidatesContentProps) {
  const listRef = useRef<JobCandidatesListRef>(null);
  const [_, setCount] = useState<number>(0);

  const handleCandidatesAdded = async () => {
    await listRef.current?.refresh();
  };

  return (
    <div className="flex flex-col h-full">
      
      <JobCandidatesList
        ref={listRef}
        jobId={jobId}
        reloadToken={reloadToken}
        onLoaded={(count) => setCount(count)}
      />

      
    </div>
  )
}