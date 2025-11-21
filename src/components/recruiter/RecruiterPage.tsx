"use client"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllPipelineEntries, type PipelineListItem } from "@/services/recruitmentPipelineService"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Briefcase, Search } from "lucide-react"
import JobSection from "@/components/recruiter/JobSection"

export default function RecruiterPage() {
  const [search, setSearch] = React.useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["recruiter-pipelines"],
    queryFn: async () => {
      const res = await getAllPipelineEntries()
      return res.data.pipelines as PipelineListItem[]
    },
  })

  const pipelines = (data || []).filter((p) => {
    const title = p.jobId?.jobTitle || ""
    const client = p.jobId?.clientName || ""
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      client.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Recruiter Jobs
          </CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs or clients"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-6 text-sm text-muted-foreground">Loading jobs...</div>
          ) : pipelines.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">No jobs found</div>
          ) : (
            <div className="space-y-3">
              {pipelines.map((p) => (
                <JobSection key={p._id} item={p} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}