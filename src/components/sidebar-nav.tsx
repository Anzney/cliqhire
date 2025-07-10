import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Inbox, Send, FileText, } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Compose
        </Button>
      </div>
      <nav className="space-y-1 px-2">
        <Link
          href="/inbox"
          className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900"
        >
          <Inbox className="h-4 w-4" />
          Inbox
        </Link>
        <Link
          href="/inbox/sent"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <Send className="h-4 w-4" />
          Sent
        </Link>
        <Link
          href="/inbox/drafts"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <FileText className="h-4 w-4" />
          Drafts
        </Link>
      </nav>
      <div className="mt-auto p-4 border-t">
        <div className="mb-4">
          {/* <h3 className="font-medium">Mann admin</h3>
          <p className="text-sm text-gray-500">mann.3@mail.manatal.com</p> */}
        </div>
        <div className="text-sm text-gray-500">
          {/* <p>You are currently using Manatal Email</p> */}
          {/* <Link href="/settings" className="text-blue-600 hover:underline flex items-center gap-2 mt-1"> */}
            {/* <Settings className="h-4 w-4" /> */}
            {/* Settings */}
          {/* </Link> */}
        </div>
      </div>
    </div>
  )
}

