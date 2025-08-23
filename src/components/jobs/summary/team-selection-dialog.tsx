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
import {
  recruitmentManagers,
  teamLeads,
  recruiters,
  getTeamLeadsByManager,
  getRecruitersByTeamLead,
  getRecruitmentManagerById,
  getTeamLeadById,
  getRecruiterById,
  type RecruitmentManager,
  type TeamLead,
  type Recruiter,
} from "@/data/teamData";
import { getTeams, type Team } from "@/services/teamService";

interface TeamSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (selections: {
    team?: { id: string; name: string };
    recruitmentManager?: RecruitmentManager;
    teamLead?: TeamLead;
    recruiter?: Recruiter;
  }) => void;
  initialSelections?: {
    teamId?: string;
    recruitmentManagerId?: string;
    teamLeadId?: string;
    recruiterId?: string;
  };
}

export function TeamSelectionDialog({
  open,
  onClose,
  onSave,
  initialSelections,
}: TeamSelectionDialogProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [selectedTeamLeadId, setSelectedTeamLeadId] = useState<string>("");
  const [selectedRecruiterId, setSelectedRecruiterId] = useState<string>("");

  const [teams, setTeams] = useState<Team[]>([]);
  const [availableTeamLeads, setAvailableTeamLeads] = useState<TeamLead[]>([]);
  const [availableRecruiters, setAvailableRecruiters] = useState<Recruiter[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

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
      setSelectedManagerId(initialSelections.recruitmentManagerId || "");
      setSelectedTeamLeadId(initialSelections.teamLeadId || "");
      setSelectedRecruiterId(initialSelections.recruiterId || "");
    }
  }, [initialSelections, open]);

  // Update available team leads when manager changes
  useEffect(() => {
    if (selectedManagerId) {
      const teamLeadsForManager = getTeamLeadsByManager(selectedManagerId);
      setAvailableTeamLeads(teamLeadsForManager);

      // Reset team lead and recruiter if current selections are not valid
      if (selectedTeamLeadId) {
        const isValidTeamLead = teamLeadsForManager.some((tl) => tl.id === selectedTeamLeadId);
        if (!isValidTeamLead) {
          setSelectedTeamLeadId("");
          setSelectedRecruiterId("");
        }
      }
    } else {
      setAvailableTeamLeads([]);
      setSelectedTeamLeadId("");
      setSelectedRecruiterId("");
    }
  }, [selectedManagerId]);

  // Update available recruiters when team lead changes
  useEffect(() => {
    if (selectedTeamLeadId) {
      const recruitersForTeamLead = getRecruitersByTeamLead(selectedTeamLeadId);
      setAvailableRecruiters(recruitersForTeamLead);

      // Reset recruiter if current selection is not valid
      if (selectedRecruiterId) {
        const isValidRecruiter = recruitersForTeamLead.some((r) => r.id === selectedRecruiterId);
        if (!isValidRecruiter) {
          setSelectedRecruiterId("");
        }
      }
    } else {
      setAvailableRecruiters([]);
      setSelectedRecruiterId("");
    }
  }, [selectedTeamLeadId]);

  const handleSave = () => {
    const selectedTeam = teams.find(team => team._id === selectedTeamId);
    
    const selections = {
      team: selectedTeam ? { id: selectedTeam._id, name: selectedTeam.teamName } : undefined,
      recruitmentManager: selectedManagerId
        ? getRecruitmentManagerById(selectedManagerId)
        : undefined,
      teamLead: selectedTeamLeadId ? getTeamLeadById(selectedTeamLeadId) : undefined,
      recruiter: selectedRecruiterId ? getRecruiterById(selectedRecruiterId) : undefined,
    };

    onSave(selections);
    onClose();
  };

  const handleCancel = () => {
    // Reset to initial values
    if (initialSelections) {
      setSelectedTeamId(initialSelections.teamId || "");
      setSelectedManagerId(initialSelections.recruitmentManagerId || "");
      setSelectedTeamLeadId(initialSelections.teamLeadId || "");
      setSelectedRecruiterId(initialSelections.recruiterId || "");
    } else {
      setSelectedTeamId("");
      setSelectedManagerId("");
      setSelectedTeamLeadId("");
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
              onValueChange={(value) => setSelectedTeamId(value)}
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

          {/* Hiring Manager Selection */}
          <div className="space-y-2">
            <Label htmlFor="hiring-manager">Hiring Manager</Label>
            <Select
              value={selectedManagerId}
              onValueChange={(value) => setSelectedManagerId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Hiring Manager" />
              </SelectTrigger>
              <SelectContent>
                {recruitmentManagers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team Lead Selection */}
          <div className="space-y-2">
            <Label htmlFor="team-lead">Team Lead</Label>
            <Select
              value={selectedTeamLeadId}
              onValueChange={(value) => setSelectedTeamLeadId(value)}
              disabled={!selectedManagerId}
            >
              <SelectTrigger className={!selectedManagerId ? "opacity-50" : ""}>
                <SelectValue
                  placeholder={
                    !selectedManagerId ? "Select a Hiring Manager first" : "Select a Team Lead"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableTeamLeads.map((teamLead) => (
                  <SelectItem key={teamLead.id} value={teamLead.id}>
                    {teamLead.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recruiter Selection */}
          <div className="space-y-2">
            <Label htmlFor="recruiter">Recruiter</Label>
            <Select
              value={selectedRecruiterId}
              onValueChange={(value) => setSelectedRecruiterId(value)}
              disabled={!selectedTeamLeadId}
            >
              <SelectTrigger className={!selectedTeamLeadId ? "opacity-50" : ""}>
                <SelectValue
                  placeholder={
                    !selectedTeamLeadId ? "Select a Team Lead first" : "Select a Recruiter"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableRecruiters.map((recruiter) => (
                  <SelectItem key={recruiter.id} value={recruiter.id}>
                    {recruiter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
