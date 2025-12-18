"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, UserPlus } from "lucide-react";
import { MemberSelectionDialog } from "@/components/jobs/summary/member-selection-dialog";
import { type RecruitmentManager, type TeamLead, type Recruiter } from "@/data/teamData";
import { updateJobById } from "@/services/jobService";
import { toast } from "sonner";
import { JobData } from "../types";

interface InternalTeamProps {
  jobId: string;
  jobData: JobData;
  canModify?: boolean;
}

export function InternalTeam({ jobId, jobData, canModify }: InternalTeamProps) {
  const [isHiringManagerDialogOpen, setIsHiringManagerDialogOpen] = useState(false);
  const [isTeamLeadDialogOpen, setIsTeamLeadDialogOpen] = useState(false);
  const [isRecruiterDialogOpen, setIsRecruiterDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{
    team?: { id: string; name: string };
    hiringManager?: { id: string; name: string; email?: string; phone?: string };
    teamLead?: { id: string; name: string; email?: string; phone?: string };
    recruiters?: { id: string; name: string; email?: string; phone?: string }[];
  } | null>(null);

  // Initialize selected team from jobData (prefer teamAssignment JSON, fallback to jobTeamInfo structure)
  useEffect(() => {
    if (!jobData) return;

    // Try parsing teamAssignment if present
    let fromAssignment: any = null;
    try {
      if ((jobData as any).teamAssignment) {
        fromAssignment = JSON.parse((jobData as any).teamAssignment as unknown as string);
      }
    } catch (e) {
      console.warn("Failed to parse jobData.teamAssignment in InternalTeam:", e);
    }

    if (fromAssignment) {
      setSelectedTeam({
        team: fromAssignment.team || undefined,
        hiringManager: fromAssignment.hiringManager || undefined,
        teamLead: fromAssignment.teamLead || undefined,
        recruiters: (fromAssignment.recruiters as any[]) || [],
      });
      return;
    }

    // Fallback to jobTeamInfo shape
    const jti: any = (jobData as any).jobTeamInfo;
    if (jti) {
      const initial = {
        team: jti.teamId
          ? { id: jti.teamId._id, name: jti.teamId.teamName }
          : undefined,
        hiringManager: jti.hiringManager
          ? { id: jti.hiringManager._id, name: jti.hiringManager.firstName + " " + jti.hiringManager.lastName, email: jti.hiringManager.email, phone: jti.hiringManager.phone }
          : undefined,
        teamLead: jti.teamLead
          ? { id: jti.teamLead._id, name: jti.teamLead.firstName + " " + jti.teamLead.lastName, email: jti.teamLead.email, phone: jti.teamLead.phone }
          : undefined,
        recruiters: jti.recruiter
          ? [{ id: jti.recruiter._id, name: jti.recruiter.firstName + " " + jti.recruiter.lastName, email: jti.recruiter.email, phone: jti.recruiter.phone }]
          : [],
      } as {
        team?: { id: string; name: string };
        hiringManager?: { id: string; name: string; email?: string; phone?: string };
        teamLead?: { id: string; name: string; email?: string; phone?: string };
        recruiters?: { id: string; name: string; email?: string; phone?: string }[];
      };

      // Only set if something exists
      if (initial.team || initial.hiringManager || initial.teamLead || (initial.recruiters && initial.recruiters.length)) {
        setSelectedTeam(initial);
      }
    }
  }, [jobData]);

  const updateTeamAssignment = async (updates: Partial<any>) => {
    try {
      // Update local UI first
      const current = selectedTeam || {};
      const updatedSelection = { ...current, ...updates };
      
      // Ensure we keep the structure consistent
      const newSelection = {
        team: updatedSelection.team || undefined,
        hiringManager: updatedSelection.hiringManager || undefined,
        teamLead: updatedSelection.teamLead || undefined,
        recruiters: updatedSelection.recruiters || [],
      };

      setSelectedTeam(newSelection);

      // Build the same payload structure used in Summary -> JobTeamInfoSection
      const teamData = {
        team: newSelection.team ? { id: newSelection.team.id, name: newSelection.team.name } : null,
        hiringManager: newSelection.hiringManager ? { id: newSelection.hiringManager.id, name: newSelection.hiringManager.name } : null,
        teamLead: newSelection.teamLead ? { id: newSelection.teamLead.id, name: newSelection.teamLead.name } : null,
        recruiters: newSelection.recruiters || [],
        lastUpdated: new Date().toISOString(),
      };

      const teamPayload = {
        teamAssignment: JSON.stringify(teamData),
        teamId: teamData.team?.id
          ? {
              _id: teamData.team.id,
              teamName: teamData.team.name,
              teamStatus: "Active",
            }
          : "",
        teamName: teamData.team?.name || "",
        hiringManagerId: teamData.hiringManager?.id || "",
        teamLeadId: teamData.teamLead?.id || "",
        recruiterIds: JSON.stringify(teamData.recruiters.map((r: any) => r.id)) || "",
        hiringManager: teamData.hiringManager?.name || "",
        teamLead: teamData.teamLead?.name || "",
        recruiters: JSON.stringify(teamData.recruiters.map((r: any) => r.name)) || "",
      } as any;

      await updateJobById(jobId, teamPayload);
      toast.success("Team assignment updated successfully");
    } catch (error) {
      console.error("Failed to update team assignment:", error);
      toast.error("Failed to update team assignment");
    }
  };

  const renderTeamMemberCard = (
    title: string,
    member: { id: string; name: string; email?: string; phone?: string } | undefined,
    roleColor: string,
    onEdit?: () => void,
  ) => {
    return (
      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className={`text-xs font-medium uppercase tracking-wide ${roleColor}`}>{title}</div>
          {onEdit && canModify && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>
        {member ? (
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{member.name}</div>
            {member.email && (
              <div className="text-sm text-gray-500">Email: {member.email}</div>
            )}
            {member.phone && (
              <div className="text-sm text-gray-500">Phone: {member.phone}</div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">Not assigned</div>
        )}
      </div>
    );
  };

  const renderRecruitersCard = (
    recruiters: { id: string; name: string; email?: string; phone?: string }[] | undefined,
    onEdit?: () => void,
  ) => {
    return (
      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wide text-purple-600">Recruiters</div>
          {onEdit && canModify && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>
        {recruiters && recruiters.length > 0 ? (
          <div className="space-y-1">
            {recruiters.map((recruiter, index) => (
              <div key={recruiter.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{recruiter.name}</div>
                  {recruiter.email && (
                    <div className="text-sm text-gray-500">Email: {recruiter.email}</div>
                  )}
                  {recruiter.phone && (
                    <div className="text-sm text-gray-500">Phone: {recruiter.phone}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">Not assigned</div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border px-4 py-4 h-[56vh] overflow-y-auto">
      {/* Header with title and button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Internal Team</h2>
        {!selectedTeam && (
          <Button
            size="sm"
            className="h-8"
            disabled={!canModify}
            onClick={() => {
              if (!canModify) return;
              setSelectedTeam({});
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Internal Team
          </Button>
        )}
      </div>

      {/* Team Information Display */}
      {selectedTeam ? (
        <div className="space-y-4">
          <div className="grid gap-4">
            {renderTeamMemberCard(
              "Hiring Manager",
              selectedTeam.hiringManager,
              "text-blue-600",
              () => setIsHiringManagerDialogOpen(true)
            )}

            {renderTeamMemberCard(
              "Team Lead", 
              selectedTeam.teamLead, 
              "text-green-600",
              () => setIsTeamLeadDialogOpen(true)
            )}

            {renderRecruitersCard(
              selectedTeam.recruiters,
              () => setIsRecruiterDialogOpen(true)
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100%-90px)] text-gray-500 text-sm">
          <UserPlus className="w-10 h-10 mb-2" />
          <span className="text-base">
            No internal team selected. Click Add Internal Team to get started.
          </span>
        </div>
      )}

      {/* Member Selection Dialogs */}
      {canModify && (
        <>
          <MemberSelectionDialog
            open={isHiringManagerDialogOpen}
            onClose={() => setIsHiringManagerDialogOpen(false)}
            title="Select Hiring Manager"
            roleFilter="Hiring Manager"
            initialSelections={selectedTeam?.hiringManager?.id ? [selectedTeam.hiringManager.id] : []}
            onSelect={(members) => {
              const member = members[0];
              updateTeamAssignment({
                hiringManager: member ? { id: member._id, name: member.firstName + " " + member.lastName, email: member.email, phone: member.phone } : null
              });
            }}
          />

          <MemberSelectionDialog
            open={isTeamLeadDialogOpen}
            onClose={() => setIsTeamLeadDialogOpen(false)}
            title="Select Team Lead"
            roleFilter="Team Lead"
            initialSelections={selectedTeam?.teamLead?.id ? [selectedTeam.teamLead.id] : []}
            onSelect={(members) => {
              const member = members[0];
              updateTeamAssignment({
                teamLead: member ? { id: member._id, name: member.firstName + " " + member.lastName, email: member.email, phone: member.phone } : null
              });
            }}
          />

          <MemberSelectionDialog
            open={isRecruiterDialogOpen}
            onClose={() => setIsRecruiterDialogOpen(false)}
            title="Select Recruiters"
            roleFilter="Recruiters"
            multiple={true}
            initialSelections={selectedTeam?.recruiters?.map(r => r.id) || []}
            onSelect={(members) => {
              updateTeamAssignment({
                recruiters: members.map(member => ({
                  id: member._id,
                  name: member.firstName + " " + member.lastName,
                  email: member.email,
                  phone: member.phone
                }))
              });
            }}
          />
        </>
      )}
    </div>
  );
}
