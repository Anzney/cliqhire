"use client"

import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import Link from "next/link"

interface CandidatesContentProps {
  jobId: string;
}

export function CandidatesContent({ jobId }: CandidatesContentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-240px)]">
      {/* Empty state illustration */}
      <div className="w-48 h-48 mb-6">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
        >
          <rect width="140" height="180" x="30" y="10" rx="8" fill="#E5E7EB"/>
          <circle cx="100" cy="60" r="24" fill="#60A5FA"/>
          <rect width="80" height="8" x="60" y="100" rx="4" fill="#60A5FA"/>
          <rect width="60" height="8" x="70" y="120" rx="4" fill="#60A5FA"/>
          <rect width="40" height="8" x="80" y="140" rx="4" fill="#60A5FA"/>
          <path d="M30 170 L170 170" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4 4"/>
          <circle cx="100" cy="170" r="4" fill="#60A5FA"/>
        </svg>
      </div>

      {/* Text content */}
      <h3 className="text-xl font-semibold mb-2">No candidates have been added to this job yet</h3>
      <p className="text-muted-foreground text-center max-w-lg mb-8">
        Adding candidates to a job will allow you to track and manage them throughout the recruitment stages of that job and much more.
      </p>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Candidate
        </Button>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Post to job boards
        </Button>
      </div>

      {/* Learn more link */}
      <Link 
        href="#" 
        className="mt-4 text-blue-500 hover:underline text-sm"
      >
        Learn more about candidates
      </Link>
    </div>
  )
}