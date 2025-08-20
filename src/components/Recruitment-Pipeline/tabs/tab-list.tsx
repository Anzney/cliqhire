"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface TabListProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const TabList: React.FC<TabListProps> = ({ value, onValueChange, children }) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className="flex border-b w-full rounded-none justify-start h-12 bg-transparent p-0">
        <TabsTrigger
          value="screening"
          className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
        >
          <Search className="h-4 w-4" />
          Screening
        </TabsTrigger>
        <TabsTrigger
          value="sr-completed"
          className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
        >
          <CheckCircle className="h-4 w-4" />
          SR/Completed
        </TabsTrigger>
        <TabsTrigger
          value="sourcing"
          className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
        >
          <Users className="h-4 w-4" />
          Sourcing
        </TabsTrigger>
        <TabsTrigger
          value="interview"
          className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
        >
          <MessageSquare className="h-4 w-4" />
          Interview
        </TabsTrigger>
        <TabsTrigger
          value="verification"
          className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
        >
          <Shield className="h-4 w-4" />
          Verification
        </TabsTrigger>
        <TabsTrigger
          value="onboarding"
          className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
        >
          <UserCheck className="h-4 w-4" />
          Onboarding
        </TabsTrigger>
        <TabsTrigger
          value="hired"
          className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
        >
          <Award className="h-4 w-4" />
          Hired
        </TabsTrigger>
        <TabsTrigger
          value="disqualified"
          className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
        >
          <XCircle className="h-4 w-4" />
          Disqualified
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
