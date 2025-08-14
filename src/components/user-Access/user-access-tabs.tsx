"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Users, Shield, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTeamMembersDialog } from "./add-team-members-dialog";
import { TeamMember } from "@/types/teamMember";
import { getTeamMembers } from "@/services/teamMembersService";

interface UserAccessTabsProps {
  refreshTrigger?: number;
  addTeamDialogOpen?: boolean;
  setAddTeamDialogOpen?: (open: boolean) => void;
  onTeamCreated?: () => void;
}

interface Team {
  id: string;
  teamName: string;
  hiringManager: string;
  teamLead: string;
  recruiters: string[];
  teamStatus: string;
  createdAt: string;
}

export function UserAccessTabs({ 
  refreshTrigger, 
  addTeamDialogOpen, 
  setAddTeamDialogOpen, 
  onTeamCreated 
}: UserAccessTabsProps) {
  const [activeTab, setActiveTab] = useState("teams");
  const [internalDialogOpen, setInternalDialogOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);

  // Use external dialog state if provided, otherwise use internal state
  const dialogOpen = addTeamDialogOpen !== undefined ? addTeamDialogOpen : internalDialogOpen;
  const setDialogOpen = setAddTeamDialogOpen || setInternalDialogOpen;

  // Fetch team members when component mounts
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoadingTeamMembers(true);
    try {
      const response = await getTeamMembers();
      setTeamMembers(response.teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoadingTeamMembers(false);
    }
  };

  const teamsHeaderArr = [
    "Team Name",
    "Hiring Manager",
    "Team Lead",
    "No. of Recruiters",
    "Team Status",
    "Action",
  ];

  const getTeamMemberById = (id: string) => {
    return teamMembers.find(member => member._id === id);
  };

  const getTeamMemberName = (id: string) => {
    const member = getTeamMemberById(id);
    return member ? member.name : "Unknown";
  };

  const handleAddTeamSuccess = (teamData: any) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      teamName: teamData.teamName,
      hiringManager: teamData.hiringManager,
      teamLead: teamData.teamLead,
      recruiters: teamData.recruiters,
      teamStatus: teamData.teamStatus,
      createdAt: new Date().toISOString(),
    };
    
    setTeams(prev => [...prev, newTeam]);
    
    // Call the parent callback if provided
    if (onTeamCreated) {
      onTeamCreated();
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      setTeams(prev => prev.filter(team => team.id !== teamId));
    }
  };

  const renderTeamsTable = () => {
    if (teams.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[calc(100vh-320px)] text-center">
            <div className="py-24">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="p-4">
                    <Button 
                      className="mb-4"
                      onClick={() => setDialogOpen(true)}
                    >
                      Add Team Members
                    </Button>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Teams Management</h3>
                <p className="text-gray-500">Manage team structures and assignments here.</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return teams.map((team) => (
      <TableRow key={team.id} className="hover:bg-muted/50">
        <TableCell className="text-sm font-medium">{team.teamName}</TableCell>
        <TableCell className="text-sm">{getTeamMemberName(team.hiringManager)}</TableCell>
        <TableCell className="text-sm">{getTeamMemberName(team.teamLead)}</TableCell>
        <TableCell className="text-sm">{team.recruiters.length}</TableCell>
        <TableCell className="text-sm">
          <Badge 
            variant={team.teamStatus === "Active" ? "default" : team.teamStatus === "Working" ? "secondary" : "outline"}
            className="text-xs"
          >
            {team.teamStatus}
          </Badge>
        </TableCell>
        <TableCell className="text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteTeam(team.id)}
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
            value="teams"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Users className="h-4 w-4" />
            Teams
            <Badge variant="secondary" className="ml-1 text-xs">
              {teams.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="user-permission"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Shield className="h-4 w-4" />
            User Permission
            <Badge variant="secondary" className="ml-1 text-xs">
              12
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="p-0 mt-0">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  {teamsHeaderArr.map((header, index) => (
                    <TableHead key={index} className="text-sm font-medium">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTeamsTable()}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="user-permission" className="p-0 mt-0">
          <div className="flex-1">
            <div className="h-[calc(100vh-240px)] flex items-center justify-center">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">User Permissions</h3>
                <p className="text-gray-500">Configure user access levels and permissions here.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AddTeamMembersDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleAddTeamSuccess}
      />
    </div>
  );
}
