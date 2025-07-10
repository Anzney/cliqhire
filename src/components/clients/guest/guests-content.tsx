"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function GuestsContent() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-240px)]">
      <div className="w-32 h-32 mb-6">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full text-blue-500"
        >
          <circle cx="100" cy="60" r="30" fill="currentColor" fillOpacity="0.2"/>
          <circle cx="60" cy="120" r="30" fill="currentColor" fillOpacity="0.2"/>
          <circle cx="140" cy="120" r="30" fill="currentColor" fillOpacity="0.2"/>
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">You have not created any guests yet</h3>
      <p className="text-muted-foreground text-center max-w-lg mb-8">
        Creating Guests will allow you to share information related to a client and the jobs under it with external users. If required, the extent of the information shared with guests can be customized.
      </p>
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        Create guest
      </Button>
      {/* <Button variant="link" className="mt-4 text-blue-500">
        Learn more about guests
      </Button> */}
    </div>
  )
}