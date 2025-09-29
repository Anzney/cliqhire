"use client";

import React, { useState } from "react";
import { TeamMember } from "@/types/teamMember";
import { updateTeamMember } from "@/services/teamMembersService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditSpecializationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMember: TeamMember | null;
  onUpdated?: (updated: TeamMember) => void;
}

export function EditSpecializationDialog({ open, onOpenChange, teamMember, onUpdated }: EditSpecializationDialogProps) {
  const [specialization, setSpecialization] = useState("");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (open && teamMember) {
      setSpecialization(teamMember.specialization || "");
    }
  }, [open, teamMember]);

  const handleSave = async () => {
    if (!teamMember?._id) return;
    
    try {
      setSaving(true);
      
      const updated = await updateTeamMember({
        _id: teamMember._id,
        specialization: specialization
      });
      
      // Call the onUpdated callback
      onUpdated?.(updated);
      
      // Show success toast
      toast.success("Specialization updated successfully");
      
      // Close the dialog
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating specialization:', error);
      
      // Show error toast with specific message
      const errorMessage = error instanceof Error ? error.message : 'Failed to update specialization';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (teamMember) {
      setSpecialization(teamMember.specialization || "");
    }
    onOpenChange(false);
  };

  if (!teamMember) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Specialization</DialogTitle>
          <DialogDescription>
            Update specialization for {teamMember.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Textarea
              id="specialization"
              placeholder="Enter specialization"
              value={specialization}
              onChange={e => setSpecialization(e.target.value)}
              rows={4}
            />
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
