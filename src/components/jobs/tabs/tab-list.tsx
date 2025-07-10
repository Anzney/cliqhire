"use client"

import { TabsList } from "@/components/ui/tabs"
import { FileText, Users, Users2, Lightbulb, Calendar, MessageSquare, Paperclip, Search, BarChart } from "lucide-react"
import { JobTabTrigger } from "./tab-trigger"

export function JobTabsList() {
  return (
    <TabsList className="border-b h-12 w-full justify-start rounded-none bg-transparent p-0">
      <JobTabTrigger value="candidates" icon={Users} label="Candidates" count={0} />
      <JobTabTrigger value="summary" icon={FileText} label="Summary" />
      <JobTabTrigger value="team" icon={Users2} label="Team" />
      <JobTabTrigger value="recommendations" icon={Lightbulb} label="Recommendations" />
      <JobTabTrigger value="activities" icon={Calendar} label="Activities" />
      <JobTabTrigger value="notes" icon={MessageSquare} label="Notes" />
      <JobTabTrigger value="attachments" icon={Paperclip} label="Attachments" />
      <JobTabTrigger value="sourcing" icon={Search} label="Sourcing" />
      <JobTabTrigger value="reports" icon={BarChart} label="Reports" />
    </TabsList>
  )
}