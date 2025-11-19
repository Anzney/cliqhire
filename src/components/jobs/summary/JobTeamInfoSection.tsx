"use client";

import { useState, startTransition } from "react";
import { CollapsibleSection } from "@/components/clients/summary/collapsible-section";
import { DetailRow } from "@/components/clients/summary/detail-row";
import { TeamSelectionDialog } from "./team-selection-dialog";
import { HeadHunterSelectionDialog } from "./HeadHunterSelectionDialog";
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
  handleUpdateMultipleFields?: (fields: Record<string, any>) => void;
  canModify?: boolean;
}

export function JobTeamInfoSection({ jobDetails, handleUpdateField, handleUpdateMultipleFields, canModify }: JobInfoSectionProps) {
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isHeadHunterDialogOpen, setIsHeadHunterDialogOpen] = useState(false);

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

  // Get current team member details (prefer JSON data, fallback to individual fields, then jobTeamInfo structure, then internalTeam structure)
  const currentHiringManager = teamAssignmentData?.hiringManager
    ? teamAssignmentData.hiringManager
    : jobDetails.hiringManagerId
      ? getRecruitmentManagerById(jobDetails.hiringManagerId)
      : jobDetails.jobTeamInfo?.hiringManager
        ? { id: jobDetails.jobTeamInfo.hiringManager._id, name: jobDetails.jobTeamInfo.hiringManager.name }
        : jobDetails.internalTeam?.hiringManager
          ? (typeof jobDetails.internalTeam.hiringManager === 'string' 
              ? { id: jobDetails.internalTeam.hiringManager, name: jobDetails.internalTeam.hiringManager }
              : { id: jobDetails.internalTeam.hiringManager._id, name: jobDetails.internalTeam.hiringManager.name })
          : null;

  const currentTeamLead = teamAssignmentData?.teamLead
    ? teamAssignmentData.teamLead
    : jobDetails.teamLeadId
      ? getTeamLeadById(jobDetails.teamLeadId)
      : jobDetails.jobTeamInfo?.teamLead
        ? { id: jobDetails.jobTeamInfo.teamLead._id, name: jobDetails.jobTeamInfo.teamLead.name }
        : jobDetails.internalTeam?.teamLead
          ? (typeof jobDetails.internalTeam.teamLead === 'string'
              ? { id: jobDetails.internalTeam.teamLead, name: jobDetails.internalTeam.teamLead }
              : { id: jobDetails.internalTeam.teamLead._id, name: jobDetails.internalTeam.teamLead.name })
          : null;

  const currentRecruiters = teamAssignmentData?.recruiters
    ? teamAssignmentData.recruiters
    : jobDetails.recruiterIds
      ? JSON.parse(jobDetails.recruiters || "[]").map((id: string) => getRecruiterById(id)).filter(Boolean)
      : jobDetails.jobTeamInfo?.recruiter
        ? [{ id: jobDetails.jobTeamInfo.recruiter._id, name: jobDetails.jobTeamInfo.recruiter.name }]
        : jobDetails.internalTeam?.recruiter
          ? (typeof jobDetails.internalTeam.recruiter === 'string'
              ? [{ id: jobDetails.internalTeam.recruiter, name: jobDetails.internalTeam.recruiter }]
              : [{ id: jobDetails.internalTeam.recruiter._id, name: jobDetails.internalTeam.recruiter.name }])
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

    // Create single payload for all team-related fields
    const teamPayload = {
      teamAssignment: JSON.stringify(teamData),
      teamId: teamData.team?.id ? {
        _id: teamData.team.id,
        teamName: teamData.team.name,
        teamStatus: "Active"
      } : "",
      teamName: teamData.team?.name || "",
      hiringManagerId: teamData.hiringManager?.id || "",
      teamLeadId: teamData.teamLead?.id || "",
      recruiterIds: JSON.stringify(teamData.recruiters.map(r => r.id)) || "",
      hiringManager: teamData.hiringManager?.name || "",
      teamLead: teamData.teamLead?.name || "",
      recruiters: JSON.stringify(teamData.recruiters.map(r => r.name)) || "",
    };

    // Use single API call if available, otherwise fallback to multiple calls
    if (handleUpdateMultipleFields) {
      handleUpdateMultipleFields(teamPayload);
    } else {
             // Fallback: Update individual fields for backward compatibility
       handleUpdateField("teamAssignment")(JSON.stringify(teamData));
       startTransition(() => {
         handleUpdateField("teamId")(teamData.team?.id ? JSON.stringify({
           _id: teamData.team.id,
           teamName: teamData.team.name,
           teamStatus: "Active"
         }) : "");
         handleUpdateField("teamName")(teamData.team?.name || "");
        handleUpdateField("hiringManagerId")(teamData.hiringManager?.id || "");
        handleUpdateField("teamLeadId")(teamData.teamLead?.id || "");
        handleUpdateField("recruiterIds")(JSON.stringify(teamData.recruiters.map(r => r.id)) || "");
        handleUpdateField("hiringManager")(teamData.hiringManager?.name || "");
        handleUpdateField("teamLead")(teamData.teamLead?.name || "");
        handleUpdateField("recruiters")(JSON.stringify(teamData.recruiters.map(r => r.name)) || "");
      });
    }
  };

  const headHunterName = jobDetails.headHunter || jobDetails.jobTeamInfo?.headHunter || "";

  return (
    <CollapsibleSection title="Job Team Info">
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
        {/* Section Header with Edit Button */}
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="text-sm font-medium text-gray-900">Team Assignment</h3>
          {canModify && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setIsTeamDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Team
            </Button>
          )}
        </div>

        {/* Team Details - Read Only */}
        <div className="space-y-3 pt-1">
          <DetailRow
            label="Position Name"
            value={teamAssignmentData?.team?.name || jobDetails.teamName || (typeof jobDetails.teamId === 'object' ? jobDetails.teamId.teamName : null) || jobDetails.jobTeamInfo?.teamId?.teamName || "Not assigned"}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
          <DetailRow
            label="Hiring Manager"
            value={currentHiringManager?.name || jobDetails.hiringManager || jobDetails.jobTeamInfo?.hiringManager?.firstName + " " + jobDetails.jobTeamInfo?.hiringManager?.lastName || jobDetails.internalTeam?.hiringManager?.name || "Not assigned"}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
          <DetailRow
            label="Team Lead"
            value={currentTeamLead?.name || jobDetails.teamLead || jobDetails.jobTeamInfo?.teamLead?.firstName + " " + jobDetails.jobTeamInfo?.teamLead?.lastName || jobDetails.internalTeam?.teamLead?.name || "Not assigned"}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
          <DetailRow
            label="Recruiters"
           value={ jobDetails.recruiter || jobDetails.jobTeamInfo?.recruiter?.firstName + " " + jobDetails.jobTeamInfo?.recruiter?.lastName || jobDetails.internalTeam?.recruiter?.firstName + " " + jobDetails.internalTeam?.recruiter?.lastName|| "Not assigned"}
            onUpdate={() => {}} // No edit functionality
            disableInternalEdit={true} // Disable edit button
          />
          <DetailRow
            label="Head Hunter"
            value={headHunterName || "Not assigned"}
            onUpdate={handleUpdateField("headHunter")}
            customEdit={() => setIsHeadHunterDialogOpen(true)}
            alwaysShowEdit
          />
        </div>
      </div>

      {canModify && (
        <>
          <TeamSelectionDialog
            open={isTeamDialogOpen}
            onClose={() => setIsTeamDialogOpen(false)}
            onSave={handleTeamSelectionSave}
            initialSelections={{
              teamId: teamAssignmentData?.team?.id || (typeof jobDetails.teamId === 'object' ? jobDetails.teamId._id : jobDetails.teamId) || jobDetails.jobTeamInfo?.teamId?._id,
              hiringManagerId: currentHiringManager?.id || jobDetails.hiringManagerId || jobDetails.jobTeamInfo?.hiringManager?._id || (typeof jobDetails.internalTeam?.hiringManager === 'string' ? jobDetails.internalTeam.hiringManager : jobDetails.internalTeam?.hiringManager?._id),
              teamLeadId: currentTeamLead?.id || jobDetails.teamLeadId || jobDetails.jobTeamInfo?.teamLead?._id || (typeof jobDetails.internalTeam?.teamLead === 'string' ? jobDetails.internalTeam.teamLead : jobDetails.internalTeam?.teamLead?._id),
              recruiterIds: currentRecruiters.length > 0 ? currentRecruiters.map((r: any) => r.id) : jobDetails.recruiterIds ? JSON.parse(jobDetails.recruiterIds) : (jobDetails.jobTeamInfo?.recruiter?._id ? [jobDetails.jobTeamInfo.recruiter._id] : (typeof jobDetails.internalTeam?.recruiter === 'string' ? [jobDetails.internalTeam.recruiter] : (jobDetails.internalTeam?.recruiter?._id ? [jobDetails.internalTeam.recruiter._id] : []))),
            }}
          />

          <HeadHunterSelectionDialog
            open={isHeadHunterDialogOpen}
            onClose={() => setIsHeadHunterDialogOpen(false)}
            selectedHeadHunterName={headHunterName}
            onSelect={(member) => {
              const fullName = `${member.firstName || ""} ${member.lastName || ""}`.trim() || member.email || "";
              handleUpdateField("headHunter")(fullName);
              setIsHeadHunterDialogOpen(false);
            }}
          />
        </>
      )}
    </CollapsibleSection>
  );
}
