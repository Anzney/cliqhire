"use client";

import { useState, startTransition } from "react";
import { CollapsibleSection } from "@/components/clients/summary/collapsible-section";
import { DetailRow } from "@/components/clients/summary/detail-row";
import { MemberSelectionDialog } from "./member-selection-dialog";
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
  const [isHiringManagerDialogOpen, setIsHiringManagerDialogOpen] = useState(false);
  const [isTeamLeadDialogOpen, setIsTeamLeadDialogOpen] = useState(false);
  const [isRecruiterDialogOpen, setIsRecruiterDialogOpen] = useState(false);
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
        ? { 
            id: jobDetails.jobTeamInfo.hiringManager._id, 
            name: jobDetails.jobTeamInfo.hiringManager.name || `${jobDetails.jobTeamInfo.hiringManager.firstName} ${jobDetails.jobTeamInfo.hiringManager.lastName}`.trim()
          }
        : jobDetails.internalTeam?.hiringManager
          ? (typeof jobDetails.internalTeam.hiringManager === 'string' 
              ? { id: jobDetails.internalTeam.hiringManager, name: jobDetails.internalTeam.hiringManager }
              : { id: jobDetails.internalTeam.hiringManager._id, name: jobDetails.internalTeam.hiringManager.name || `${jobDetails.internalTeam.hiringManager.firstName} ${jobDetails.internalTeam.hiringManager.lastName}`.trim() })
          : null;

  const currentTeamLead = teamAssignmentData?.teamLead
    ? teamAssignmentData.teamLead
    : jobDetails.teamLeadId
      ? getTeamLeadById(jobDetails.teamLeadId)
      : jobDetails.jobTeamInfo?.teamLead
        ? { 
            id: jobDetails.jobTeamInfo.teamLead._id, 
            name: jobDetails.jobTeamInfo.teamLead.name || `${jobDetails.jobTeamInfo.teamLead.firstName} ${jobDetails.jobTeamInfo.teamLead.lastName}`.trim()
          }
        : jobDetails.internalTeam?.teamLead
          ? (typeof jobDetails.internalTeam.teamLead === 'string'
              ? { id: jobDetails.internalTeam.teamLead, name: jobDetails.internalTeam.teamLead }
              : { id: jobDetails.internalTeam.teamLead._id, name: jobDetails.internalTeam.teamLead.name || `${jobDetails.internalTeam.teamLead.firstName} ${jobDetails.internalTeam.teamLead.lastName}`.trim() })
          : null;

  const currentRecruiters = teamAssignmentData?.recruiters
    ? teamAssignmentData.recruiters
    : jobDetails.recruiterIds
      ? JSON.parse(jobDetails.recruiters || "[]").map((id: string) => getRecruiterById(id)).filter(Boolean)
      : jobDetails.jobTeamInfo?.recruiter
        ? [{ 
            id: jobDetails.jobTeamInfo.recruiter._id, 
            name:`${jobDetails.jobTeamInfo.recruiter.firstName} ${jobDetails.jobTeamInfo.recruiter.lastName}`.trim()
          }]
        : jobDetails.internalTeam?.recruiter
          ? (typeof jobDetails.internalTeam.recruiter === 'string'
              ? [{ id: jobDetails.internalTeam.recruiter, name: jobDetails.internalTeam.recruiter }]
              : [{ id: jobDetails.internalTeam.recruiter._id, name: jobDetails.internalTeam.recruiter.name || `${jobDetails.internalTeam.recruiter.firstName} ${jobDetails.internalTeam.recruiter.lastName}`.trim() }])
          : [];

  const updateTeamAssignment = (updates: Partial<any>) => {
    // Current state
    const currentData = {
      team: teamAssignmentData?.team || null,
      hiringManager: currentHiringManager,
      teamLead: currentTeamLead,
      recruiters: currentRecruiters,
      lastUpdated: new Date().toISOString(),
      ...updates
    };

    const teamPayload = {
      teamAssignment: JSON.stringify(currentData),
      // Update individual fields
      hiringManagerId: currentData.hiringManager?.id || "",
      hiringManager: currentData.hiringManager?.name || "",
      teamLeadId: currentData.teamLead?.id || "",
      teamLead: currentData.teamLead?.name || "",
      recruiterIds: JSON.stringify(currentData.recruiters.map((r: any) => r.id)) || "",
      recruiters: JSON.stringify(currentData.recruiters.map((r: any) => r.name)) || "",
    };

    if (handleUpdateMultipleFields) {
      handleUpdateMultipleFields(teamPayload);
    } else {
      // Fallback
      handleUpdateField("teamAssignment")(JSON.stringify(currentData));
      startTransition(() => {
        if (updates.hiringManager !== undefined) {
           handleUpdateField("hiringManagerId")(currentData.hiringManager?.id || "");
           handleUpdateField("hiringManager")(currentData.hiringManager?.name || "");
        }
        if (updates.teamLead !== undefined) {
           handleUpdateField("teamLeadId")(currentData.teamLead?.id || "");
           handleUpdateField("teamLead")(currentData.teamLead?.name || "");
        }
        if (updates.recruiters !== undefined) {
           handleUpdateField("recruiterIds")(JSON.stringify(currentData.recruiters.map((r: any) => r.id)) || "");
           handleUpdateField("recruiters")(JSON.stringify(currentData.recruiters.map((r: any) => r.name)) || "");
        }
      });
    }
  };

  const headHunterObject = jobDetails.jobTeamInfo?.headhunter;
  const headHunterName =
    jobDetails.headHunter ||
    (headHunterObject
      ? `${headHunterObject.firstName || ""} ${headHunterObject.lastName || ""}`.trim() ||
        headHunterObject.email ||
        ""
      : jobDetails.jobTeamInfo?.headHunter || "");

  return (
    <CollapsibleSection title="Job Team Info">
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="text-sm font-medium text-gray-900">Team Assignment</h3>
        </div>

        {/* Team Details */}
        <div className="space-y-3 pt-1">
          <DetailRow
            label="Hiring Manager"
            value={currentHiringManager?.name || jobDetails.hiringManager || jobDetails.jobTeamInfo?.hiringManager?.firstName + " " + jobDetails.jobTeamInfo?.hiringManager?.lastName || jobDetails.internalTeam?.hiringManager?.name || "Not assigned"}
            onUpdate={() => {}} 
            customEdit={canModify ? () => setIsHiringManagerDialogOpen(true) : undefined}
            alwaysShowEdit={canModify}
          />
          <DetailRow
            label="Team Lead"
            value={currentTeamLead?.name || jobDetails.teamLead || jobDetails.jobTeamInfo?.teamLead?.firstName + " " + jobDetails.jobTeamInfo?.teamLead?.lastName || jobDetails.internalTeam?.teamLead?.name || "Not assigned"}
            onUpdate={() => {}}
            customEdit={canModify ? () => setIsTeamLeadDialogOpen(true) : undefined}
            alwaysShowEdit={canModify}
          />
          <DetailRow
            label="Recruiter"
            value={ 
                currentRecruiters.length > 0 
                ? currentRecruiters[0].name
                : jobDetails.recruiter || jobDetails.jobTeamInfo?.recruiter?.firstName + " " + jobDetails.jobTeamInfo?.recruiter?.lastName || jobDetails.internalTeam?.recruiter?.firstName + " " + jobDetails.internalTeam?.recruiter?.lastName|| "Not assigned"
            }
            onUpdate={() => {}}
            customEdit={canModify ? () => setIsRecruiterDialogOpen(true) : undefined}
            alwaysShowEdit={canModify}
          />
          <DetailRow
            label="Head Hunter"
            value={headHunterName || "Not assigned"}
            onUpdate={handleUpdateField("headHunter")}
            customEdit={canModify ? () => setIsHeadHunterDialogOpen(true) : undefined}
            alwaysShowEdit={canModify}
          />
        </div>
      </div>

      {canModify && (
        <>
          <MemberSelectionDialog
            open={isHiringManagerDialogOpen}
            onClose={() => setIsHiringManagerDialogOpen(false)}
            title="Select Hiring Manager"
            roleFilter="Hiring Manager"
            initialSelections={currentHiringManager?.id ? [currentHiringManager.id] : []}
            onSelect={(members) => {
              const member = members[0];
              updateTeamAssignment({
                hiringManager: member ? { id: member._id, name: member.firstName + " " + member.lastName } : null
              });
            }}
          />

          <MemberSelectionDialog
            open={isTeamLeadDialogOpen}
            onClose={() => setIsTeamLeadDialogOpen(false)}
            title="Select Team Lead"
            roleFilter="Team Lead"
            initialSelections={currentTeamLead?.id ? [currentTeamLead.id] : []}
            onSelect={(members) => {
              const member = members[0];
              updateTeamAssignment({
                teamLead: member ? { id: member._id, name: member.firstName + " " + member.lastName } : null
              });
            }}
          />

          <MemberSelectionDialog
            open={isRecruiterDialogOpen}
            onClose={() => setIsRecruiterDialogOpen(false)}
            title="Select Recruiter"
            roleFilter="Recruiters"
            multiple={false}
            initialSelections={currentRecruiters.length > 0 ? [currentRecruiters[0].id] : []}
            onSelect={(members) => {
              const member = members[0];
              updateTeamAssignment({
                recruiters: member ? [{ id: member._id, name: member.firstName + " " + member.lastName }] : []
              });
            }}
          />

          <HeadHunterSelectionDialog
            open={isHeadHunterDialogOpen}
            onClose={() => setIsHeadHunterDialogOpen(false)}
            selectedHeadHunterName={headHunterName}
            onSelect={(member) => {
              const fullName = `${member.firstName || ""} ${member.lastName || ""}`.trim() || member.email || "";

              if (handleUpdateMultipleFields) {
                handleUpdateMultipleFields({
                  headhunter: member._id,
                });
              } else {
                handleUpdateField("headHunter")(fullName);
              }
              setIsHeadHunterDialogOpen(false);
            }}
          />
        </>
      )}
    </CollapsibleSection>
  );
}
