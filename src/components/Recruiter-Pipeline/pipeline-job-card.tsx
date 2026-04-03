"use client";

import { MapPin, Users, Building2, ChevronRight, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Job } from "./dummy-data";
import { Badge } from "@/components/ui/badge";

interface PipelineJobCardProps {
  job: Job;
  isHighlighted?: boolean;
}

export function PipelineJobCard({ job, isHighlighted = false }: PipelineJobCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/reactruterpipeline/${job.id}`)}
      className={`group relative flex flex-col bg-white rounded-xl border border-slate-200/60 p-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 ${
        isHighlighted ? "ring-2 ring-blue-500 bg-blue-50/20" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 gap-4">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Briefcase className="h-5 w-5 opacity-80" />
          </div>
          <div className="flex flex-col justify-center min-w-[200px]">
            <h3 className="text-base font-semibold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors truncate">
              {job.title}
            </h3>
            <div className="flex items-center space-x-1.5 text-slate-500 mt-0.5 text-sm">
              <Building2 className="h-3.5 w-3.5" />
              <span className="font-medium truncate">{job.clientName}</span>
            </div>
          </div>

          <div className="flex ml-auto flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md px-2 py-0.5 text-xs font-medium transition-colors">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[100px]">{job.location}</span>
            </Badge>
            {job.jobType && (
              <Badge variant="outline" className="text-slate-600 border-slate-200 rounded-md px-2 py-0.5 text-xs font-medium bg-white">
                {job.jobType}
              </Badge>
            )}
            {job.jobId?.stage && (
              <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 rounded-md px-2 py-0.5 text-xs font-medium">
                {job.jobId.stage}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-md px-2 py-0.5 text-xs font-medium transition-colors shrink-0">
              <Users className="h-3 w-3 mr-1" />
              {job.totalCandidates || job.candidates?.length || 0}
            </Badge>
          </div>
        </div>
        <div className="flex shrink-0 items-center pl-4">
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white text-slate-400 transition-all duration-300 shadow-sm border border-slate-100 group-hover:border-blue-600">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
