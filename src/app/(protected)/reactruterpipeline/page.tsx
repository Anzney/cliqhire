"use client";
import React, { useState } from "react";
import Dashboardheader from "@/components/dashboard-header";
import { TabList } from "@/components/Recruitment-Pipeline/tabs/tab-list";
import { TabContent } from "@/components/Recruitment-Pipeline/tabs/tab-content";

const ReactruterPipelinePage = () => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sourcing");

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
      <div className="flex-1 flex flex-col min-h-0 ">
        <TabList value={activeTab} onValueChange={setActiveTab}>
          <TabContent value={activeTab} />
        </TabList>
      </div>
    </div>
  );
};

export default ReactruterPipelinePage;
