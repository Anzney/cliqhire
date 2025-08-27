"use client";
import React from "react";
import { RecruiterPipeline } from "@/components/Recruiter-Pipeline/recruiter-pipeline";

const ReactruterPipelinePage = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-semibold">Recruitment Pipeline</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <RecruiterPipeline />
      </div>
    </div>
  );
};

export default ReactruterPipelinePage;
