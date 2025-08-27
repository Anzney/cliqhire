"use client";
import React from "react";
import { RecruiterPipeline } from "@/components/Recruiter-Pipeline/recruiter-pipeline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ReactruterPipelinePage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
       {/* Content */}
        <div className="p-4">
          <RecruiterPipeline />
        </div>
    
    </div>
  );
};

export default ReactruterPipelinePage;
