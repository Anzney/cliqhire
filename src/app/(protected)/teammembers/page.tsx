"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboardheader from "@/components/dashboard-header";
import { TeamMembersTabs } from "@/components/teamMembers/team-members-tabs";
import { CreateTeamMemberModal } from "@/components/create-teamMembers-modal/create-teamMembers-modal";
import { getTeamMembers } from "@/services/teamMembersService";
import { TeamMember } from "@/types/teamMember";

export default function TeamMembersPage() {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  const handleCreateSuccess = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
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
        heading="Team Members"
        buttonText="Add Team Member"
      />

      {/* Tabbed Interface */}
      <div className="flex-1">
        <TeamMembersTabs onTeamMemberClick={handleTeamMemberClick} refreshTrigger={refreshTrigger} />
      </div>

      <CreateTeamMemberModal open={open} onOpenChange={setOpen} onSuccess={handleCreateSuccess} />
    </div>
  );
}
