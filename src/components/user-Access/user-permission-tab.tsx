"use client";

import React, { useState, useEffect } from "react";
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
import { MoreVertical, Shield, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPermissionDialog } from "./user-permission-dialog";
import { TeamMember } from "@/types/teamMember";
import { getTeamMembers } from "@/services/teamMembersService";

interface UserPermissionTabProps {
  refreshTrigger?: number;
}

export function UserPermissionTab({ refreshTrigger }: UserPermissionTabProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);

  const userPermissionHeaderArr = [
    "Name",
    "Email", 
    "Phone",
    "Role",
    "Action",
  ];

  // Fetch team members when component mounts
  useEffect(() => {
    fetchTeamMembers();
  }, [refreshTrigger]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await getTeamMembers();
      setTeamMembers(response.teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPermission = (user: TeamMember) => {
    setSelectedUser(user);
    setPermissionDialogOpen(true);
  };

  const renderUserPermissionTable = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-[calc(100vh-240px)] text-center">
            <div className="py-24">
              <div className="text-center">Loading user permissions...</div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (teamMembers.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-[calc(100vh-240px)] text-center">
            <div className="py-24">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">User Permissions</h3>
                <p className="text-gray-500">No user permissions found.</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return teamMembers.map((member) => (
      <TableRow key={member._id} className="hover:bg-muted/50">
        <TableCell className="text-sm font-medium">{member.name}</TableCell>
        <TableCell className="text-sm">{member.email}</TableCell>
        <TableCell className="text-sm">{member.phone}</TableCell>
        <TableCell className="text-sm">
          <Badge variant="outline" className="text-xs">
            {member.role || "Not Assigned"}
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
              <DropdownMenuItem onClick={() => handleUserPermission(member)}>
                <Shield className="mr-2 h-4 w-4" />
                User Permission
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
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
    <div className="flex-1">
      <Table>
        <TableHeader>
          <TableRow>
            {userPermissionHeaderArr.map((header, index) => (
              <TableHead key={index} className="text-sm font-medium">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderUserPermissionTable()}
        </TableBody>
      </Table>
      
      <UserPermissionDialog
        open={permissionDialogOpen}
        onOpenChange={setPermissionDialogOpen}
        user={selectedUser}
      />
    </div>
  );
}
