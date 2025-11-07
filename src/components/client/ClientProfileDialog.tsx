"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { clientLogout } from "@/services/clientAuthService"
import { Separator } from "@/components/ui/separator"

interface ClientProfileDialogProps {
  name: string
  initials: string
}

export default function ClientProfileDialog({ name, initials }: ClientProfileDialogProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: email } = useQuery({
    queryKey: ["clientEmail"],
    queryFn: async () => {
      if (typeof window === "undefined") return null
      return localStorage.getItem("clientEmail")
    },
    initialData: typeof window !== "undefined" ? localStorage.getItem("clientEmail") : null,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
  })

  const handleLogout = async () => {
    // Call server logout; client storage will be cleared in the service regardless of API outcome
    await clientLogout()
    if (typeof window !== "undefined") {
      localStorage.removeItem("clientName")
    }
    // Clear query cache related to client name
    queryClient.removeQueries({ queryKey: ["clientName"], exact: true })
    queryClient.setQueryData(["clientName"], null)
    // Navigate to client login
    router.push("/client/login")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button aria-label="Open profile dialog" className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Avatar>
            <AvatarImage src={""} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Account</DialogTitle>
          <DialogDescription className="text-sm">Signed in details</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 py-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={""} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium">{name}</div>
            {email && <div className="truncate text-xs text-muted-foreground">{email}</div>}
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex flex-col gap-2 py-2">
          <Button variant="secondary" asChild>
            <Link href="/client/forgot-password">Change password</Link>
          </Button>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
