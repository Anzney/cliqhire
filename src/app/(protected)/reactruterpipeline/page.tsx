"use client";
import React, { useState } from "react";
import Dashboardheader from "@/components/dashboard-header";
import { EmptyState } from "./empty";

const ReactruterPipelinePage = () => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false); // Set as needed

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={setFilterOpen}
        initialLoading={initialLoading}
        heading="Reactruter Pipeline"
        buttonText="Create Pipeline"
      />
      <div className="border-b" />
      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center text-center" style={{ maxHeight: "calc(100vh - 30px)" }}>
          <EmptyState />
        </div>
      </div>
    </div>
  );
};

export default ReactruterPipelinePage;
