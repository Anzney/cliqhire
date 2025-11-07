"use client"

import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import ClientProfileDialog from "@/components/client/ClientProfileDialog"

export default function ClientTopNav() {
  const { user } = useAuth()
  const { data: clientName } = useQuery({
    queryKey: ["clientName"],
    queryFn: async () => {
      if (typeof window === "undefined") return null
      return localStorage.getItem("clientName")
    },
    // Initialize immediately with current localStorage to avoid empty first render
    initialData: typeof window !== "undefined" ? localStorage.getItem("clientName") : null,
    // Refetch on mount to capture latest value written during login flow
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
  })

  const name = user?.name || clientName || "Client"
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="sticky top-0 z-10 h-14 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <div className="text-lg font-semibold tracking-tight">{name}</div>
        <div className="flex items-center gap-3">
          <ClientProfileDialog name={name} initials={initials} />
        </div>
      </div>
    </div>
  )
}

