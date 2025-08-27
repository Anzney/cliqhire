"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Users, MapPin, DollarSign, Briefcase, Building2, Tag, Pin, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { KPISection } from "./kpi-section";
import { CreatePipelineDialog } from "./create-pipeline-dialog";
import { 
  dummyJobs, 
  pipelineStages, 
  getStageColor, 
  getCandidateCountByStage,
  type Job,
  type Candidate 
} from "./dummy-data";
import { Button } from "../ui/button";

export function RecruiterPipeline() {
  const [jobs, setJobs] = useState<Job[]>(dummyJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Calculate KPI data from jobs
  const calculateKPIData = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.candidates.some(c => c.currentStage !== "Hired" && c.currentStage !== "Disqualified")).length;
    const appliedCandidates = jobs.reduce((total, job) => total + job.candidates.length, 0);
    const hiredCandidates = jobs.reduce((total, job) => 
      total + job.candidates.filter(c => c.currentStage === "Hired").length, 0
    );
    const disqualifiedCandidates = jobs.reduce((total, job) => 
      total + job.candidates.filter(c => c.currentStage === "Disqualified").length, 0
    );

    return {
      totalJobs,
      activeJobs,
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
        
        return false;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filteredJobs = filteredJobs.filter(job => {
        switch (statusFilter) {
          case "active":
            return job.candidates.some(c => c.currentStage !== "Hired" && c.currentStage !== "Disqualified");
          case "completed":
            return job.candidates.every(c => c.currentStage === "Hired" || c.currentStage === "Disqualified");
          case "paused":
            // You can define your own logic for paused jobs
            return false;
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
          return b.candidates.length - a.candidates.length;
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

  const toggleJobExpansion = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isExpanded: !job.isExpanded } : job
    ));
  };

  const updateCandidateStage = (jobId: string, candidateId: string, newStage: string) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          candidates: job.candidates.map(candidate => 
            candidate.id === candidateId 
              ? { ...candidate, currentStage: newStage }
              : candidate
          )
        };
      }
      return job;
    }));
  };

  const handlePipelineCreated = (jobIds: string[], jobData?: any[]) => {
    if (!jobData || jobData.length === 0) {
      console.log("No job data provided");
      return;
    }

    // Convert API job data to our local format
    const newJobs: Job[] = jobData.map((apiJob, index) => ({
      id: apiJob._id || `new-${Date.now()}-${index}`,
      title: apiJob.jobTitle || "Untitled Job",
      clientName: apiJob.client?.name || apiJob.client || "Unknown Client",
      location: Array.isArray(apiJob.location) ? apiJob.location.join(", ") : apiJob.location || "Location not specified",
      salaryRange: apiJob.minimumSalary && apiJob.maximumSalary 
        ? `${apiJob.minimumSalary} - ${apiJob.maximumSalary}`
        : apiJob.minimumSalary 
        ? `${apiJob.minimumSalary}+`
        : apiJob.maximumSalary 
        ? `Up to ${apiJob.maximumSalary}`
        : "Salary not specified",
      headcount: apiJob.headcount || 1,
      jobType: apiJob.jobType || "Full-time",
      isExpanded: false,
      candidates: [] // Start with empty candidates array
    }));

    // Add new jobs to the existing jobs state
    setJobs(prevJobs => {
      // Filter out any jobs that might already exist (by ID)
      const existingJobIds = new Set(prevJobs.map(job => job.id));
      const uniqueNewJobs = newJobs.filter(job => !existingJobIds.has(job.id));
      
      return [...prevJobs, ...uniqueNewJobs];
    });

    console.log("Added jobs to pipeline:", newJobs);
    
    // You can add a toast notification here if you want
    // toast.success(`Successfully added ${newJobs.length} job(s) to the pipeline`);
  };

  const kpiData = calculateKPIData();
  const filteredJobs = getFilteredAndSortedJobs();

  return (
    <div className="space-y-3">
      {/* KPI Section */}
      <KPISection data={kpiData} />

      <div className="flex items-center justify-between">
        <CreatePipelineDialog 
          trigger={
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Recruitment
            </Button>
          }
          onPipelineCreated={handlePipelineCreated}
        />
        
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
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <Card key={job.id} className="overflow-hidden shadow-sm border-gray-200">
            {/* Job Header - Clickable */}
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleJobExpansion(job.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {job.isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <span className="text-sm text-gray-600">{job.clientName}</span>
                    </div>
                    <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                        <span>{job.salaryRange}</span>
                      </div>
                      <Badge variant="outline" className="bg-gray-100 text-gray-700">
                        {job.jobType}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span>{job.headcount} candidates</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Expanded Content */}
            {job.isExpanded && (
              <CardContent className="pt-0">
                {/* Pipeline Stage Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {pipelineStages.map((stage) => (
                    <Badge 
                      key={stage}
                      variant="outline" 
                      className={`${getStageColor(stage)} border`}
                    >
                      {stage}: {getCandidateCountByStage(job.candidates, stage)}
                    </Badge>
                  ))}
                </div>

                {/* Candidate Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {job.candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className="text-sm bg-gray-200">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {candidate.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Pin className="h-3 w-3 text-red-500" />
                          <span>{candidate.source}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Tag className="h-3 w-3 text-yellow-500" />
                          <span>Stage: {candidate.currentStage}</span>
                        </div>
                        
                        <div className="pt-2">
                          <Select
                            value={candidate.currentStage}
                            onValueChange={(value) => updateCandidateStage(job.id, candidate.id, value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {pipelineStages.map((stage) => (
                                <SelectItem key={stage} value={stage} className="text-xs">
                                  {stage}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No jobs found matching your search criteria" : "No jobs available"}
        </div>
      )}
    </div>
  );
}
