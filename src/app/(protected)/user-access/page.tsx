"use client";
import React from "react";
import { useState } from "react";
import Dashboardheader from "@/components/dashboard-header";

const UserAccess = () => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={setFilterOpen}
        initialLoading={initialLoading}
        heading="User Management"
        buttonText="Add Team Member"
      />

      <div className="flex-1">
        <p>Manage user access and permissions here.</p>
      </div>
    </div>
  );
};

export default UserAccess;
