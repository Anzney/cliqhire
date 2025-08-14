"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Mail, User } from "lucide-react";
import { TeamMember } from "@/types/teamMember";

interface UserPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: TeamMember | null;
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

export function UserPermissionDialog({ 
  open, 
  onOpenChange, 
  user 
}: UserPermissionDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || "");

  const permissions: Permission[] = [
    {
      id: "clients",
      name: "Clients Page",
      description: "Access to view and manage client information"
    },
    {
      id: "jobs",
      name: "Jobs Page", 
      description: "Access to view and manage job postings"
    },
    {
      id: "candidates",
      name: "Candidates Page",
      description: "Access to view and manage candidate profiles"
    },
    {
      id: "pipeline",
      name: "Recruitment Pipeline Page",
      description: "Access to view and manage recruitment pipeline"
    }
  ];

  const roles = [
    "Hiring Manager",
    "Team Lead", 
    "Recruiters",
    "Head Hunter"
  ];

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    // Here you would typically save the permissions and role to your backend
    console.log("Saving permissions for user:", user?.name, selectedPermissions);
    console.log("Saving role for user:", user?.name, selectedRole);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedPermissions([]);
    setSelectedRole(user?.role || "");
    onOpenChange(false);
  };

  // Update selectedRole when user changes
  React.useEffect(() => {
    setSelectedRole(user?.role || "");
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Permissions: {user.name}
          </DialogTitle>
          <DialogDescription>
            Manage access permissions for this user across different pages and features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="w-full">
                <Label className="text-sm font-medium">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <Label className="text-sm font-medium">Permissions</Label>
            </div>
            
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={permission.id} 
                      className="text-sm font-medium cursor-pointer"
                    >
                      {permission.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
