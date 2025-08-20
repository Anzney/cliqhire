"use client";
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, CheckCircle, Users, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCandidatesByStage, RecruitmentCandidate } from "@/components/dummy/recruitment-pipeline-data";
import { ViewCandidateDialog } from "@/components/Recruitment-Pipeline/view-candidate-dialog";

interface TabContentProps {
  value: string;
}

const headerArr = [
  "Candidate Name",
  "Job Position", 
  "Client Name",
  "Hiring Manager",
  "Action",
];

export const TabContent: React.FC<TabContentProps> = ({ value }) => {
  const candidates = getCandidatesByStage(value);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<RecruitmentCandidate | null>(null);

  const handleViewCandidate = (candidate: RecruitmentCandidate) => {
    setSelectedCandidate(candidate);
    setViewDialogOpen(true);
  };

  const renderCandidatesTable = (candidates: RecruitmentCandidate[]) => {
    if (candidates.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={headerArr.length} className="h-[calc(100vh-240px)] text-center">
            <div className="py-24">
              <div className="text-center">No candidates found in this stage</div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return candidates.map((candidate) => (
      <TableRow
        key={candidate.id}
        className="hover:bg-muted/50 cursor-default"
      >
        <TableCell className="text-sm font-medium">{candidate.candidateName}</TableCell>
        <TableCell className="text-sm">{candidate.jobPosition}</TableCell>
        <TableCell className="text-sm">{candidate.clientName}</TableCell>
        <TableCell className="text-sm">{candidate.hiringManager}</TableCell>
        <TableCell className="text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleViewCandidate(candidate);
              }}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                console.log("Move to next round:", candidate.candidateName);
              }}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Move To Next Round
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                console.log("Assign new recruiter:", candidate.candidateName);
              }}>
                <Users className="mr-2 h-4 w-4" />
                Assign New Recruiter
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Delete candidate:", candidate.candidateName);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <TabsContent value={value} className="p-0 mt-0">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                {headerArr.map((header, index) => (
                  <TableHead key={index} className="text-sm font-medium">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderCandidatesTable(candidates)}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <ViewCandidateDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        candidate={selectedCandidate}
      />
    </>
  );
};
