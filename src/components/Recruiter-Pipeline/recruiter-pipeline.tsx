"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { KPISection } from "./kpi-section";
import { CreatePipelineDialog } from "./create-pipeline-dialog";
import { PipelineJobCard } from "./pipeline-job-card";
import { type Job } from "./dummy-data";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPipelineEntries, getPipelineEntry } from "@/services/recruitmentPipelineService";

// Utility function to convert pipeline data to Job format
const convertPipelineDataToJob = (pipelineData: any, isExpanded: boolean = false): Job => {
  // Format salary range using the correct backend fields
  const formatSalaryRange = () => {
    const minSalary = pipelineData.jobDetails.minimumSalary;
    const maxSalary = pipelineData.jobDetails.maximumSalary;
    const currency = pipelineData.jobDetails.salaryCurrency;
    
    if (minSalary && maxSalary && currency) {
      return `${minSalary} - ${maxSalary} ${currency}`;
    } else if (minSalary && currency) {
      return `${minSalary} ${currency}`;
    } else if (maxSalary && currency) {
      return `${maxSalary} ${currency}`;
    } else if (minSalary || maxSalary) {
      return `${minSalary || maxSalary}`;
    }
    return "Salary not specified";
  };

  return {
    id: pipelineData.pipelineInfo._id,
    title: pipelineData.jobDetails.jobTitle || "Untitled Job",
    clientName: pipelineData.clientInfo.name || "Unknown Client",
    location: pipelineData.jobDetails.location || "Location not specified",
    salaryRange: formatSalaryRange(),
    headcount: pipelineData.jobDetails.headcount || 1,
    jobType: pipelineData.jobDetails.jobType || "Full-time",
    isExpanded,
    candidates: pipelineData.candidates.map((candidateData: any) => {
      const candidate = candidateData.candidate || candidateData; // Handle both new and old structure
      return {
        id: candidateData.applicationId || candidate._id,
        name: candidate.name,
        source: candidate.referredBy || "Pipeline",
        currentStage: candidateData.status || candidate.status || "Sourcing",
        avatar: undefined,
        experience: candidate.experience,
        currentSalary: candidate.currentSalary,
        currentSalaryCurrency: candidateData.salaryCurrency || candidate.currentSalaryCurrency,
        expectedSalary: candidate.expectedSalary,
        expectedSalaryCurrency: candidate.expectedSalaryCurrency,
        currentJobTitle: candidate.currentJobTitle,
        previousCompanyName: candidate.previousCompanyName,
        // Additional fields from new structure
        applicationId: candidateData.applicationId,
        appliedDate: candidateData.appliedDate,
        lastUpdated: candidateData.lastUpdated,
        applicationDuration: candidateData.applicationDuration,
        // Candidate details
        email: candidate.email,
        phone: candidate.phone,
        location: candidate.location,
        skills: candidate.skills,
        softSkill: candidate.softSkill,
        technicalSkill: candidate.technicalSkill,
        gender: candidate.gender,
        dateOfBirth: candidate.dateOfBirth,
        country: candidate.country,
        nationality: candidate.nationality,
        willingToRelocate: candidate.willingToRelocate,
        description: candidate.description,
        linkedin: candidate.linkedin,
        reportingTo: candidate.reportingTo
      };
    }),
    // Pipeline-specific data - use stage field from backend
    pipelineStatus: pipelineData.jobDetails.stage || "Unknown",
    priority: pipelineData.pipelineInfo.priority,
    notes: pipelineData.pipelineInfo.notes,
    assignedDate: pipelineData.pipelineInfo.assignedDate,
    candidateSummary: pipelineData.candidateSummary || { totalCandidates: 0, byStatus: {} },
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
  };
};

export function RecruiterPipeline() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(false);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  const [overallCandidateSummary, setOverallCandidateSummary] = useState<{
    totalCandidates: number;
    byStatus: { [key: string]: number };
  } | null>(null);

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
        
        // Store overall candidate summary if available
        if (response.data.overallCandidateSummary) {
          setOverallCandidateSummary(response.data.overallCandidateSummary);
        }
        
        // Convert all pipeline entries to Job format using the utility function
        const pipelineJobs: Job[] = response.data.pipelines.map((pipelineData: any) => 
          convertPipelineDataToJob(pipelineData, false)
        );
        
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
        
        // Convert to local format for detailed view using the utility function
        const detailedJob: Job = convertPipelineDataToJob(pipelineData, true);
        
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

  // Calculate KPI data from jobs and overall summary
  const calculateKPIData = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.pipelineStatus !== "Closed").length;
    
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
      appliedCandidates = jobs.reduce((total, job) => total + job.candidates.length, 0);
      
      jobs.forEach(job => {
        if (job.candidateSummary && job.candidateSummary.byStatus) {
          hiredCandidates += job.candidateSummary.byStatus["Hired"] || 0;
          disqualifiedCandidates += job.candidateSummary.byStatus["Disqualified"] || 0;
        }
      });
    }

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
            return job.pipelineStatus !== "Closed";
          case "completed":
            return job.pipelineStatus === "Closed";
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
          <PipelineJobCard
            key={job.id}
            job={job}
            loadingJobId={loadingJobId}
            onToggleExpansion={toggleJobExpansion}
            onUpdateCandidateStage={updateCandidateStage}
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
