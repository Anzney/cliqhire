"use client"

import { ClientTeam } from "./Client-Team"
import { InternalTeam } from "./Internal-Team"

interface TeamContentProps {
  jobId: string;
}

export function TeamContent({ jobId }: TeamContentProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 max-w-full mx-auto">
      <div className="h-full"><ClientTeam jobId={jobId} /></div>
      <div className="h-full"><InternalTeam /></div>
    </div>
  )
}