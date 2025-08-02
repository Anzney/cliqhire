"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Group {
  id: string;
  name: string;
}

import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { AddGroupDialog } from "@/components/AddGroupDialog";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface GroupCardsProps {
  groups: Group[];
  onAddGroup: (groupName: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  onEditGroup?: (groupId: string, newName: string) => void;
}

import { AddCandidateDialog } from "@/components/candidates/AddCandidateDialog";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";

export const GroupCards: React.FC<GroupCardsProps> = ({ groups, onAddGroup, onDeleteGroup, onEditGroup }) => {
  // --- Handler Functions ---
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; group: Group | null }>({ open: false, group: null });
  const [editDialog, setEditDialog] = useState<{ open: boolean; group: Group | null }>({ open: false, group: null });
  const [addCandidateDialog, setAddCandidateDialog] = useState<{ open: boolean; group: Group | null }>({ open: false, group: null });
  const [showCreateCandidateModal, setShowCreateCandidateModal] = useState<{ open: boolean; group: Group | null }>({ open: false, group: null });

  // Add Group
  const handleOpenAddGroupDialog = () => setOpen(true);
  const handleCloseAddGroupDialog = () => setOpen(false);
  const handleAddGroup = (groupName: string) => {
    onAddGroup(groupName);
    toast.success("Group added successfully");
  };

  // Edit Group
  const handleOpenEditDialog = (group: Group) => setEditDialog({ open: true, group });
  const handleCloseEditDialog = () => setEditDialog({ open: false, group: null });
  const handleEditGroup = (newName: string) => {
    if (editDialog.group && onEditGroup) {
      onEditGroup(editDialog.group.id, newName);
    }
    handleCloseEditDialog();
  };

  // Delete Group
  const handleOpenDeleteDialog = (group: Group) => setDeleteDialog({ open: true, group });
  const handleCloseDeleteDialog = () => setDeleteDialog({ open: false, group: null });
  const handleDeleteGroup = () => {
    if (deleteDialog.group && onDeleteGroup) {
      onDeleteGroup(deleteDialog.group.id);
    }
    handleCloseDeleteDialog();
  };

  // Add Candidate
  const handleOpenAddCandidateDialog = (group: Group) => setAddCandidateDialog({ open: true, group });
  const handleCloseAddCandidateDialog = () => setAddCandidateDialog({ open: false, group: null });
  const handleSelectCandidateOption = (option: "existing" | "new", group: Group) => {
    handleCloseAddCandidateDialog();
    if (option === "new") {
      setShowCreateCandidateModal({ open: true, group });
    }
    // else handle existing candidate flow
  };

  // Create Candidate Modal
  const handleOpenCreateCandidateModal = (group: Group) => setShowCreateCandidateModal({ open: true, group });
  const handleCloseCreateCandidateModal = () => setShowCreateCandidateModal({ open: false, group: null });

  if (!groups.length) return null;
  return (
    <div
      className="flex-1 w-full overflow-y-auto px-4"
      style={{ minHeight: 0 }}
    >
      <div
        className="flex gap-4 py-8 overflow-x-auto items-start"
        style={{ minHeight: 180 }}
      >
        {groups.map((group) => (
          <Card key={group.id} className="min-w-[280px] max-w-xs flex-shrink-0 h-[720px]">
            <div className="p-6 pb-0 flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xl font-semibold text-left">{group.name}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-accent focus:outline-none">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setEditDialog({ open: true, group })}>
                      Edit Group Name
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => setDeleteDialog({ open: true, group })}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mb-3 flex items-center gap-1 text-xs"
                onClick={() => handleOpenAddCandidateDialog(group)}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Candidate
              </Button>
              <div className="flex-1 flex flex-col justify-start">
                {/* Additional group content can go here */}
              </div>
              {/* Add Candidate Dialog per group */}
              <AddCandidateDialog
                open={addCandidateDialog.open && addCandidateDialog.group?.id === group.id}
                onOpenChange={open => open ? handleOpenAddCandidateDialog(group) : handleCloseAddCandidateDialog()}
                onSelectOption={option => handleSelectCandidateOption(option, group)}
              />
              <CreateCandidateModal
                isOpen={showCreateCandidateModal.open && showCreateCandidateModal.group?.id === group.id}
                onClose={handleCloseCreateCandidateModal}
              />
            </div>
          </Card>
        ))}
        {/* Add Group Button and Dialog */}
        <div className="flex flex-col items-start justify-start h-[720px] min-w-[280px] max-w-xs">
          <Button onClick={handleOpenAddGroupDialog} className="h-8 w-1/2.5" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add New Group
          </Button>
          <AddGroupDialog
            open={open}
            onOpenChange={setOpen}
            onAddGroup={handleAddGroup}
          />
        </div>
      </div>
      {/* Edit Group Dialog (global, not per card) */}
      <AddGroupDialog
        open={editDialog.open}
        onOpenChange={open => open ? handleOpenEditDialog(editDialog.group!) : handleCloseEditDialog()}
        initialGroupName={editDialog.group?.name || ""}
        submitButtonLabel="Update"
        onSubmit={handleEditGroup}
      />
      {/* Delete Confirmation Dialog (global, not per card) */}
      <AlertDialog open={deleteDialog.open} onOpenChange={open => open ? handleOpenDeleteDialog(deleteDialog.group!) : handleCloseDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this group: "{deleteDialog.group?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDeleteGroup}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
