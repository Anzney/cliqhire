"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pipelineStages } from "./dummy-data";

interface DisqualificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: DisqualificationData) => void;
  candidateName: string;
  currentStage: string;
}

export interface DisqualificationData {
  reason: string;
  stageAfterDisqualification: string;
}

export function DisqualificationDialog({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  currentStage
}: DisqualificationDialogProps) {
  const [reason, setReason] = React.useState("");
  const [stageAfterDisqualification, setStageAfterDisqualification] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setReason("");
      setStageAfterDisqualification("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!reason.trim() || !stageAfterDisqualification) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm({
        reason: reason.trim(),
        stageAfterDisqualification
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

  const isFormValid = reason.trim().length > 0 && stageAfterDisqualification.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Disqualify Candidate</DialogTitle>
          <DialogDescription>
            You are about to disqualify <strong>{candidateName}</strong> from the pipeline.
            Please provide the reason for disqualification and specify after which stage this occurred.
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
            <Label htmlFor="stage-after-disqualification">
              Stage After Disqualification <span className="text-red-500">*</span>
            </Label>
            <Select value={stageAfterDisqualification} onValueChange={setStageAfterDisqualification}>
              <SelectTrigger>
                <SelectValue placeholder="Select the stage after disqualification" />
              </SelectTrigger>
              <SelectContent>
                {pipelineStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
