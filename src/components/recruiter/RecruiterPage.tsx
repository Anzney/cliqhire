"use client"
import React, { useEffect, useState } from "react"
import { RecruiterSearchBar } from "@/components/recruiter/RecruiterSearchBar"
import { RecruiterJobList } from "@/components/recruiter/RecruiterJobList"
import { type RecruiterJob } from "@/components/recruiter/types"
import { useQuery } from "@tanstack/react-query"
import { getHeadhunterAssignedJobs } from "@/services/recruiterService"
import { useAuth } from "@/contexts/AuthContext"

export default function RecruiterPage() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([])
  const [search, setSearch] = useState("")
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null)

  const { user } = useAuth()
  const role = String(user?.role || "").toUpperCase()
  const userId = (user?.profile?._id || user?._id || user?.id || "") as string

  const roleSegment =
    role === "RECRUITER" ? "recruiter" :
    role === "TEAM_LEAD" ? "teamLead" :
    role === "HIRING_MANAGER" ? "hiringManager" : "hiringManager"

  const { data: fetchedJobs = [], isLoading } = useQuery({
    queryKey: ["headhunter-assigned-jobs", roleSegment, userId],
    queryFn: () => getHeadhunterAssignedJobs(roleSegment, userId),
    enabled: !!userId,
  })

  useEffect(() => {
    setJobs((fetchedJobs || []).map((j) => ({ ...j, isExpanded: false })))
  }, [fetchedJobs])

  const toggleJobExpansion = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId)
    if (!job) return
    const willExpand = !job.isExpanded
    if (willExpand) {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isExpanded: true } : j)))
      setLoadingJobId(jobId)
      setTimeout(() => setLoadingJobId(null), 300)
    } else {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isExpanded: false } : j)))
    }
  }

  const filteredJobs = jobs.filter((j) => {
    const title = j.title || ""
    const client = j.clientName || ""
    return title.toLowerCase().includes(search.toLowerCase()) || client.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <RecruiterSearchBar value={search} onChange={setSearch} />
      </div>

      {isLoading ? (
        <div className="py-6 text-sm text-muted-foreground">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-6 text-sm text-muted-foreground">No jobs found</div>
      ) : (
        <RecruiterJobList
          jobs={filteredJobs}
          loadingJobId={loadingJobId}
          onToggleExpansion={toggleJobExpansion}
        />
      )}
    </div>
  )
}
