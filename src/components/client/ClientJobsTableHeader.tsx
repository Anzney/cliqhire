import React from "react"
import { TableHeader, TableRow, TableHead } from "@/components/ui/table"

export default function ClientJobsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Job Title</TableHead>
        <TableHead>HeadCount</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>No. of Applied Candidates</TableHead>
        <TableHead>Action</TableHead>
      </TableRow>
    </TableHeader>
  )
}
