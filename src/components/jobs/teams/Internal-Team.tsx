"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, UserPlus } from "lucide-react";
import { TeamSelectionDialog } from "@/components/jobs/summary/team-selection-dialog";
import { type RecruitmentManager, type TeamLead, type Recruiter } from "@/data/teamData";
import { updateJobById } from "@/services/jobService";
import { toast } from "sonner";
import { JobData } from "../types";

interface InternalTeamProps {
  jobId: string;
  jobData: JobData;
}

export function InternalTeam({ jobId, jobData }: InternalTeamProps) {
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
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
          ? { id: jti.hiringManager._id, name: jti.hiringManager.name, email: jti.hiringManager.email, phone: jti.hiringManager.phone }
          : undefined,
        teamLead: jti.teamLead
          ? { id: jti.teamLead._id, name: jti.teamLead.name, email: jti.teamLead.email, phone: jti.teamLead.phone }
          : undefined,
        recruiters: jti.recruiter
          ? [{ id: jti.recruiter._id, name: jti.recruiter.name, email: jti.recruiter.email, phone: jti.recruiter.phone }]
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

  const handleTeamSelectionSave = async (selections: {
    team?: { id: string; name: string };
    hiringManager?: { id: string; name: string };
    teamLead?: { id: string; name: string };
    recruiters?: { id: string; name: string }[];
  }) => {
    try {
      // Update local UI first
      setSelectedTeam(selections);
      setIsTeamDialogOpen(false);

      // Build the same payload structure used in Summary -> JobTeamInfoSection
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
        recruiterIds: JSON.stringify(teamData.recruiters.map((r) => r.id)) || "",
        hiringManager: teamData.hiringManager?.name || "",
        teamLead: teamData.teamLead?.name || "",
        recruiters: JSON.stringify(teamData.recruiters.map((r) => r.name)) || "",
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
  ) => {
    if (!member) return null;

    return (
      <div className="border rounded-lg p-4 space-y-2">
        <div className={`text-xs font-medium uppercase tracking-wide ${roleColor}`}>{title}</div>
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{member.name}</div>
          {member.email && (
            <div className="text-sm text-gray-500">Email: {member.email}</div>
          )}
          {member.phone && (
            <div className="text-sm text-gray-500">Phone: {member.phone}</div>
          )}
        </div>
      </div>
    );
  };

  const renderRecruitersCard = (recruiters: { id: string; name: string; email?: string; phone?: string }[] | undefined) => {
    if (!recruiters || recruiters.length === 0) return null;

    return (
      <div className="border rounded-lg p-4 space-y-2">
        <div className="text-xs font-medium uppercase tracking-wide text-purple-600">Recruiters</div>
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
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border px-4 py-4 h-[56vh] overflow-y-auto">
      {/* Header with title and button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Internal Team</h2>
        <Button
          size="sm"
          className="h-8"
          onClick={() => setIsTeamDialogOpen(true)}
        >
          {selectedTeam &&
          (selectedTeam.hiringManager || selectedTeam.teamLead || selectedTeam.recruiters?.length) ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Internal Team
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Internal Team
            </>
          )}
        </Button>
      </div>

      {/* Team Information Display */}
      {selectedTeam && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {renderTeamMemberCard(
              "Hiring Manager",
              selectedTeam.hiringManager,
              "text-blue-600",
            )}

            {renderTeamMemberCard("Team Lead", selectedTeam.teamLead, "text-green-600")}

            {renderRecruitersCard(selectedTeam.recruiters)}
          </div>
        </div>
      )}

      {!selectedTeam && (
        <div className="flex flex-col items-center justify-center h-[calc(100%-90px)] text-gray-500 text-sm">
          <UserPlus className="w-10 h-10 mb-2" />
          <span className="text-base">
            No internal team selected. Click Add Internal Team to get started.
          </span>
        </div>
      )}

      {/* Team Selection Dialog */}
      <TeamSelectionDialog
        open={isTeamDialogOpen}
        onClose={() => setIsTeamDialogOpen(false)}
        onSave={handleTeamSelectionSave}
        initialSelections={{
          teamId:
            selectedTeam?.team?.id ||
            ((jobData as any)?.jobTeamInfo?.teamId?._id as string | undefined),
          hiringManagerId:
            selectedTeam?.hiringManager?.id ||
            ((jobData as any)?.jobTeamInfo?.hiringManager?._id as string | undefined),
          teamLeadId:
            selectedTeam?.teamLead?.id ||
            ((jobData as any)?.jobTeamInfo?.teamLead?._id as string | undefined),
          recruiterIds:
            selectedTeam?.recruiters?.map((r) => r.id) ||
            (((jobData as any)?.jobTeamInfo?.recruiter?._id ? [(jobData as any).jobTeamInfo.recruiter._id] : []) as string[]),
        }}
      />
    </div>
  );
}
