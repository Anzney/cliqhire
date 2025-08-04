"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Group } from "lucide-react";
import { AddGroupDialog } from "@/components/AddGroupDialog";
import Image from "next/image";

interface EmptyStateProps {
  onAddGroup: (groupName: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddGroup }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto p-4">
      <div className="w-48 h-48 mb-6">
        <Image
          src="/group-users.png"
          alt="Group Users"
          width={192}
          height={192}
          className="w-full h-full object-contain"
        />
      </div>
      <h2 className="text-xl font-semibold mb-3">You have not created any groups yet</h2>
      <p className="text-gray-500 mb-6">
        Creating groups will allow you to organize your candidates and manage them more effectively.
      </p>
      <Button onClick={() => setOpen(true)}>
        <Group className="mr-2 h-4 w-4" />
        Add Group
      </Button>
      <AddGroupDialog open={open} onOpenChange={setOpen} onAddGroup={onAddGroup} />
    </div>
  );
};
