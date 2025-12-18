"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getTeamMembers } from "@/services/teamMembersService";
import type { TeamMember } from "@/types/teamMember";
import { Loader2, Search, X } from "lucide-react";

interface MemberSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (members: TeamMember[]) => void;
  roleFilter: "Hiring Manager" | "Team Lead" | "Recruiters";
  title: string;
  initialSelections?: string[]; // IDs
  multiple?: boolean;
}

export function MemberSelectionDialog({
  open,
  onClose,
  onSelect,
  roleFilter,
  title,
  initialSelections = [],
  multiple = false,
}: MemberSelectionDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reset selection when dialog opens with new initialSelections
  useEffect(() => {
    if (open) {
      setSelectedIds(initialSelections);
      setSearch("");
    }
  }, [open, initialSelections]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamMembers(),
  });

  const filteredMembers = useMemo(() => {
    const members = data?.teamMembers || [];
    
    // Role filtering logic (copied from add-team-members-dialog.tsx)
    const roleMappings: { [key: string]: string[] } = {
      "Hiring Manager": ["Hiring Manager", "Recruitment Manager", "HR Manager", "Manager"],
      "Team Lead": ["Team Lead", "Lead", "Team Leader", "Lead Recruiter"],
      "Recruiters": ["Recruiter", "Recruiters", "Recruitment Specialist", "Talent Acquisition", "Recruiter Specialist"]
    };
    
    const validRoles = roleMappings[roleFilter] || [roleFilter];

    const roleFiltered = members.filter(member => {
      const memberRole = member.role || member.teamRole || member.department || '';
      const isActive = member.status === "Active" || member.isActive === "Active";
      
      let matchesRole = false;
      if (roleFilter === "Recruiters") {
        matchesRole = validRoles.some(validRole => {
          const roleLower = memberRole.toLowerCase();
          const validRoleLower = validRole.toLowerCase();
          return roleLower === validRoleLower || 
                 (roleLower.startsWith(validRoleLower) && 
                  !roleLower.includes('manager') && 
                  !roleLower.includes('lead'));
        });
      } else {
        matchesRole = validRoles.some(validRole => 
          memberRole.toLowerCase().includes(validRole.toLowerCase())
        );
      }
      
      return matchesRole && isActive;
    });

    if (!search.trim()) return roleFiltered;

    const term = search.toLowerCase();
    return roleFiltered.filter((m) => {
      const fullName = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
      return (
        fullName.includes(term) ||
        (m.email || "").toLowerCase().includes(term)
      );
    });
  }, [data?.teamMembers, roleFilter, search]);

  const handleToggle = (memberId: string) => {
    if (multiple) {
      setSelectedIds(prev => 
        prev.includes(memberId) 
          ? prev.filter(id => id !== memberId)
          : [...prev, memberId]
      );
    } else {
      setSelectedIds([memberId]);
    }
  };

  const handleSave = () => {
    const members = (data?.teamMembers || []).filter(m => selectedIds.includes(m._id));
    onSelect(members);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {multiple && selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedIds.map(id => {
                const member = data?.teamMembers.find(m => m._id === id);
                if (!member) return null;
                return (
                  <Badge key={id} variant="secondary" className="flex items-center gap-1">
                    {member.firstName} {member.lastName}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleToggle(id)} />
                  </Badge>
                );
              })}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading members...
            </div>
          )}

          {isError && !isLoading && (
            <div className="text-sm text-red-500 py-4">
              Failed to load team members. Please try again.
            </div>
          )}

          {!isLoading && !isError && (
            <ScrollArea className="h-[300px] border rounded-md">
              <div className="divide-y">
                {filteredMembers.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No members found matching "{roleFilter}"
                    {search && ` and "${search}"`}
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <div
                      key={member._id}
                      className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedIds.includes(member._id) ? "bg-muted" : ""
                      }`}
                      onClick={() => handleToggle(member._id)}
                    >
                      <Checkbox
                        checked={selectedIds.includes(member._id)}
                        onCheckedChange={() => handleToggle(member._id)}
                        id={`member-${member._id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.teamRole || member.role}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedIds.length === 0 && !multiple}>
            {multiple ? `Select (${selectedIds.length})` : "Select"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
