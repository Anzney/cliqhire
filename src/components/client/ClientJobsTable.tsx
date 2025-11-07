"use client"

import React from "react"
import { Table } from "@/components/ui/table"
import ClientJobsTableHeader from "@/components/client/ClientJobsTableHeader"
import ClientJobsTableBody from "@/components/client/ClientJobsTableBody"

export default function ClientJobsTable() {
  return (
    <Table>
      <ClientJobsTableHeader />
      <ClientJobsTableBody />
    </Table>
  )
}
