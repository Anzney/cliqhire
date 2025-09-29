"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { UserPlus, Users } from "lucide-react";

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExisting: () => void;
  onAddNew: () => void;
  jobTitle?: string;
}

export function AddCandidateDialog({
  open,
  onOpenChange,
  onAddExisting,
  onAddNew,
  jobTitle,
}: AddCandidateDialogProps) {
  const handleExistingClick = () => {
    onAddExisting();
    onOpenChange(false);
  };

  const handleNewClick = () => {
    onAddNew();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Add Candidate</DialogTitle>
          <DialogDescription>
            {jobTitle
              ? `Choose how you want to add a candidate to ${jobTitle}.`
              : "Choose how you want to add a candidate."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-2">
             <Button
                variant="outline"
                onClick={handleExistingClick}
                className="h-10 w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Add Existing Candidate
              </Button>
              <Button onClick={handleNewClick} className="h-10 w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Candidate
              </Button>
             </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


