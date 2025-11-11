"use client"

import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getClientToken } from '@/services/clientAuthService'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = getClientToken()
    if (!token) {
      router.replace('/client/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}