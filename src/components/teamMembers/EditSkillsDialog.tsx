"use client";

import React, { useState } from "react";
import { TeamMember } from "@/types/teamMember";
import { updateTeamMember } from "@/services/teamMembersService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditSkillsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMember: TeamMember | null;
  onUpdated?: (updated: TeamMember) => void;
}

export function EditSkillsDialog({ open, onOpenChange, teamMember, onUpdated }: EditSkillsDialogProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (open && teamMember) {
      setSkills(Array.isArray(teamMember.skills) ? teamMember.skills : []);
    }
  }, [open, teamMember]);

  const handleSave = async () => {
    if (!teamMember?._id) return;
    
    try {
      setSaving(true);
      
      const updated = await updateTeamMember({
        _id: teamMember._id,
        skills: skills.filter(skill => skill.trim() !== "")
      });
      
      // Call the onUpdated callback
      onUpdated?.(updated);
      
      // Show success toast
      toast.success("Skills updated successfully");
      
      // Close the dialog
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating skills:', error);
      
      // Show error toast with specific message
      const errorMessage = error instanceof Error ? error.message : 'Failed to update skills';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (teamMember) {
      setSkills(Array.isArray(teamMember.skills) ? teamMember.skills : []);
    }
    onOpenChange(false);
  };

  if (!teamMember) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
          <DialogDescription>
            Update skills for {teamMember.firstName + " " + teamMember.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              placeholder="Enter skills (one per line)"
              value={skills.join("\n")}
              onChange={e => {
                const skillsArray = e.target.value.split("\n").map(s => s.trim());
                setSkills(skillsArray);
              }}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Enter each skill on a new line
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
