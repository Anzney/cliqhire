"use client";

import React, { useState, useEffect } from "react";
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
import { permissionService, PermissionsInfo, UserPermissions } from "@/services/permissionService";
import { toast } from "sonner";

interface UserPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: TeamMember | null;
  onPermissionsUpdated?: () => void;
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

export function UserPermissionDialog({ 
  open, 
  onOpenChange, 
  user,
  onPermissionsUpdated
}: UserPermissionDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(user?.teamRole || "");
  const [permissionsInfo, setPermissionsInfo] = useState<PermissionsInfo | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch permissions info and user permissions when dialog opens
  useEffect(() => {
    if (open && user) {
      fetchPermissionsInfo();
      fetchUserPermissions();
    }
  }, [open, user]);

  // Update selectedRole when user changes
  useEffect(() => {
    setSelectedRole(user?.teamRole || "");
  }, [user]);

  const fetchPermissionsInfo = async () => {
    try {
      setLoading(true);
      const response = await permissionService.getPermissionsInfo();
      setPermissionsInfo(response.data);
    } catch (error) {
      console.error('Error fetching permissions info:', error);
      // Set fallback permissions info if API fails
      setPermissionsInfo({
        availablePermissions: ['RECRUITMENT_PIPELINE', 'JOBS', 'CANDIDATE'],
        availableRoles: ['ADMIN', 'HIRING_MANAGER', 'TEAM_LEAD', 'RECRUITER', 'HEAD_HUNTER', 'SALES_TEAM'],
        roleDefaultPermissions: {
          'ADMIN': ['RECRUITMENT_PIPELINE', 'JOBS', 'CANDIDATE'],
          'HIRING_MANAGER': ['RECRUITMENT_PIPELINE', 'JOBS', 'CANDIDATE'],
          'TEAM_LEAD': ['RECRUITMENT_PIPELINE', 'JOBS', 'CANDIDATE'],
          'RECRUITER': ['RECRUITMENT_PIPELINE', 'JOBS', 'CANDIDATE'],
          'HEAD_HUNTER': ['RECRUITMENT_PIPELINE', 'JOBS', 'CANDIDATE'],
          'SALES_TEAM': []
        },
        permissionsDescription: {
          'RECRUITMENT_PIPELINE': 'Access to view and manage recruitment pipeline',
          'JOBS': 'Access to view and manage job postings',
          'CANDIDATE': 'Access to view and manage candidate information'
        }
      });
      toast.error('Failed to load permissions information');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPermissions = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const response = await permissionService.getUserPermissions(user._id);
      setUserPermissions(response.data.user);
      setSelectedPermissions(response.data.user.permissions);
      setSelectedRole(response.data.user.role);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      // If user doesn't exist in permission system, use fallback data
      setUserPermissions({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.teamRole || "RECRUITER",
        isActive: true,
        permissions: [],
        profile: {
          name: user.name,
          email: user.email,
          teamRole: user.teamRole || "RECRUITER",
          status: "Active",
          department: user.department || ""
        },
        lastLogin: new Date().toISOString(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
      setSelectedPermissions([]);
      setSelectedRole(user.teamRole || "RECRUITER");
      // Don't show error toast for new users who don't exist in permission system yet
      if (error instanceof Error && !error.message.includes('User not found')) {
        toast.error('Failed to load user permissions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    
    // If permissions info is available, set default permissions for the new role
    if (permissionsInfo?.roleDefaultPermissions[newRole]) {
      setSelectedPermissions(permissionsInfo.roleDefaultPermissions[newRole]);
    }
  };

  const handleSave = async () => {
    if (!user?._id) return;
    
    try {
      setSaving(true);
      const updateData: { permissions?: string[]; role?: string } = {};
      
      // Only include permissions if they've changed
      if (JSON.stringify(selectedPermissions.sort()) !== JSON.stringify(userPermissions?.permissions.sort())) {
        updateData.permissions = selectedPermissions;
      }
      
      // Only include role if it's changed
      if (selectedRole !== userPermissions?.role) {
        updateData.role = selectedRole;
      }
      
      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        await permissionService.updateUserPermissions(user._id, updateData);
        await fetchUserPermissions(); // Refresh user permissions
        toast.success('Permissions updated successfully');
        onPermissionsUpdated?.();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating permissions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update permissions';
      
      // If user doesn't exist in permission system, show a more helpful message
      if (errorMessage.includes('User not found')) {
        toast.error('User not found in permission system. Please contact an administrator.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedPermissions(userPermissions?.permissions || []);
    setSelectedRole(userPermissions?.role || user?.teamRole || "");
    onOpenChange(false);
  };

  // Create permissions list from API data
  const permissions: Permission[] = permissionsInfo ? 
    permissionsInfo.availablePermissions.map(permissionId => ({
      id: permissionId,
      name: permissionId.replace(/_/g, ' '),
      description: permissionsInfo.permissionsDescription[permissionId] || `Access to ${permissionId.toLowerCase().replace(/_/g, ' ')}`
    })) : [];

  const roles = permissionsInfo?.availableRoles || [];

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Permissions: {user.name}
          </DialogTitle>
          <DialogDescription>
            Manage access permissions for this user across different pages and features.
          </DialogDescription>
        </DialogHeader>
        
        {/* User Information - Fixed */}
        <div className="mt-6">
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
                <Select 
                  value={selectedRole} 
                  onValueChange={handleRoleChange}
                  disabled={loading || saving}
                >
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
        </div>

        {/* Permissions Section - Fixed Header */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <Label className="text-sm font-medium">Permissions</Label>
          </div>
        </div>

        {/* Permissions List - Scrollable */}
        <div className="flex-1 overflow-y-auto mt-3">
          <div className="space-y-3">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <Checkbox
                  id={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                  disabled={saving}
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

        <DialogFooter className="mt-6 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading || saving}
          >
            Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
