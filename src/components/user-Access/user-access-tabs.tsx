"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Shield } from "lucide-react";

interface UserAccessTabsProps {
  refreshTrigger?: number;
}

export function UserAccessTabs({ refreshTrigger }: UserAccessTabsProps) {
  const [activeTab, setActiveTab] = useState("teams");

  // Mock data - replace with actual data from your services
  const teamsCount = 5; // Replace with actual count
  const permissionsCount = 12; // Replace with actual count

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex border-b w-full rounded-none justify-start h-12 bg-transparent p-0">
          <TabsTrigger
            value="teams"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Users className="h-4 w-4" />
            Teams
            <Badge variant="secondary" className="ml-1 text-xs">
              {teamsCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="user-permission"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Shield className="h-4 w-4" />
            User Permission
            <Badge variant="secondary" className="ml-1 text-xs">
              {permissionsCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="p-0 mt-0">
          <div className="flex-1">
            <div className="h-[calc(100vh-240px)] flex items-center justify-center">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Teams Management</h3>
                <p className="text-gray-500">Manage team structures and assignments here.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="user-permission" className="p-0 mt-0">
          <div className="flex-1">
            <div className="h-[calc(100vh-240px)] flex items-center justify-center">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">User Permissions</h3>
                <p className="text-gray-500">Configure user access levels and permissions here.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
