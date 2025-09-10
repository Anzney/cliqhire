"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DisqualificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: DisqualificationData) => void;
  candidateName: string;
  currentStage: string;
  currentStageStatus?: string;
}

export interface DisqualificationData {
  disqualificationStage: string;
  disqualificationStatus: string;
  disqualificationReason: string;
  disqualificationFeedback?: string;
  notes?: string;
}

export function DisqualificationDialog({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  currentStage,
  currentStageStatus
}: DisqualificationDialogProps) {
  const [reason, setReason] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setReason("");
      setFeedback("");
      setNotes("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm({
        disqualificationStage: currentStage,
        disqualificationStatus: currentStageStatus || "",
        disqualificationReason: reason.trim(),
        disqualificationFeedback: feedback.trim() || undefined,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (error) {
      console.error('Error submitting disqualification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const isFormValid = reason.trim().length > 0 && currentStageStatus && currentStageStatus.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Disqualify Candidate</DialogTitle>
          <DialogDescription>
            You are about to disqualify <strong>{candidateName}</strong> from the pipeline.
            Please provide the reason for disqualification.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-stage">Current Stage</Label>
            <Input
              id="current-stage"
              value={currentStage}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-stage-status">
              Current Stage Status <span className="text-red-500">*</span>
            </Label>
            <Input
              id="current-stage-status"
              value={currentStageStatus || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Disqualification <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed reason for disqualification..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="text-xs text-gray-500">
              {reason.length}/500 characters
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">
              Disqualification Feedback
            </Label>
            <Textarea
              id="feedback"
              placeholder="Additional feedback about the disqualification..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="text-xs text-gray-500">
              {feedback.length}/500 characters
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Optional notes about the disqualification..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <div className="text-xs text-gray-500">
              {notes.length}/500 characters
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Disqualifying..." : "Disqualify Candidate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
