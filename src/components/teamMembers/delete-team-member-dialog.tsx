"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMemberName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteTeamMemberDialog({
  open,
  onOpenChange,
  teamMemberName,
  onConfirm,
  isLoading = false,
}: DeleteTeamMemberDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in delete confirmation:', error);
      // The error will be handled by the parent component
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Team Member
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{teamMemberName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex items-center gap-2"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
            {isLoading ? "Deleting..." : "Delete Team Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
