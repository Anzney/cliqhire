"use client";

import { useState, startTransition } from "react";
import { CollapsibleSection } from "@/components/clients/summary/collapsible-section";
import { DetailRow } from "@/components/clients/summary/detail-row";
import { TeamSelectionDialog } from "./team-selection-dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  getRecruitmentManagerById,
  getTeamLeadById,
  getRecruiterById,
  type RecruitmentManager,
  type TeamLead,
  type Recruiter,
} from "@/data/teamData";

interface JobInfoSectionProps {
  jobDetails: any;
  handleUpdateField: (field: string) => (value: string) => void;
}

export function JobTeamInfoSection({ jobDetails, handleUpdateField }: JobInfoSectionProps) {
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

  // Helper function to parse team assignment data
  const getTeamAssignmentData = () => {
    try {
      if (jobDetails.teamAssignment) {
        return JSON.parse(jobDetails.teamAssignment);
      }
    } catch (error) {
      console.warn("Failed to parse team assignment data:", error);
    }
    return null;
  };

  const teamAssignmentData = getTeamAssignmentData();

  // Get current team member details (prefer JSON data, fallback to individual fields)
  const currentHiringManager = teamAssignmentData?.hiringManager
    ? teamAssignmentData.hiringManager
    : jobDetails.hiringManagerId
      ? getRecruitmentManagerById(jobDetails.hiringManagerId)
      : null;

  const currentTeamLead = teamAssignmentData?.teamLead
    ? teamAssignmentData.teamLead
    : jobDetails.teamLeadId
      ? getTeamLeadById(jobDetails.teamLeadId)
      : null;

  const currentRecruiters = teamAssignmentData?.recruiters
    ? teamAssignmentData.recruiters
    : jobDetails.recruiterIds
      ? JSON.parse(jobDetails.recruiters || "[]").map((id: string) => getRecruiterById(id)).filter(Boolean)
      : [];

  const handleTeamSelectionSave = (selections: {
    team?: { id: string; name: string };
    hiringManager?: { id: string; name: string };
    teamLead?: { id: string; name: string };
    recruiters?: { id: string; name: string }[];
  }) => {
    // Create a comprehensive team data object
    const teamData = {
      team: selections.team
        ? {
            id: selections.team.id,
            name: selections.team.name,
          }
        : null,
      hiringManager: selections.hiringManager
        ? {
            id: selections.hiringManager.id,
            name: selections.hiringManager.name,
          }
        : null,
      teamLead: selections.teamLead
        ? {
            id: selections.teamLead.id,
            name: selections.teamLead.name,
          }
        : null,
      recruiters: selections.recruiters || [],
      lastUpdated: new Date().toISOString(),
    };

    // Primary update: Store complete team data as JSON (single API call)
    const teamDataString = JSON.stringify(teamData);
    handleUpdateField("teamAssignment")(teamDataString);

    // Fallback: Update individual fields for backward compatibility (batched)
    startTransition(() => {
      // Update team information
      handleUpdateField("teamId")(teamData.team?.id || "");
      handleUpdateField("teamName")(teamData.team?.name || "");

      // Update IDs for relationships
      handleUpdateField("hiringManagerId")(teamData.hiringManager?.id || "");
      handleUpdateField("teamLeadId")(teamData.teamLead?.id || "");
      handleUpdateField("recruiterIds")(JSON.stringify(teamData.recruiters.map(r => r.id)) || "");

      // Update names for display
      handleUpdateField("hiringManager")(teamData.hiringManager?.name || "");
      handleUpdateField("teamLead")(teamData.teamLead?.name || "");
      handleUpdateField("recruiters")(JSON.stringify(teamData.recruiters.map(r => r.name)) || "");
    });
  };

  return (
    <CollapsibleSection title="Job Team Info">
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
        {/* Section Header with Edit Button */}
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="text-sm font-medium text-gray-900">Team Assignment</h3>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setIsTeamDialogOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Team
          </Button>
        </div>

        {/* Team Details - Read Only */}
        <div className="space-y-3 pt-1">
          <DetailRow
            label="Team Name"
            value={teamAssignmentData?.team?.name || jobDetails.teamName || "Not assigned"}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
          <DetailRow
            label="Hiring Manager"
            value={currentHiringManager?.name || jobDetails.hiringManager}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
          <DetailRow
            label="Team Lead"
            value={currentTeamLead?.name || jobDetails.teamLead}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
          <DetailRow
            label="Recruiters"
            value={currentRecruiters.length > 0 ? currentRecruiters.map((r: any) => r.name).join(", ") : jobDetails.recruiters || "Not assigned"}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
        </div>
      </div>

      <TeamSelectionDialog
        open={isTeamDialogOpen}
        onClose={() => setIsTeamDialogOpen(false)}
        onSave={handleTeamSelectionSave}
        initialSelections={{
          teamId: teamAssignmentData?.team?.id || jobDetails.teamId,
          hiringManagerId: currentHiringManager?.id || jobDetails.hiringManagerId,
          teamLeadId: currentTeamLead?.id || jobDetails.teamLeadId,
          recruiterIds: currentRecruiters.length > 0 ? currentRecruiters.map((r: any) => r.id) : jobDetails.recruiterIds ? JSON.parse(jobDetails.recruiterIds) : [],
        }}
      />
    </CollapsibleSection>
  );
}
