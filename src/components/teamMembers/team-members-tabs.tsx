"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Trash2, Users, UserCheck, UserCog, Crown, Eye } from "lucide-react";
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
import ViewEditTeamMemberDialog from "@/components/teamMembers/ViewEditTeamMemberDialog";
import { DeleteTeamMemberDialog } from "@/components/teamMembers/delete-team-member-dialog";
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
  "Status",
  "Actions",
];

// Team role color mapping
const getTeamRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
  const normalizedRole = role?.toLowerCase() || "";
  
  switch (normalizedRole) {
    case "admin":
    case "administrator":
      return "destructive"; // Red
    case "hiring manager":
    case "hiring_manager":
    case "hir":
      return "default"; // Blue
    case "team lead":
    case "team_lead":
    case "lead":
      return "secondary"; // Gray
    case "recruiter":
    case "recruiters":
    case "rec":
      return "outline"; // Border only
    case "head hunter":
    case "head_hunter":
    case "head enter":
    case "headenter":
      return "destructive"; // Red
    default:
      return "outline"; // Default for unknown roles
  }
};

// Team role color classes for custom styling - matching status badge style
const getTeamRoleColorClass = (role: string): string => {
  const normalizedRole = role?.toLowerCase() || "";
  
  switch (normalizedRole) {
    case "admin":
    case "administrator":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "hiring manager":
    case "hiring_manager":
    case "hir":
      return "bg-sky-100 text-sky-800 border-sky-200";
    case "team lead":
    case "team_lead":
    case "lead":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "recruiter":
    case "recruiters":
    case "rec":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "head hunter":
    case "head_hunter":
    case "head enter":
    case "headenter":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export function TeamMembersTabs({ onTeamMemberClick, refreshTrigger }: TeamMembersTabsProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamMemberToDelete, setTeamMemberToDelete] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [teamMemberToView, setTeamMemberToView] = useState<TeamMember | null>(null);

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
    const member = teamMembers.find((tm) => tm._id === teamMemberId) || null;
    setTeamMemberToView(member);
    setViewDialogOpen(true);
  };

  const handleRegisterUser = (teamMember: TeamMember) => {
    setSelectedTeamMember(teamMember);
    setRegisterDialogOpen(true);
  };

  const handleCloseRegisterDialog = () => {
    setRegisterDialogOpen(false);
    setSelectedTeamMember(null);
  };

  const handleDeleteTeamMember = (teamMember: TeamMember) => {
    setTeamMemberToDelete(teamMember);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTeamMember = async () => {
    console.log('confirmDeleteTeamMember called');
    if (!teamMemberToDelete) {
      console.log('No team member to delete');
      return;
    }
    
    console.log('Deleting team member:', teamMemberToDelete.name, teamMemberToDelete._id);
    setIsDeleting(true);
    try {
      await deleteTeamMember(teamMemberToDelete._id);
      console.log('Team member deleted successfully');
      setTeamMembers((prevTeamMembers) =>
        prevTeamMembers.filter((teamMember) => teamMember._id !== teamMemberToDelete._id),
      );
      setDeleteDialogOpen(false);
      setTeamMemberToDelete(null);
    } catch (error) {
      console.error("Error deleting team member:", error);
      // You might want to show a toast notification here instead of alert
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteTeamMember = () => {
    setDeleteDialogOpen(false);
    setTeamMemberToDelete(null);
  };

  

  // Get counts for each role
  const getCountByRole = (role: string) => {
    return teamMembers.filter(member => 
      member.teamRole === role || 
      member.role === role
    ).length;
  };

  // Filter team members based on active tab
  const getFilteredTeamMembers = () => {
    switch (activeTab) {
      case "all":
        return teamMembers;
      case "hiring-manager":
        return teamMembers.filter(member => 
          member.teamRole === "HIRING_MANAGER" || 
          member.teamRole === "Hiring Manager" ||
          member.role === "Hiring Manager"
        );
      case "team-lead":
        return teamMembers.filter(member => 
          member.teamRole === "TEAM_LEAD" || 
          member.teamRole === "Team Lead" ||
          member.role === "Team Lead"
        );
      case "recruiters":
        return teamMembers.filter(member => 
          member.teamRole === "RECRUITER" || 
          member.teamRole === "Recruiters" ||
          member.role === "Recruiters"
        );
      case "head-enter":
        return teamMembers.filter(member => 
          member.teamRole === "HEAD_HUNTER" || 
          member.teamRole === "Head Enter" ||
          member.role === "HEAD_HUNTER"
        );
      default:
        return teamMembers;
    }
  };

  const filteredTeamMembers = getFilteredTeamMembers();

  const renderTeamMembersTable = (members: TeamMember[]) => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={headerArr.length} className="h-[calc(100vh-240px)] text-center">
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
          <TableCell colSpan={headerArr.length} className="h-[calc(100vh-240px)] text-center">
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
        className="hover:bg-muted/50 cursor-default"
      >
        <TableCell className="text-sm font-medium">{teamMember.name}</TableCell>
        <TableCell className="text-sm">{teamMember.email}</TableCell>
        <TableCell className="text-sm">{teamMember.phone}</TableCell>
        <TableCell className="text-sm">{teamMember.location}</TableCell>
        <TableCell className="text-sm">{teamMember.experience}</TableCell>
                 <TableCell className="text-sm">
           <span 
             className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTeamRoleColorClass(teamMember.teamRole || "")}`}
             style={{ 
               transition: 'none',
               pointerEvents: 'none'
             }}
           >
             {teamMember.teamRole || "Not Assigned"}
           </span>
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
                 handleViewTeamMember(teamMember._id);
               }}>
                 <Eye className="mr-2 h-4 w-4" />
                 View
               </DropdownMenuItem>
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
                   handleDeleteTeamMember(teamMember);
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
            value="all"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Users className="h-4 w-4" />
            All
            <Badge variant="secondary" className="ml-1 text-xs">
              {teamMembers.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="hiring-manager"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <UserCheck className="h-4 w-4" />
            Hiring Manager
            <Badge variant="secondary" className="ml-1 text-xs">
              {getCountByRole("HIRING_MANAGER")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="team-lead"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <UserCog className="h-4 w-4" />
            Team Lead
            <Badge variant="secondary" className="ml-1 text-xs">
              {getCountByRole("TEAM_LEAD")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="recruiters"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Users className="h-4 w-4" />
            Recruiters
            <Badge variant="secondary" className="ml-1 text-xs">
              {getCountByRole("RECRUITER")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="head-enter"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Crown className="h-4 w-4" />
            Head Hunter
            <Badge variant="secondary" className="ml-1 text-xs">
              {getCountByRole("HEAD_HUNTER")}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="p-0 mt-0">
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

        <DeleteTeamMemberDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          teamMemberName={teamMemberToDelete?.name || ""}
          onConfirm={confirmDeleteTeamMember}
          isLoading={isDeleting}
        />
        <ViewEditTeamMemberDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          teamMember={teamMemberToView}
          onUpdated={(updated) => {
            setTeamMembers(prev => prev.map(tm => tm._id === updated._id ? updated : tm));
          }}
        />
     </div>
   );
 }
