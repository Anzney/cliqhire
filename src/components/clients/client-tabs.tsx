"use client"

import { Tabs } from "@/components/ui/tabs"
import { JobsTable } from "@/components/jobs/jobs-table"
import { ClientTabsList } from "@/components/clients/tabs/tab-list"
import { ClientTabContent } from "@/components/clients/tabs/tab-content"
import { SummaryContent } from "./summary/summary-content"
import { ActivitiesContent } from "./activities/activities-content"
import { NotesContent } from "./notes/notes-content"
import { AttachmentsContent } from "./attachments/attachments-content"
import TeamContent from "./team/team-content"
import { ContactsContent } from "./contacts/contacts-content"
import { HistoryContent } from "./history/history-content"
import { Job } from "@/types/job"

interface ClientTabsProps {
  clientId: string;
  clientName: string;
  filteredJobs: Job[];
}

export function ClientTabs({ clientId, clientName, filteredJobs }: ClientTabsProps) {
  return (
    <Tabs defaultValue="jobs" className="w-full">
      <ClientTabsList />
      
      <ClientTabContent value="jobs">
        <JobsTable jobs={filteredJobs} clientId={clientId} clientName={clientName} />
      </ClientTabContent>
      
      <ClientTabContent value="summary">
        <SummaryContent clientId={clientId} />
      </ClientTabContent>
      
      <ClientTabContent value="activities">
        <ActivitiesContent clientId={clientId} />
      </ClientTabContent>
      
      <ClientTabContent value="notes">
        <NotesContent clientId={clientId} />
      </ClientTabContent>
      
      <ClientTabContent value="attachments">
        <AttachmentsContent clientId={clientId} />
      </ClientTabContent>
      
      <ClientTabContent value="team">
        <TeamContent clientId={clientId} />
      </ClientTabContent>
      
      <ClientTabContent value="contacts">
        <ContactsContent clientId={clientId} />
      </ClientTabContent>
      
      <ClientTabContent value="history">
        <HistoryContent clientId={clientId} />
      </ClientTabContent>
    </Tabs>
  )
}