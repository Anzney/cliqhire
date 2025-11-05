"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTeamMembers } from "@/services/teamMembersService";
import { Loader2, Search } from "lucide-react";

type User = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  teamRole?: string;
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

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getTeamMembers();
        if (!cancelled) {
          setUsers(res.teamMembers || []);
        }
      } catch (e) {
        // silent
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
    if (!q) return users;
    return users.filter(u => {
      if (searchBy === "name") {
        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "";
        return fullName.toLowerCase().includes(q);
      }
      if (searchBy === "email") return (u.email || "").toLowerCase().includes(q);
      return (u.teamRole || "").toLowerCase().includes(q);
    });
  }, [users, search, searchBy]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

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
                      <div className="font-medium text-sm">{`${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || u.email || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{u.email || ""}{u.teamRole ? ` • ${u.teamRole}` : ""}</div>
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
