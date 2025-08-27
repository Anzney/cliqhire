"use client";
import React from "react";
import { RecruiterPipeline } from "@/components/Recruiter-Pipeline/recruiter-pipeline";

const ReactruterPipelinePage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
       {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          {/* <div className="flex h-16 items-center px-6">
            <h1 className="text-2xl font-semibold text-gray-900">Recruitment Pipeline</h1>
          </div> */}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <RecruiterPipeline />
        </div>
      </div>
    </div>
  );
};

export default ReactruterPipelinePage;
