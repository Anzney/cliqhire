"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Download, Eye, Edit, Trash2, Users, UserCheck, UserCog, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { TeamMemberStatusBadge } from "@/components/teamMembers/team-status-badge";
import { RegisterUserDialog } from "@/components/teamMembers/register-user-dialog";
import { getTeamMembers, deleteTeamMember } from "@/services/teamMembersService";
import { TeamMember, TeamMemberStatus } from "@/types/teamMember";

interface TeamMembersTabsProps {
  onTeamMemberClick?: (teamMemberId: string) => void;
  refreshTrigger?: number; // Add this to trigger refresh from parent
}

const headerArr = [
  "Name",
  "Email",
  "Phone",
  "Location",
  "Experience",
  "Team Role",
  "Resume",
  "Status",
  "Actions",
];

export function TeamMembersTabs({ onTeamMemberClick, refreshTrigger }: TeamMembersTabsProps) {
  const [activeTab, setActiveTab] = useState("hiring-manager");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const router = useRouter();

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await getTeamMembers();
      setTeamMembers(response.teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [refreshTrigger]);

  const handleStatusChange = (teamMemberId: string, newStatus: TeamMemberStatus) => {
    setTeamMembers((prevTeamMembers) =>
      prevTeamMembers.map((teamMember) =>
        teamMember._id === teamMemberId ? { ...teamMember, status: newStatus } : teamMember,
      ),
    );
  };

  const handleViewTeamMember = (teamMemberId: string) => {
    if (onTeamMemberClick) {
      onTeamMemberClick(teamMemberId);
    } else {
      router.push(`/teammembers/${teamMemberId}`);
    }
  };

  const handleRegisterUser = (teamMember: TeamMember) => {
    setSelectedTeamMember(teamMember);
    setRegisterDialogOpen(true);
  };

  const handleCloseRegisterDialog = () => {
    setRegisterDialogOpen(false);
    setSelectedTeamMember(null);
  };

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
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      alert("No resume available for download");
    }
  };

  // Get counts for each role
  const getCountByRole = (role: string) => {
    return teamMembers.filter(member => member.role === role).length;
  };

  // Filter team members based on active tab
  const getFilteredTeamMembers = () => {
    switch (activeTab) {
      case "hiring-manager":
        return teamMembers.filter(member => member.role === "Hiring Manager");
      case "team-lead":
        return teamMembers.filter(member => member.role === "Team Lead");
      case "recruiters":
        return teamMembers.filter(member => member.role === "Recruiters");
      case "head-enter":
        return teamMembers.filter(member => member.role === "Head Enter");
      default:
        return teamMembers;
    }
  };

  const filteredTeamMembers = getFilteredTeamMembers();

  const renderTeamMembersTable = (members: TeamMember[]) => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
            <div className="py-24">
              <div className="text-center">Loading team members...</div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (members.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
            <div className="py-24">
              <div className="text-center">No team members found in this category</div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return members.map((teamMember) => (
      <TableRow
        key={teamMember._id}
        className="hover:bg-muted/50 cursor-pointer"
        onClick={() => handleViewTeamMember(teamMember._id)}
      >
        <TableCell className="text-sm font-medium">{teamMember.name}</TableCell>
        <TableCell className="text-sm">{teamMember.email}</TableCell>
        <TableCell className="text-sm">{teamMember.phone}</TableCell>
        <TableCell className="text-sm">{teamMember.location}</TableCell>
        <TableCell className="text-sm">{teamMember.experience}</TableCell>
                 <TableCell className="text-sm">
           <Badge variant="outline" className="text-xs">
             {teamMember.role || "Not Assigned"}
           </Badge>
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
             <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
               <DropdownMenuItem onClick={(e) => {
                 e.stopPropagation();
                 handleRegisterUser(teamMember);
               }}>
                 <UserCheck className="mr-2 h-4 w-4" />
                 Register User
               </DropdownMenuItem>
               <DropdownMenuItem
                 onClick={(e) => {
                   e.stopPropagation();
                   handleDeleteTeamMember(teamMember._id);
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
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex border-b w-full rounded-none justify-start h-12 bg-transparent p-0">
          <TabsTrigger
            value="hiring-manager"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <UserCheck className="h-4 w-4" />
            Hiring Manager
            <Badge variant="secondary" className="ml-1 text-xs">
              {getCountByRole("Hiring Manager")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="team-lead"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <UserCog className="h-4 w-4" />
            Team Lead
            <Badge variant="secondary" className="ml-1 text-xs">
              {getCountByRole("Team Lead")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="recruiters"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Users className="h-4 w-4" />
            Recruiters
            <Badge variant="secondary" className="ml-1 text-xs">
              {getCountByRole("Recruiters")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="head-enter"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Crown className="h-4 w-4" />
            Head Enter
            <Badge variant="secondary" className="ml-1 text-xs">
              {getCountByRole("Head Enter")}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hiring-manager" className="p-0 mt-0">
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
                {renderTeamMembersTable(filteredTeamMembers)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="team-lead" className="p-0 mt-0">
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
                {renderTeamMembersTable(filteredTeamMembers)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="recruiters" className="p-0 mt-0">
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
                {renderTeamMembersTable(filteredTeamMembers)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="head-enter" className="p-0 mt-0">
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
                {renderTeamMembersTable(filteredTeamMembers)}
              </TableBody>
            </Table>
          </div>
                 </TabsContent>
       </Tabs>
       
               {selectedTeamMember && (
          <RegisterUserDialog
            isOpen={registerDialogOpen}
            onClose={handleCloseRegisterDialog}
            teamMemberId={selectedTeamMember._id}
            teamMemberName={selectedTeamMember.name}
            teamMemberEmail={selectedTeamMember.email}
          />
        )}
     </div>
   );
 }
