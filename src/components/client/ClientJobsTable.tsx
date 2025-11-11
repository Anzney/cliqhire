"use client"

import React from "react"
import { Table } from "@/components/ui/table"
import ClientJobsTableHeader from "@/components/client/ClientJobsTableHeader"
import ClientJobsTableBody from "@/components/client/ClientJobsTableBody"

export interface ClientJobsTableProps {
  page?: number
  pageSize?: number
  status?: string
}

export default function ClientJobsTable({ page, pageSize, status }: ClientJobsTableProps) {
  return (
    <Table>
      <ClientJobsTableHeader />
      <ClientJobsTableBody page={page} pageSize={pageSize} status={status} />
    </Table>
  )
}
