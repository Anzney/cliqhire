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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getTeams, type Team } from "@/services/teamService";

interface TeamSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (selections: {
    team?: { id: string; name: string };
    hiringManager?: { id: string; name: string };
    teamLead?: { id: string; name: string };
    recruiters?: { id: string; name: string }[];
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
  const [selectedRecruiterIds, setSelectedRecruiterIds] = useState<string[]>([]);
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
      setSelectedRecruiterIds(initialSelections.recruiterIds || []);
    }
  }, [initialSelections, open]);

  // Reset recruiters when team changes
  useEffect(() => {
    if (selectedTeamId && !initialSelections?.recruiterIds) {
      setSelectedRecruiterIds([]);
    }
  }, [selectedTeamId, initialSelections?.recruiterIds]);

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    // Reset recruiter selections when team changes (unless it's initial load)
    if (!initialSelections?.recruiterIds) {
      setSelectedRecruiterIds([]);
    }
  };

  const handleRecruiterToggle = (recruiterId: string) => {
    setSelectedRecruiterIds(prev => {
      if (prev.includes(recruiterId)) {
        return prev.filter(id => id !== recruiterId);
      } else {
        return [...prev, recruiterId];
      }
    });
  };

  const removeRecruiter = (recruiterId: string) => {
    setSelectedRecruiterIds(prev => prev.filter(id => id !== recruiterId));
  };

  const handleSave = () => {
    const selections = {
      team: selectedTeam ? { id: selectedTeam._id, name: selectedTeam.teamName } : undefined,
      hiringManager: selectedTeam?.hiringManagerId ? {
        id: selectedTeam.hiringManagerId._id,
        name: selectedTeam.hiringManagerId.name
      } : undefined,
      teamLead: selectedTeam?.teamLeadId ? {
        id: selectedTeam.teamLeadId._id,
        name: selectedTeam.teamLeadId.name
      } : undefined,
      recruiters: selectedRecruiterIds.map(recruiterId => {
        const recruiter = selectedTeam?.recruiters.find(r => r._id === recruiterId);
        return recruiter ? { id: recruiter._id, name: recruiter.name } : null;
      }).filter(Boolean) as { id: string; name: string }[],
    };

    onSave(selections);
    onClose();
  };

  const handleCancel = () => {
    // Reset to initial values
    if (initialSelections) {
      setSelectedTeamId(initialSelections.teamId || "");
      setSelectedRecruiterIds(initialSelections.recruiterIds || []);
    } else {
      setSelectedTeamId("");
      setSelectedRecruiterIds([]);
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
                  {selectedTeam.hiringManagerId.name}
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
                  {selectedTeam.teamLeadId.name}
                </span>
              </div>
            </div>
          )}

          {/* Recruiter Selection (Multiple) */}
          {selectedTeam && (
            <div className="space-y-2">
              <Label>Recruiters</Label>
              <div className="space-y-3">
                {/* Selected Recruiters Display */}
                {selectedRecruiterIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedRecruiterIds.map(recruiterId => {
                      const recruiter = selectedTeam.recruiters.find(r => r._id === recruiterId);
                      return recruiter ? (
                        <Badge key={recruiterId} variant="secondary" className="flex items-center gap-1">
                          {recruiter.name}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeRecruiter(recruiterId)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Recruiter Selection Dropdown */}
                <Select
                  value=""
                  onValueChange={handleRecruiterToggle}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recruiters" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTeam.recruiters.map((recruiter) => (
                      <SelectItem 
                        key={recruiter._id} 
                        value={recruiter._id}
                      >
                        {recruiter.name}
                        {selectedRecruiterIds.includes(recruiter._id) && " ✓"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
