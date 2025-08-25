"use client";
import React, { useState } from "react";
import Dashboardheader from "@/components/dashboard-header";
import { TabList } from "@/components/Recruitment-Pipeline/tabs/tab-list";
import { TabContent } from "@/components/Recruitment-Pipeline/tabs/tab-content";
import { CreatePipelineDialog } from "@/components/Recruiter-Pipeline/create-pipeline-dialog";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, RefreshCcw, MoreVertical } from "lucide-react";

const ReactruterPipelinePage = () => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sourcing");

  const handlePipelineCreated = (jobIds: string[], jobData?: any[]) => {
    console.log("Pipeline created with jobs:", jobIds, jobData);
    // You can add additional logic here to handle the pipeline creation
    // For example, refreshing the data or updating the UI
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-semibold">Recruitment Pipeline</h1>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-4">
        <CreatePipelineDialog
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Pipeline
            </Button>
          }
          onPipelineCreated={handlePipelineCreated}
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
          //   onClick={() => fetchClients(currentPage, pageSize)}
          //   disabled={initialLoading}
          >
            {initialLoading ? (
              <>
                <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
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
