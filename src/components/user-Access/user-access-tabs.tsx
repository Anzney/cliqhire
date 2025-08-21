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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Shield, MoreVertical, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTeamMembersDialog } from "./add-team-members-dialog";
import { UserPermissionTab } from "./user-permission-tab";
import { ViewTeamDialog } from "./view-team-dialog";
import { TeamMember } from "@/types/teamMember";
import { getTeamMembers } from "@/services/teamMembersService";
import { getTeams, Team } from "@/services/teamService";

interface UserAccessTabsProps {
  refreshTrigger?: number;
  addTeamDialogOpen?: boolean;
  setAddTeamDialogOpen?: (open: boolean) => void;
  onTeamCreated?: () => void;
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
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [teamToView, setTeamToView] = useState<Team | null>(null);

  // Use external dialog state if provided, otherwise use internal state
  const dialogOpen = addTeamDialogOpen !== undefined ? addTeamDialogOpen : internalDialogOpen;
  const setDialogOpen = setAddTeamDialogOpen || setInternalDialogOpen;

  // Fetch team members and teams when component mounts
  useEffect(() => {
    fetchTeamMembers();
    fetchTeams();
  }, [refreshTrigger]);

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

  const fetchTeams = async () => {
    setLoadingTeams(true);
    try {
      const response = await getTeams();
      setTeams(response.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoadingTeams(false);
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
    // The teamData should already be in the correct format from the API
    setTeams(prev => [...prev, teamData]);
    
    // Call the parent callback if provided
    if (onTeamCreated) {
      onTeamCreated();
    }
  };

  const handleViewTeam = (team: Team) => {
    setTeamToView(team);
    setViewDialogOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTeam = () => {
    if (teamToDelete) {
      setTeams(prev => prev.filter(team => team._id !== teamToDelete._id));
      setDeleteDialogOpen(false);
      setTeamToDelete(null);
    }
  };

  const cancelDeleteTeam = () => {
    setDeleteDialogOpen(false);
    setTeamToDelete(null);
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
      <TableRow key={team._id} className="hover:bg-muted/50">
        <TableCell className="text-sm font-medium">{team.teamName}</TableCell>
        <TableCell className="text-sm">{team.hiringManagerId.name}</TableCell>
        <TableCell className="text-sm">{team.teamLeadId.name}</TableCell>
        <TableCell className="text-sm">{team.recruiterCount}</TableCell>
        <TableCell className="text-sm">
          <Badge 
            variant={team.isActive ? "default" : "secondary"}
            className="text-xs"
          >
            {team.isActive ? "Active" : "Inactive"}
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
              <DropdownMenuItem onClick={() => handleViewTeam(team)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteTeam(team)}
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
              {teamMembers.length}
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
            <UserPermissionTab 
              refreshTrigger={refreshTrigger} 
              teamMembers={teamMembers}
              loading={loadingTeamMembers}
              onRefresh={fetchTeamMembers}
            />
          </div>
        </TabsContent>
      </Tabs>

      <AddTeamMembersDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleAddTeamSuccess}
      />

      <ViewTeamDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        team={teamToView}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the team "{teamToDelete?.teamName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteTeam}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTeam}>
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
