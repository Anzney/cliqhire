"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getTeamMembers } from "@/services/teamMembersService";
import { createTeam, updateTeam, Team } from "@/services/teamService";
import { TeamMember } from "@/types/teamMember";

interface AddTeamMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (formData: any) => void;
  editTeam?: Team | null;
}

export function AddTeamMembersDialog({ open, onOpenChange, onSuccess, editTeam }: AddTeamMembersDialogProps) {
  const [formData, setFormData] = useState({
    teamName: "",
    hiringManager: "",
    teamLead: "",
    recruiters: [] as string[],
    teamStatus: "",
  });

  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);

  // Fetch team members when dialog opens
  useEffect(() => {
    if (open) {
      fetchTeamMembers();
    }
  }, [open]);

  useEffect(() => {
    if (open && editTeam) {
      setFormData({
        teamName: editTeam.teamName || "",
        hiringManager: editTeam.hiringManagerId?._id || "",
        teamLead: editTeam.teamLeadId?._id || "",
        recruiters: Array.isArray(editTeam.recruiters) ? editTeam.recruiters.map(r => r._id) : [],
        teamStatus: editTeam.teamStatus || "",
      });
    } else if (open && !editTeam) {
      setFormData({
        teamName: "",
        hiringManager: "",
        teamLead: "",
        recruiters: [],
        teamStatus: "",
      });
    }
  }, [open, editTeam]);

  const fetchTeamMembers = async () => {
    setLoadingTeamMembers(true);
    try {
      const response = await getTeamMembers();
      setTeamMembers(response.teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoadingTeamMembers(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecruiterToggle = (recruiterId: string) => {
    setFormData(prev => ({
      ...prev,
      recruiters: prev.recruiters.includes(recruiterId)
        ? prev.recruiters.filter(id => id !== recruiterId)
        : [...prev.recruiters, recruiterId]
    }));
  };

  const removeRecruiter = (recruiterId: string) => {
    setFormData(prev => ({
      ...prev,
      recruiters: prev.recruiters.filter(id => id !== recruiterId)
    }));
  };

  const getTeamMemberById = (id: string) => {
    return teamMembers.find(member => member._id === id);
  };

  const getTeamMembersByRole = (role: string) => {
    // More specific role matching to avoid cross-contamination
    const roleMappings: { [key: string]: string[] } = {
      "Hiring Manager": ["Hiring Manager", "Recruitment Manager", "HR Manager", "Manager"],
      "Team Lead": ["Team Lead", "Lead", "Team Leader", "Lead Recruiter"],
      "Recruiters": ["Recruiter", "Recruiters", "Recruitment Specialist", "Talent Acquisition", "Recruiter Specialist"]
    };
    
    const validRoles = roleMappings[role] || [role];
    
    const filteredMembers = teamMembers.filter(member => {
      const memberRole = member.role || member.teamRole || member.department || '';
      const isActive = member.status === "Active" || member.isActive === "Active";
      
      // More strict matching to avoid false positives
      let matchesRole = false;
      if (role === "Recruiters") {
        // For recruiters, be more specific - avoid matching "Recruitment Manager" or "Lead Recruiter"
        matchesRole = validRoles.some(validRole => {
          const roleLower = memberRole.toLowerCase();
          const validRoleLower = validRole.toLowerCase();
          
          // Exact match or starts with the role (but not if it's a manager or lead)
          return roleLower === validRoleLower || 
                 (roleLower.startsWith(validRoleLower) && 
                  !roleLower.includes('manager') && 
                  !roleLower.includes('lead'));
        });
      } else {
        // For other roles, use standard matching
        matchesRole = validRoles.some(validRole => 
          memberRole.toLowerCase().includes(validRole.toLowerCase())
        );
      }
      
      return matchesRole && isActive;
    });
    
    return filteredMembers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.teamName || !formData.hiringManager || !formData.teamLead || formData.recruiters.length === 0 || !formData.teamStatus) {
        throw new Error("Please fill in all required fields");
      }

      const payload = {
        teamName: formData.teamName,
        hiringManagerId: formData.hiringManager,
        teamLeadId: formData.teamLead,
        recruiterIds: formData.recruiters,
        teamStatus: formData.teamStatus,
      };

      let result;
      if (editTeam?._id) {
        result = await updateTeam(editTeam._id, payload);
      } else {
        result = await createTeam(payload);
      }

      onOpenChange(false);
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Reset form
      setFormData({
        teamName: "",
        hiringManager: "",
        teamLead: "",
        recruiters: [],
        teamStatus: "",
      });
    } catch (error: any) {
      // You might want to show an error message to the user here
      alert(error.message || (editTeam ? "Failed to update team" : "Failed to create team"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      teamName: "",
      hiringManager: "",
      teamLead: "",
      recruiters: [],
      teamStatus: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editTeam ? "Edit Team" : "Add Team Members"}</DialogTitle>
          <DialogDescription>
            {editTeam ? "Update the team details and members." : "Create a new team with the required members and roles."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={formData.teamName}
              onChange={(e) => handleInputChange("teamName", e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hiringManager">Hiring Manager</Label>
            <Select
              value={formData.hiringManager}
              onValueChange={(value) => handleInputChange("hiringManager", value)}
              required
              disabled={loadingTeamMembers}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingTeamMembers ? "Loading..." : "Select hiring manager"} />
              </SelectTrigger>
              <SelectContent>
                {loadingTeamMembers ? (
                  <SelectItem value="loading" disabled>Loading team members...</SelectItem>
                ) : getTeamMembersByRole("Hiring Manager").length === 0 ? (
                  <SelectItem value="no-results" disabled>No hiring managers found</SelectItem>
                ) : (
                  getTeamMembersByRole("Hiring Manager").map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamLead">Team Lead</Label>
            <Select
              value={formData.teamLead}
              onValueChange={(value) => handleInputChange("teamLead", value)}
              required
              disabled={loadingTeamMembers}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingTeamMembers ? "Loading..." : "Select team lead"} />
              </SelectTrigger>
              <SelectContent>
                {loadingTeamMembers ? (
                  <SelectItem value="loading" disabled>Loading team members...</SelectItem>
                ) : getTeamMembersByRole("Team Lead").length === 0 ? (
                  <SelectItem value="no-results" disabled>No team leads found</SelectItem>
                ) : (
                  getTeamMembersByRole("Team Lead").map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recruiters">Recruiters</Label>
            <div className="space-y-2">
              <Select
                onValueChange={(value) => handleRecruiterToggle(value)}
                value=""
                disabled={loadingTeamMembers}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingTeamMembers ? "Loading..." : "Select recruiters"} />
                </SelectTrigger>
                <SelectContent>
                  {loadingTeamMembers ? (
                    <SelectItem value="loading" disabled>Loading team members...</SelectItem>
                  ) : getTeamMembersByRole("Recruiters").length === 0 ? (
                    <SelectItem value="no-results" disabled>No recruiters found</SelectItem>
                  ) : (
                    getTeamMembersByRole("Recruiters").map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {/* Selected Recruiters */}
              {formData.recruiters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.recruiters.map((recruiterId) => {
                    const recruiter = getTeamMemberById(recruiterId);
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamStatus">Team Status</Label>
            <Select
              value={formData.teamStatus}
              onValueChange={(value) => handleInputChange("teamStatus", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Working">Working</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (editTeam ? "Updating..." : "Creating...") : (editTeam ? "Update Team" : "Create Team")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
