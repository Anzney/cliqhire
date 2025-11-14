"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTeamMembers } from "@/services/teamMembersService";
import { getReferredList } from "@/services/referredService";
import { Loader2, Search, Users, UserPlus } from "lucide-react";

type User = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  teamRole?: string;
  type?: 'team' | 'referred';
  phone?: string;
  position?: string;
};

interface UserSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (user: User) => void;
  title?: string;
}

export default function UserSelectDialog({ open, onClose, onSelect, title = "Select User" }: UserSelectDialogProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "email" | "role">("name");
  const [showTeam, setShowTeam] = useState(true);
  const [showReferred, setShowReferred] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        
        const [teamRes, referredRes] = await Promise.all([
          getTeamMembers(),
          getReferredList()
        ]);

        if (cancelled) return;

        const teamMembers = (teamRes.teamMembers || []).map((user: any) => ({
          ...user,
          type: 'team' as const,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email || 'Unknown'
        }));

        const referredUsers = (referredRes || []).map((user: any) => ({
          ...user,
          type: 'referred' as const,
          name: user.name || user.email || 'Unknown',
          email: user.email || '',
          teamRole: user.position || 'Referred Contact'
        }));

        setUsers([...teamMembers, ...referredUsers]);
      } catch (e) {
        console.error('Error loading users:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (open) load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = [...users];
    
    // Apply type filters
    result = result.filter(u => {
      if (showTeam && u.type === 'team') return true;
      if (showReferred && u.type === 'referred') return true;
      return false;
    });
    
    // Apply search filter if query exists
    if (q) {
      result = result.filter(u => {
        if (searchBy === "name") {
          const fullName = u.name?.toLowerCase() || '';
          return fullName.includes(q);
        }
        if (searchBy === "email") return (u.email || "").toLowerCase().includes(q);
        return (u.teamRole || "").toLowerCase().includes(q);
      });
    }
    
    // Sort team members first, then referred users
    return result.sort((a, b) => {
      if (a.type === 'team' && b.type === 'referred') return -1;
      if (a.type === 'referred' && b.type === 'team') return 1;
      return 0;
    });
  }, [users, search, searchBy, showTeam, showReferred]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Select value={searchBy} onValueChange={(v: any) => setSearchBy(v)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search by ${searchBy}`}
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowTeam(!showTeam)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${showTeam ? 'bg-accent text-accent-foreground' : 'opacity-60'}`}
              >
                <Users className="h-4 w-4" />
                <span>Team</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReferred(!showReferred)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${showReferred ? 'bg-accent text-accent-foreground' : 'opacity-60'}`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Referred</span>
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-80 border rounded-md">
            {loading ? (
              <div className="h-full flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading users...
              </div>
            ) : (
              <ScrollArea className="h-80">
                <div className="divide-y">
                  {filtered.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground">No users found</div>
                  )}
                  {filtered.map((u) => (
                    <button
                      key={u._id || u.id || `${u.email}-${u.name}`}
                      className="w-full text-left p-3 hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || u.email || "";
                        onSelect({ ...u, name: fullName });
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{u.name}</span>
                      {u.type === 'referred' && (
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          Referred
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {u.email || ''}
                      {u.phone && ` • ${u.phone}`}
                      {u.teamRole && ` • ${u.teamRole}`}
                    </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
