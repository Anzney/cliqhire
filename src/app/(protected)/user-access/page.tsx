"use client";
import React from "react";
import { useState } from "react";
import Dashboardheader from "@/components/dashboard-header";
import { UserAccessTabs } from "@/components/user-Access/user-access-tabs";

const UserAccess = () => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  return (
    <div className="flex flex-col h-full">
      <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={setFilterOpen}
        initialLoading={initialLoading}
        heading="User Management"
        buttonText="Add Team Member"
      />

      {/* Tabbed Interface */}
      <div className="flex-1">
        <UserAccessTabs 
          refreshTrigger={refreshTrigger} 
          addTeamDialogOpen={open}
          setAddTeamDialogOpen={setOpen}
          onTeamCreated={handleCreateSuccess}
        />
      </div>
    </div>
  );
};

export default UserAccess;
