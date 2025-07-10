"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TeamMemberProps {
  name: string
  avatar?: string
  role?: string
  isActive?: boolean
}

export function TeamMember({ name, avatar, role, isActive }: TeamMemberProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-orange-500">
            <AvatarFallback>{avatar || name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-sm">{name}</span>
            {role && <div className="text-xs text-muted-foreground">{role}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-none">
              ACTIVE
            </Badge>
          )}
          <Eye 
            className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200"
            onClick={() => setShowDetails(true)}
          />
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Team Member Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <Avatar className="h-16 w-16 bg-orange-500">
                <AvatarFallback>{avatar || name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">{role}</p>
                {isActive && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-none mt-2">
                    ACTIVE
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p>example@email.com</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p>+1 234 567 890</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Permissions</h4>
              <div className="space-y-1 text-sm">
                <p>• Can view and edit client information</p>
                <p>• Can manage team members</p>
                <p>• Can view analytics and reports</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Activity</h4>
              <div className="text-sm text-muted-foreground">
                Last active: Today at 2:30 PM
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}