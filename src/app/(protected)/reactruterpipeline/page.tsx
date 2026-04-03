"use client";
import React from "react";
import { RecruiterPipeline } from "@/components/Recruiter-Pipeline/recruiter-pipeline";

const ReactruterPipelinePage = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC]">
      <div className="flex-1 w-full mx-auto p-2 space-y-2 h-full overflow-hidden">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-2 h-full flex flex-col">
          <RecruiterPipeline />
        </div>
      </div>
    </div>
  );
};

export default ReactruterPipelinePage;
