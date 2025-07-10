"use client"

import { TabsList } from "@/components/ui/tabs"
import { FileText, Users, MessageSquare, Paperclip, Users2, Mail, History } from "lucide-react"
import { ClientTabTrigger } from "./tab-trigger"

export function ClientTabsList() {
  return (
    <TabsList className="border-b h-12 w-full justify-start rounded-none bg-transparent p-0">
      <ClientTabTrigger value="jobs" icon={FileText} label="Jobs" />
      <ClientTabTrigger value="summary" icon={FileText} label="Summary" />
      <ClientTabTrigger value="activities" icon={MessageSquare} label="Activities" />
      <ClientTabTrigger value="notes" icon={FileText} label="Notes" />
      <ClientTabTrigger value="attachments" icon={Paperclip} label="Attachments" />
      <ClientTabTrigger value="team" icon={Users2} label="Client Team" />
      <ClientTabTrigger value="contacts" icon={Mail} label="Contacts" />
      <ClientTabTrigger value="history" icon={History} label="History" />
    </TabsList>
  )
}