"use client";
import React, { useState } from "react";
import {
  Plus,
  RefreshCcw,
  StickyNote,
  Paperclip,
  Users,
  Clock,
  FileIcon,
  TriangleAlert,
  Loader,
  FilePen,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryContent } from "@/components/clients/summary/summary-content";
import { NotesContent } from "@/components/clients/notes/notes-content";
import { AttachmentsContent } from "@/components/clients/attachments/attachments-content";
import TeamContent from "@/components/clients/team/team-content";
import { ContactsContent } from "@/components/clients/contacts/contacts-content";
import { HistoryContent } from "@/components/clients/history/history-content";
import { JobsContent } from "@/components/clients/jobs/jobs-content";
import { getClientById } from "@/services/clientService";
import { ContractSection } from "@/components/clients/contract/contract-section";
import { CreateJobRequirementForm } from "@/components/new-jobs/create-jobs-form";
import { useQuery } from "@tanstack/react-query";
import { EmailTemplatesContent } from "@/components/clients/email-templates";
import { useAuth } from "@/contexts/AuthContext";

interface PageProps {
  params: { id: string };
}

export default function ClientPage({ params }: PageProps) {
  const { id } = params;
  // const [isLoading, setIsLoading] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Summary");
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  let finalPermissions = (user?.permissions && user.permissions.length > 0) ? user.permissions : (user?.defaultPermissions || []);
  if (!isAdmin && !finalPermissions.includes('TODAY_TASKS')) {
    finalPermissions = [...finalPermissions, 'TODAY_TASKS'];
  }
  const canViewClients = isAdmin || finalPermissions.includes('CLIENTS_VIEW') || finalPermissions.includes('CLIENTS');
  const canModifyClients = isAdmin || finalPermissions.includes('CLIENTS_MODIFY');
  const canDeleteClients = isAdmin || finalPermissions.includes('CLIENTS_DELETE');
  const canModifyJobs = isAdmin || finalPermissions.includes('JOBS_MODIFY');

  const { data: client, isLoading, isError, refetch } = useQuery({
    queryKey: ["clientsData", id],
    queryFn: () => getClientById(id),
    enabled: Boolean(id), // Only run the query if id is available
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleTabSwitch = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center">
          <TriangleAlert className="size-4" />
          <div className="text-gray-600">Something went wrong! Please try again later</div>
        </div>
      </div>
    );
  }

  if (isLoading || !client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center flex-col justify-center">
          <Loader className="size-6 animate-spin" />
          <p className="text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (!canViewClients) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-muted-foreground">You do not have permission to view this client.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="border-b bg-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{client.name || "Unnamed Client"}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              {client.industry && <span>{client.industry}</span>}
              {client.industry && (client.address || client.location) && <span>•</span>}
              {(client.address || client.location) && <span>{client.address || client.location}</span>}
              {(client.industry || client.address || client.location) && <span>•</span>}
              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                Lead
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Button Bar */}
      <div className="flex items-center justify-between p-4 border-b">
        {canModifyJobs && (
          <Button
            className="bg-black text-white hover:bg-gray-800 rounded-md flex items-center gap-2"
            onClick={() => setIsCreateJobOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Job Requirement
          </Button>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border rounded-md flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex border-b w-full rounded-none justify-start h-12 bg-transparent p-0">
          <TabsTrigger
            value="Summary"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <FileIcon className="h-4 w-4" />
            Summary
          </TabsTrigger>

          <TabsTrigger
            value="Contract"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <FilePen className="h-4 w-4" />
            Contract Details
          </TabsTrigger>

          <TabsTrigger
            value="Jobs"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <FileIcon className="h-4 w-4" />
            Jobs
          </TabsTrigger>
  
          <TabsTrigger
            value="Notes"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <StickyNote className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger
            value="Attachments"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Paperclip className="h-4 w-4" />
            Attachments
          </TabsTrigger>
        
          <TabsTrigger
            value="Contacts"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="History"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger
            value="EmailTemplates"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Mail className="h-4 w-4" />
            Email Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Jobs" className="p-0 mt-0">
          <JobsContent clientId={id} clientName={client.name} />
        </TabsContent>

        <TabsContent value="Summary" className="p-4">
          <SummaryContent clientId={id} clientData={client} onTabSwitch={handleTabSwitch} canModify={canModifyClients} />
        </TabsContent>

        <TabsContent value="Notes" className="p-4">
          <NotesContent clientId={id} canModify={canModifyClients} />
        </TabsContent>

        <TabsContent value="Attachments" className="p-4">
          <AttachmentsContent clientId={id} canModify={canModifyClients} />
        </TabsContent>

        <TabsContent value="ClientTeam" className="p-4">
          <TeamContent clientId={id} />
        </TabsContent>

        <TabsContent value="Contacts" className="p-4">
          <ContactsContent clientId={id} clientData={client} canModify={canModifyClients} />
        </TabsContent>

        <TabsContent value="History" className="p-4">
          <HistoryContent clientId={id}  />
        </TabsContent>

        <TabsContent value="Contract" className="p-4">
          <ContractSection clientId={id} clientData={client} canModify={canModifyClients} />
        </TabsContent>

        <TabsContent value="EmailTemplates" className="p-4">
          <EmailTemplatesContent clientId={id} clientData={client} canModify={canModifyClients} />
        </TabsContent>
      </Tabs>

      {/* Create Job Modal */}
      {canModifyJobs && (
        <CreateJobRequirementForm
          open={isCreateJobOpen}
          onOpenChange={setIsCreateJobOpen}
          lockedClientId={id}
          lockedClientName={client?.name || ""}
        />
      )}
    </div>
  );
}
