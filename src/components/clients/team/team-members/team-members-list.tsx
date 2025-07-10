"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Eye, MoreVertical } from "lucide-react"
import { useState } from "react"
import SelectTeamMembersModal from "./select-team-members-modal"

interface TeamMember {
  id: string
  name: string
  details: string
  type: string
  avatar?: string
}

const initialMembers: TeamMember[] = [
  {
    id: "1",
    name: "Shaswat singh",
    details: "Shaswat singh",
    type: "User",
    avatar: "SS"
  }
]

export default function TeamMembersList() {
  const [members] = useState<TeamMember[]>(initialMembers)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-blue-500 cursor-pointer">Teams</span>
          <span>›</span>
          <span>Team members</span>
        </div>
        <Button 
          className="ml-auto"
          onClick={() => setIsModalOpen(true)}
        >
          Add a team member
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <div className="grid grid-cols-3 gap-4 p-4 border-b bg-muted/30">
          <div>NAME</div>
          <div>DETAILS</div>
          <div>TYPE</div>
        </div>

        {members.map((member) => (
          <div key={member.id} className="grid grid-cols-3 gap-4 p-4 border-b items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 bg-orange-500">
                <AvatarFallback>{member.avatar}</AvatarFallback>
              </Avatar>
              <span className="text-blue-500">{member.name}</span>
            </div>
            <div>{member.details}</div>
            <div className="flex items-center justify-between">
              <span>{member.type}</span>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground cursor-pointer" />
                <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results Footer */}
      <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
        <div>Results per page: 20</div>
        <div>1 - 1 of 1</div>
      </div>

      <SelectTeamMembersModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}