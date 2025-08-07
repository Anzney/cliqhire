"use client";

import { useState, startTransition } from "react";
import { CollapsibleSection } from "@/components/clients/summary/collapsible-section";
import { DetailRow } from "@/components/clients/summary/detail-row";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { TeamSelectionDialog } from "./team-selection-dialog";

interface CandidateTeamInfoSectionProps {
  candidateDetails: any;
  handleUpdateField: (field: string) => (value: string) => void;
}

export function CandidateTeamInfoSection({ candidateDetails, handleUpdateField }: CandidateTeamInfoSectionProps) {
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

  // Helper function to parse team assignment data
  const getTeamAssignmentData = () => {
    try {
      if (candidateDetails.teamAssignment) {
        return JSON.parse(candidateDetails.teamAssignment);
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
    : candidateDetails.recruitmentManagerId
      ? { name: candidateDetails.recruitmentManager || "Sarah Johnson" }
      : { name: "Sarah Johnson" };

  const currentTeamLead = teamAssignmentData?.teamLead
    ? teamAssignmentData.teamLead
    : candidateDetails.teamLeadId
      ? { name: candidateDetails.teamLead || "Mike Chen" }
      : { name: "Mike Chen" };

  const currentRecruiter = teamAssignmentData?.recruiter
    ? teamAssignmentData.recruiter
    : candidateDetails.recruiterId
      ? { name: candidateDetails.recruiter || "Alex Rodriguez" }
      : { name: "Alex Rodriguez" };

  const handleTeamSelectionSave = (selections: {
    recruitmentManager?: any;
    teamLead?: any;
    recruiter?: any;
  }) => {
    // Create a comprehensive team data object
    const teamData = {
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
    <CollapsibleSection title="Candidate Team Info">
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
            label="Recruitment Manager"
            value={currentRecruitmentManager?.name || candidateDetails.recruitmentManager}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
          <DetailRow
            label="Team Lead"
            value={currentTeamLead?.name || candidateDetails.teamLead}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
          <DetailRow
            label="Recruiter"
            value={currentRecruiter?.name || candidateDetails.recruiter}
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
          recruitmentManagerId: currentRecruitmentManager?.id || candidateDetails.recruitmentManagerId,
          teamLeadId: currentTeamLead?.id || candidateDetails.teamLeadId,
          recruiterId: currentRecruiter?.id || candidateDetails.recruiterId,
        }}
      />
    </CollapsibleSection>
  );
} 