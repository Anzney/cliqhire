"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TempCandidateAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  message?: string;
}

export function TempCandidateAlertDialog({ 
  isOpen, 
  onClose, 
  candidateName,
  message = "Change the status of the candidate (CV Received), then create the candidate, then change the stage."
}: TempCandidateAlertDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Cannot Change Stage
          </DialogTitle>
          <DialogDescription className="pt-2">
            {candidateName && (
              <div className="mb-3">
                <strong>{candidateName}</strong> is a temporary candidate.
              </div>
            )}
            <div className="text-sm text-gray-600">
              {message}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Understood
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
