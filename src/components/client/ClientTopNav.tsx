"use client"

import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ClientTopNav() {
  const { user } = useAuth()
  const [clientName, setClientName] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clientName")
      if (stored) setClientName(stored)
    }
  }, [])

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
          <Avatar>
            <AvatarImage src={""} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
