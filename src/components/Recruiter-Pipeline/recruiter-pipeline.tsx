"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { KPISection } from "./kpi-section";
import { CreatePipelineDialog } from "./create-pipeline-dialog";
import { PipelineJobCard } from "./pipeline-job-card";
import { type Job, mapUIStageToBackendStage } from "./dummy-data";
import { convertPipelineListDataToJob, convertPipelineDataToJob } from "./utils/convert";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPipelineEntries, getPipelineEntry, updateCandidateStage as updateCandidateStageAPI, type PipelineListItem } from "@/services/recruitmentPipelineService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Local conversion utilities removed in favor of utils/convert

export function RecruiterPipeline() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  // Transient highlight to indicate which pipeline was updated
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);
  const [overallCandidateSummary, setOverallCandidateSummary] = useState<{
    totalCandidates: number;
    byStatus: { [key: string]: number };
  } | null>(null);

  // React Query: load pipeline jobs list
  const { data: listResponse, isLoading: listLoading, error: listError, refetch: refetchPipelines } = useQuery({
    queryKey: ["pipelineEntries", user?._id],
    queryFn: async () => await getAllPipelineEntries(),
    enabled: !!user,
  });

  useEffect(() => {
    if (!listResponse) return;
    if (!listResponse.success || !listResponse.data) {
      if ((listError as any)?.message) {
        toast.error(`Failed to load pipeline jobs: ${(listError as any).message}`);
      }
      return;
    }
    // Capture which jobs are currently expanded before we overwrite jobs state
    const previouslyExpandedIds = jobs.filter((j) => j.isExpanded).map((j) => j.id);
    const convertedJobs = listResponse.data.pipelines.map((pipeline: PipelineListItem) =>
      convertPipelineListDataToJob(pipeline, false),
    );
    const overallSummary = {
      totalCandidates: listResponse.data.pipelines.reduce(
        (total: number, pipeline: any) => total + (pipeline.totalCandidates || 0),
        0,
      ),
      byStatus: {} as { [key: string]: number },
    };
    // Merge with previous jobs to preserve expansion state across refetches
    setJobs((prev) => {
      return convertedJobs.map((job) => {
        const prevMatch = prev.find((p) => p.id === job.id);
        return prevMatch ? { ...job, isExpanded: prevMatch.isExpanded ?? job.isExpanded } : job;
      });
    });
    setOverallCandidateSummary(overallSummary);

    // After merging list data, re-fetch details for all previously expanded jobs
    previouslyExpandedIds.forEach((id) => {
      loadEntryMutation.mutate(id);
    });
  }, [listResponse, listError]);

  const loadEntryMutation = useMutation({
    mutationFn: async (pipelineId: string) => await getPipelineEntry(pipelineId),
    onMutate: (pipelineId: string) => {
      setLoadingJobId(pipelineId);
    },
    onSuccess: (response, pipelineId) => {
      if (response.success && response.data) {
        const detailedJob: Job = convertPipelineDataToJob(response.data, true);
        setJobs((prevJobs) => {
          const idx = prevJobs.findIndex((j) => j.id === pipelineId);
          if (idx !== -1) {
            const updated = [...prevJobs];
            // Preserve previous expansion state so the card doesn't collapse after refetch
            const wasExpanded = prevJobs[idx]?.isExpanded ?? false;
            updated[idx] = { ...detailedJob, isExpanded: wasExpanded } as Job;
            return updated;
          }
          return prevJobs;
        });
      }
    },
    onError: (error: any) => {
      console.error("Error loading pipeline entry details:", error);
      toast.error("Failed to load pipeline entry details");
    },
    onSettled: () => setLoadingJobId(null),
  });

  // Calculate KPI data from jobs and overall summary
  const calculateKPIData = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.jobId?.stage && job.jobId.stage.toLowerCase() !== "closed").length;
    const inactiveJobs = jobs.filter(job => job.jobId?.stage && job.jobId.stage.toLowerCase() === "closed").length;
    
    // Use overall candidate summary if available, otherwise calculate from jobs
    let appliedCandidates = 0;
    let hiredCandidates = 0;
    let disqualifiedCandidates = 0;
    
    if (overallCandidateSummary) {
      // Use API-provided overall summary
      appliedCandidates = overallCandidateSummary.totalCandidates;
      hiredCandidates = overallCandidateSummary.byStatus["Hired"] || 0;
      disqualifiedCandidates = overallCandidateSummary.byStatus["Disqualified"] || 0;
    } else {
      // Fallback to calculating from individual jobs
      appliedCandidates = jobs.reduce((total, job) => total + (job.totalCandidates || 0), 0);
      
      jobs.forEach(job => {
        if (job.candidates && job.candidates.length > 0) {
          hiredCandidates += job.candidates.filter(c => c.currentStage === "Hired").length;
          disqualifiedCandidates += job.candidates.filter(c => c.currentStage === "Disqualified").length;
        }
      });
    }

    return {
      totalJobs,
      activeJobs,
      inactiveJobs,
      appliedCandidates,
      hiredCandidates,
      disqualifiedCandidates
    };
  };

  // Filter and sort jobs
  const getFilteredAndSortedJobs = () => {
    let filteredJobs = [...jobs];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredJobs = filteredJobs.filter(job => {
        // Search in job title
        if (job.title.toLowerCase().includes(searchLower)) return true;
        
        // Search in client name
        if (job.clientName.toLowerCase().includes(searchLower)) return true;
        
        // Search in candidate names
        if (job.candidates.some(candidate => 
          candidate.name.toLowerCase().includes(searchLower)
        )) return true;
        
        // Search in notes
        if (job.notes?.toLowerCase().includes(searchLower)) return true;
        
        return false;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filteredJobs = filteredJobs.filter(job => {
        switch (statusFilter) {
          case "active":
            return job.jobId?.stage && job.jobId.stage.toLowerCase() !== "closed";
          case "completed":
            return job.jobId?.stage && job.jobId.stage.toLowerCase() === "closed";
          case "paused":
            return job.jobId?.stage && (
              job.jobId.stage.toLowerCase().includes("hold") || 
              job.jobId.stage.toLowerCase().includes("pause") ||
              job.jobId.stage.toLowerCase().includes("suspended")
            );
          default:
            return true;
        }
      });
    }

    // Sort jobs
    filteredJobs.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "candidates":
          return (b.totalCandidates || 0) - (a.totalCandidates || 0);
        case "client":
          return a.clientName.localeCompare(b.clientName);
        case "date":
        default:
          // Assuming jobs are already sorted by creation date (newest first)
          return 0;
      }
    });

    return filteredJobs;
  };

  const toggleJobExpansion = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (!job.isExpanded && job.candidates.length === 0) {
      // Load detailed data when expanding for the first time using React Query mutation
      loadEntryMutation.mutate(jobId);
    } else {
      // Simply toggle the expansion state
      setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, isExpanded: !job.isExpanded } : job)));
    }
  };

  const updateCandidateStage = async (
    jobId: string,
    candidateId: string,
    newStage: string,
    extras?: { interviewDate?: string; interviewMeetingLink?: string }
  ) => {
    // Track previous stage for rollback on error
    let previousStage: string | undefined;
    try {
      // Optimistically update the UI first using functional update to avoid stale state
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.id === jobId) {
            return {
              ...job,
              candidates: job.candidates.map((candidate) => {
                if (candidate.id === candidateId) {
                  previousStage = candidate.currentStage;
                  return { ...candidate, currentStage: newStage };
                }
                return candidate;
              }),
            };
          }
          return job;
        }),
      );

      // Make API call to update the candidate stage
      const backendStage = mapUIStageToBackendStage(newStage);
      const requestBody = {
        newStage: backendStage,
        notes: `Stage changed to ${newStage}`,
        interviewDate: extras?.interviewDate,
        interviewMeetingLink: extras?.interviewMeetingLink,
      };
      console.log('updateCandidateStageAPI request body:', requestBody);
      const response = await updateCandidateStageAPI(jobId, candidateId, requestBody);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update candidate stage');
      }

      // Invalidate and refetch relevant queries so UI reflects server state
      await queryClient.invalidateQueries({ queryKey: ["pipelineEntries", user?._id] });
      // If this job is expanded or shown, refresh its detailed data as well
      await loadEntryMutation.mutateAsync(jobId);

      toast.success(`Successfully moved candidate to ${newStage} stage`);
      // Highlight the updated pipeline card and clear highlight after a short delay
      setHighlightedJobId(jobId);
      setTimeout(() => setHighlightedJobId((current) => (current === jobId ? null : current)), 2500);
      // Ensure the updated job remains expanded and visible
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isExpanded: true } : j)));
    } catch (error: any) {
      console.error('Error updating candidate stage:', error);
      
      // Revert the optimistic update on error
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.id === jobId) {
            return {
              ...job,
              candidates: job.candidates.map((candidate) =>
                candidate.id === candidateId
                  ? { ...candidate, currentStage: previousStage || candidate.currentStage }
                  : candidate,
              ),
            };
          }
          return job;
        }),
      );
      
      toast.error(error.message || 'Failed to update candidate stage');
    }
  };

  const handleCandidateUpdate = async (jobId: string, updatedCandidate: any) => {
    try {
      // Only refresh the specific job data instead of all pipeline jobs
      // This prevents the entire page from refreshing
      await loadEntryMutation.mutateAsync(jobId);
      await queryClient.invalidateQueries({ queryKey: ["pipelineEntries", user?._id] });
      toast.success("Candidate updated successfully");
      // Highlight the updated pipeline card and clear highlight after a short delay
      setHighlightedJobId(jobId);
      setTimeout(() => setHighlightedJobId((current) => (current === jobId ? null : current)), 2500);
      // Ensure the updated job remains expanded and visible
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isExpanded: true } : j)));
    } catch (error: any) {
      console.error('Error refreshing job data after candidate update:', error);
      toast.error("Failed to refresh candidate data");
    }
  };

  const handlePipelineCreated = async (jobIds: string[], jobData?: any[]) => {
    if (!jobData || jobData.length === 0) {
      console.log("No job data provided");
      return;
    }

    try {
      // Jobs have already been added to the pipeline via the create pipeline API
      toast.success(`Successfully created pipeline with ${jobData.length} job(s)`);
      console.log("Created pipeline with jobs:", jobData);
      
      // Refresh the pipeline data to show the newly created entries
      await refetchPipelines();
    } catch (error) {
      console.error("Error handling pipeline creation:", error);
      toast.error("Failed to handle pipeline creation");
    }
  };

  const kpiData = calculateKPIData();
  const filteredJobs = getFilteredAndSortedJobs();

  return (
    <div className="space-y-3">
      {/* KPI Section */}
      <KPISection data={kpiData} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreatePipelineDialog 
            trigger={
              <Button className="flex items-center gap-2" disabled={listLoading}>
                <Plus className="h-4 w-4" />
                Add Recruitment
              </Button>
            }
            onPipelineCreated={handlePipelineCreated}
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs, candidates, or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="active">Active Jobs</SelectItem>
              <SelectItem value="completed">Completed Jobs</SelectItem>
              <SelectItem value="paused">Paused Jobs</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Created</SelectItem>
              <SelectItem value="title">Job Title</SelectItem>
              <SelectItem value="candidates">Candidates</SelectItem>
              <SelectItem value="client">Client Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Jobs Section */}
      {listLoading ? (
        <div className="text-center py-8 text-gray-500">
          Loading pipeline jobs...
        </div>
      ) : filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <PipelineJobCard
            key={job.id}
            job={job}
            loadingJobId={loadingJobId}
            isHighlighted={highlightedJobId === job.id}
            onToggleExpansion={toggleJobExpansion}
            onUpdateCandidateStage={updateCandidateStage}
            onCandidateUpdate={handleCandidateUpdate}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No jobs found matching your search criteria" : "No jobs available"}
        </div>
      )}
    </div>
  );
}
