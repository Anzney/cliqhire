"use client"
import { Loader2, ChevronRight, ChevronDown, Building, MapPin, HandCoins, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import type { RecruiterJob } from "./types"
import { StatusBadge, type StatusOption } from "@/components/common/StatusBadge"
import { useState } from "react"
import { Button } from "../ui/button"
import { EllipsisVertical } from 'lucide-react';

type RecruiterJobCardProps = {
  job: RecruiterJob
  loadingJobId: string | null
  onToggleExpansion: (jobId: string) => void
}

export function RecruiterJobCard({ job, loadingJobId, onToggleExpansion }: RecruiterJobCardProps) {
  const isLoading = loadingJobId === job.id
  const [candidateStatuses, setCandidateStatuses] = useState<Record<string, StatusOption>>({})

  return (
    <Card className="p-4">
      <button
        type="button"
        onClick={() => onToggleExpansion(job.id)}
        className="flex w-full items-start justify-between text-left"
      >
        <div className="flex items-start gap-3">
          {job.isExpanded ? (
            <ChevronDown className="mt-0.5 h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="mt-0.5 h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <div className="text-sm font-semibold">{job.title}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Building className="h-3 w-3" />
              {job.clientName}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4 text-red-500" />
                {job.location || "—"}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <HandCoins className="h-4 w-4 text-yellow-500" />
                {job.salaryRange || "—"}
              </span>
              {job.jobType && (
                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                  {job.jobType}
                </Badge>
              )}
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4 text-purple-500" />
                {job.totalCandidates} candidates
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </button>

      {job.isExpanded && (
        <CardContent className="pt-4">
          {job.candidates.length === 0 ? (
            <div className="py-4 text-sm text-muted-foreground">No candidates added</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {job.candidates.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.currentJobTitle || ""}</TableCell>
                    <TableCell>
                      <StatusBadge
                        value={(candidateStatuses?.[c.id] || ((c.status?.toLowerCase() === "accepted") ? "Accepted" : (c.status?.toLowerCase() === "rejected") ? "Rejected" : "Pending")) as StatusOption}
                        onChange={(next) =>
                          setCandidateStatuses((prev) => ({ ...prev, [c.id]: next }))
                        }
                      />
                    </TableCell>
                    <TableCell>{c.email || ""}</TableCell>
                    <TableCell>{c.phone || ""}</TableCell>
                    <TableCell>{c.location || ""}</TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="icon">
                        <EllipsisVertical className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      )}
    </Card>
  )
}
