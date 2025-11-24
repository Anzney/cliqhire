"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddCandidateOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoose: (option: "existing" | "new") => void;
}

export function AddCandidateOptionsDialog({ open, onOpenChange, onChoose }: AddCandidateOptionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Candidate</DialogTitle>
          <DialogDescription>Choose how you want to add a candidate.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <Button variant="outline" onClick={() => onChoose("existing")}>Add Existing Candidate</Button>
          <Button onClick={() => onChoose("new")}>Add New Candidate</Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}