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
import { Team } from "@/services/teamService";

interface ViewTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
}

export function ViewTeamDialog({ 
  open, 
  onOpenChange, 
  team
}: ViewTeamDialogProps) {
  if (!team) return null;

  const sections = [
    {
      title: "Team Information",
      icon: Users,
             rows: [
         [
           { label: "Team Name", value: team.teamName, isBadge: false },
           { label: "Team Status", value: team.teamStatus || "Inactive", isBadge: true },
           { label: "Created", value: new Date(team.createdAt).toLocaleDateString(), isBadge: false },
         ],
         [
           { label: "Hiring Manager", value: team.hiringManagerId.name, isBadge: false },
           { label: "Team Lead", value: team.teamLeadId.name, isBadge: false },
           { label: "", value: "", isBadge: false },
         ],
         [
           { label: "Recruiters", value: team.recruiters.map(recruiter => recruiter.name).join(", "), isBadge: false },
         ]
       ]
    },
    {
      title: "Clients",
      icon: Building,
      items: [
        { label: "Active Clients", value: "0", isBadge: false },
        { label: "Total Clients", value: "0", isBadge: false },
      ]
    },
    {
      title: "Jobs",
      icon: Briefcase,
      items: [
        { label: "Active Jobs", value: "0", isBadge: false },
        { label: "Completed Jobs", value: "0", isBadge: false },
      ]
    },
    {
      title: "Candidates",
      icon: User,
      items: [
        { label: "Active Candidates", value: "0", isBadge: false },
        { label: "Placed Candidates", value: "0", isBadge: false },
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
            <Card key={sectionIndex} className={`h-fit ${section.title === "Team Information" ? "col-span-full" : ""}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.rows ? (
                                     // Handle Team Information section with rows
                   section.rows.map((row, rowIndex) => (
                     <div key={rowIndex} className="flex gap-4">
                       {row.map((item, itemIndex) => (
                         <div key={itemIndex} className="flex-1">
                           <div className="flex items-center gap-2 text-sm">
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
                         </div>
                       ))}
                     </div>
                   ))
                ) : (
                  // Handle other sections with items
                  section.items.map((item, itemIndex) => (
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
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
