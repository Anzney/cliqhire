"use client";
import React from "react";
import { RecruiterPipeline } from "@/components/Recruiter-Pipeline/recruiter-pipeline";

const ReactruterPipelinePage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* Content */}
     
        <div className="p-6">
          <RecruiterPipeline />
        </div>
      
    </div>
  );
};

export default ReactruterPipelinePage;
