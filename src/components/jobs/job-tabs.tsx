"use client"

import { Tabs } from "@/components/ui/tabs"
import { JobTabsList } from "@/components/jobs/tabs/tab-list"
import { JobTabContent } from "@/components/jobs/tabs/tab-content"
import { SummaryContent } from "./summary/summary-content"
import { CandidatesContent } from "./candidates/candidates-content"
import { RecommendationsContent } from "./recommendations/recommendations-content"
import { ActivitiesContent } from "./activities/activities-content"
import { NotesContent } from "./notes/notes-content"
import { AttachmentsContent } from "./attachments/attachments-content"
import { TeamContent } from "./teams/team-content"
import { SourcingContent } from "./sourcing/sourcing-content"
import { ReportsContent } from "./reports/reports-content"
import { JobData } from "./types"

interface JobTabsProps {
  jobId: string;
  jobData: JobData;
  reloadToken?: number;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export function JobTabs({ jobId, jobData, reloadToken, activeTab = "summary", onTabChange }: JobTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <JobTabsList />
      
      <JobTabContent value="candidates">
        <CandidatesContent jobId={jobId} jobTitle={jobData.jobTitle} reloadToken={reloadToken} />
      </JobTabContent>
      
      <JobTabContent value="summary">
      
        <SummaryContent jobId={jobId} jobData={jobData} />
      </JobTabContent>
      
      <JobTabContent value="team">
      
        <TeamContent jobId={jobId} jobData={jobData} />
      </JobTabContent>

      <JobTabContent value="recommendations">
      
        <RecommendationsContent jobId={jobId} />
      </JobTabContent>
      
      <JobTabContent value="activities">
      
        <ActivitiesContent jobId={jobId} />
      </JobTabContent>
      
      <JobTabContent value="notes">
      
        <NotesContent jobId={jobId} jobData={jobData} />
      </JobTabContent>
      
      <JobTabContent value="attachments">
      
        <AttachmentsContent jobId={jobId} />
      </JobTabContent>

      <JobTabContent value="sourcing">
      
        <SourcingContent jobId={jobId} />
      </JobTabContent>

      <JobTabContent value="reports">
      
        <ReportsContent jobId={jobId} />
      </JobTabContent>
    </Tabs>
  )
}