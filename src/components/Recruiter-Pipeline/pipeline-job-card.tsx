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
      className={`group relative flex flex-col bg-white rounded-2xl border border-slate-200/60 p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 ${
        isHighlighted ? "ring-2 ring-blue-500 bg-blue-50/20" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <Briefcase className="h-6 w-6 opacity-80" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center space-x-2 text-slate-500 mt-1">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">{job.clientName}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg px-3 py-1 font-medium transition-colors">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              {job.location}
            </Badge>
            {job.jobType && (
              <Badge variant="outline" className="text-slate-600 border-slate-200 rounded-lg px-3 py-1 font-medium bg-white">
                {job.jobType}
              </Badge>
            )}
            {job.jobId?.stage && (
              <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 rounded-lg px-3 py-1 font-medium">
                {job.jobId.stage}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg px-3 py-1 font-medium transition-colors">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              {job.totalCandidates || job.candidates?.length || 0} Candidates
            </Badge>
          </div>
        </div>
        <div className="flex h-full items-center pl-4 pt-4">
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white text-slate-400 transition-all duration-300 shadow-sm border border-slate-100 group-hover:border-blue-600">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
