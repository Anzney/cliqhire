"use client";
import React, { useState, useRef, useEffect } from "react";
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
  FileText,
  Download,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { generateWeeklyReport } from "@/services/reportService";

const CANDIDATE_STAGE_STATUS_MAP: Record<string, string[]> = {
  Sourcing: [
    "Pending",
    "Communication Sent",
    "Communication Acknowledged",
    "CV Recieved",
    "Disqualified",
  ],
  Screening: ["AEMS Interview", "Submission Pending", "CV Submitted", "Disqualified"],
  "Client Review": ["pending", "shortlisted", "Disqualified"],
};

interface PageProps {
  params: { id: string };
}

export default function ClientPage({ params }: PageProps) {
  const { id } = params;
  // const [isLoading, setIsLoading] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [jobsAvailable, setJobsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState("Summary");
  const [reportStatus, setReportStatus] = useState<"idle" | "generating" | "completed">("idle");
  const [reportProgress, setReportProgress] = useState(0);
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedJobStages, setSelectedJobStages] = useState<string[]>([]);
  const [selectedCandidateStages, setSelectedCandidateStages] = useState<string[]>([]);
  const [selectedCandidateStageStatuses, setSelectedCandidateStageStatuses] = useState<
    Record<string, string[]>
  >({});
  const downloadUrlRef = useRef<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  let finalPermissions =
    user?.permissions && user.permissions.length > 0
      ? user.permissions
      : user?.defaultPermissions || [];
  if (!isAdmin && !finalPermissions.includes("TODAY_TASKS")) {
    finalPermissions = [...finalPermissions, "TODAY_TASKS"];
  }
  const canViewClients =
    isAdmin || finalPermissions.includes("CLIENTS_VIEW") || finalPermissions.includes("CLIENTS");
  const canModifyClients = isAdmin || finalPermissions.includes("CLIENTS_MODIFY");
  const canDeleteClients = isAdmin || finalPermissions.includes("CLIENTS_DELETE");
  const canModifyJobs = isAdmin || finalPermissions.includes("JOBS_MODIFY");

  const {
    data: client,
    isLoading,
    isError,
    refetch,
  } = useQuery({
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

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current);
        downloadUrlRef.current = null;
      }
    };
  }, []);

  const handleGenerateReportClick = () => {
    setIsReportDialogOpen(true);
  };

  const handleDownloadReport = () => {
    const url = downloadUrlRef.current;
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    const fallbackName = `weekly-report-${client?.name || "client"}-${new Date().toISOString().split("T")[0]
      }.xlsx`;
    link.download = downloadFilename || fallbackName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    downloadUrlRef.current = null;

    // Reset to idle state after download
    setReportStatus("idle");
    setReportProgress(0);
    setDownloadFilename(null);
  };

  const handleConfirmGenerate = async () => {
    // Close the dialog
    setIsReportDialogOpen(false);

    // Capture button width before changing state
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    // Revoke previous URL if any
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }

    setReportStatus("generating");
    setReportProgress(0);

    // Start simulated progress to 90% in case server doesn't send content-length
    progressIntervalRef.current = setInterval(() => {
      setReportProgress((prev) => {
        const next = Math.min(prev + 1, 90);
        return next;
      });
    }, 150);

    try {
      const result = await generateWeeklyReport({
        clientId: id,
        jobStages: selectedJobStages,
        candidateStages: selectedCandidateStages,
        candidateStageStatuses: selectedCandidateStageStatuses,
        onProgress: (percent: number) => {
          if (percent > 0) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setReportProgress(percent);
          }
        },
      });

      // Completed
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setReportProgress(100);
      const objectUrl = URL.createObjectURL(result.blob);
      downloadUrlRef.current = objectUrl;
      setDownloadFilename(result.filename);
      setReportStatus("completed");
    } catch (error) {
      console.error("Failed to generate weekly report:", error);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setReportStatus("idle");
      setReportProgress(0);
    }
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
        <div className="text-center text-muted-foreground">
          You do not have permission to view this client.
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
              {client.industry && <span>{client.industry}</span>}
              {client.industry && (client.address || client.location) && <span>•</span>}
              {(client.address || client.location) && (
                <span>{client.address || client.location}</span>
              )}
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

          {jobsAvailable &&
            (reportStatus === "idle" ? (
              <Button
                ref={buttonRef}
                size="sm"
                className="w-50"
                onClick={handleGenerateReportClick}
              >
                <FileText className="h-4 w-4" />
                Generate Weekly Report
              </Button>
            ) : reportStatus === "generating" ? (
              <div
                className="relative h-8 rounded-md bg-gray-200 overflow-hidden inline-flex items-center justify-center px-3"
                style={{ width: buttonWidth ? `${buttonWidth}px` : "auto", maxWidth: "200px" }}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-100 ease-linear"
                  style={{ width: `${reportProgress}%` }}
                />
                <div className="relative z-10 flex items-center gap-2 text-xs font-medium text-gray-700 whitespace-nowrap">
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating...
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-50 bg-green-600 hover:bg-green-700"
                onClick={handleDownloadReport}
              >
                <Download className="h-4 w-4" />
                Download Weekly Report
              </Button>
            ))}
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
          <JobsContent clientId={id} clientName={client.name} setJobsAvailable={setJobsAvailable} />
        </TabsContent>

        <TabsContent value="Summary" className="p-4">
          <SummaryContent
            clientId={id}
            clientData={client}
            onTabSwitch={handleTabSwitch}
            canModify={canModifyClients}
          />
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
          <HistoryContent clientId={id} />
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

      {/* Generate Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[700px] h-[400px] grid-rows-[auto,1fr,auto] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Generate Weekly Report</DialogTitle>
            <DialogDescription>
              Choose stages to include in the report for this client.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 overflow-y-auto pr-2">
            <div className="flex gap-20 items-start">
              <div className="grid gap-3">
                <Label>Job Stages</Label>
                <div className="grid gap-2">
                  {["Open", "Active", "Onboarding", "Hired", "On Hold", "Closed"].map((stage) => {
                    const checked = selectedJobStages.includes(stage);
                    return (
                      <label key={stage} className="flex items-center gap-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const isChecked = Boolean(v);
                            setSelectedJobStages((prev) =>
                              isChecked ? [...prev, stage] : prev.filter((s) => s !== stage),
                            );
                          }}
                        />
                        <span className="text-sm">{stage}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3">
                <Label>Candidate Stages</Label>
                <div className="grid gap-2">
                  {[
                    "Sourcing",
                    "Screening",
                    "Client Review",
                    "Interview",
                    "Verification",
                    "Onboarding",
                    "Hired",
                  ].map((stage) => {
                    const checked = selectedCandidateStages.includes(stage);
                    return (
                      <label key={stage} className="flex items-center gap-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const isChecked = Boolean(v);
                            setSelectedCandidateStages((prev) =>
                              isChecked ? [...prev, stage] : prev.filter((s) => s !== stage),
                            );
                            if (CANDIDATE_STAGE_STATUS_MAP[stage]) {
                              setSelectedCandidateStageStatuses((prev) => {
                                const next = { ...prev };
                                if (isChecked) {
                                  next[stage] = [...CANDIDATE_STAGE_STATUS_MAP[stage]];
                                } else {
                                  delete next[stage];
                                }
                                return next;
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{stage}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Candidate Statuses for selected stages */}
            {selectedCandidateStages
              .filter((stage) => Boolean(CANDIDATE_STAGE_STATUS_MAP[stage]))
              .map((stage) => {
                const allStatuses = CANDIDATE_STAGE_STATUS_MAP[stage] || [];
                const selectedForStage = selectedCandidateStageStatuses[stage] || allStatuses;
                return (
                  <div key={`${stage}-statuses`} className="grid gap-3">
                    <Label>{stage} Statuses</Label>
                    <div className="grid gap-2">
                      {allStatuses.map((status) => {
                        const statusChecked = selectedForStage.includes(status);
                        return (
                          <label key={`${stage}-${status}`} className="flex items-center gap-2">
                            <Checkbox
                              checked={statusChecked}
                              onCheckedChange={(v) => {
                                const isChecked = Boolean(v);
                                setSelectedCandidateStageStatuses((prev) => {
                                  const prevForStage = prev[stage] ?? [];
                                  const nextForStage = isChecked
                                    ? Array.from(new Set([...prevForStage, status]))
                                    : prevForStage.filter((s) => s !== status);
                                  return { ...prev, [stage]: nextForStage };
                                });
                              }}
                            />
                            <span className="text-sm">{status}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmGenerate}
              disabled={selectedJobStages.length === 0 && selectedCandidateStages.length === 0}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

