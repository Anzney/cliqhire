"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectOption: (option: "existing" | "new") => void;
}

export const AddCandidateDialog: React.FC<AddCandidateDialogProps> = ({ open, onOpenChange, onSelectOption }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Candidate Option</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 mt-4">
          <Card
            className="flex-1 p-8 cursor-pointer hover:shadow-lg border-primary border-2 transition-all flex flex-col items-center justify-center"
            onClick={() => onSelectOption("existing")}
          >
            <Users className="h-8 w-8 mb-2 text-primary" />
            <span className="font-medium">Existing Candidate</span>
          </Card>
          <Card
            className="flex-1 p-8 cursor-pointer hover:shadow-lg border-primary border-2 transition-all flex flex-col items-center justify-center"
            onClick={() => onSelectOption("new")}
          >
            <UserPlus className="h-8 w-8 mb-2 text-primary" />
            <span className="font-medium">Add New Candidate</span>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateDialog;
