"use client";
import React from "react";
import { RecruiterPipeline } from "@/components/Recruiter-Pipeline/recruiter-pipeline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ReactruterPipelinePage = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Content */}
      <div className="p-4 flex-1 h-full overflow-hidden">
        <RecruiterPipeline />
      </div>
    </div>
  );
};

export default ReactruterPipelinePage;
