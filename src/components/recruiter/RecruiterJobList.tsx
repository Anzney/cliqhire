"use client"
import type { RecruiterJob } from "./types"
import { RecruiterJobCard } from "./RecruiterJobCard"

type RecruiterJobListProps = {
  jobs: RecruiterJob[]
  loadingJobId: string | null
  onToggleExpansion: (jobId: string) => void
}

export function RecruiterJobList({ jobs, loadingJobId, onToggleExpansion }: RecruiterJobListProps) {
  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <RecruiterJobCard
          key={job.id}
          job={job}
          loadingJobId={loadingJobId}
          onToggleExpansion={onToggleExpansion}
        />
      ))}
    </div>
  )
}

