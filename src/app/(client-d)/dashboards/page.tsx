import React from 'react'
import ClientTopNav from '@/components/client/ClientTopNav'
import ClientKPI from '@/components/client/ClientKPI'
import ClientJobsTableHeader from '@/components/client/ClientJobsTableHeader'
import { Table } from '@/components/ui/table'

export default function Page() {
  return (
    <div className="min-h-screen w-full">
      <ClientTopNav />
      <ClientKPI />
      <Table>
        <ClientJobsTableHeader />
      </Table>
    </div>
  )
}
