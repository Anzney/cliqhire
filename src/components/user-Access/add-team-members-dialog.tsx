"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

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
    recruiters: "",
    teamStatus: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Add API call to create team member
      console.log("Form data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        teamName: "",
        hiringManager: "",
        teamLead: "",
        recruiters: "",
        teamStatus: "",
      });

      // Close dialog and trigger success callback
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating team member:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      teamName: "",
      hiringManager: "",
      teamLead: "",
      recruiters: "",
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
            <Input
              id="hiringManager"
              value={formData.hiringManager}
              onChange={(e) => handleInputChange("hiringManager", e.target.value)}
              placeholder="Enter hiring manager name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamLead">Team Lead</Label>
            <Input
              id="teamLead"
              value={formData.teamLead}
              onChange={(e) => handleInputChange("teamLead", e.target.value)}
              placeholder="Enter team lead name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recruiters">Recruiters</Label>
            <Textarea
              id="recruiters"
              value={formData.recruiters}
              onChange={(e) => handleInputChange("recruiters", e.target.value)}
              placeholder="Enter recruiter names (separate with commas)"
              required
            />
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
