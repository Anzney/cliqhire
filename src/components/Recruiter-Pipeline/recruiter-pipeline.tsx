"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { KPISection } from "./kpi-section";
import { CreatePipelineDialog } from "./create-pipeline-dialog";
import { PipelineJobCard } from "./pipeline-job-card";
import { type Job, mapUIStageToBackendStage, mapBackendStageToUIStage } from "./dummy-data";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPipelineEntries, getPipelineEntry, updateCandidateStage as updateCandidateStageAPI, type PipelineListItem } from "@/services/recruitmentPipelineService";

// Utility function to convert pipeline list data to Job format
const convertPipelineListDataToJob = (pipelineData: PipelineListItem, isExpanded: boolean = false): Job => {
  // Format salary range using the correct backend fields
  const formatSalaryRange = () => {
    const minSalary = pipelineData.jobId.minimumSalary;
    const maxSalary = pipelineData.jobId.maximumSalary;
    const currency = pipelineData.jobId.salaryCurrency;
    
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
    id: pipelineData._id,
    title: pipelineData.jobId.jobTitle || "Untitled Job",
    clientName: pipelineData.jobId.clientName || "Unknown Client",
    location: pipelineData.jobId.location || "Location not specified",
    salaryRange: formatSalaryRange(),
    headcount: pipelineData.jobId.numberOfPositions || 1,
    jobType: pipelineData.jobId.jobType || "Full-time",
    isExpanded,
    // Preserve the entire jobId object for access to jobTeamInfo
    jobId: pipelineData.jobId,
    candidates: [], // Will be populated when expanded
    // Pipeline-specific data from new API structure
    // Note: pipelineStatus is now derived from jobId.stage
    priority: pipelineData.priority,
    notes: pipelineData.notes,
    assignedDate: pipelineData.assignedDate,
    // Candidate counts from new API structure
    totalCandidates: pipelineData.totalCandidates,
    activeCandidates: pipelineData.activeCandidates,
    completedCandidates: pipelineData.completedCandidates,
    droppedCandidates: pipelineData.droppedCandidates,
    numberOfCandidates: pipelineData.numberOfCandidates,
    // Recruiter information
    recruiterName: pipelineData.recruiterId?.name || "Unknown Recruiter",
    recruiterEmail: pipelineData.recruiterId?.email || "",
    // Job details from API
    department: pipelineData.jobId.department,
    numberOfPositions: pipelineData.jobId.numberOfPositions,
    // Additional fields will be populated when detailed data is loaded
  };
};

// Utility function to convert detailed pipeline data to Job format
const convertPipelineDataToJob = (pipelineData: any, isExpanded: boolean = false): Job => {
  // Format salary range using the correct backend fields
  const formatSalaryRange = () => {
    const minSalary = pipelineData.jobId.minimumSalary;
    const maxSalary = pipelineData.jobId.maximumSalary;
    const currency = pipelineData.jobId.salaryCurrency;
    
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
    id: pipelineData._id,
    title: pipelineData.jobId.jobTitle || "Untitled Job",
    clientName: pipelineData.jobId.client?.name || "Unknown Client",
    location: pipelineData.jobId.location || "Location not specified",
    salaryRange: formatSalaryRange(),
    headcount: pipelineData.jobId.headcount || 1,
    jobType: pipelineData.jobId.jobType || "Full-time",
    isExpanded,
    // Preserve the entire jobId object for access to jobTeamInfo
    jobId: pipelineData.jobId,
    candidates: pipelineData.candidateIdArray.map((candidateData: any) => {
      const candidate = candidateData.candidateId;
      return {
        id: candidate._id,
        name: candidate.name,
        source: candidate.referredBy || "Pipeline",
        currentStage: mapBackendStageToUIStage(candidateData.currentStage || "Sourcing"),
        avatar: undefined,
        experience: candidate.experience,
        currentSalary: candidate.currentSalary,
        currentSalaryCurrency: candidate.currentSalaryCurrency,
        expectedSalary: candidate.expectedSalary,
        expectedSalaryCurrency: candidate.expectedSalaryCurrency,
        currentJobTitle: candidate.currentJobTitle,
        previousCompanyName: candidate.previousCompanyName,
        // Additional fields from new structure
        applicationId: candidate._id,
        appliedDate: candidateData.addedToPipelineDate,
        lastUpdated: candidateData.lastUpdated,
        applicationDuration: 0, // Calculate if needed
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
        reportingTo: candidate.reportingTo,
        // Additional fields for dialog
        educationDegree: candidate.educationDegree,
        primaryLanguage: candidate.primaryLanguage,
        resume: candidate.resume,
        // Pipeline-specific data
        status: candidateData.status,
        subStatus: candidateData.status,
        priority: candidateData.priority,
        notes: candidateData.notes,
        // Stage-specific data - IMPORTANT: Include all stage data
        sourcing: candidateData.sourcing,
        screening: candidateData.screening,
        clientScreening: candidateData.clientScreening,
        interview: candidateData.interview,
        verification: candidateData.verification,
        onboarding: candidateData.onboarding,
        hired: candidateData.hired,
        disqualified: candidateData.disqualified,
        // Additional pipeline fields
        connection: candidateData.connection,
        hiringManager: candidateData.hiringManager,
        recruiter: candidateData.recruiter,
        isTempCandidate: candidate.isTempCandidate || false,
      };
    }),
    // Pipeline-specific data from new API structure
    // Note: pipelineStatus is now derived from jobId.stage
    priority: pipelineData.priority,
    notes: pipelineData.notes,
    assignedDate: pipelineData.assignedDate,
    // Candidate counts from new API structure
    totalCandidates: pipelineData.totalCandidates,
    activeCandidates: pipelineData.activeCandidates,
    completedCandidates: pipelineData.completedCandidates,
    droppedCandidates: pipelineData.droppedCandidates,
    numberOfCandidates: pipelineData.totalCandidates,
    // Recruiter information
    recruiterName: pipelineData.recruiterId?.name || "Unknown Recruiter",
    recruiterEmail: pipelineData.recruiterId?.email || "",
    // Job details from API
    jobPosition: Array.isArray(pipelineData.jobId.jobPosition) ? 
      pipelineData.jobId.jobPosition.join(", ") : 
      pipelineData.jobId.jobPosition,
    department: pipelineData.jobId.department,
    experience: pipelineData.jobId.experience,
    education: Array.isArray(pipelineData.jobId.education) ? 
      pipelineData.jobId.education.join(", ") : 
      pipelineData.jobId.education,
    specialization: Array.isArray(pipelineData.jobId.specialization) ? 
      pipelineData.jobId.specialization.join(", ") : 
      pipelineData.jobId.specialization,
    teamSize: pipelineData.jobId.teamSize,
    numberOfPositions: pipelineData.jobId.numberOfPositions,
    workVisa: pipelineData.jobId.workVisa ? 
      (typeof pipelineData.jobId.workVisa === 'object' ? 
        !!pipelineData.jobId.workVisa.workVisa : 
        !!pipelineData.jobId.workVisa) : 
      false,
    gender: pipelineData.jobId.gender,
    deadlineByClient: pipelineData.jobId.deadlineByClient || undefined,
    keySkills: Array.isArray(pipelineData.jobId.specialization) ? 
      pipelineData.jobId.specialization : 
      [],
    certifications: Array.isArray(pipelineData.jobId.certifications) ? 
      pipelineData.jobId.certifications : 
      [],
    otherBenefits: Array.isArray(pipelineData.jobId.otherBenefits) ? 
      pipelineData.jobId.otherBenefits.join(", ") : 
      pipelineData.jobId.otherBenefits,
    jobDescription: pipelineData.jobId.jobDescription,
    // Client information from API
    clientIndustry: pipelineData.jobId.client?.industry,
    clientLocation: pipelineData.jobId.client?.location,
    clientStage: pipelineData.jobId.client?.clientStage,
    clientCountry: pipelineData.jobId.client?.countryOfBusiness,
    clientWebsite: pipelineData.jobId.client?.website,
    clientPhone: pipelineData.jobId.client?.phoneNumber,
    clientEmails: pipelineData.jobId.client?.emails
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
      
      console.log("Loading pipeline data from API");
      const response = await getAllPipelineEntries();
      
      console.log("API Response:", response);
      
      if (response.success && response.data) {
        console.log("Raw pipeline data:", response.data.pipelines);
        
        // Convert API data to Job format
        const convertedJobs = response.data.pipelines.map(pipeline => 
          convertPipelineListDataToJob(pipeline, false)
        );
        
        console.log("Converted jobs:", convertedJobs);
        
        // Calculate overall candidate summary
        const overallSummary = {
          totalCandidates: response.data.pipelines.reduce((total, pipeline) => total + pipeline.totalCandidates, 0),
          byStatus: {} as { [key: string]: number }
        };
        
        // For now, we'll use the basic counts since detailed status breakdown isn't in the list response
        // This will be updated when individual pipeline details are loaded
        setOverallCandidateSummary(overallSummary);
        setJobs(convertedJobs);
        
        console.log("Loaded pipelines:", convertedJobs.length, "pipelines");
        console.log("Overall summary:", overallSummary);
      } else {
        throw new Error(response.message || 'Failed to load pipeline data');
      }
      
    } catch (error: any) {
      console.error("Error loading pipeline jobs:", error);
      toast.error(`Failed to load pipeline jobs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadPipelineEntryDetails = async (pipelineId: string) => {
    try {
      setLoadingJobId(pipelineId);
      console.log(`Calling getPipelineEntry API for pipeline ID: ${pipelineId}`);
      const response = await getPipelineEntry(pipelineId);
      
      console.log("Detailed pipeline entry response:", response);
      
      if (response.success && response.data) {
        const pipelineData = response.data;
        console.log("Raw detailed pipeline data:", pipelineData);
        
        // Convert to local format for detailed view using the utility function
        const detailedJob: Job = convertPipelineDataToJob(pipelineData, true);
        
        console.log("Converted detailed job:", detailedJob);
        
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
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    if (!job.isExpanded && job.candidates.length === 0) {
      // Load detailed data when expanding for the first time
      await loadPipelineEntryDetails(jobId);
    } else {
      // Simply toggle the expansion state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, isExpanded: !job.isExpanded } : job
      ));
    }
  };

  const updateCandidateStage = async (jobId: string, candidateId: string, newStage: string) => {
    try {
      // Optimistically update the UI first
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

      // Make API call to update the candidate stage
      const backendStage = mapUIStageToBackendStage(newStage);
      const response = await updateCandidateStageAPI(jobId, candidateId, {
        newStage: backendStage,
        notes: `Stage changed to ${newStage}`
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to update candidate stage');
      }

      toast.success(`Successfully moved candidate to ${newStage} stage`);
    } catch (error: any) {
      console.error('Error updating candidate stage:', error);
      
      // Revert the optimistic update on error
      setJobs(jobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            candidates: job.candidates.map(candidate => 
              candidate.id === candidateId 
                ? { ...candidate, currentStage: candidate.currentStage }
                : candidate
            )
          };
        }
        return job;
      }));
      
      toast.error(error.message || 'Failed to update candidate stage');
    }
  };

  const handleCandidateUpdate = async (jobId: string, updatedCandidate: any) => {
    try {
      // Refresh the jobs data to reflect the updated candidate
      await loadJobs();
      toast.success("Candidate updated successfully");
    } catch (error: any) {
      console.error('Error refreshing jobs after candidate update:', error);
      toast.error("Failed to refresh candidate data");
    }
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
