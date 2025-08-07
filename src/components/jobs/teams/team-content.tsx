"use client"

import { JobData } from "../types";
import { ClientTeam } from "./Client-Team"
import { InternalTeam } from "./Internal-Team"

interface TeamContentProps {
  jobId: string;
  jobData: JobData;
}

export function TeamContent({ jobId, jobData }: TeamContentProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 max-w-full mx-auto">
      <div className="h-full"><ClientTeam jobId={jobId} jobData={jobData} /></div>
      <div className="h-full"><InternalTeam /></div>
    </div>
  )
}