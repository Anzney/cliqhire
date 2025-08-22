"use client";

import React, { useState } from "react";
import { TeamMember } from "@/types/teamMember";
import { updateTeamMember, uploadResume } from "@/services/teamMembersService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface EditResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMember: TeamMember | null;
  onUpdated?: (updated: TeamMember) => void;
}

export function EditResumeDialog({ open, onOpenChange, teamMember, onUpdated }: EditResumeDialogProps) {
  const [resume, setResume] = useState("");
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  React.useEffect(() => {
    if (open && teamMember) {
      setResume(teamMember.resume || "");
      setResumeFile(null);
    }
  }, [open, teamMember]);

  const handleSave = async () => {
    if (!teamMember?._id) return;
    
    try {
      setSaving(true);
      
      let updated: TeamMember;
      
      // Handle resume file upload separately
      if (resumeFile) {
        const { resumeUrl } = await uploadResume(teamMember._id, resumeFile);
        updated = await updateTeamMember({
          _id: teamMember._id,
          resume: resumeUrl
        });
      } else {
        updated = await updateTeamMember({
          _id: teamMember._id,
          resume: resume
        });
      }
      
      // Call the onUpdated callback
      onUpdated?.(updated);
      
      // Show success toast
      toast.success("Resume updated successfully");
      
      // Close the dialog
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating resume:', error);
      
      // Show error toast with specific message
      const errorMessage = error instanceof Error ? error.message : 'Failed to update resume';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (teamMember) {
      setResume(teamMember.resume || "");
    }
    setResumeFile(null);
    onOpenChange(false);
  };

  if (!teamMember) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Resume</DialogTitle>
          <DialogDescription>
            Update resume for {teamMember.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume URL</Label>
            <Input
              id="resume"
              placeholder="Paste resume URL"
              value={resume}
              onChange={e => setResume(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Or Upload File</Label>
            <input
              id="resume-file-input"
              type="file"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setResumeFile(file);
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploadingResume}
              onClick={() => document.getElementById("resume-file-input")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> 
              {uploadingResume ? "Uploading..." : resumeFile ? "Change File" : "Upload File"}
            </Button>
            {resumeFile && (
              <div className="text-xs text-green-600">
                File selected: {resumeFile.name}
              </div>
            )}
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
