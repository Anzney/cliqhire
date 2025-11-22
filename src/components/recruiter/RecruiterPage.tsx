"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { PipelineJobCard } from "@/components/Recruiter-Pipeline/pipeline-job-card"
import { type Job } from "@/components/Recruiter-Pipeline/dummy-data"

export default function RecruiterPage() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job-001",
      title: "Frontend Developer",
      clientName: "Acme Corp",
      location: "Remote",
      salaryRange: "50000 - 70000 USD",
      headcount: 2,
      jobType: "Full-time",
      isExpanded: false,
      candidates: [
        {
          id: "cand-001",
          name: "John Doe",
          currentJobTitle: "Frontend Engineer",
          email: "john.doe@example.com",
          phone: "+1 555-123-4567",
          location: "New York, USA",
          currentStage: "",
          status: undefined,
        },
        {
          id: "cand-002",
          name: "Jane Smith",
          currentJobTitle: "React Developer",
          email: "jane.smith@example.com",
          phone: "+1 555-987-6543",
          location: "Remote",
          currentStage: "",
          status: undefined,
        },
      ],
      jobId: { stage: "" },
      totalCandidates: 2,
    },
    {
      id: "job-002",
      title: "Backend Engineer",
      clientName: "Globex",
      location: "Berlin, DE",
      salaryRange: "70000 - 90000 EUR",
      headcount: 1,
      jobType: "Contract",
      isExpanded: false,
      candidates: [
        {
          id: "cand-101",
          name: "Alex Thompson",
          currentJobTitle: "Node.js Engineer",
          email: "alex.thompson@example.com",
          phone: "+49 30 123456",
          location: "Berlin, DE",
          currentStage: "",
          status: undefined,
        },
        {
          id: "cand-102",
          name: "Maria Garcia",
          currentJobTitle: "API Developer",
          email: "maria.garcia@example.com",
          phone: "+34 600 123 456",
          location: "Madrid, ES",
          currentStage: "",
          status: undefined,
        },
      ],
      jobId: { stage: "" },
      totalCandidates: 2,
    },
  ])
  const [search, setSearch] = useState("")
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null)

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
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, clients, or candidates"
            className="pl-9"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="py-6 text-sm text-muted-foreground">No jobs found</div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <PipelineJobCard
              key={job.id}
              job={job}
              loadingJobId={loadingJobId}
              onToggleExpansion={toggleJobExpansion}
              onUpdateCandidateStage={async () => {}}
              canModify={false}
              hideCopyFormAndViewTableButtons={true}
              hideStageFilters={true}
              tableOptions={{ showStageColumn: false, showClientNameColumn: true }}
            />
          ))}
        </div>
      )}
    </div>
  )
}