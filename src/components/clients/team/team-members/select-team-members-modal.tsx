"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"

interface SelectTeamMembersModalProps {
  open: boolean
  onClose: () => void
}

export default function SelectTeamMembersModal({ open, onClose }: SelectTeamMembersModalProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'group'>('user')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">Select Team Members</h2>
          {/* <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button> */}
        </div>

        <div className="py-4">
          <p className="text-sm text-center mb-4">
            Click on the + icon next to a user or group to add them to the client&apos;s team. 
            {/* <Button variant="link" className="text-blue-500 px-1">
              Learn more about permissions for team members and groups here
            </Button> */}
          </p>

          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'user' ? 'default' : 'outline'}
              onClick={() => setActiveTab('user')}
              className="flex-1"
            >
              User
            </Button>
            <Button
              variant={activeTab === 'group' ? 'default' : 'outline'}
              onClick={() => setActiveTab('group')}
              className="flex-1"
            >
              Group
            </Button>
          </div>

          {activeTab === 'user' ? (
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto mb-4">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full text-blue-500"
                >
                  <rect x="60" y="60" width="80" height="80" rx="40" fill="currentColor" fillOpacity="0.1"/>
                  <path d="M100 80C93.3726 80 88 85.3726 88 92C88 98.6274 93.3726 104 100 104C106.627 104 112 98.6274 112 92C112 85.3726 106.627 80 100 80Z" fill="currentColor"/>
                  <path d="M82 120C82 113.373 87.3726 108 94 108H106C112.627 108 118 113.373 118 120V124H82V120Z" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">You have not yet created new users in your account</p>
              <p className="text-sm text-muted-foreground mb-4">You can invite new users via the button below.</p>
              <Button>Invite new users</Button>
              <div className="mt-4">
                {/* <Button variant="link" className="text-blue-500">
                  Learn more about users here
                </Button> */}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto mb-4">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full text-blue-500"
                >
                  <rect x="40" y="40" width="120" height="120" rx="8" fill="currentColor" fillOpacity="0.1"/>
                  <circle cx="80" cy="80" r="16" fill="currentColor"/>
                  <circle cx="120" cy="80" r="16" fill="currentColor"/>
                  <circle cx="80" cy="120" r="16" fill="currentColor"/>
                  <circle cx="120" cy="120" r="16" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">There are currently no unassigned groups</p>
              <p className="text-sm text-muted-foreground mb-4">available to add to the team. You can create a new group via the button below.</p>
              <Button>Create group</Button>
              <div className="mt-4">
                {/* <Button variant="link" className="text-blue-500">
                  Learn more about groups here
                </Button> */}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}