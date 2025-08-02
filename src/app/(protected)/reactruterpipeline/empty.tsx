"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Group } from "lucide-react";
import { AddGroupDialog } from "@/components/AddGroupDialog";

interface EmptyStateProps {
  onAddGroup: (groupName: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddGroup }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="text-muted-foreground text-lg">No groups have been added yet.</span>
      <Button onClick={() => setOpen(true)}>
        <Group className="mr-2 h-4 w-4" />
        Add Group
      </Button>
      <AddGroupDialog open={open} onOpenChange={setOpen} onAddGroup={onAddGroup} />
    </div>
  );
};
