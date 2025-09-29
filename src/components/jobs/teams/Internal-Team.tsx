"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, UserPlus } from "lucide-react";
import { TeamSelectionDialog } from "@/components/jobs/summary/team-selection-dialog";
import { type RecruitmentManager, type TeamLead, type Recruiter } from "@/data/teamData";

export function InternalTeam() {
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{
    team?: { id: string; name: string };
    hiringManager?: { id: string; name: string };
    teamLead?: { id: string; name: string };
    recruiters?: { id: string; name: string }[];
  } | null>(null);

  const handleTeamSelectionSave = (selections: {
    team?: { id: string; name: string };
    hiringManager?: { id: string; name: string };
    teamLead?: { id: string; name: string };
    recruiters?: { id: string; name: string }[];
  }) => {
    setSelectedTeam(selections);
    setIsTeamDialogOpen(false);
  };

  const renderTeamMemberCard = (
    title: string,
    member: { id: string; name: string } | undefined,
    roleColor: string,
  ) => {
    if (!member) return null;

    return (
      <div className="border rounded-lg p-4 space-y-2">
        <div className={`text-xs font-medium uppercase tracking-wide ${roleColor}`}>{title}</div>
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{member.name}</div>
          <div className="text-sm text-gray-500">ID: {member.id}</div>
        </div>
      </div>
    );
  };

  const renderRecruitersCard = (recruiters: { id: string; name: string }[] | undefined) => {
    if (!recruiters || recruiters.length === 0) return null;

    return (
      <div className="border rounded-lg p-4 space-y-2">
        <div className="text-xs font-medium uppercase tracking-wide text-purple-600">Recruiters</div>
        <div className="space-y-1">
          {recruiters.map((recruiter, index) => (
            <div key={recruiter.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{recruiter.name}</div>
                <div className="text-sm text-gray-500">ID: {recruiter.id}</div>
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
          <div className="text-sm font-medium text-gray-700 border-b pb-2">
            Selected Team Members
          </div>

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
          teamId: selectedTeam?.team?.id,
          hiringManagerId: selectedTeam?.hiringManager?.id,
          teamLeadId: selectedTeam?.teamLead?.id,
          recruiterIds: selectedTeam?.recruiters?.map(r => r.id) || [],
        }}
      />
    </div>
  );
}
