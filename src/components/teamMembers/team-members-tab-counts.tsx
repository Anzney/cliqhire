"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { TeamMember } from "@/types/teamMember";

interface TeamMembersTabCountsProps {
  teamMembers: TeamMember[];
}

export function TeamMembersTabCounts({ teamMembers }: TeamMembersTabCountsProps) {
  const getCountByDepartment = (department: string) => {
    return teamMembers.filter(member => member.department === department).length;
  };

  const hiringManagerCount = getCountByDepartment("Hiring Manager");
  const teamLeadCount = getCountByDepartment("Team Lead");
  const recruitersCount = getCountByDepartment("Recruiters");
  const headEnterCount = getCountByDepartment("Head Enter");

  return (
    <div className="flex gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Hiring Manager:</span>
        <Badge variant="secondary">{hiringManagerCount}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Team Lead:</span>
        <Badge variant="secondary">{teamLeadCount}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Recruiters:</span>
        <Badge variant="secondary">{recruitersCount}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Head Enter:</span>
        <Badge variant="secondary">{headEnterCount}</Badge>
      </div>
    </div>
  );
}
