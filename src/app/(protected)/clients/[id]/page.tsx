"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useRouter, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { ClientStageBadge } from "@/components/client-stage-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { SummaryContent } from "@/components/clients/summary/summary-content";
// import { ActivitiesContent } from "@/components/clients/activities/activities-content";
import { NotesContent } from "@/components/clients/notes/notes-content";
import { AttachmentsContent } from "@/components/clients/attachments/attachments-content";
import TeamContent from "@/components/clients/team/team-content";
import { ContactsContent } from "@/components/clients/contacts/contacts-content";
import { HistoryContent } from "@/components/clients/history/history-content";
import { JobsContent } from "@/components/clients/jobs/jobs-content";

import { CreateJobModal } from "@/components/jobs/create-job-modal";

interface PageProps {
  params: { id: string };
}

export default function ClientPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${id}`);
      if (!response.ok) {
        if (response.status === 404) notFound();
        throw new Error("Failed to fetch client data");
      }
      const responseData = await response.json();
      if (responseData.success === true && responseData.data) {
        setClient(responseData.data);
      } else {
        throw new Error("Invalid client data format");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const handleRefresh = () => {
    router.refresh();
  };

  if (error) {
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

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="border-b bg-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{client.name || "Unnamed Client"}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{client.industry || "Investment Management"}</span>
              <span>•</span>
              <span>{client.location || "Riyadh Region, Saudi Arabia"}</span>
              <span>•</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                Lead
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border rounded-md px-4">
              Website
            </Button>
            <Button variant="outline" size="sm" className="border rounded-md px-4">
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Button Bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          className="bg-black text-white hover:bg-gray-800 rounded-md flex items-center gap-2"
          onClick={() => setIsCreateJobOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Job Requirement
        </Button>

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
      <Tabs defaultValue="Summary" className="w-full">
        <TabsList className="flex border-b w-full rounded-none justify-start h-12 bg-transparent p-0">
          <TabsTrigger
            value="Summary"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <FileIcon className="h-4 w-4" />
            Summary
          </TabsTrigger>

          <TabsTrigger
            value="Jobs"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <FileIcon className="h-4 w-4" />
            Jobs
          </TabsTrigger>
          {/* <TabsTrigger
            value="Activities"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <MessageSquare className="h-4 w-4" />
            Activities
          </TabsTrigger> */}
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
            value="ClientTeam"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Users className="h-4 w-4" />
            Client Team
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
        </TabsList>

        <TabsContent value="Jobs" className="p-0 mt-0">
          <JobsContent clientId={id} clientName={client.name} />
        </TabsContent>

        <TabsContent value="Summary" className="p-4">
          <SummaryContent clientId={id} clientData={client} />
        </TabsContent>

        {/* <TabsContent value="Activities" className="p-4">
          <ActivitiesContent clientId={id} />
        </TabsContent> */}

        <TabsContent value="Notes" className="p-4">
          <NotesContent clientId={id} />
        </TabsContent>

        <TabsContent value="Attachments" className="p-4">
          <AttachmentsContent clientId={id} />
        </TabsContent>

        <TabsContent value="ClientTeam" className="p-4">
          <TeamContent clientId={id} />
        </TabsContent>

        <TabsContent value="Contacts" className="p-4">
          <ContactsContent clientId={id} clientData={client} />
        </TabsContent>

        <TabsContent value="History" className="p-4">
          <HistoryContent clientId={id} />
        </TabsContent>
      </Tabs>

      {/* Create Job Modal */}
      <CreateJobModal
        open={isCreateJobOpen}
        onOpenChange={setIsCreateJobOpen}
        clientId={id}
        clientName={client.name}
        onJobCreated={handleRefresh}
      />
    </div>
  );
}
