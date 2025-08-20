"use client";
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  CheckCircle, 
  Users, 
  MessageSquare, 
  Shield, 
  UserCheck, 
  Award, 
  XCircle 
} from "lucide-react";

interface TabContentProps {
  value: string;
}

export const TabContent: React.FC<TabContentProps> = ({ value }) => {
  const getTabIcon = (tabValue: string) => {
    switch (tabValue) {
      case "screening":
        return <Search className="h-6 w-6" />;
      case "sr-completed":
        return <CheckCircle className="h-6 w-6" />;
      case "sourcing":
        return <Users className="h-6 w-6" />;
      case "interview":
        return <MessageSquare className="h-6 w-6" />;
      case "verification":
        return <Shield className="h-6 w-6" />;
      case "onboarding":
        return <UserCheck className="h-6 w-6" />;
      case "hired":
        return <Award className="h-6 w-6" />;
      case "disqualified":
        return <XCircle className="h-6 w-6" />;
      default:
        return <Search className="h-6 w-6" />;
    }
  };

  const getTabTitle = (tabValue: string) => {
    switch (tabValue) {
      case "screening":
        return "Screening";
      case "sr-completed":
        return "SR/Completed";
      case "sourcing":
        return "Sourcing";
      case "interview":
        return "Interview";
      case "verification":
        return "Verification";
      case "onboarding":
        return "Onboarding";
      case "hired":
        return "Hired Candidate";
      case "disqualified":
        return "Disqualified Candidate";
      default:
        return "Screening";
    }
  };

  const getTabDescription = (tabValue: string) => {
    switch (tabValue) {
      case "screening":
        return "Review and evaluate candidate applications and resumes.";
      case "sr-completed":
        return "Candidates who have completed the screening requirements.";
      case "sourcing":
        return "Active candidate sourcing and recruitment activities.";
      case "interview":
        return "Candidates in various interview stages.";
      case "verification":
        return "Background checks and reference verification process.";
      case "onboarding":
        return "New hires in the onboarding process.";
      case "hired":
        return "Successfully hired candidates.";
      case "disqualified":
        return "Candidates who did not meet requirements.";
      default:
        return "Review and evaluate candidate applications and resumes.";
    }
  };

  return (
    <TabsContent value={value} >
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          {getTabIcon(value)}
          <div>
            <CardTitle>{getTabTitle(value)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {getTabDescription(value)}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Content for {getTabTitle(value)} will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
