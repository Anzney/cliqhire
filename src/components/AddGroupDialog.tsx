"use client";
import React, { useState , useEffect} from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGroup?: (groupName: string) => void;
  initialGroupName?: string;
  submitButtonLabel?: string;
  onSubmit?: (groupName: string) => void;
}

export const AddGroupDialog: React.FC<AddGroupDialogProps> = ({ open, onOpenChange, onAddGroup, initialGroupName = "", submitButtonLabel = "Add", onSubmit }) => {
  const [groupName, setGroupName] = useState(initialGroupName);

  useEffect(() => {
    setGroupName(initialGroupName);
  }, [initialGroupName, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      if (typeof onSubmit === 'function') {
        onSubmit(groupName.trim());
      } else if (typeof onAddGroup === 'function') {
        onAddGroup(groupName.trim());
      }
    }
    onOpenChange(false);
    setGroupName("");
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Group</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              autoFocus
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="Group Name"
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{submitButtonLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
