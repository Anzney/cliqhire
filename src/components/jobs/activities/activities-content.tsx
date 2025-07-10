"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CreateActivityModal } from "./create-activity";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface ActivitiesContentProps {
  jobId: string;
}

export function ActivitiesContent({ jobId }: ActivitiesContentProps) {
  return (
    <>
     <div className="flex flex-col items-center justify-center h-[calc(100vh-240px)]">
      {/* Calendar illustration */}
      <div className="w-48 h-48 mb-6">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
        >
          {/* Background clouds and sun */}
          <circle cx="100" cy="40" r="20" fill="#3B82F6" fillOpacity="0.2"/>
          <path d="M140 30 Q160 30 170 40" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="4" fill="none"/>
          <path d="M30 50 Q50 50 60 60" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="4" fill="none"/>
          
          {/* Calendar */}
          <rect x="40" y="60" width="120" height="100" rx="8" fill="#F3F4F6"/>
          
          {/* Calendar header */}
          <rect x="40" y="60" width="120" height="30" rx="8" fill="#3B82F6" fillOpacity="0.1"/>
          
          {/* Calendar grid */}
          <line x1="40" y1="100" x2="160" y2="100" stroke="#E5E7EB" strokeWidth="1"/>
          <line x1="40" y1="120" x2="160" y2="120" stroke="#E5E7EB" strokeWidth="1"/>
          <line x1="40" y1="140" x2="160" y2="140" stroke="#E5E7EB" strokeWidth="1"/>
          
          <line x1="80" y1="90" x2="80" y2="160" stroke="#E5E7EB" strokeWidth="1"/>
          <line x1="120" y1="90" x2="120" y2="160" stroke="#E5E7EB" strokeWidth="1"/>
          
          {/* Activity indicator */}
          <rect x="90" y="130" width="20" height="20" rx="4" fill="#3B82F6" fillOpacity="0.2"/>
        </svg>
      </div>

      {/* Text content */}
      <h3 className="text-xl font-semibold mb-2">You have not scheduled any activities yet</h3>
      <p className="text-muted-foreground text-center mb-8">
        All scheduled activities will be displayed on this page once the first activity has been scheduled.
      </p>

      {/* Action buttons */}
      <Dialog>
      <DialogTrigger asChild>
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        Add activity
      </Button>
      </DialogTrigger>
      <CreateActivityModal/>
      </Dialog>
      {/* Learn more link */}
      <Link 
        href="#" 
        className="mt-4 text-blue-500 hover:underline text-sm"
      >
        Learn more about activities
      </Link>
    </div>
    </>
    
  )
}