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
    <div className="flex flex-col bg-slate-50/50 p-2 space-y-2" style={{ height: 'calc(100vh - 20px)' }}>
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
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex-1 overflow-auto relative rounded-xl">
          <UserAccessTabs
            addTeamDialogOpen={open}
            setAddTeamDialogOpen={setOpen}
            onTeamCreated={handleCreateSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default UserAccess;
