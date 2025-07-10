"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  SlidersHorizontal,
  RefreshCcw,
  FileText,
  StickyNote,
  Paperclip,
  Users,
  Clock,
  FileIcon,
  MessageSquare,
  X,
  LayoutGrid,
  List,
  MoreVertical,
} from "lucide-react";
import { useRouter, notFound } from "next/navigation";
import { Job, JobStage } from "@/types/job";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateJobModal } from "@/components/jobs/create-job-modal";

interface PageProps {
  params: { id: string };
}

interface FilterState {
  jobStage: Job["stage"] | "";
  location: string;
  minSalary: string;
  maxSalary: string;
}

const jobStages: JobStage[] = [
  "New",
  "Sourcing",
  "Screening",
  "Interviewing",
  "Shortlisted",
  "Offer",
  "Hired",
  "On Hold",
  "Cancelled",
];

const stageColors: Record<JobStage, string> = {
  New: "bg-blue-100 text-blue-800",
  Sourcing: "bg-purple-100 text-purple-800",
  Screening: "bg-yellow-100 text-yellow-800",
  Interviewing: "bg-orange-100 text-orange-800",
  Shortlisted: "bg-green-100 text-green-800",
  Offer: "bg-pink-100 text-pink-800",
  Hired: "bg-green-200 text-green-900",
  "On Hold": "bg-gray-200 text-gray-800",
  Cancelled: "bg-red-100 text-red-800",
};

function ConfirmStageChangeDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Stage Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to update the job stage? This action will be saved immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function ClientPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    jobStage: "",
    location: "",
    minSalary: "",
    maxSalary: "",
  });
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientJobs, setClientJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Summary");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{
    jobId: string;
    newStage: JobStage;
  } | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://aems-backend.onrender.com/api/clients/${id}`);
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

    fetchClientData();
  }, [id]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://aems-backend.onrender.com/api/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const responseData = await response.json();
        const jobs = responseData.data;
        setClientJobs(jobs.filter((job: any) => job.client === id));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [id]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Refetch client data and jobs
      const clientResponse = await fetch(`https://aems-backend.onrender.com/api/clients/${id}`);
      const jobsResponse = await fetch("https://aems-backend.onrender.com/api/jobs");

      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        setClient(clientData.data);
      }

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setClientJobs(jobsData.data.filter((job: any) => job.client === id));
      }

      // Reset filters
      setFilters({ jobStage: "", location: "", minSalary: "", maxSalary: "" });
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageChange = (jobId: string, newStage: JobStage) => {
    setPendingStageChange({ jobId, newStage });
    setConfirmOpen(true);
  };

  const confirmStageChange = async () => {
    if (!pendingStageChange) return;

    const { jobId, newStage } = pendingStageChange;

    try {
      // Update local state immediately for better UX
      setClientJobs((prev) =>
        prev.map((job) => (job._id === jobId ? { ...job, stage: newStage } : job)),
      );

      // Make API call to update the stage
      const response = await fetch(`https://aems-backend.onrender.com/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job stage");
      }
    } catch (error) {
      console.error("Error updating job stage:", error);
      // Revert the local state if the API call fails
      setClientJobs((prev) =>
        prev.map((job) => (job._id === jobId ? { ...job, stage: job.stage } : job)),
      );
    } finally {
      setPendingStageChange(null);
      setConfirmOpen(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading || !client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  const filteredJobs = clientJobs.filter((job) => {
    const matchesStage = !filters.jobStage || job.stage === filters.jobStage;
    const matchesLocation =
      !filters.location ||
      (job.location && job.location.toLowerCase().includes(filters.location.toLowerCase()));
    const minSalary = filters.minSalary ? parseFloat(filters.minSalary) : null;
    const maxSalary = filters.maxSalary ? parseFloat(filters.maxSalary) : null;
    const matchesMinSalary =
      minSalary === null || (job.minimumSalary && Number(job.minimumSalary) >= minSalary);
    const matchesMaxSalary =
      maxSalary === null || (job.maximumSalary && Number(job.maximumSalary) <= maxSalary);
    return matchesStage && matchesLocation && matchesMinSalary && matchesMaxSalary;
  });

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
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
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
          <div className="border-b py-2 px-4">
            <div className="flex items-center">
              <Checkbox id="selectAll" className="mr-4 border-gray-400" />
              <div className="grid grid-cols-7 w-full text-sm font-medium text-gray-500">
                <div>Position Name</div>
                <div>Client</div>
                <div>Location</div>
                <div>Headcount</div>
                <div>Stage</div>
                <div>Minimum Salary</div>
                <div>Maximum Salary</div>
              </div>
            </div>
          </div>
          <div className="overflow-auto">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job._id} className="border-b hover:bg-gray-50 py-3 px-4">
                  <div className="flex items-center">
                    <Checkbox id={`job-${job._id}`} className="mr-4 border-gray-400" />
                    <div className="grid grid-cols-7 w-full">
                      <div className="font-medium">{job.jobTitle}</div>
                      <div>{client.name}</div>
                      <div>{job.location}</div>
                      <div>{job.headcount}</div>
                      <div>
                        <Badge
                          className={`${stageColors[job.stage as JobStage]} cursor-pointer`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStageChange(job._id, job.stage);
                          }}
                        >
                          {job.stage}
                        </Badge>
                      </div>
                      <div>{job.minimumSalary}</div>
                      <div>{job.maximumSalary}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No jobs found. Create a new job requirement.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="Summary" className="p-4">
          <SummaryContent clientId={id} />
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
          <ContactsContent clientId={id} />
        </TabsContent>

        <TabsContent value="History" className="p-4">
          <HistoryContent clientId={id} />
        </TabsContent>
      </Tabs>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Jobs</DialogTitle>
          </DialogHeader>
          <form>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Job Stage</Label>
                <Select
                  value={filters.jobStage}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, jobStage: value as Job["stage"] }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select job stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Stages</SelectItem>
                    {jobStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        <Badge className={stageColors[stage]}>{stage}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Filter by location"
                  value={filters.location}
                  onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Salary</Label>
                  <Input
                    type="number"
                    placeholder="Minimum"
                    value={filters.minSalary}
                    onChange={(e) => setFilters((prev) => ({ ...prev, minSalary: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Salary</Label>
                  <Input
                    type="number"
                    placeholder="Maximum"
                    value={filters.maxSalary}
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxSalary: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFilters({ jobStage: "", location: "", minSalary: "", maxSalary: "" })
                }
              >
                Reset
              </Button>
              <Button type="button" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Job Modal */}
      <CreateJobModal
        open={isCreateJobOpen}
        onOpenChange={setIsCreateJobOpen}
        clientId={id}
        clientName={client.name}
        onJobCreated={handleRefresh}
      />

      <ConfirmStageChangeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmStageChange}
      />
    </div>
  );
}
