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
import { TeamMember } from "@/types/teamMember";

interface AddTeamMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddTeamMembersDialog({ open, onOpenChange, onSuccess }: AddTeamMembersDialogProps) {
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
    return teamMembers.filter(member => member.role === role && member.status === "Active");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Add API call to create team
      console.log("Form data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        teamName: "",
        hiringManager: "",
        teamLead: "",
        recruiters: [],
        teamStatus: "",
      });

      // Close dialog and trigger success callback
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating team:", error);
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
          <DialogTitle>Add Team Members</DialogTitle>
          <DialogDescription>
            Create a new team with the required members and roles.
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
            >
              <SelectTrigger>
                <SelectValue placeholder="Select hiring manager" />
              </SelectTrigger>
              <SelectContent>
                {getTeamMembersByRole("Hiring Manager").map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamLead">Team Lead</Label>
            <Select
              value={formData.teamLead}
              onValueChange={(value) => handleInputChange("teamLead", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team lead" />
              </SelectTrigger>
              <SelectContent>
                {getTeamMembersByRole("Team Lead").map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recruiters">Recruiters</Label>
            <div className="space-y-2">
              <Select
                onValueChange={(value) => handleRecruiterToggle(value)}
                value=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recruiters" />
                </SelectTrigger>
                <SelectContent>
                  {getTeamMembersByRole("Recruiters").map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name}
                    </SelectItem>
                  ))}
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
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
