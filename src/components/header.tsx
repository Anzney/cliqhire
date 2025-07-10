'use client'

import { Bell, Gift, HelpCircle, Plus, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex justify-center w-full">
          <div className="relative max-w-[400px] w-full mx-auto">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Name, Job, Email or Client"
              className="pl-8 bg-blue-50"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          {/* <Button variant="ghost" size="icon">
            <Gift className="h-4 w-4" />
          </Button> */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar>
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
