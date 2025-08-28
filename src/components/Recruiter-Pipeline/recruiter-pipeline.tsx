"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Users, MapPin, DollarSign, Briefcase, Building2, Tag, Pin, Plus, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { KPISection } from "./kpi-section";
import { CreatePipelineDialog } from "./create-pipeline-dialog";
import { 
  pipelineStages, 
  getStageColor, 
  getCandidateCountByStage,
  type Job,
  type Candidate 
} from "./dummy-data";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPipelineEntries, getPipelineEntry } from "@/services/recruitmentPipelineService";

export function RecruiterPipeline() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(false);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  // Load pipeline jobs on component mount or when user changes
  useEffect(() => {
    if (user) {
      loadPipelineJobs();
    }
  }, [user]);

  const loadPipelineJobs = async () => {
    try {
      setLoading(true);
      const response = await (getAllPipelineEntries as any)();
      console.log("API Response:", response);
      
      if (response.success && response.data && response.data.pipelines) {
        console.log("Pipeline data found:", response.data.pipelines.length, "pipelines");
        
        // Convert all pipeline entries to Job format
        const pipelineJobs: Job[] = response.data.pipelines.map((pipelineData: any) => ({
          id: pipelineData.pipelineInfo._id,
          title: pipelineData.jobDetails.jobTitle || "Untitled Job",
          clientName: pipelineData.clientInfo.name || "Unknown Client",
          location: pipelineData.jobDetails.location || "Location not specified",
          salaryRange: pipelineData.jobDetails.salaryRange ? 
            (typeof pipelineData.jobDetails.salaryRange === 'object' && pipelineData.jobDetails.salaryRange !== null ? 
              `${(pipelineData.jobDetails.salaryRange as any).min || 0} - ${(pipelineData.jobDetails.salaryRange as any).max || 0} ${(pipelineData.jobDetails.salaryRange as any).currency || ''}` : 
              String(pipelineData.jobDetails.salaryRange)) : 
            "Salary not specified",
          headcount: pipelineData.jobDetails.headcount || 1,
          jobType: pipelineData.jobDetails.jobType || "Full-time",
          isExpanded: false,
          candidates: pipelineData.candidates.map((candidate: any) => ({
              id: candidate._id,
              name: candidate.name,
              source: candidate.referredBy || "Pipeline",
              currentStage: candidate.status || "Sourcing",
              avatar: undefined,
              experience: candidate.experience,
              currentSalary: candidate.currentSalary,
              currentSalaryCurrency: candidate.currentSalaryCurrency,
              expectedSalary: candidate.expectedSalary,
              expectedSalaryCurrency: candidate.expectedSalaryCurrency,
              currentJobTitle: candidate.currentJobTitle,
              previousCompanyName: candidate.previousCompanyName
            })),
          // Pipeline-specific data
          pipelineStatus: pipelineData.pipelineInfo.status,
          priority: pipelineData.pipelineInfo.priority,
          notes: pipelineData.pipelineInfo.notes,
          assignedDate: pipelineData.pipelineInfo.assignedDate,
          candidateSummary: pipelineData.candidateSummary,
          // Job details from API
          jobPosition: Array.isArray(pipelineData.jobDetails.jobPosition) ? 
            pipelineData.jobDetails.jobPosition.join(", ") : 
            pipelineData.jobDetails.jobPosition,
          department: pipelineData.jobDetails.department,
          experience: pipelineData.jobDetails.experience,
          education: Array.isArray(pipelineData.jobDetails.education) ? 
            pipelineData.jobDetails.education.join(", ") : 
            pipelineData.jobDetails.education,
          specialization: Array.isArray(pipelineData.jobDetails.specialization) ? 
            pipelineData.jobDetails.specialization.join(", ") : 
            pipelineData.jobDetails.specialization,
          teamSize: pipelineData.jobDetails.teamSize,
          numberOfPositions: pipelineData.jobDetails.numberOfPositions,
          workVisa: pipelineData.jobDetails.workVisa ? 
            (typeof pipelineData.jobDetails.workVisa === 'object' ? 
              !!pipelineData.jobDetails.workVisa : 
              !!pipelineData.jobDetails.workVisa) : 
            false,
          gender: pipelineData.jobDetails.gender,
          deadlineByClient: pipelineData.jobDetails.deadlineByClient || undefined,
          keySkills: Array.isArray(pipelineData.jobDetails.specialization) ? 
            pipelineData.jobDetails.specialization : 
            [],
          certifications: Array.isArray(pipelineData.jobDetails.certifications) ? 
            pipelineData.jobDetails.certifications : 
            [],
          otherBenefits: Array.isArray(pipelineData.jobDetails.otherBenefits) ? 
            pipelineData.jobDetails.otherBenefits.join(", ") : 
            pipelineData.jobDetails.otherBenefits,
          jobDescription: pipelineData.jobDetails.jobDescription,
          // Client information from API
          clientIndustry: pipelineData.clientInfo.industry,
          clientLocation: pipelineData.clientInfo.location,
          clientStage: pipelineData.clientInfo.clientStage,
          clientCountry: pipelineData.clientInfo.countryOfBusiness,
          clientWebsite: pipelineData.clientInfo.website,
          clientPhone: pipelineData.clientInfo.phoneNumber,
          clientEmails: pipelineData.clientInfo.emails
        }));
        
        console.log("Converted pipeline jobs:", pipelineJobs);
        setJobs(pipelineJobs);
      } else {
        console.log("No pipeline data found in response");
      }
    } catch (error: any) {
      console.error("Error loading pipeline jobs:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        toast.error("Pipeline endpoint not found. Please ensure the backend API is running and the endpoint exists.");
      } else if (error.response?.status === 404) {
        toast.error("Pipeline API endpoint not found. Check if the backend route exists.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please check the backend logs.");
      } else {
        toast.error(`Failed to load pipeline jobs: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPipelineEntryDetails = async (pipelineId: string) => {
    try {
      setLoadingJobId(pipelineId);
      console.log(`Calling getPipelineEntry API for pipeline ID: ${pipelineId}`);
      const response = await getPipelineEntry(pipelineId);
      if (response.success && response.data) {
        const pipelineData = response.data;
        
        // Convert to local format for detailed view
        const detailedJob: Job = {
          id: pipelineData.pipelineInfo._id,
          title: pipelineData.jobDetails.jobTitle || "Untitled Job",
          clientName: pipelineData.clientInfo.name || "Unknown Client",
          location: pipelineData.jobDetails.location || "Location not specified",
          salaryRange: pipelineData.jobDetails.salaryRange || "Salary not specified",
          headcount: pipelineData.jobDetails.headcount || 1,
          jobType: pipelineData.jobDetails.jobType || "Full-time",
          isExpanded: true, // Show expanded by default for detailed view
                      candidates: pipelineData.candidates.map((candidate: any) => ({
              id: candidate._id,
              name: candidate.name,
              source: candidate.referredBy || "Pipeline",
              currentStage: candidate.status || "Sourcing",
              avatar: undefined,
              experience: candidate.experience,
              currentSalary: candidate.currentSalary,
              currentSalaryCurrency: candidate.currentSalaryCurrency,
              expectedSalary: candidate.expectedSalary,
              expectedSalaryCurrency: candidate.expectedSalaryCurrency,
              currentJobTitle: candidate.currentJobTitle,
              previousCompanyName: candidate.previousCompanyName
            })),
          // Pipeline-specific data from the detailed API
          pipelineStatus: pipelineData.pipelineInfo.status,
          priority: pipelineData.pipelineInfo.priority,
          notes: pipelineData.pipelineInfo.notes,
          assignedDate: pipelineData.pipelineInfo.assignedDate,
          candidateSummary: pipelineData.candidateSummary,
          // Job details from API
          jobPosition: pipelineData.jobDetails.jobPosition,
          department: pipelineData.jobDetails.department,
          experience: pipelineData.jobDetails.experience,
          education: pipelineData.jobDetails.education,
          specialization: pipelineData.jobDetails.specialization,
          teamSize: pipelineData.jobDetails.teamSize,
          numberOfPositions: pipelineData.jobDetails.numberOfPositions,
          workVisa: pipelineData.jobDetails.workVisa,
          gender: pipelineData.jobDetails.gender,
          deadlineByClient: pipelineData.jobDetails.deadlineByClient || undefined,
          keySkills: pipelineData.jobDetails.keySkills,
          certifications: pipelineData.jobDetails.certifications,
          otherBenefits: pipelineData.jobDetails.otherBenefits,
          jobDescription: pipelineData.jobDetails.jobDescription,
          // Client information from API
          clientIndustry: pipelineData.clientInfo.industry,
          clientLocation: pipelineData.clientInfo.location,
          clientStage: pipelineData.clientInfo.clientStage,
          clientCountry: pipelineData.clientInfo.countryOfBusiness,
          clientWebsite: pipelineData.clientInfo.website,
          clientPhone: pipelineData.clientInfo.phoneNumber,
          clientEmails: pipelineData.clientInfo.emails
        };
        
        // Update the specific job in the jobs array
        setJobs(prevJobs => {
          const jobIndex = prevJobs.findIndex(job => job.id === pipelineId);
          if (jobIndex !== -1) {
            const updatedJobs = [...prevJobs];
            updatedJobs[jobIndex] = detailedJob;
            return updatedJobs;
          }
          return prevJobs;
        });
        
        return detailedJob;
      }
    } catch (error) {
      console.error("Error loading pipeline entry details:", error);
      toast.error("Failed to load pipeline entry details");
    } finally {
      setLoadingJobId(null);
    }
  };

  // Calculate KPI data from jobs
  const calculateKPIData = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.pipelineStatus === "Open" || job.pipelineStatus === "Active").length;
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
            return job.pipelineStatus === "Open" || job.pipelineStatus === "Active";
          case "completed":
            return job.pipelineStatus === "Closed" || job.pipelineStatus === "Completed";
          case "paused":
            return job.pipelineStatus === "On Hold" || job.pipelineStatus === "Paused";
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

  const toggleJobExpansion = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    if (!job.isExpanded) {
      // Load detailed information when expanding
      console.log(`Loading pipeline entry details for job ID: ${jobId}`);
      await loadPipelineEntryDetails(jobId);
    } else {
      // Just toggle expansion state when collapsing
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, isExpanded: !job.isExpanded } : job
      ));
    }
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

  const handlePipelineCreated = async (jobIds: string[], jobData?: any[]) => {
    if (!jobData || jobData.length === 0) {
      console.log("No job data provided");
      return;
    }

    try {
      setLoading(true);
      
      // Jobs have already been added to the pipeline via the create pipeline API
      toast.success(`Successfully created pipeline with ${jobData.length} job(s)`);
      console.log("Created pipeline with jobs:", jobData);
      
      // Refresh the pipeline data to show the newly created entries
      await loadPipelineJobs();
    } catch (error) {
      console.error("Error handling pipeline creation:", error);
      toast.error("Failed to handle pipeline creation");
    } finally {
      setLoading(false);
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
              <Button className="flex items-center gap-2" disabled={loading}>
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
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading pipeline jobs...
        </div>
      ) : filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <Card key={job.id} className="overflow-hidden shadow-sm border-gray-200">
            {/* Job Header - Clickable */}
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleJobExpansion(job.id)}
            >
              {loadingJobId === job.id && (
                <div className="absolute top-2 right-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              )}
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
                        <span>{typeof job.salaryRange === 'string' ? job.salaryRange : String(job.salaryRange || '')}</span>
                      </div>
                      <Badge variant="outline" className="bg-gray-100 text-gray-700">
                        {job.jobType}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span>{job.candidates.length} candidates</span>
                      </div>
                      {job.pipelineStatus && (
                        <Badge 
                          variant="outline" 
                          className={`${
                            job.pipelineStatus === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                            job.pipelineStatus === 'On Hold' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {job.pipelineStatus}
                        </Badge>
                      )}
                      {job.priority && (
                        <Badge 
                          variant="outline" 
                          className={`${
                            job.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                            job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-green-100 text-green-700 border-green-200'
                          }`}
                        >
                          {job.priority}
                        </Badge>
                      )}
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
                  {pipelineStages.map((stage) => {
                    const count = job.candidates.filter(c => c.currentStage === stage).length;
                    return (
                      <Badge 
                        key={stage}
                        variant="outline" 
                        className={`${getStageColor(stage)} border`}
                      >
                        {stage}: {count}
                      </Badge>
                    );
                  })}
                </div>
                
                {/* API Status Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.candidateSummary && Object.entries(job.candidateSummary.byStatus || {}).map(([status, count]) => (
                    <Badge 
                      key={status}
                      variant="outline" 
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {status}: {count}
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
                          <span>Status: {candidate.currentStage}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Briefcase className="h-3 w-3 text-green-500" />
                          <span>{candidate.experience || "Experience not specified"}</span>
                        </div>
                        
                        {candidate.currentSalary && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <DollarSign className="h-3 w-3 text-yellow-500" />
                            <span>Current: {candidate.currentSalary} {candidate.currentSalaryCurrency}</span>
                          </div>
                        )}
                        
                        {candidate.expectedSalary && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <DollarSign className="h-3 w-3 text-yellow-500" />
                            <span>Expected: {candidate.expectedSalary} {candidate.expectedSalaryCurrency}</span>
                          </div>
                        )}
                        
                        {candidate.currentJobTitle && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Briefcase className="h-3 w-3 text-purple-500" />
                            <span>{candidate.currentJobTitle}</span>
                          </div>
                        )}
                        
                        {candidate.previousCompanyName && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Building2 className="h-3 w-3 text-indigo-500" />
                            <span>Ex: {candidate.previousCompanyName}</span>
                          </div>
                        )}
                        
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
