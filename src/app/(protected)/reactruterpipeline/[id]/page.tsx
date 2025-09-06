"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronLeft, Users, MapPin, DollarSign, Building2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Briefcase, Trash2, EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { pipelineStages, getStageColor, type Job, type Candidate, type ConnectionType } from "@/components/Recruiter-Pipeline/dummy-data";
import { getPipelineEntry, updateCandidateStage, deleteCandidateFromPipeline } from "@/services/recruitmentPipelineService";
import { CandidateDetailsDialog } from "@/components/Recruiter-Pipeline/candidate-details-dialog";
import { PipelineStageBadge } from "@/components/Recruiter-Pipeline/pipeline-stage-badge";
import { StatusBadge } from "@/components/Recruiter-Pipeline/status-badge";
import { StatusChangeConfirmationDialog } from "@/components/Recruiter-Pipeline/status-change-confirmation-dialog";
import { AddCandidateDialog } from "@/components/Recruiter-Pipeline/add-candidate-dialog";
import { AddExistingCandidateDialog } from "@/components/common/add-existing-candidate-dialog";
import { CreateCandidateDialog, type CreateCandidateValues } from "@/components/Recruiter-Pipeline/create-candidate-dialog";

const Page = () => {
  const params = useParams();
  const id = (params as any)?.id as string;
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [job, setJob] = React.useState<Job | null>(null);
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  // Dialog states
  const [isAddCandidateOpen, setIsAddCandidateOpen] = React.useState(false);
  const [isCreateCandidateOpen, setIsCreateCandidateOpen] = React.useState(false);
  const [isAddExistingOpen, setIsAddExistingOpen] = React.useState(false);
  
  // Delete candidate confirmation dialog state
  const [deleteCandidateDialog, setDeleteCandidateDialog] = React.useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // Status change confirmation dialog state
  const [statusChangeDialog, setStatusChangeDialog] = React.useState<{
    isOpen: boolean;
    candidate: Candidate | null;
    newStatus: string | null;
  }>({
    isOpen: false,
    candidate: null,
    newStatus: null,
  });

  // Stage change confirmation dialog state
  const [stageChangeDialog, setStageChangeDialog] = React.useState<{
    isOpen: boolean;
    candidate: Candidate | null;
    currentStage: string;
    newStage: string;
  }>({
    isOpen: false,
    candidate: null,
    currentStage: '',
    newStage: '',
  });

  // Filter state for stage filtering
  const [selectedStageFilter, setSelectedStageFilter] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getPipelineEntry(id);
        // Transform API response to match Job type used by pipeline components
        const entry = res.data;
        const jobData: any = entry.jobId || {};
        const salaryMin = jobData?.salaryRange?.min ?? jobData?.minimumSalary;
        const salaryMax = jobData?.salaryRange?.max ?? jobData?.maximumSalary;
        const salaryCurrency = jobData?.salaryRange?.currency ?? jobData?.salaryCurrency ?? "";
        const salaryRangeString =
          (salaryMin !== undefined && salaryMin !== null && salaryMax !== undefined && salaryMax !== null)
            ? `${salaryMin}-${salaryMax} ${salaryCurrency}`
            : "";
        const mappedJob: Job = {
          id: entry._id,
          title: entry.jobId?.jobTitle || "",
          clientName: (entry.jobId as any)?.client?.name || "",
          location: Array.isArray(entry.jobId?.location) ? entry.jobId.location.join(", ") : (entry.jobId?.location || ""),
          salaryRange: salaryRangeString,
          headcount: entry.jobId?.numberOfPositions || 0,
          jobType: entry.jobId?.jobType || "",
          isExpanded: true,
          // Preserve the entire jobId object for access to jobTeamInfo
          jobId: entry.jobId,
          candidates: (entry.candidateIdArray || []).map((c) => ({
            id: (c as any)._id || (c as any).candidateId?._id || "",
            name: (c as any).candidateId?.name || "",
            source: (c as any).sourcing?.source || "",
            currentStage: (c as any).currentStage || (c as any).status || "Sourcing",
            avatar: undefined,
            experience: (c as any).candidateId?.experience,
            currentSalary: (c as any).candidateId?.currentSalary,
            currentSalaryCurrency: (c as any).candidateId?.currentSalaryCurrency,
            expectedSalary: (c as any).candidateId?.expectedSalary,
            expectedSalaryCurrency: (c as any).candidateId?.expectedSalaryCurrency,
            currentJobTitle: (c as any).candidateId?.currentJobTitle,
            previousCompanyName: (c as any).candidateId?.previousCompanyName,
            currentCompanyName: (c as any).candidateId?.currentCompanyName,
            subStatus: (c as any).status,
            // Additional fields that might be updated in the dialog
            email: (c as any).candidateId?.email,
            phone: (c as any).candidateId?.phone,
            location: (c as any).candidateId?.location,
            skills: (c as any).candidateId?.skills,
            softSkill: (c as any).candidateId?.softSkill,
            technicalSkill: (c as any).candidateId?.technicalSkill,
            gender: (c as any).candidateId?.gender,
            dateOfBirth: (c as any).candidateId?.dateOfBirth,
            country: (c as any).candidateId?.country,
            nationality: (c as any).candidateId?.nationality,
            willingToRelocate: (c as any).candidateId?.willingToRelocate,
            description: (c as any).candidateId?.description,
            linkedin: (c as any).candidateId?.linkedin,
            reportingTo: (c as any).candidateId?.reportingTo,
            educationDegree: (c as any).candidateId?.educationDegree,
            primaryLanguage: (c as any).candidateId?.primaryLanguage,
            resume: (c as any).candidateId?.resume,
            priority: (c as any).priority,
            notes: (c as any).notes,
            // Stage-specific data
            sourcing: (c as any).sourcing,
            screening: (c as any).screening,
            clientScreening: (c as any).clientScreening,
            interview: (c as any).interview,
            verification: (c as any).verification,
            onboarding: (c as any).onboarding,
            hired: (c as any).hired,
            disqualified: (c as any).disqualified,
            connection: (c as any).connection,
            hiringManager: (c as any).hiringManager,
            recruiter: (c as any).recruiter,
          })) as Candidate[],
          pipelineStatus: entry.status,
          priority: entry.priority,
          notes: entry.notes,
          assignedDate: entry.assignedDate,
          totalCandidates: entry.totalCandidates,
          activeCandidates: entry.activeCandidates,
          completedCandidates: entry.completedCandidates,
          droppedCandidates: entry.droppedCandidates,
          // numberOfCandidates not available on PipelineEntryDetail
          recruiterName: entry.recruiterId?.name,
          recruiterEmail: entry.recruiterId?.email,
        };
        if (isMounted) setJob(mappedJob);
      } catch (e: any) {
        if (isMounted) setError(e.message || "Failed to load pipeline");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (id) load();
    return () => { isMounted = false; };
  }, [id]);

  // Handler functions
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCandidate(null);
  };

  const handleCandidateUpdate = async (updatedCandidate: Candidate) => {
    // Refresh the job data to reflect the updated candidate
    try {
      const res = await getPipelineEntry(id);
      const entry = res.data;
      const jobData: any = entry.jobId || {};
      const salaryMin = jobData?.salaryRange?.min ?? jobData?.minimumSalary;
      const salaryMax = jobData?.salaryRange?.max ?? jobData?.maximumSalary;
      const salaryCurrency = jobData?.salaryRange?.currency ?? jobData?.salaryCurrency ?? "";
      const salaryRangeString =
        (salaryMin !== undefined && salaryMin !== null && salaryMax !== undefined && salaryMax !== null)
          ? `${salaryMin}-${salaryMax} ${salaryCurrency}`
          : "";
      const mappedJob: Job = {
        id: entry._id,
        title: entry.jobId?.jobTitle || "",
        clientName: (entry.jobId as any)?.client?.name || "",
        location: Array.isArray(entry.jobId?.location) ? entry.jobId.location.join(", ") : (entry.jobId?.location || ""),
        salaryRange: salaryRangeString,
        headcount: entry.jobId?.numberOfPositions || 0,
        jobType: entry.jobId?.jobType || "",
        isExpanded: true,
        // Preserve the entire jobId object for access to jobTeamInfo
        jobId: entry.jobId,
        candidates: (entry.candidateIdArray || []).map((c) => ({
          id: (c as any)._id || (c as any).candidateId?._id || "",
          name: (c as any).candidateId?.name || "",
          source: (c as any).sourcing?.source || "",
          currentStage: (c as any).currentStage || (c as any).status || "Sourcing",
          avatar: undefined,
          experience: (c as any).candidateId?.experience,
          currentSalary: (c as any).candidateId?.currentSalary,
          currentSalaryCurrency: (c as any).candidateId?.currentSalaryCurrency,
          expectedSalary: (c as any).candidateId?.expectedSalary,
          expectedSalaryCurrency: (c as any).candidateId?.expectedSalaryCurrency,
          currentJobTitle: (c as any).candidateId?.currentJobTitle,
          previousCompanyName: (c as any).candidateId?.previousCompanyName,
          currentCompanyName: (c as any).candidateId?.currentCompanyName,
          subStatus: (c as any).status,
          // Additional fields that might be updated in the dialog
          email: (c as any).candidateId?.email,
          phone: (c as any).candidateId?.phone,
          location: (c as any).candidateId?.location,
          skills: (c as any).candidateId?.skills,
          softSkill: (c as any).candidateId?.softSkill,
          technicalSkill: (c as any).candidateId?.technicalSkill,
          gender: (c as any).candidateId?.gender,
          dateOfBirth: (c as any).candidateId?.dateOfBirth,
          country: (c as any).candidateId?.country,
          nationality: (c as any).candidateId?.nationality,
          willingToRelocate: (c as any).candidateId?.willingToRelocate,
          description: (c as any).candidateId?.description,
          linkedin: (c as any).candidateId?.linkedin,
          reportingTo: (c as any).candidateId?.reportingTo,
          educationDegree: (c as any).candidateId?.educationDegree,
          primaryLanguage: (c as any).candidateId?.primaryLanguage,
          resume: (c as any).candidateId?.resume,
          priority: (c as any).priority,
          notes: (c as any).notes,
          // Stage-specific data
          sourcing: (c as any).sourcing,
          screening: (c as any).screening,
          clientScreening: (c as any).clientScreening,
          interview: (c as any).interview,
          verification: (c as any).verification,
          onboarding: (c as any).onboarding,
          hired: (c as any).hired,
          disqualified: (c as any).disqualified,
          connection: (c as any).connection,
          hiringManager: (c as any).hiringManager,
          recruiter: (c as any).recruiter,
        })) as Candidate[],
        pipelineStatus: entry.status,
        priority: entry.priority,
        notes: entry.notes,
        assignedDate: entry.assignedDate,
        totalCandidates: entry.totalCandidates,
        activeCandidates: entry.activeCandidates,
        completedCandidates: entry.completedCandidates,
        droppedCandidates: entry.droppedCandidates,
        // numberOfCandidates not available on PipelineEntryDetail
        recruiterName: entry.recruiterId?.name,
        recruiterEmail: entry.recruiterId?.email,
      };
      setJob(mappedJob);
    } catch (error) {
      console.error('Error refreshing job data:', error);
    }
  };

  const handleStageChange = (candidate: Candidate, newStage: string) => {
    setStageChangeDialog({
      isOpen: true,
      candidate,
      currentStage: candidate.currentStage,
      newStage,
    });
  };

  const handleConfirmStageChange = async () => {
    if (stageChangeDialog.candidate) {
      try {
        await updateCandidateStage(id, stageChangeDialog.candidate.id, {
          newStage: stageChangeDialog.newStage,
        });
        
        // Refresh the job data
        const res = await getPipelineEntry(id);
        const entry = res.data;
        const mappedJob: Job = {
          id: entry._id,
          title: entry.jobId?.jobTitle || "",
          clientName: entry.jobId?.client?.name || "",
          location: entry.jobId?.location || "",
          salaryRange: entry.jobId?.salaryRange ? 
            `${entry.jobId.salaryRange.min}-${entry.jobId.salaryRange.max} ${entry.jobId.salaryRange.currency}` : 
            `${entry.jobId?.minimumSalary || 0}-${entry.jobId?.maximumSalary || 0} ${entry.jobId?.salaryCurrency || ""}`,
          headcount: entry.jobId?.headcount || 1,
          jobType: entry.jobId?.jobType || "",
          isExpanded: true,
          // Preserve the entire jobId object for access to jobTeamInfo
          jobId: entry.jobId,
          candidates: (entry.candidateIdArray || []).map((c) => ({
            id: (c as any)._id || (c as any).candidateId?._id || "",
            name: (c as any).candidateId?.name || "",
            source: (c as any).sourcing?.source || "",
            currentStage: (c as any).currentStage || (c as any).status || "Sourcing",
            avatar: undefined,
            experience: (c as any).candidateId?.experience,
            currentSalary: (c as any).candidateId?.currentSalary,
            currentSalaryCurrency: (c as any).candidateId?.currentSalaryCurrency,
            expectedSalary: (c as any).candidateId?.expectedSalary,
            expectedSalaryCurrency: (c as any).candidateId?.expectedSalaryCurrency,
            currentJobTitle: (c as any).candidateId?.currentJobTitle,
            previousCompanyName: (c as any).candidateId?.previousCompanyName,
            currentCompanyName: (c as any).candidateId?.currentCompanyName,
            subStatus: (c as any).status,
            // Additional fields that might be updated in the dialog
            email: (c as any).candidateId?.email,
            phone: (c as any).candidateId?.phone,
            location: (c as any).candidateId?.location,
            skills: (c as any).candidateId?.skills,
            softSkill: (c as any).candidateId?.softSkill,
            technicalSkill: (c as any).candidateId?.technicalSkill,
            gender: (c as any).candidateId?.gender,
            dateOfBirth: (c as any).candidateId?.dateOfBirth,
            country: (c as any).candidateId?.country,
            nationality: (c as any).candidateId?.nationality,
            willingToRelocate: (c as any).candidateId?.willingToRelocate,
            description: (c as any).candidateId?.description,
            linkedin: (c as any).candidateId?.linkedin,
            reportingTo: (c as any).candidateId?.reportingTo,
            educationDegree: (c as any).candidateId?.educationDegree,
            primaryLanguage: (c as any).candidateId?.primaryLanguage,
            resume: (c as any).candidateId?.resume,
            priority: (c as any).priority,
            notes: (c as any).notes,
            // Stage-specific data
            sourcing: (c as any).sourcing,
            screening: (c as any).screening,
            clientScreening: (c as any).clientScreening,
            interview: (c as any).interview,
            verification: (c as any).verification,
            onboarding: (c as any).onboarding,
            hired: (c as any).hired,
            disqualified: (c as any).disqualified,
            connection: (c as any).connection,
            hiringManager: (c as any).hiringManager,
            recruiter: (c as any).recruiter,
          })) as Candidate[],
          pipelineStatus: entry.status,
          priority: entry.priority,
          notes: entry.notes,
          assignedDate: entry.assignedDate,
          totalCandidates: entry.totalCandidates,
          activeCandidates: entry.activeCandidates,
          completedCandidates: entry.completedCandidates,
          droppedCandidates: entry.droppedCandidates,
          recruiterName: entry.recruiterId?.name,
          recruiterEmail: entry.recruiterId?.email,
        };
        setJob(mappedJob);
        
        setStageChangeDialog({ isOpen: false, candidate: null, currentStage: '', newStage: '' });
      } catch (error) {
        console.error('Error updating candidate stage:', error);
      }
    }
  };

  const handleCancelStageChange = () => {
    setStageChangeDialog({ isOpen: false, candidate: null, currentStage: '', newStage: '' });
  };

  const handleDeleteCandidate = (candidate: Candidate) => {
    setDeleteCandidateDialog({
      isOpen: true,
      candidate,
    });
  };

  const handleConfirmDeleteCandidate = async () => {
    if (deleteCandidateDialog.candidate) {
      try {
        await deleteCandidateFromPipeline(id, deleteCandidateDialog.candidate.id);
        
        // Refresh the job data
        const res = await getPipelineEntry(id);
        const entry = res.data;
        const mappedJob: Job = {
          id: entry._id,
          title: entry.jobId?.jobTitle || "",
          clientName: entry.jobId?.client?.name || "",
          location: entry.jobId?.location || "",
          salaryRange: entry.jobId?.salaryRange ? 
            `${entry.jobId.salaryRange.min}-${entry.jobId.salaryRange.max} ${entry.jobId.salaryRange.currency}` : 
            `${entry.jobId?.minimumSalary || 0}-${entry.jobId?.maximumSalary || 0} ${entry.jobId?.salaryCurrency || ""}`,
          headcount: entry.jobId?.headcount || 1,
          jobType: entry.jobId?.jobType || "",
          isExpanded: true,
          // Preserve the entire jobId object for access to jobTeamInfo
          jobId: entry.jobId,
          candidates: (entry.candidateIdArray || []).map((c) => ({
            id: (c as any)._id || (c as any).candidateId?._id || "",
            name: (c as any).candidateId?.name || "",
            source: (c as any).sourcing?.source || "",
            currentStage: (c as any).currentStage || (c as any).status || "Sourcing",
            avatar: undefined,
            experience: (c as any).candidateId?.experience,
            currentSalary: (c as any).candidateId?.currentSalary,
            currentSalaryCurrency: (c as any).candidateId?.currentSalaryCurrency,
            expectedSalary: (c as any).candidateId?.expectedSalary,
            expectedSalaryCurrency: (c as any).candidateId?.expectedSalaryCurrency,
            currentJobTitle: (c as any).candidateId?.currentJobTitle,
            previousCompanyName: (c as any).candidateId?.previousCompanyName,
            currentCompanyName: (c as any).candidateId?.currentCompanyName,
            subStatus: (c as any).status,
            // Additional fields that might be updated in the dialog
            email: (c as any).candidateId?.email,
            phone: (c as any).candidateId?.phone,
            location: (c as any).candidateId?.location,
            skills: (c as any).candidateId?.skills,
            softSkill: (c as any).candidateId?.softSkill,
            technicalSkill: (c as any).candidateId?.technicalSkill,
            gender: (c as any).candidateId?.gender,
            dateOfBirth: (c as any).candidateId?.dateOfBirth,
            country: (c as any).candidateId?.country,
            nationality: (c as any).candidateId?.nationality,
            willingToRelocate: (c as any).candidateId?.willingToRelocate,
            description: (c as any).candidateId?.description,
            linkedin: (c as any).candidateId?.linkedin,
            reportingTo: (c as any).candidateId?.reportingTo,
            educationDegree: (c as any).candidateId?.educationDegree,
            primaryLanguage: (c as any).candidateId?.primaryLanguage,
            resume: (c as any).candidateId?.resume,
            priority: (c as any).priority,
            notes: (c as any).notes,
            // Stage-specific data
            sourcing: (c as any).sourcing,
            screening: (c as any).screening,
            clientScreening: (c as any).clientScreening,
            interview: (c as any).interview,
            verification: (c as any).verification,
            onboarding: (c as any).onboarding,
            hired: (c as any).hired,
            disqualified: (c as any).disqualified,
            connection: (c as any).connection,
            hiringManager: (c as any).hiringManager,
            recruiter: (c as any).recruiter,
          })) as Candidate[],
          pipelineStatus: entry.status,
          priority: entry.priority,
          notes: entry.notes,
          assignedDate: entry.assignedDate,
          totalCandidates: entry.totalCandidates,
          activeCandidates: entry.activeCandidates,
          completedCandidates: entry.completedCandidates,
          droppedCandidates: entry.droppedCandidates,
          recruiterName: entry.recruiterId?.name,
          recruiterEmail: entry.recruiterId?.email,
        };
        setJob(mappedJob);
        
        setDeleteCandidateDialog({ isOpen: false, candidate: null });
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const handleCancelDeleteCandidate = () => {
    setDeleteCandidateDialog({ isOpen: false, candidate: null });
  };

  const handleAddCandidate = () => {
    setIsAddCandidateOpen(true);
  };

  const handleAddExistingCandidate = () => {
    setIsAddExistingOpen(true);
  };

  const handleAddNewCandidate = () => {
    setIsCreateCandidateOpen(true);
  };

  const handleCreateCandidateSubmit = (values: CreateCandidateValues) => {
    console.log('Create candidate for job:', id, values);
    // TODO: integrate API call
  };

  const handleStatusChange = (candidate: Candidate, newStatus: any) => {
    setStatusChangeDialog({
      isOpen: true,
      candidate,
      newStatus,
    });
  };


  const handleConfirmStatusChange = async () => {
    if (statusChangeDialog.candidate && statusChangeDialog.newStatus) {
      console.log('Status changed for candidate:', statusChangeDialog.candidate.name, 'to:', statusChangeDialog.newStatus);
      // TODO: Implement API call to update status
      
      setStatusChangeDialog({ isOpen: false, candidate: null, newStatus: null });
    }
  };

  const handleCancelStatusChange = () => {
    setStatusChangeDialog({ isOpen: false, candidate: null, newStatus: null });
  };

  // Function to get filtered candidates based on selected stage
  const getFilteredCandidates = () => {
    if (!selectedStageFilter) {
      return job?.candidates || [];
    }
    return (job?.candidates || []).filter(candidate => {
      return candidate.currentStage === selectedStageFilter;
    });
  };

  // Function to handle stage badge click
  const handleStageBadgeClick = (stage: string) => {
    if (selectedStageFilter === stage) {
      // If clicking the same stage, clear the filter
      setSelectedStageFilter(null);
    } else {
      // Filter by the selected stage
      setSelectedStageFilter(stage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-4">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="text-red-600">{error || "Job not found"}</div>
      </div>
    );
  }

  return (
    <>
      <div className=" space-y-4">
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </div>
        </div> */}

        {/* Job Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{job.clientName}</span>
                  </div>
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
                    <span>{job.totalCandidates || job.candidates.length} candidates</span>
                  </div>
                  {job.pipelineStatus && (
                    <Badge 
                      variant="outline" 
                      className={`${
                        job.pipelineStatus === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                        job.pipelineStatus === 'Closed' ? 'bg-red-100 text-red-700 border-red-200' :
                        job.pipelineStatus === 'On Hold' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {job.pipelineStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Add Candidate Button */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={handleAddCandidate}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Candidate
              </Button>
            </div>
          </div>
        </div>

        {/* Pipeline Stage Badges - Clickable filters */}
        <div className="flex flex-wrap gap-2">
          {pipelineStages.map((stage) => {
            const count = job.candidates.filter(c => c.currentStage === stage).length;
            const isActive = selectedStageFilter === stage;
            return (
              <Badge 
                key={stage}
                variant="outline" 
                className={`${getStageColor(stage)} border cursor-pointer hover:opacity-80 transition-opacity ${
                  isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                onClick={() => handleStageBadgeClick(stage)}
              >
                {stage}: {count}
              </Badge>
            );
          })}
          {selectedStageFilter && (
            <Badge 
              variant="outline" 
              className="bg-gray-100 text-gray-600 border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedStageFilter(null)}
            >
              Clear Filter
            </Badge>
          )}
        </div>

        {/* Candidates Table */}
        {selectedStageFilter && (
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 mb-4">
            Showing candidates in: <span className="font-semibold">{selectedStageFilter}</span>
            <span className="ml-2 text-blue-500">({getFilteredCandidates().length} candidates)</span>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[44px]"></TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Current Position</TableHead>
              <TableHead className="w-[200px]">Stage</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[140px]">Hiring Manager</TableHead>
              <TableHead className="w-[120px]">Recruiter</TableHead>
              <TableHead className="w-[90px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getFilteredCandidates().map((candidate) => (
              <TableRow key={candidate.id} className="hover:bg-muted/50">
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback className="text-xs bg-gray-200">
                      {candidate.name ? candidate.name.split(' ').map(n => n[0]).join('') : 'NA'}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium truncate max-w-[220px]">
                  {candidate.name || 'Unknown Candidate'}
                </TableCell>
                <TableCell className="truncate max-w-[260px] text-gray-700">
                  {candidate.currentJobTitle || 'Position not specified'}
                </TableCell>
                <TableCell>
                  <PipelineStageBadge
                    stage={candidate.currentStage}
                    onStageChange={(newStage) => handleStageChange(candidate, newStage)}
                  />
                </TableCell>
                <TableCell>
                  {(() => {
                    const stagesWithStatus = ['Sourcing', 'Screening', 'Client Screening', 'Interview', 'Verification'];
                    if (stagesWithStatus.includes(candidate.currentStage)) {
                      return (
                        <StatusBadge
                          status={candidate.status || null}
                          stage={candidate.currentStage}
                          onStatusChange={(newStatus) => handleStatusChange(candidate, newStatus)}
                        />
                      );
                    } else {
                      return (
                        <span className="text-sm text-gray-500">N/A</span>
                      );
                    }
                  })()}
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {(job as any).jobId?.jobTeamInfo?.hiringManager?.name || 'Not assigned'}
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {(job as any).jobId?.jobTeamInfo?.recruiter?.name || 'Not assigned'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        title="More options"
                      >
                        <EllipsisVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-50">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCandidate(candidate);
                        }}
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View & Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View resume for:', candidate.name);
                        }}
                        className="cursor-pointer"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        View Resume
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCandidate(candidate);
                        }}
                        className="cursor-pointer"
                      >
                        <Trash2 className="size-4 mr-2 text-red-500" />
                        Delete Candidate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Candidate Details Dialog */}
      <CandidateDetailsDialog
        candidate={selectedCandidate}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        pipelineId={job.id}
        onCandidateUpdate={handleCandidateUpdate}
      />
      
      {/* Status Change Confirmation Dialog */}
      <StatusChangeConfirmationDialog
        isOpen={stageChangeDialog.isOpen}
        onClose={handleCancelStageChange}
        onConfirm={handleConfirmStageChange}
        candidateName={stageChangeDialog.candidate?.name || ''}
        currentStage={stageChangeDialog.currentStage}
        newStage={stageChangeDialog.newStage}
      />

      {/* Add Candidate Dialog */}
      <AddCandidateDialog
        open={isAddCandidateOpen}
        onOpenChange={setIsAddCandidateOpen}
        onAddExisting={handleAddExistingCandidate}
        onAddNew={handleAddNewCandidate}
        jobTitle={job.title}
      />

      {/* Shared Existing Candidate selection dialog */}
      <AddExistingCandidateDialog
        jobId={job.id}
        jobTitle={job.title}
        open={isAddExistingOpen}
        onOpenChange={setIsAddExistingOpen}
        isPipeline={true}
        pipelineId={job.id}
        onCandidatesAdded={() => {
          // Refresh the job data or trigger a reload
          console.log('Candidates added to pipeline, refreshing...');
        }}
      />

      <CreateCandidateDialog
        open={isCreateCandidateOpen}
        onOpenChange={setIsCreateCandidateOpen}
        pipelineId={job.id}
        onSubmit={handleCreateCandidateSubmit}
      />

      {/* Delete Candidate Confirmation Dialog */}
      <Dialog open={deleteCandidateDialog.isOpen} onOpenChange={(open) => setDeleteCandidateDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteCandidateDialog.candidate?.name}</strong> from this pipeline? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDeleteCandidate}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDeleteCandidate}
            >
              Delete Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={statusChangeDialog.isOpen} onOpenChange={(open) => setStatusChangeDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the status for <strong>{statusChangeDialog.candidate?.name}</strong> to <strong>{statusChangeDialog.newStatus}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelStatusChange}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmStatusChange}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
