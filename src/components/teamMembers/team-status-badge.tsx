"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ChevronDown, RefreshCcw } from "lucide-react";
import { TeamMemberStatus } from "@/types/teamMember";
import { updateTeamMemberStatus } from "@/services/teamMembersService";

interface TeamMemberStatusBadgeProps {
  id: string;
  status: TeamMemberStatus;
  onStatusChange?: (id: string, status: TeamMemberStatus) => void;
  disabled?: boolean;
}

const statusOptions: {
  value: TeamMemberStatus;
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
}[] = [
  { value: "Active", label: "Active", variant: "default" },
  { value: "Inactive", label: "Inactive", variant: "secondary" },
  { value: "On Leave", label: "On Leave", variant: "outline" },
  { value: "Terminated", label: "Terminated", variant: "destructive" },
];

export function TeamMemberStatusBadge({
  id,
  status,
  onStatusChange,
  disabled = false,
}: TeamMemberStatusBadgeProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TeamMemberStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentStatus = statusOptions.find((option) => option.value === status);

  const handleStatusChange = (newStatus: TeamMemberStatus) => {
    if (newStatus === status) return;

    setPendingStatus(newStatus);
    setError(null);
    setShowConfirmDialog(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStatus) return;

    setIsUpdating(true);
    setError(null);

    try {
      const updatedTeamMember = await updateTeamMemberStatus(id, pendingStatus);

      if (onStatusChange) {
        onStatusChange(id, updatedTeamMember.status);
      }

      setShowConfirmDialog(false);
      setPendingStatus(null);
    } catch (err: any) {
      console.error("Error updating team member status:", err);
      setError(err.message || "Failed to update team member status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelStatusChange = () => {
    setShowConfirmDialog(false);
    setPendingStatus(null);
    setError(null);
  };

  if (disabled) {
    return (
      <Badge variant={currentStatus?.variant || "default"}>{currentStatus?.label || status}</Badge>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent" disabled={isUpdating}>
            <Badge
              variant={currentStatus?.variant || "default"}
              className="cursor-pointer hover:opacity-80"
            >
              {currentStatus?.label || status}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={option.value === status || isUpdating}
              className="cursor-pointer"
            >
              <Badge variant={option.variant} className="mr-2">
                {option.label}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Team Member Status</AlertDialogTitle>
            <AlertDialogDescription>
              {error ? (
                <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-md">{error}</div>
              ) : (
                `Are you sure you want to change the team member status from "${status}" to "${pendingStatus}"?`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelStatusChange}>
              {error ? "Close" : "Cancel"}
            </AlertDialogCancel>
            {!error && (
              <AlertDialogAction onClick={handleConfirmStatusChange} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Confirm"
                )}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
