"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { KPISection } from "./kpi-section";
import { PipelineJobCard } from "./pipeline-job-card";
import { type Job } from "./dummy-data";
import { convertPipelineListDataToJob } from "./utils/convert";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPipelineEntries, type PipelineListItem } from "@/services/recruitmentPipelineService";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming we have or will use a simple inline debounce if not available.
// Actually let's just implement inline debounce logic with useState to avoid missing imports
import { useEffect } from "react";

export function RecruiterPipeline() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  let finalPermissions = (user?.permissions && user.permissions.length > 0) ? user.permissions : (user?.defaultPermissions || []);
  if (!isAdmin && !finalPermissions.includes('TODAY_TASKS')) {
    finalPermissions = [...finalPermissions, 'TODAY_TASKS'];
  }
  const canViewPipeline = isAdmin || finalPermissions.includes('RECRUITMENT_PIPELINE_VIEW') || finalPermissions.includes('RECRUITMENT_PIPELINE');

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [highlightedJobId] = useState<string | null>(null);

  // Debounce search term natively
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: listResponse, isLoading: listLoading } = useQuery({
    queryKey: ["pipelineEntries", user?._id, currentPage, pageSize, debouncedSearchTerm],
    queryFn: async () => await getAllPipelineEntries(currentPage, pageSize, debouncedSearchTerm),
    enabled: !!user,
  });

  const { data: allPipelinesResponse } = useQuery({
    queryKey: ["allPipelineEntriesForKPI", user?._id],
    queryFn: async () => await getAllPipelineEntries(1, 1000),
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const calculateKPIData = () => {
    const rawPipelines = allPipelinesResponse?.data?.pipelines || listResponse?.data?.pipelines || [];
    const allJobsList: Job[] = rawPipelines.map((p: any) => convertPipelineListDataToJob(p, false));

    const totalJobs = allPipelinesResponse?.data?.totalPipelines || listResponse?.data?.pagination?.totalPipelines || allJobsList.length;
    const activeJobs = allJobsList.filter(job => job.jobId?.stage && job.jobId.stage.toLowerCase() !== "closed").length;
    const inactiveJobs = allJobsList.filter(job => job.jobId?.stage && job.jobId.stage.toLowerCase() === "closed").length;

    let appliedCandidates = 0;
    let hiredCandidates = 0;
    let disqualifiedCandidates = 0;

    if (rawPipelines.length > 0) {
      appliedCandidates = rawPipelines.reduce((total: number, pipeline: any) => total + (pipeline.totalCandidates || 0), 0);
      hiredCandidates = rawPipelines.reduce((total: number, pipeline: any) => total + (pipeline.completedCandidates || 0), 0);
      disqualifiedCandidates = rawPipelines.reduce((total: number, pipeline: any) => total + (pipeline.droppedCandidates || 0), 0);
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

  const getRenderJobs = () => {
    let sourcePipelines: any[] = [];
    let isClientSearch = false;

    if (debouncedSearchTerm.trim() && allPipelinesResponse?.data?.pipelines) {
      sourcePipelines = allPipelinesResponse.data.pipelines;
      isClientSearch = true;
    } else if (listResponse?.data?.pipelines) {
      sourcePipelines = listResponse.data.pipelines;
    }

    let filteredJobs = sourcePipelines.map((p: any) => convertPipelineListDataToJob(p, false));

    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filteredJobs = filteredJobs.filter((job: Job) => {
        if (job.title.toLowerCase().includes(searchLower)) return true;
        if (job.clientName.toLowerCase().includes(searchLower)) return true;
        if (job.notes?.toLowerCase().includes(searchLower)) return true;
        return false;
      });
    }

    const fullFilteredCount = filteredJobs.length;
    let paginatedJobs = filteredJobs;

    if (isClientSearch) {
      const startIndex = (currentPage - 1) * pageSize;
      paginatedJobs = filteredJobs.slice(startIndex, startIndex + pageSize);
    }

    return {
      renderJobs: paginatedJobs,
      totalItems: fullFilteredCount,
      isClientSearch
    };
  };

  const kpiData = calculateKPIData();
  const { renderJobs, totalItems, isClientSearch } = getRenderJobs();

  const actualTotalPages = isClientSearch ? Math.max(1, Math.ceil(totalItems / pageSize)) : (listResponse?.data?.pagination?.totalPages || 0);
  const actualCurrentPage = isClientSearch ? currentPage : (listResponse?.data?.pagination?.currentPage || 0);
  const hasNextPage = isClientSearch ? currentPage < actualTotalPages : listResponse?.data?.pagination?.hasNextPage;
  const hasPrevPage = isClientSearch ? currentPage > 1 : listResponse?.data?.pagination?.hasPrevPage;

  if (!canViewPipeline) {
    return (
      <div className="text-center py-8 text-gray-500">You do not have permission to view the recruitment pipeline.</div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden space-y-4">
      <div className="flex-none">
        <KPISection data={kpiData} />
      </div>

      <div className="flex-none bg-white rounded-2xl border border-slate-200/60 p-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search jobs, or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-transparent border-transparent hover:border-transparent focus:border-transparent shadow-none transition-colors outline-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar">
        {listLoading ? (
          <div className="text-center py-8 text-slate-500 animate-pulse">
            Loading pipeline jobs...
          </div>
        ) : renderJobs.length > 0 ? (
          <div className="space-y-4">
            {renderJobs.map((job: Job) => (
              <PipelineJobCard
                key={job.id}
                job={job}
                isHighlighted={highlightedJobId === job.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            {searchTerm ? "No jobs found matching your search criteria" : "No jobs available"}
          </div>
        )}
      </div>

      <div className="flex-none bg-slate-50/50 rounded-xl border border-slate-200/60 p-3 mt-auto">
        {actualTotalPages > 1 ? (
          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-slate-500 font-medium tracking-tight">
              Showing page <span className="text-slate-900 font-semibold">{actualCurrentPage}</span> of {actualTotalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!hasPrevPage}
                className="rounded-lg shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(actualTotalPages, prev + 1))}
                disabled={!hasNextPage}
                className="rounded-lg shadow-sm"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500 font-medium px-2 py-1 tracking-tight">
            Showing all <span className="text-slate-900 font-semibold">{totalItems}</span> result(s)
          </div>
        )}
      </div>
    </div>
  );
}
