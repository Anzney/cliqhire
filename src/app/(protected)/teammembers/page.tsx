"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboardheader from "@/components/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import Tableheader from "@/components/table-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Download, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamMemberStatusBadge } from "@/components/teamMembers/team-status-badge";
import { CreateTeamMemberModal } from "@/components/create-teamMembers-modal/create-teamMembers-modal";
import { getTeamMembers, deleteTeamMember } from "@/services/teamMembersService";
import { TeamMember, TeamMemberStatus } from "@/types/recruiter";

const headerArr = [
  "Team Member Name",
  "Team Member Email",
  "Team Member Phone",
  "Team Member Location",
  "Team Member Experience",
  "Team Member Skills",
  "Team Member Resume",
  "Team Member Status",
  "Actions",
];

export default function TeamMembersPage() {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const router = useRouter();

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    setInitialLoading(true);
    try {
      const response = await getTeamMembers();
      setTeamMembers(response.teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      // For now, keep empty array on error
      setTeamMembers([]);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleStatusChange = (teamMemberId: string, newStatus: TeamMemberStatus) => {
    setTeamMembers((prevTeamMembers) =>
      prevTeamMembers.map((teamMember) =>
        teamMember._id === teamMemberId ? { ...teamMember, status: newStatus } : teamMember,
      ),
    );
  };

  const handleViewTeamMember = (teamMemberId: string) => {
    router.push(`/recruiter/${teamMemberId}`);
  };

  const handleEditTeamMember = (teamMemberId: string) => {};

  const handleDeleteTeamMember = async (teamMemberId: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteTeamMember(teamMemberId);
        setTeamMembers((prevTeamMembers) =>
          prevTeamMembers.filter((teamMember) => teamMember._id !== teamMemberId),
        );
      } catch (error) {
        console.error("Error deleting team member:", error);
        alert("Failed to delete team member");
      }
    }
  };

  const handleDownloadResume = (resumeUrl: string, teamMemberName: string) => {
    // Handle resume download
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      alert("No resume available for download");
    }
  };

  const handleCreateSuccess = () => {
    fetchTeamMembers(); // Refresh the list
  };

  return (
    <div className="flex flex-col h-full">
      <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={setFilterOpen}
        initialLoading={initialLoading}
        heading="Team Members"
        buttonText="Add Team Member"
      />

      {/* Table */}
      <div className="flex-1">
        <Table>
          <TableHeader>
            <Tableheader tableHeadArr={headerArr} />
          </TableHeader>
          <TableBody>
            {initialLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
                  <div className="py-24">
                    <div className="text-center">Loading team members...</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : teamMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
                  <div className="py-24">
                    <div className="text-center">No team members found</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              teamMembers.map((teamMember) => (
                <TableRow
                  key={teamMember._id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => router.push(`/recruiter/${teamMember._id}`)}
                >
                  <TableCell className="text-sm font-medium">{teamMember.name}</TableCell>
                  <TableCell className="text-sm">{teamMember.email}</TableCell>
                  <TableCell className="text-sm">{teamMember.phone}</TableCell>
                  <TableCell className="text-sm">{teamMember.location}</TableCell>
                  <TableCell className="text-sm">{teamMember.experience}</TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-wrap gap-1">
                      {teamMember.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {teamMember.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{teamMember.skills.length - 2} more
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
                        handleDownloadResume(teamMember.resume, teamMember.name);
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm">
                    <TeamMemberStatusBadge
                      id={teamMember._id}
                      status={teamMember.status}
                      onStatusChange={handleStatusChange}
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
                        <DropdownMenuItem onClick={() => handleViewTeamMember(teamMember._id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTeamMember(teamMember._id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTeamMember(teamMember._id)}
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
      </div>

      <CreateTeamMemberModal open={open} onOpenChange={setOpen} onSuccess={handleCreateSuccess} />
    </div>
  );
}
