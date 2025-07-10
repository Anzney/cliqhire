"use client";
import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Download, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecruiterStatusBadge } from "./recruiter-status-badge";
import { Recruiter, RecruiterStatus } from "@/types/recruiter";
import Tableheader from "@/components/table-header";

interface RecruitersTableProps {
  recruiters: Recruiter[];
  loading: boolean;
  onStatusChange: (recruiterId: string, status: RecruiterStatus) => void;
  onViewRecruiter: (recruiterId: string) => void;
  onEditRecruiter: (recruiterId: string) => void;
  onDeleteRecruiter: (recruiterId: string) => void;
  onDownloadResume: (resumeUrl: string, recruiterName: string) => void;
}

const headerArr = [
  "Recruiter Name",
  "Recruiter Email",
  "Recruiter Phone", 
  "Recruiter Location",
  "Recruiter Experience",
  "Recruiter Skills",
  "Recruiter Resume",
  "Recruiter Status",
  "Actions"
];

export function RecruitersTable({
  recruiters,
  loading,
  onStatusChange,
  onViewRecruiter,
  onEditRecruiter,
  onDeleteRecruiter,
  onDownloadResume
}: RecruitersTableProps) {
  return (
    <Table>
      <TableHeader>
        <Tableheader tableHeadArr={headerArr} />
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
              <div className="py-24">
                <div className="text-center">Loading recruiters...</div>
              </div>
            </TableCell>
          </TableRow>
        ) : recruiters.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
              <div className="py-24">
                <div className="text-center">No recruiters found</div>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          recruiters.map((recruiter) => (
            <TableRow
              key={recruiter._id}
              className="hover:bg-muted/50 cursor-pointer"
            >
              <TableCell className="text-sm font-medium">{recruiter.name}</TableCell>
              <TableCell className="text-sm">{recruiter.email}</TableCell>
              <TableCell className="text-sm">{recruiter.phone}</TableCell>
              <TableCell className="text-sm">{recruiter.location}</TableCell>
              <TableCell className="text-sm">{recruiter.experience}</TableCell>
              <TableCell className="text-sm">
                <div className="flex flex-wrap gap-1">
                  {recruiter.skills.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {recruiter.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{recruiter.skills.length - 2} more
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadResume(recruiter.resume, recruiter.name);
                  }}
                  className="h-6 px-2 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </TableCell>
              <TableCell className="text-sm">
                <RecruiterStatusBadge
                  id={recruiter._id}
                  status={recruiter.status}
                  onStatusChange={onStatusChange}
                />
              </TableCell>
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onViewRecruiter(recruiter._id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditRecruiter(recruiter._id)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteRecruiter(recruiter._id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
} 