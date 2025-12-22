"use client";
import React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Dashboardheader from "@/components/dashboard-header";
import { UserAccessTabs } from "@/components/user-Access/user-access-tabs";

const UserAccess = () => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCreateSuccess = () => {
    // Invalidate teams list to refetch after creating a team
    queryClient.invalidateQueries({ queryKey: ["teams"] });
  };

  return (
    <div className="flex flex-col h-full">
      {/* <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={setFilterOpen}
        initialLoading={initialLoading}
        heading="User Management"
        buttonText=""
        showCreateButton={false}
        showFilterButton={false}
        rightContent={<></>}
      /> */}

      {/* Tabbed Interface */}
      <div className="flex-1">
        <UserAccessTabs
          addTeamDialogOpen={open}
          setAddTeamDialogOpen={setOpen}
          onTeamCreated={handleCreateSuccess}
        />
      </div>
    </div>
  );
};

export default UserAccess;
