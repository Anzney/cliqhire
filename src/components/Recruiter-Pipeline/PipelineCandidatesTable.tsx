"use client";
import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Briefcase, EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { PipelineStageBadge } from "./pipeline-stage-badge";
import { StatusBadge } from "./status-badge";
import { type Candidate, type Job } from "./dummy-data";

type Props = {
  job: Job;
  candidates: Candidate[];
  onStageChange: (candidate: Candidate, newStage: string) => void;
  onStatusChange: (candidate: Candidate, newStatus: string) => void;
  onViewCandidate: (candidate: Candidate) => void;
  onViewResume: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
};

export function PipelineCandidatesTable({
  job,
  candidates,
  onStageChange,
  onStatusChange,
  onViewCandidate,
  onViewResume,
  onDeleteCandidate,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[44px]"></TableHead>
          <TableHead>Candidate</TableHead>
          <TableHead>Current Position</TableHead>
          <TableHead className="w-[200px]">Stage</TableHead>
          <TableHead className="w-[120px]">Status</TableHead>
          <TableHead className="w-[140px]">Hiring Manager</TableHead>
          <TableHead className="w-[120px]">Recruiter</TableHead>
          <TableHead className="w-[90px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.map((candidate) => (
          <TableRow key={candidate.id} className="hover:bg-muted/50">
            <TableCell>
              <Avatar className="h-8 w-8">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback className="text-xs bg-gray-200">
                  {candidate.name ? candidate.name.split(" ").map((n) => n[0]).join("") : "NA"}
                </AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="font-medium truncate max-w-[220px]">
              {candidate.name || "Unknown Candidate"}
            </TableCell>
            <TableCell className="truncate max-w-[260px] text-gray-700">
              {candidate.currentJobTitle || "Position not specified"}
            </TableCell>
            <TableCell>
              <PipelineStageBadge
                stage={candidate.currentStage}
                onStageChange={(newStage) => onStageChange(candidate, newStage)}
              />
            </TableCell>
            <TableCell>
              {(() => {
                const stagesWithStatus = [
                  "Sourcing",
                  "Screening",
                  "Client Review",
                  "Interview",
                  "Verification",
                ];
                if (stagesWithStatus.includes(candidate.currentStage)) {
                  return (
                    <StatusBadge
                      status={(candidate.status as any) || null}
                      stage={candidate.currentStage}
                      onStatusChange={(newStatus) => onStatusChange(candidate, newStatus as any)}
                    />
                  );
                } else {
                  return <span className="text-sm text-gray-500">N/A</span>;
                }
              })()}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {(job as any).jobId?.jobTeamInfo?.hiringManager?.name || "Not assigned"}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {(job as any).jobId?.jobTeamInfo?.recruiter?.name || "Not assigned"}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    title="More options"
                  >
                    <EllipsisVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-50">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewCandidate(candidate);
                    }}
                    className="cursor-pointer"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View & Edit Details
                  </DropdownMenuItem>
                  {candidate.resume && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewResume(candidate);
                      }}
                      className="cursor-pointer"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      View Resume
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCandidate(candidate);
                    }}
                    className="cursor-pointer"
                  >
                    <Trash2 className="size-4 mr-2 text-red-500" />
                    Delete Candidate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}



