"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"

interface TeamContentProps {
  jobId: string;
}

export function TeamContent({ jobId }: TeamContentProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Job Team Section */}
      <div className="bg-white rounded-lg border">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Job Team</h2>
          <p className="text-muted-foreground mb-2">
            Users part of this team will have full visibility of all the available information related to that job, and will have the ability to add / move / remove candidates from the job.
          </p>
          <Link href="#" className="text-blue-500 hover:underline text-sm">
            Learn more about job ownership & team
          </Link>
        </div>

        <div className="border-t">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Team members</span>
              <Avatar className="h-8 w-8 bg-green-500">
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Department Team Section */}
      <div className="bg-white rounded-lg border">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Department Team</h2>
          <p className="text-muted-foreground mb-2">
            Users part of this team will have full visibility of the jobs under that department, and will have the ability to add / move / remove candidates from all these jobs.
          </p>
          <Link href="#" className="text-blue-500 hover:underline text-sm">
            Learn more about department ownership & team
          </Link>
        </div>

        <div className="border-t">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Team members</span>
              <Avatar className="h-8 w-8 bg-green-500">
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
            </div>
            <ExternalLink className="h-4 w-4 text-blue-500" />
          </div>
        </div>

        <div className="border-t">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Team Settings</span>
              <span className="text-sm">Manage team permissions</span>
            </div>
            <ExternalLink className="h-4 w-4 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Guest Team Section */}
      <div className="bg-white rounded-lg border">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Guest Team</h2>
          <p className="text-muted-foreground mb-2">
            Guests part of this team will only receive basic notifications and view publicly shared candidate notes and attachments in this job.
          </p>
          <Link href="#" className="text-blue-500 hover:underline text-sm">
            Learn more about adding guests
          </Link>
        </div>

        <div className="border-t">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Team members</span>
              <span className="text-sm">Manage team members</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  )
}