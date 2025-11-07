import React from 'react'
import ClientTopNav from '@/components/client/ClientTopNav'
import ClientKPI from '@/components/client/ClientKPI'
import ClientJobsTable from '@/components/client/ClientJobsTable'

export default function Page() {
  return (
    <div className="min-h-screen w-full">
      <ClientTopNav />
      <ClientKPI />
      <ClientJobsTable />
    </div>
  )
}
