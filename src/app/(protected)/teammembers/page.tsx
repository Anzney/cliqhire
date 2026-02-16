"use client";
import React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Dashboardheader from "@/components/dashboard-header";
import { TeamMembersTabs } from "@/components/teamMembers/team-members-tabs";
import { CreateTeamMemberModal } from "@/components/create-teamMembers-modal/create-teamMembers-modal";
import { ExportDialog, ExportFilterParams } from "@/components/common/export-dialog";
import { useExportUsers } from "@/hooks/useExportUsers";

export default function TeamMembersPage() {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const { mutateAsync: exportUsersMutation } = useExportUsers();

  // Get highlight ID from URL query parameter
  const highlightId = searchParams?.get('highlight') || undefined;

  const handleCreateSuccess = () => {
    // Invalidate team members list to refetch after create
    queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
  };

  const handleTeamMemberClick = (teamMemberId: string) => {
    router.push(`/teammembers/${teamMemberId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={setFilterOpen}
        initialLoading={initialLoading}
        showFilterButton={false}
        rightContent={undefined}
        heading="Team Members"
        buttonText="Add Team Member"
        onExport={() => setOpenExportDialog(true)}
      />

      {/* Tabbed Interface */}
      <div className="flex-1">
        <TeamMembersTabs
          onTeamMemberClick={handleTeamMemberClick}
          highlightId={highlightId}
        />
      </div>

      <CreateTeamMemberModal open={open} onOpenChange={setOpen} onSuccess={handleCreateSuccess} />

      <ExportDialog
        isOpen={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        title="Export User Data"
        description="Select whether to export all user data or filter by a specific period."
        onExport={(params: ExportFilterParams | undefined) => exportUsersMutation(params)}
        filename="users_export"
      />
    </div>
  );
}
