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
  const [permissionAccess, setPermissionAccess] = useState<Record<string, { view: boolean; modify: boolean; delete: boolean }>>({});

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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.teamRole || "RECRUITER",
        isActive: true,
        permissions: ['RECRUITMENT_PIPELINE', 'JOBS', 'CANDIDATE', 'TODAY_TASKS'], // Default permissions
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          teamRole: user.teamRole || "RECRUITER",
          status: "Active",
          department: user.department || ""
        },
        lastLogin: new Date().toISOString(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
      setSelectedPermissions(['RECRUITMENT_PIPELINE', 'JOBS', 'CANDIDATE', 'TODAY_TASKS']); // Default permissions
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

  const handlePermissionAccessToggle = (
    permissionId: string,
    key: 'view' | 'modify' | 'delete'
  ) => {
    setPermissionAccess(prev => {
      const current = prev[permissionId] || { view: false, modify: false, delete: false };
      return {
        ...prev,
        [permissionId]: { ...current, [key]: !current[key] }
      };
    });
  };

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    
    // If permissions info is available, set default permissions for the new role
    if (permissionsInfo?.roleDefaultPermissions[newRole]) {
      setSelectedPermissions(permissionsInfo.roleDefaultPermissions[newRole]);
    } else {
      // Default to the three main permissions if backend doesn't provide defaults
      setSelectedPermissions(['RECRUITMENT_PIPELINE', 'JOBS', 'CANDIDATE', 'TODAY_TASKS']);
    }
  };

  const handleSave = async () => {
    if (!user?._id) return;
    
    try {
      setSaving(true);
      const updateData: { permissions?: string[]; role?: string } = {};

      // Expand granular permissions to include base permissions expected by backend
      const expandWithBase = (perms: string[]): string[] => {
        const set = new Set(perms);
        perms.forEach((p) => {
          const m = p.match(/^(.*)_(VIEW|MODIFY|DELETE)$/);
          if (m) {
            set.add(m[1]);
          }
        });
        return Array.from(set);
      };
      const expandedSelected = expandWithBase(selectedPermissions);
      
      // Only include permissions if they've changed (compare expanded set to server's current perms)
      if (JSON.stringify([...expandedSelected].sort()) !== JSON.stringify([...(userPermissions?.permissions || [])].sort())) {
        updateData.permissions = expandedSelected;
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

  // Build grouped permissions by base entity with granular actions
  type ActionKey = 'view' | 'modify' | 'delete';
  interface GroupedPermission {
    base: string;
    label: string;
    description?: string;
    actions: Partial<Record<ActionKey, string>>; // maps to actual permission IDs like BASE_VIEW
  }

  const groupedPermissions: GroupedPermission[] = React.useMemo(() => {
    const available = permissionsInfo?.availablePermissions || [];
    const desc = permissionsInfo?.permissionsDescription || {} as Record<string, string>;
    const map = new Map<string, GroupedPermission>();

    for (const id of available) {
      const match = id.match(/^(.*)_(VIEW|MODIFY|DELETE)$/);
      if (match) {
        const base = match[1];
        const action = match[2].toLowerCase() as ActionKey;
        if (!map.has(base)) {
          map.set(base, {
            base,
            label: base.replace(/_/g, ' '),
            description: desc[base] || desc[id] || `Access to ${base.toLowerCase().replace(/_/g, ' ')}`,
            actions: {}
          });
        }
        map.get(base)!.actions[action] = id;
      } else {
        if (!map.has(id)) {
          map.set(id, {
            base: id,
            label: id.replace(/_/g, ' '),
            description: desc[id] || `Access to ${id.toLowerCase().replace(/_/g, ' ')}`,
            actions: {}
          });
        }
      }
    }

    // Add default permission groups if they don't exist
    const defaultGroups = [
      {
        base: 'CLIENTS',
        label: 'CLIENTS',
        description: 'Access to view and manage client information',
        actions: {
          view: 'CLIENTS_VIEW',
          modify: 'CLIENTS_MODIFY',
          delete: 'CLIENTS_DELETE'
        }
      },
      // {
      //   base: 'TEAM_MEMBERS',
      //   label: 'TEAM MEMBERS',
      //   description: 'Access to view and manage team members',
      //   actions: {
      //     view: 'TEAM_MEMBERS_VIEW',
      //     modify: 'TEAM_MEMBERS_MODIFY',
      //     delete: 'TEAM_MEMBERS_DELETE'
      //   }
      // }
    ];

    defaultGroups.forEach(group => {
      if (!map.has(group.base)) {
        map.set(group.base, group as any);
      }
    });

    const order = ['CANDIDATE', 'JOBS', 'RECRUITMENT_PIPELINE', 'CLIENTS', 'TEAM_MEMBERS'];
    const ordered: GroupedPermission[] = [];
    for (const key of order) {
      const gp = map.get(key);
      if (gp) ordered.push(gp);
    }

    // Include any other groups not in the predefined order at the end
    for (const [key, gp] of map.entries()) {
      if (!order.includes(key)) ordered.push(gp);
    }
    return ordered;
  }, [permissionsInfo]);

  useEffect(() => {
    setPermissionAccess(prev => {
      const next = { ...prev } as Record<string, { view: boolean; modify: boolean; delete: boolean }>;
      groupedPermissions.forEach(g => {
        const current = next[g.base] || { view: false, modify: false, delete: false };
        next[g.base] = current;
      });
      return next;
    });
  }, [groupedPermissions.length]);

  const roles = permissionsInfo?.availableRoles || ['ADMIN', 'HIRING_MANAGER', 'TEAM_LEAD', 'RECRUITER', 'HEAD_HUNTER', 'SALES_TEAM'];

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Permissions: {user.firstName + " " + user.lastName}
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
                <Label className="text-sm font-medium">Email : <span className="text-muted-foreground">{user.email}</span></Label>
                {/* <p className="text-sm text-muted-foreground">{user.email}</p> */}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Role </Label>
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

        {/* Permissions Section - Fixed Header */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <Label className="text-sm font-medium">Permissions</Label>
          </div>
        </div>

        {/* Permissions List - Scrollable */}
        <div className="flex flex-col overflow-y-auto mt-3">
          <div className="p-2 space-y-3">
            {groupedPermissions.length === 0 && (
              <div className="text-center text-muted-foreground py-4 col-span-1 sm:col-span-2">
                No permissions available
              </div>
            )}
            {groupedPermissions.map((group) => (
              <div key={group.base} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor={group.base}
                      className="text-sm font-medium"
                    >
                      {group.label}
                    </Label>
                    {group.base === 'CLIENTS' && (
                      <Badge variant="secondary" className="text-xs">
                        Additional Access
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {group.description}
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-4">
                    {group.actions.view && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${group.base}-view`}
                          checked={selectedPermissions.includes(group.actions.view)}
                          onCheckedChange={() => handlePermissionToggle(group.actions.view!)}
                          disabled={saving}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                        />
                        <Label htmlFor={`${group.base}-view`} className="text-xs">View</Label>
                      </div>
                    )}
                    {group.actions.modify && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${group.base}-modify`}
                          checked={selectedPermissions.includes(group.actions.modify)}
                          onCheckedChange={() => handlePermissionToggle(group.actions.modify!)}
                          disabled={saving}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                        />
                        <Label htmlFor={`${group.base}-modify`} className="text-xs">Modify</Label>
                      </div>
                    )}
                    {group.actions.delete && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${group.base}-delete`}
                          checked={selectedPermissions.includes(group.actions.delete)}
                          onCheckedChange={() => handlePermissionToggle(group.actions.delete!)}
                          disabled={saving}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                        />
                        <Label htmlFor={`${group.base}-delete`} className="text-xs">Delete</Label>
                      </div>
                    )}
                  </div>
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
