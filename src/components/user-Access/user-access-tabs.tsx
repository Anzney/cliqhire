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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Users, Shield, MoreVertical, Eye, Trash2, Edit } from "lucide-react";
import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTeamMembersDialog } from "./add-team-members-dialog";
import { UserPermissionTab } from "./user-permission-tab";
import { ViewTeamDialog } from "./view-team-dialog";
import { TeamStatusBadge } from "./team-status-badge";
import { TeamMember } from "@/types/teamMember";
import { getTeamMembers } from "@/services/teamMembersService";
import { getTeams, deleteTeam, updateTeamStatus, Team } from "@/services/teamService";

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
  const [teamId, setTeamId] = useState<string>();
  const [newStatus, setNewStatus] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChange, setPendingChange] = useState<{ teamId: string; status: string } | null>(null);

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
      // Handle error silently or show user feedback
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
      // Handle error silently or show user feedback
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

  const handleStatusChange = (teamId: string, newStatus: string) => {
    setPendingChange({ teamId, status: newStatus });
    setShowConfirmDialog(true);
  };

  const handleConfirmChange = async () => {
    if (!pendingChange) return;

    setTeamId(pendingChange.teamId);
    setNewStatus(pendingChange.status);
    setTeams(prev => prev.map(team => 
      team._id === pendingChange.teamId ? { ...team, teamStatus: pendingChange.status } : team
    ));
    setShowConfirmDialog(false);
  };

  const handleCancelChange = () => {
    setPendingChange(null);
    setShowConfirmDialog(false);
  };

  useEffect(() => {
    const updateTeamStatusHandler = async () => {
      if (!teamId || !newStatus) return;
  
      try {
        setIsLoading(true);
  
        const updatedTeam = await updateTeamStatus(teamId, newStatus);
        
        // Update the teams list with the updated team data
        setTeams(prev => prev.map(team => 
          team._id === teamId ? updatedTeam : team
        ));

      } catch (error) {
        console.error('Failed to update team status:', error);
        // Revert the local state if the API call fails
        setTeams(prev => prev.map(team => 
          team._id === teamId ? { ...team, teamStatus: team.teamStatus } : team
        ));
      } finally {
        setIsLoading(false);
        setTeamId(undefined);
        setNewStatus(undefined);
      }
    };
  
    updateTeamStatusHandler();
  }, [teamId, newStatus]);

  const handleViewTeam = (team: Team) => {
    setTeamToView(team);
    setViewDialogOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTeam = async () => {
    if (teamToDelete) {
      try {
        await deleteTeam(teamToDelete._id);
        setTeams(prev => prev.filter(team => team._id !== teamToDelete._id));
        setDeleteDialogOpen(false);
        setTeamToDelete(null);
      } catch (error) {
        alert('Failed to delete team. Please try again.');
      }
    }
  };

  const cancelDeleteTeam = () => {
    setDeleteDialogOpen(false);
    setTeamToDelete(null);
  };

  const renderTeamsTable = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

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
          <TeamStatusBadge 
            status={team.teamStatus || "Inactive"} 
            onStatusChange={(newStatus) => handleStatusChange(team._id, newStatus)}
          />
        </TableCell>
        <TableCell className="text-sm">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 border border-gray-200">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                side="bottom" 
                className="z-[9999] min-w-[120px] bg-white border border-gray-200 shadow-lg"
                style={{ position: 'absolute', zIndex: 9999 }}
              >
                <DropdownMenuItem onClick={() => handleViewTeam(team)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewTeam(team)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
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
          </div>
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
          <div className="flex-1 relative overflow-visible">
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

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the team status? This action will be saved immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelChange}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the team &quot;{teamToDelete?.teamName}&quot;? This action cannot be undone.
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
