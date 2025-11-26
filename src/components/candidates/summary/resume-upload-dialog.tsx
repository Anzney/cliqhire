"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadResume } from "../UploadResume";

interface ResumeUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onResumeUploaded: (resumeUrl: string) => void;
  candidateId?: string; // Add candidateId prop
}

export function ResumeUploadDialog({ 
  open, 
  onClose, 
  onResumeUploaded,
  candidateId 
}: ResumeUploadDialogProps) {
  const handleUploaded = (resumeUrl: string) => {
    onResumeUploaded(resumeUrl);
    // Don't close the dialog here - let the parent component handle it
    // after the API call is successful
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>
        <div className="py-4 h-full">
          <UploadResume
            open={true}
            onUploaded={handleUploaded}
            onClose={onClose}
            goBack={onClose}
            candidateId={candidateId}
            useDialog={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
