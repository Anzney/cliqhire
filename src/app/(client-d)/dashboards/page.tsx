import React from 'react'
import ClientTopNav from '@/components/client/ClientTopNav'
import ClientKPI from '@/components/client/ClientKPI'

export default function Page() {
  return (
    <div className="min-h-screen">
      <ClientTopNav />
      <div className="mx-auto w-full max-w-7xl">
        <ClientKPI />
      </div>
    </div>
  )
}
