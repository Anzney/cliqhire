
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4 md:p-6 overflow-hidden">
        {children}
    </div>
  )
}

