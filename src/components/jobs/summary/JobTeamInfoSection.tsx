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
  const currentRecruitmentManager = teamAssignmentData?.recruitmentManager
    ? teamAssignmentData.recruitmentManager
    : jobDetails.recruitmentManagerId
      ? getRecruitmentManagerById(jobDetails.recruitmentManagerId)
      : null;

  const currentTeamLead = teamAssignmentData?.teamLead
    ? teamAssignmentData.teamLead
    : jobDetails.teamLeadId
      ? getTeamLeadById(jobDetails.teamLeadId)
      : null;

  const currentRecruiter = teamAssignmentData?.recruiter
    ? teamAssignmentData.recruiter
    : jobDetails.recruiterId
      ? getRecruiterById(jobDetails.recruiterId)
      : null;

  const handleTeamSelectionSave = (selections: {
    team?: { id: string; name: string };
    recruitmentManager?: RecruitmentManager;
    teamLead?: TeamLead;
    recruiter?: Recruiter;
  }) => {
    // Create a comprehensive team data object
    const teamData = {
      team: selections.team
        ? {
            id: selections.team.id,
            name: selections.team.name,
          }
        : null,
      recruitmentManager: selections.recruitmentManager
        ? {
            id: selections.recruitmentManager.id,
            name: selections.recruitmentManager.name,
            email: selections.recruitmentManager.email,
            phone: selections.recruitmentManager.phone,
            teamSize: selections.recruitmentManager.teamSize,
          }
        : null,
      teamLead: selections.teamLead
        ? {
            id: selections.teamLead.id,
            name: selections.teamLead.name,
            email: selections.teamLead.email,
            phone: selections.teamLead.phone,
            teamSize: selections.teamLead.teamSize,
            managerId: selections.teamLead.managerId,
          }
        : null,
      recruiter: selections.recruiter
        ? {
            id: selections.recruiter.id,
            name: selections.recruiter.name,
            email: selections.recruiter.email,
            phone: selections.recruiter.phone,
            teamLeadId: selections.recruiter.teamLeadId,
          }
        : null,
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
      handleUpdateField("recruitmentManagerId")(teamData.recruitmentManager?.id || "");
      handleUpdateField("teamLeadId")(teamData.teamLead?.id || "");
      handleUpdateField("recruiterId")(teamData.recruiter?.id || "");

      // Update names for display
      handleUpdateField("recruitmentManager")(teamData.recruitmentManager?.name || "");
      handleUpdateField("teamLead")(teamData.teamLead?.name || "");
      handleUpdateField("recruiter")(teamData.recruiter?.name || "");
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
            label="Recruitment Manager"
            value={currentRecruitmentManager?.name || jobDetails.recruitmentManager}
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
            label="Recruiter"
            value={currentRecruiter?.name || jobDetails.recruiter}
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
          recruitmentManagerId: currentRecruitmentManager?.id || jobDetails.recruitmentManagerId,
          teamLeadId: currentTeamLead?.id || jobDetails.teamLeadId,
          recruiterId: currentRecruiter?.id || jobDetails.recruiterId,
        }}
      />
    </CollapsibleSection>
  );
}
