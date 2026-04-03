import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Candidate } from "@/components/Recruiter-Pipeline/dummy-data";
import { PipelineStageBadge } from "@/components/Recruiter-Pipeline/pipeline-stage-badge";
import { StatusBadge } from "@/components/Recruiter-Pipeline/status-badge";

interface Props {
  candidate: Candidate;
  onStageChange?: (candidate: Candidate, newStage: string) => void;
  onStatusChange?: (candidate: Candidate, newStatus: string) => void;
  canModify?: boolean;
}

export function CandidateHeaderCard({ candidate, onStageChange, onStatusChange, canModify = true }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4">
      <div className="flex items-center space-x-4">
        <div className="relative shrink-0">
          <Avatar className="h-16 w-16 ring-2 ring-blue-50 shadow-sm">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-100 to-blue-200 text-slate-700">
              {candidate.name ? candidate.name.split(' ').map((n: string) => n[0]).join('') : 'NA'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {candidate.name || 'Unknown Candidate'}
            </h2>
            {candidate.isTempCandidate && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                TEMP
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 font-medium truncate">
            {candidate.currentJobTitle || "Professional"}
          </p>
          <div className="flex items-center space-x-3 mt-2">
            <PipelineStageBadge
              stage={candidate.currentStage}
              onStageChange={canModify && onStageChange ? ((newStage: string) => onStageChange(candidate, newStage)) : undefined}
            />
            
            {(() => {
              const stagesWithStatus = [
                "Sourcing",
                "Screening",
                "Client Review",
                "Interview",
                "Verification",
                "Onboarding",
              ];
              if (stagesWithStatus.includes(candidate.currentStage)) {
                return (
                  <StatusBadge
                    status={candidate.status as any}
                    stage={candidate.currentStage}
                    onStatusChange={canModify && onStatusChange ? ((newStatus: string) => onStatusChange(candidate, newStatus)) : undefined}
                  />
                );
              }
              return null;
            })()}

            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 truncate">{candidate.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
