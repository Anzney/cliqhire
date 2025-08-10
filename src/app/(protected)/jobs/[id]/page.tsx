"use client"

import { Button } from "@/components/ui/button"
import { Plus, SlidersHorizontal, RefreshCcw, Loader } from "lucide-react"
import { getJobById } from "@/services/jobService"
import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { JobTabs } from "@/components/jobs/job-tabs"
import { JobData } from "@/components/jobs/types"
import { AddCandidateDialog } from "@/components/jobs/candidates/add-candidate-dialog"

interface PageProps {
  params: { id: string }
}

export default function JobPage({ params }: PageProps) {
  const { id } = params
  const [isLoading, setIsLoading] = useState(true)
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [addCandidateOpen, setAddCandidateOpen] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const [activeTab, setActiveTab] = useState<string>("summary")

  const fetchJob = async () => {
    if (!id) return;
    setIsLoading(true)
    try {
      const response = await getJobById(id)
      const job = Array.isArray(response.data) ? response.data[0] : response.data
      if (!job) {
        notFound()
        return
      }
      setJobData(job as unknown as JobData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch job'))
      console.error("Error fetching job:", err)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchJob()
  }, [id])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center gap-2 flex-col">
        <Loader className="size-6 animate-spin" />
        <div className="text-center">Loading jobs...</div>
      </div>
    </div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error: {error.message}</div>
  }

  if (!jobData) {
    return notFound()
  }

  const handleRefresh = async () => {
    await fetchJob()
  }
  

  // Header values from summary
  const jobTitle = jobData.jobTitle || "Untitled Job"
  const location = Array.isArray(jobData.location) ? jobData.location.join(", ") : (jobData.location || "No location")
  const stage = jobData.stage || "No stage"

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

      {/* Button Bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button size="sm" onClick={() => setAddCandidateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <JobTabs
        jobId={id}
        jobData={jobData}
        reloadToken={reloadToken}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Add Candidate Dialog (controlled) */}
      <AddCandidateDialog
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