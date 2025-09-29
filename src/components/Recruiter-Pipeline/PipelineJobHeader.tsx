"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, HandCoins, MapPin, Plus, Users } from "lucide-react";
import { type Job } from "./dummy-data";

type Props = {
  job: Job;
  onAddCandidate: () => void;
};

export function PipelineJobHeader({ job, onAddCandidate }: Props) {
  return (
    <div className="bg-white  border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{job.clientName}</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <HandCoins className="h-4 w-4 text-yellow-500" />
                <span>{job.salaryRange}</span>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                {job.jobType}
              </Badge>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-purple-500" />
                <span>{job.totalCandidates || job.candidates.length} candidates</span>
              </div>
              {job.jobId?.stage && (
                <Badge
                  variant="outline"
                  className="bg-gray-100 text-gray-700 border-gray-200"
                >
                  {job.jobId.stage}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button onClick={onAddCandidate} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Attach Candidate
          </Button>
        </div>
      </div>
    </div>
  );
}



