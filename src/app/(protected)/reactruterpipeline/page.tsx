"use client";
import React from "react";
import { RecruiterPipeline } from "@/components/Recruiter-Pipeline/recruiter-pipeline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ReactruterPipelinePage = () => {
  return (
    <div className="flex flex-col bg-slate-50/50 p-2 space-y-2" style={{ height: 'calc(100vh - 20px)' }}>
      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 flex-1 h-full overflow-hidden">
          <RecruiterPipeline />
        </div>
      </div>
    </div>
  );
};

export default ReactruterPipelinePage;
