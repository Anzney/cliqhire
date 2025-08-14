"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, UserCheck, Building, Briefcase, UserPlus } from "lucide-react";

interface Team {
  id: string;
  teamName: string;
  hiringManager: string;
  teamLead: string;
  recruiters: string[];
  teamStatus: string;
  createdAt: string;
}

interface ViewTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  getTeamMemberName: (id: string) => string;
}

export function ViewTeamDialog({ 
  open, 
  onOpenChange, 
  team, 
  getTeamMemberName 
}: ViewTeamDialogProps) {
  if (!team) return null;

  const sections = [
    {
      title: "Team Information",
      icon: Users,
      items: [
        { label: "Team Name", value: team.teamName },
        { label: "Team Status", value: team.teamStatus, isBadge: true },
        { label: "Created", value: new Date(team.createdAt).toLocaleDateString() },
      ]
    },
    {
      title: "Team Leadership",
      icon: UserCheck,
      items: [
        { label: "Hiring Manager", value: getTeamMemberName(team.hiringManager) },
        { label: "Team Lead", value: getTeamMemberName(team.teamLead) },
      ]
    },
    {
      title: "Recruiters",
      icon: UserPlus,
      items: team.recruiters.map(recruiterId => ({
        label: getTeamMemberName(recruiterId),
        value: "Recruiter"
      }))
    },
    {
      title: "Clients",
      icon: Building,
      items: [
        { label: "Active Clients", value: "0" },
        { label: "Total Clients", value: "0" },
      ]
    },
    {
      title: "Jobs",
      icon: Briefcase,
      items: [
        { label: "Active Jobs", value: "0" },
        { label: "Completed Jobs", value: "0" },
        { label: "Total Jobs", value: "0" },
      ]
    },
    {
      title: "Candidates",
      icon: User,
      items: [
        { label: "Active Candidates", value: "0" },
        { label: "Placed Candidates", value: "0" },
        { label: "Total Candidates", value: "0" },
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Details: {team.teamName}
          </DialogTitle>
          <DialogDescription>
            View comprehensive information about this team including members, clients, jobs, and candidates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span className="font-medium">
                      {item.isBadge ? (
                        <Badge 
                          variant={item.value === "Active" ? "default" : item.value === "Working" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {item.value}
                        </Badge>
                      ) : (
                        item.value
                      )}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
