"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchClientPipelineJobsSummary } from "@/services/clientJobsService"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface ClientJobsTableBodyProps {
  page?: number
  pageSize?: number
  status?: string
}

const ClientJobsTableBody: React.FC<ClientJobsTableBodyProps> = ({ page, pageSize, status }) => {
  const params = { page, pageSize, status }
  const { data, isLoading, isError } = useQuery({
    queryKey: ["client", "pipeline-jobs-summary", params],
    queryFn: () => fetchClientPipelineJobsSummary(params),
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>Loading...</TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (isError) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>Failed to load data</TableCell>
        </TableRow>
      </TableBody>
    )
  }

  const rows = data ?? []

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>No jobs found</TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.jobId}>
          <TableCell className="font-medium">{row.jobTitle || "-"}</TableCell>
          <TableCell>{/* HeadCount not provided by API */}-</TableCell>
          <TableCell>{row.jobStatus || "-"}</TableCell>
          <TableCell>{typeof row.candidateCount === "number" ? row.candidateCount : "-"}</TableCell>
          <TableCell>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/client/jobs/${row.jobId}`}>View</Link>
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export default ClientJobsTableBody
