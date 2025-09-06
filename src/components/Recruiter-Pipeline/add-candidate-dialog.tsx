"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, Users } from "lucide-react";

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

function OptionCard({ icon, title, onClick }: OptionCardProps) {
  return (
    <Button
      variant="outline"
      className="h-auto flex flex-col items-center gap-6 p-8 hover:border-gray-400 hover:bg-gray-200"
      onClick={onClick}
    >
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
        {icon}
      </div>
      <span className="text-lg font-semibold text-gray-800">{title}</span>
    </Button>
  );
}

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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl sticky">Add Candidate</DialogTitle>
          <DialogDescription>
            {jobTitle
              ? `Choose how you want to add a candidate to ${jobTitle}.`
              : "Choose how you want to add a candidate."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <OptionCard
            icon={<Users className="w-8 h-8 text-gray-600" />}
            title="Add Existing Candidate"
            onClick={handleExistingClick}
          />
          <OptionCard
            icon={<UserPlus className="w-8 h-8 text-gray-600" />}
            title="Add New Candidate"
            onClick={handleNewClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
