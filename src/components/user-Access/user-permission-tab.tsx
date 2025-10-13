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
import { permissionService, UserPermissions } from "@/services/permissionService";
import { toast } from "sonner";

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

// Function to format team role display - replace underscores with spaces
const formatTeamRoleDisplay = (role: string): string => {
  if (!role) return "Not Assigned";
  return role.replace(/_/g, " ");
};

interface UserPermissionTabProps {
  refreshTrigger?: number;
  teamMembers?: TeamMember[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function UserPermissionTab({ 
  refreshTrigger, 
  teamMembers = [], 
  loading = false,
  onRefresh
}: UserPermissionTabProps) {
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);

  const userPermissionHeaderArr = [
    "Name",
    "Email", 
    "Phone",
    "Role",
    "Action",
  ];

  const handleUserPermission = (user: TeamMember) => {
    setSelectedUser(user);
    setPermissionDialogOpen(true);
  };

  const handlePermissionsUpdated = () => {
    // Trigger refresh in parent component
    if (onRefresh) {
      onRefresh();
    }
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

    return teamMembers.map((user) => (
      <TableRow key={user._id} className="hover:bg-muted/50">
        <TableCell className="text-sm font-medium">{user.name}</TableCell>
        <TableCell className="text-sm">{user.email}</TableCell>
        <TableCell className="text-sm">{user.phone}</TableCell>
                 <TableCell className="text-sm">
           <span 
             className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTeamRoleColorClass(user.teamRole || "")}`}
             style={{ 
               transition: 'none',
               pointerEvents: 'none'
             }}
           >
             {formatTeamRoleDisplay(user.teamRole || "")}
           </span>
         </TableCell>
        <TableCell className="text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleUserPermission(user)}>
                <Shield className="mr-2 h-4 w-4" />
                User Permission
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
        onPermissionsUpdated={handlePermissionsUpdated}
      />
    </div>
  );
}
