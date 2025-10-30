"use client";
import React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Dashboardheader from "@/components/dashboard-header";
import { TeamMembersTabs } from "@/components/teamMembers/team-members-tabs";
import { CreateTeamMemberModal } from "@/components/create-teamMembers-modal/create-teamMembers-modal";

export default function TeamMembersPage() {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

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
        rightContent={<></>}
        heading="Team Members"
        buttonText="Add Team Member"
      />

      {/* Tabbed Interface */}
      <div className="flex-1">
        <TeamMembersTabs onTeamMemberClick={handleTeamMemberClick} />
      </div>

      <CreateTeamMemberModal open={open} onOpenChange={setOpen} onSuccess={handleCreateSuccess} />
    </div>
  );
}
