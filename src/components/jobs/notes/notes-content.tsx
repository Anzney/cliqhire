"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AddNoteDialog } from "@/components/clients/notes/add-note-dialog"
import React from "react"

interface NotesContentProps {
  jobId: string;
}

export function NotesContent({ jobId }: NotesContentProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex h-[calc(100vh-240px)]">
      {/* Left Sidebar */}
      <div className="w-80 border-r p-4 flex flex-col gap-4">
        <Input 
          placeholder="Search for contacts or guests" 
          className="w-full"
        />
        <Button 
          variant="default" 
          className="w-full justify-start bg-blue-600 hover:bg-blue-700"
        >
          General
        </Button>
      </div>

      {/* Main Content - Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Note-taking illustration */}
        <div className="w-48 h-48 mb-6">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-blue-500"
          >
            {/* Person */}
            <path 
              d="M100 120 L100 160" 
              stroke="currentColor" 
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle 
              cx="100" 
              cy="100" 
              r="20" 
              fill="currentColor"
            />
            {/* Floating notes */}
            <rect 
              x="130" 
              y="60" 
              width="40" 
              height="30" 
              rx="4" 
              fill="currentColor" 
              fillOpacity="0.2"
            />
            <rect 
              x="140" 
              y="70" 
              width="20" 
              height="2" 
              fill="currentColor"
            />
            <rect 
              x="140" 
              y="75" 
              width="15" 
              height="2" 
              fill="currentColor"
            />
            <rect 
              x="60" 
              y="80" 
              width="40" 
              height="30" 
              rx="4" 
              fill="currentColor" 
              fillOpacity="0.2"
            />
            <rect 
              x="70" 
              y="90" 
              width="20" 
              height="2" 
              fill="currentColor"
            />
            <rect 
              x="70" 
              y="95" 
              width="15" 
              height="2" 
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Text content */}
        <h3 className="text-xl font-semibold mb-2">You have not created any notes yet</h3>
        <p className="text-muted-foreground text-center mb-8">
          All notes will be displayed on this page once the first note has been noted.
        </p>

        {/* Add Note Button */}
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Note
        </Button>

        {/* Add Note Dialog */}
        <AddNoteDialog 
          open={open} 
          onOpenChange={setOpen} 
          onSubmit={(note) => console.log("Note submitted:", note)}
        />

        {/* Learn more link */}
        <Link 
          href="#" 
          className="mt-4 text-blue-500 hover:underline text-sm"
        >
          Learn more about notes
        </Link>
      </div>
    </div>
  )
}
