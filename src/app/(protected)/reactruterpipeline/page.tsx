"use client";
import React from "react";
import { RecruiterPipeline } from "@/components/Recruiter-Pipeline/recruiter-pipeline";

const ReactruterPipelinePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="flex-1 w-full mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recruitment Pipeline</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Manage and track your active job pipelines</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-2 h-[calc(100vh-160px)]">
          <RecruiterPipeline />
        </div>
      </div>
    </div>
  );
};

export default ReactruterPipelinePage;
