"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getTeams, type Team } from "@/services/teamService";

interface TeamSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (selections: {
    team?: { id: string; name: string };
    hiringManager?: { id: string; name: string; email?: string; phone?: string };
    teamLead?: { id: string; name: string; email?: string; phone?: string };
    recruiters?: { id: string; name: string; email?: string; phone?: string }[];
  }) => void;
  initialSelections?: {
    teamId?: string;
    hiringManagerId?: string;
    teamLeadId?: string;
    recruiterIds?: string[];
  };
}

export function TeamSelectionDialog({
  open,
  onClose,
  onSave,
  initialSelections,
}: TeamSelectionDialogProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedRecruiterId, setSelectedRecruiterId] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  // Get the selected team object
  const selectedTeam = teams.find(team => team._id === selectedTeamId);

  // Fetch teams when dialog opens
  useEffect(() => {
    if (open) {
      fetchTeams();
    }
  }, [open]);

  const fetchTeams = async () => {
    setIsLoadingTeams(true);
    try {
      const response = await getTeams();
      setTeams(response.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  // Initialize with current selections
  useEffect(() => {
    if (initialSelections) {
      setSelectedTeamId(initialSelections.teamId || "");
      setSelectedRecruiterId(initialSelections.recruiterIds?.[0] || "");
    }
  }, [initialSelections, open]);

  // Reset recruiters when team changes
  useEffect(() => {
    if (selectedTeamId && !initialSelections?.recruiterIds) {
      setSelectedRecruiterId("");
    }
  }, [selectedTeamId, initialSelections?.recruiterIds]);

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    // Reset recruiter selection when team changes (unless it's initial load)
    if (!initialSelections?.recruiterIds) {
      setSelectedRecruiterId("");
    }
  };

  const handleRecruiterChange = (recruiterId: string) => {
    setSelectedRecruiterId(recruiterId);
  };

  const handleSave = () => {
    // Some backends may return IDs as strings instead of populated objects. Guard at runtime.
    const hiringManagerObj = selectedTeam && typeof (selectedTeam as any).hiringManagerId === "object"
      ? (selectedTeam as any).hiringManagerId
      : undefined;
    const teamLeadObj = selectedTeam && typeof (selectedTeam as any).teamLeadId === "object"
      ? (selectedTeam as any).teamLeadId
      : undefined;

    const selections = {
      team: selectedTeam ? { id: selectedTeam._id, name: selectedTeam.teamName } : undefined,
      hiringManager: hiringManagerObj
        ? {
            id: hiringManagerObj._id,
            name: hiringManagerObj.name,
            email: hiringManagerObj.email,
            phone: hiringManagerObj.phone,
          }
        : undefined,
      teamLead: teamLeadObj
        ? {
            id: teamLeadObj._id,
            name: teamLeadObj.name,
            email: teamLeadObj.email,
            phone: teamLeadObj.phone,
          }
        : undefined,
      recruiters: selectedRecruiterId
        ? (() => {
            const recruiter = selectedTeam?.recruiters.find((r) => r._id === selectedRecruiterId);
            return recruiter
              ? [{ id: recruiter._id, name: recruiter.name, email: recruiter.email, phone: recruiter.phone }]
              : [];
          })()
        : [],
    };

    onSave(selections);
    onClose();
  };

  const handleCancel = () => {
    // Reset to initial values
    if (initialSelections) {
      setSelectedTeamId(initialSelections.teamId || "");
      setSelectedRecruiterId(initialSelections.recruiterIds?.[0] || "");
    } else {
      setSelectedTeamId("");
      setSelectedRecruiterId("");
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Job Team Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Team Selection */}
          <div className="space-y-2">
            <Label htmlFor="team">Team Name</Label>
            <Select
              value={selectedTeamId}
              onValueChange={handleTeamChange}
              disabled={isLoadingTeams}
            >
              <SelectTrigger>
                <SelectValue 
                  placeholder={isLoadingTeams ? "Loading teams..." : "Select a team"} 
                />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team._id} value={team._id}>
                    {team.teamName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hiring Manager Display (Auto-populated) */}
          {selectedTeam && (
            <div className="space-y-2">
              <Label>Hiring Manager</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-sm font-medium">
                  {typeof (selectedTeam as any).hiringManagerId === "object"
                    ? (selectedTeam as any).hiringManagerId?.name
                    : "Not assigned"}
                </span>
              </div>
            </div>
          )}

          {/* Team Lead Display (Auto-populated) */}
          {selectedTeam && (
            <div className="space-y-2">
              <Label>Team Lead</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-sm font-medium">
                  {typeof (selectedTeam as any).teamLeadId === "object"
                    ? (selectedTeam as any).teamLeadId?.name
                    : "Not assigned"}
                </span>
              </div>
            </div>
          )}

          {/* Recruiter Selection (Single) */}
          {selectedTeam && (
            <div className="space-y-2">
              <Label>Recruiter</Label>
              <Select
                value={selectedRecruiterId}
                onValueChange={handleRecruiterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a recruiter" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTeam.recruiters?.map?.((recruiter) => (
                    <SelectItem 
                      key={recruiter._id} 
                      value={recruiter._id}
                    >
                      {recruiter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
