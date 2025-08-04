"use client";
import React, { useState } from "react";
import Dashboardheader from "@/components/dashboard-header";
import { toast } from "sonner";
import { EmptyState } from "./empty";
import { GroupCards } from "@/components/Reactruter-Pipeline/GroupCards";
import type { Group } from "@/components/Reactruter-Pipeline/GroupCards";

const ReactruterPipelinePage = () => {

  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false); // Set as needed
  // Example group state, replace with your data logic
  const [groups, setGroups] = useState<Group[]>([]);

  // Handler for adding a group
  const handleAddGroup = (groupName: string) => {
    setGroups(prev => ([...prev, { id: Date.now().toString(), name: groupName }]));
    toast.success("Group added successfully");
  };

  // Handler for deleting a group
  const handleDeleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    toast.success("Group deleted successfully");
  };

  // Handler for editing a group
  const handleEditGroup = (groupId: string, newName: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, name: newName } : g));
    toast.success("Group name updated successfully");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={setFilterOpen}
        initialLoading={initialLoading}
        heading="Recruitment Pipeline"
        buttonText="Create Pipeline"
      />
      <div className="border-b" />
      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center text-center" style={{ maxHeight: "calc(100vh - 30px)" }}>
          {groups.length > 0 ? (
            <GroupCards
              groups={groups}
              onAddGroup={handleAddGroup}
              onDeleteGroup={handleDeleteGroup}
              onEditGroup={handleEditGroup}
            />
          ) : (
            <EmptyState onAddGroup={handleAddGroup} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactruterPipelinePage;
