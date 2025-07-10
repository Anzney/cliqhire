"use client"

import { Button } from "@/components/ui/button"
import { Plus, SlidersHorizontal, RefreshCcw } from "lucide-react"
import { getSampleJobs } from "../../clients/data/sample-jobs";
import { JobStageBadge } from "@/components/jobs/job-stage-badge"
import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { JobTabs } from "@/components/jobs/job-tabs"
import { Job } from "@/types/job";

interface PageProps {
  params: { id: string }
}

export default function JobPage({ params }: PageProps) {
  const { id } = params
  const [isLoading, setIsLoading] = useState(true)
  const [jobData, setJobData] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        const jobs = await getSampleJobs()
        if (!Array.isArray(jobs)) {
          throw new Error('Invalid jobs data received')
        }

        const job = jobs.filter(j => j._id === id.toString())
        if (!job) {
          notFound()
          return
        }
        
        setJobData(job)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch job'))
        console.error("Error fetching job:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchJob()
  }, [id])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error: {error.message}</div>
  }

  if (!jobData) {
    return notFound()
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b">
        <div className="flex flex-col px-4 py-3">
          {/* Top row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center text-xl font-semibold text-blue-600">
                {jobData.positionName?.[0] || 'J'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">{jobData.positionName}</h1>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-none">
                    NOT PUBLISHED
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
                      <path d="M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7M6 21V10M18 21V10" strokeWidth="2"/>
                    </svg>
                    {jobData.department || 'TECH'}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeWidth="2"/>
                    </svg>
                    {jobData.minSalary && jobData.maxSalary 
                      ? `${jobData.minSalary} - ${jobData.maxSalary}`
                      : 'Negotiable - Negotiable'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Hired
                  <span className="ml-1 text-xs">0</span>
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  In pipeline
                  <span className="ml-1 text-xs">0</span>
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Dropped
                  <span className="ml-1 text-xs">0</span>
                </Badge>
              </div>
            </div>
          </div>
          {/* Bottom row */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              + Tags
            </Button>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-4">
        <Button size="sm">
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
      <div className="border-b">
        <JobTabs jobId={id} />
      </div>
    </div>
  )
}