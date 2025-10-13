"use client"

import { Loader } from "lucide-react"
import { getJobById } from "@/services/jobService"
import { notFound } from "next/navigation"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { JobTabs } from "@/components/jobs/job-tabs"
import { JobData } from "@/components/jobs/types"
import { AddExistingCandidateDialog } from "@/components/common/add-existing-candidate-dialog"
import { useAuth } from "@/contexts/AuthContext"

interface PageProps {
  params: { id: string }
}
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function JobPage({ params }: PageProps) {
  const { id } = params
  const [addCandidateOpen, setAddCandidateOpen] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const [activeTab, setActiveTab] = useState<string>("summary")
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  let finalPermissions = (user?.permissions && user.permissions.length > 0) ? user.permissions : (user?.defaultPermissions || []);
  if (!isAdmin && !finalPermissions.includes('TODAY_TASKS')) {
    finalPermissions = [...finalPermissions, 'TODAY_TASKS'];
  }
  const canViewJobs = isAdmin || finalPermissions.includes('JOBS_VIEW') || finalPermissions.includes('JOBS');
  const canModifyJobs = isAdmin || finalPermissions.includes('JOBS_MODIFY');

  const queryClient = useQueryClient();
  const { data: job, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id),
    enabled: !!id,
    // Normalize API response to a single job object
    select: (res: any) => (Array.isArray(res?.data) ? res.data[0] : res?.data) as JobData | undefined,
    placeholderData: (prev) => prev,
  })

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center gap-2 flex-col">
        <Loader className="size-6 animate-spin" />
        <div className="text-center">Loading jobs...</div>
      </div>
    </div>
  }

  if (isError) {
    return <div className="flex items-center justify-center h-screen">Error: {error instanceof Error ? error.message : 'Failed to load job'}</div>
  }

  if (!job) {
    return notFound()
  }

  if (!canViewJobs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-muted-foreground">You do not have permission to view this job.</div>
      </div>
    )
  }

  const handleRefresh = async () => {
    refetch()
    queryClient.invalidateQueries({ queryKey: ['job', id] })
  }

  // Header values from summary
  const jobTitle = job.jobTitle || "Untitled Job"
  const location = Array.isArray(job.location) ? job.location.join(", ") : (job.location || "No location")
  const stage = job.stage || "No stage"

  // Copy the stageColors mapping from JobStageBadge
  const stageColors: Record<string, string> = {
    'New': "bg-blue-100 text-blue-800",
    'Sourcing': "bg-purple-100 text-purple-800",
    'Screening': "bg-yellow-100 text-yellow-800",
    'Interviewing': "bg-orange-100 text-orange-800",
    'Shortlisted': "bg-indigo-100 text-indigo-800",
    'Offer': "bg-pink-100 text-pink-800",
    'Hired': "bg-green-100 text-green-800",
    'On Hold': "bg-gray-100 text-gray-800",
    'Cancelled': "bg-red-100 text-red-800",
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="border-b bg-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{jobTitle}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{location}</span>
              <span>•</span>
              {/* Use the same color logic as JobStageBadge, but display-only */}
              <Badge
                variant="secondary"
                className={`${stageColors[stage] || 'bg-gray-100 text-gray-800'} border-none`}
              >
                {stage}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <JobTabs
        jobId={id}
        jobData={job}
        reloadToken={reloadToken}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        canModify={canModifyJobs}
      />

      {/* Add Candidate Dialog (Existing Candidate selection) */}
      <AddExistingCandidateDialog
        jobId={id}
        jobTitle={jobTitle}
        open={addCandidateOpen}
        onOpenChange={setAddCandidateOpen}
        onCandidatesAdded={async () => {
          setActiveTab("candidates")
          setReloadToken((t) => t + 1)
          await handleRefresh()
        }}
      />
    </div>
  )
}