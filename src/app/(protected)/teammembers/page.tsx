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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const router = useRouter();

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    setInitialLoading(true);
    try {
      const response = await getTeamMembers();
      setTeamMembers(response.teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleCreateSuccess = () => {
    fetchTeamMembers(); // Refresh the list
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
        <TeamMembersTabs onTeamMemberClick={handleTeamMemberClick} />
      </div>

      <CreateTeamMemberModal open={open} onOpenChange={setOpen} onSuccess={handleCreateSuccess} />
    </div>
  );
}
