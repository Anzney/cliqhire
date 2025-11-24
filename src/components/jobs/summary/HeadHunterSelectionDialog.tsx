"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTeamMembers } from "@/services/teamMembersService";
import type { TeamMember } from "@/types/teamMember";
import { Loader2 } from "lucide-react";
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

interface HeadHunterSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (headHunter: TeamMember) => void;
  selectedHeadHunterName?: string | null;
}

export function HeadHunterSelectionDialog({
  open,
  onClose,
  onSelect,
  selectedHeadHunterName,
}: HeadHunterSelectionDialogProps) {
  const [search, setSearch] = useState("");
  const [pendingSelection, setPendingSelection] = useState<TeamMember | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["head-hunters"],
    queryFn: () => getTeamMembers(),
  });

  const headHunters = useMemo(() => {
    const members = data?.teamMembers || [];
    // Filter by role/teamRole containing "head" and "hunter" (case-insensitive)
    const onlyHeadHunters = members.filter((m) => {
      const role = (m.teamRole || m.role || "").toLowerCase();
      return role.includes("head") && role.includes("hunter");
    });

    if (!search.trim()) return onlyHeadHunters;

    const term = search.toLowerCase();
    return onlyHeadHunters.filter((m) => {
      const fullName = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
      return (
        fullName.includes(term) ||
        (m.email || "").toLowerCase().includes(term) ||
        (m.location || "").toLowerCase().includes(term)
      );
    });
  }, [data?.teamMembers, search]);

  const handleSelect = (member: TeamMember) => {
    setPendingSelection(member);
    setShowConfirm(true);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Head Hunter</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            placeholder="Search head hunters by name, email, or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isLoading && (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading head hunters...
            </div>
          )}

          {isError && !isLoading && (
            <div className="text-sm text-red-500 py-4">
              Failed to load head hunters. Please try again.
            </div>
          )}

          {!isLoading && !isError && (
            <ScrollArea className="h-64 border rounded-md">
              <div className="divide-y">
                {headHunters.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No head hunters found.
                  </div>
                ) : (
                  headHunters.map((member) => {
                    const fullName = `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
                      member.email ||
                      "Unnamed";
                    const isSelected =
                      !!selectedHeadHunterName &&
                      selectedHeadHunterName.toLowerCase() === fullName.toLowerCase();

                    return (
                      <button
                        key={member._id}
                        type="button"
                        className={`w-full text-left p-3 flex items-center justify-between hover:bg-accent hover:text-accent-foreground text-sm ${
                          isSelected ? "bg-accent text-accent-foreground" : ""
                        }`}
                        onClick={() => handleSelect(member)}
                      >
                        <div>
                          <div className="font-medium">{fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            {member.email}
                            {member.location ? ` • ${member.location}` : ""}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-xs text-primary font-medium">Selected</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>

        <AlertDialog open={showConfirm} onOpenChange={(open) => {
          if (!open) {
            setShowConfirm(false);
            setPendingSelection(null);
          }
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Head Hunter</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingSelection
                  ? `Are you sure you want to set "${
                      `${pendingSelection.firstName || ""} ${pendingSelection.lastName || ""}`.trim() ||
                      pendingSelection.email ||
                      "this user"
                    }" as the head hunter for this job?`
                  : "Are you sure you want to set this head hunter?"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (pendingSelection) {
                    onSelect(pendingSelection);
                  }
                  setShowConfirm(false);
                  setPendingSelection(null);
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
