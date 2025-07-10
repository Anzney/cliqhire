import React from 'react'


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full items-center justify-center bg-muted p-6 md:p-10">
        {children}
    </div>
  )
}

