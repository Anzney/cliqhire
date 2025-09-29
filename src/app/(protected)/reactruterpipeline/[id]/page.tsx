"use client";
import {useState , useEffect , useMemo} from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Job, type Candidate, mapUIStageToBackendStage } from "@/components/Recruiter-Pipeline/dummy-data";
import { getPipelineEntry, updateCandidateStage, deleteCandidateFromPipeline, updateCandidateStatus } from "@/services/recruitmentPipelineService";
import { RecruiterPipelineService } from "@/services/recruiterPipelineService";
import { CandidateDetailsDialog } from "@/components/Recruiter-Pipeline/candidate-details-dialog";
import { StatusChangeConfirmationDialog } from "@/components/Recruiter-Pipeline/status-change-confirmation-dialog";
import { AddCandidateDialog } from "@/components/Recruiter-Pipeline/add-candidate-dialog";
import { AddExistingCandidateDialog } from "@/components/common/add-existing-candidate-dialog";
import { CreateCandidateDialog, type CreateCandidateValues } from "@/components/Recruiter-Pipeline/create-candidate-dialog";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { validateTempCandidateStageChange, isTempCandidate, validateTempCandidateStatusChange } from "@/lib/temp-candidate-validation";
import { TempCandidateAlertDialog } from "@/components/Recruiter-Pipeline/temp-candidate-alert-dialog";
import { DisqualificationDialog, type DisqualificationData } from "@/components/Recruiter-Pipeline/disqualification-dialog";
import { PipelineJobHeader } from "@/components/Recruiter-Pipeline/PipelineJobHeader";
import { PipelineStageFilters } from "@/components/Recruiter-Pipeline/PipelineStageFilters";
import { PipelineCandidatesTable } from "@/components/Recruiter-Pipeline/PipelineCandidatesTable";
import { mapEntryToJob } from "@/components/Recruiter-Pipeline/pipeline-mapper";
import { InterviewDetailsDialog } from "@/components/Recruiter-Pipeline/interview-details-dialog";

const Page = () => {
  const params = useParams();
  const id = (params as any)?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] =useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [selectedCandidate, setSelectedCandidate] =useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Dialog states
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [isCreateCandidateOpen, setIsCreateCandidateOpen] = useState(false);
  const [isAddExistingOpen, setIsAddExistingOpen] =useState(false);
  
  // Delete candidate confirmation dialog state
  const [deleteCandidateDialog, setDeleteCandidateDialog] = useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // Status change confirmation dialog state
  const [statusChangeDialog, setStatusChangeDialog] =useState<{
    isOpen: boolean;
    candidate: Candidate | null;
    newStatus: string | null;
  }>({
    isOpen: false,
    candidate: null,
    newStatus: null,
  });

  // Stage change confirmation dialog state
  const [stageChangeDialog, setStageChangeDialog] =useState<{
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

  // Interview details dialog state
  const [interviewDialog, setInterviewDialog] =useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // PDF viewer state
  const [pdfViewer, setPdfViewer] =useState<{
    isOpen: boolean;
    pdfUrl: string | null;
    candidateName: string | null;
  }>({
    isOpen: false,
    pdfUrl: null,
    candidateName: null,
  });

  // Temp candidate alert dialog state
  const [tempCandidateAlert, setTempCandidateAlert] = useState<{
    isOpen: boolean;
    candidateName: string | null;
    message: string | null;
  }>({
    isOpen: false,
    candidateName: null,
    message: null,
  });

  // Auto-create candidate dialog state for temp candidates
  const [autoCreateCandidateDialog, setAutoCreateCandidateDialog] = useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // Disqualification dialog state
  const [disqualificationDialog, setDisqualificationDialog] = useState<{
    isOpen: boolean;
    candidate: Candidate | null;
    newStatus: string | null;
  }>({
    isOpen: false,
    candidate: null,
    newStatus: null,
  });

  // Filter state for stage filtering
  const [selectedStageFilter, setSelectedStageFilter] =useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getPipelineEntry(id);
        const entry = res.data;
        const mappedJob = mapEntryToJob(entry);
        if (isMounted) setJob(mappedJob as Job);
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
      setJob(mapEntryToJob(entry));
    } catch (error) {
      console.error('Error refreshing job data:', error);
    }
  };

  const handleStageChange = (candidate: Candidate, newStage: string) => {
    // Validate if candidate can change stage (check for temp candidate)
    const validation = validateTempCandidateStageChange(candidate);
    
    if (!validation.canChangeStage) {
      // Show temp candidate alert instead of stage change dialog
      setTempCandidateAlert({
        isOpen: true,
        candidateName: candidate.name,
        message: validation.message || null,
      });
      return;
    }

    // If moving to Interview, ask for details first
    if (newStage === 'Interview') {
      setInterviewDialog({ isOpen: true, candidate });
      return;
    }

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
        const backendStage = mapUIStageToBackendStage(stageChangeDialog.newStage);
        await updateCandidateStage(id, stageChangeDialog.candidate.id, {
          newStage: backendStage,
        });
        
        // Refresh the job data
        const res = await getPipelineEntry(id);
        const entry = res.data;
        setJob(mapEntryToJob(entry));
        
        setStageChangeDialog({ isOpen: false, candidate: null, currentStage: '', newStage: '' });
      } catch (error) {
        console.error('Error updating candidate stage:', error);
      }
    }
  };

  const handleCancelStageChange = () => {
    setStageChangeDialog({ isOpen: false, candidate: null, currentStage: '', newStage: '' });
  };

  const handleCloseInterviewDialog = () => {
    setInterviewDialog({ isOpen: false, candidate: null });
  };

  const handleConfirmInterviewDetails = async (dateTime: string, meetingLink: string) => {
    const candidate = interviewDialog.candidate;
    if (!candidate) return;
    try {
      const backendStage = mapUIStageToBackendStage('Interview');
      await updateCandidateStage(id, candidate.id, {
        newStage: backendStage,
        interviewDate: dateTime,
        interviewMeetingLink: meetingLink,
      });
      // Optionally TODO: persist dateTime and meetingLink if API supports
      const res = await getPipelineEntry(id);
      const entry = res.data;
      setJob(mapEntryToJob(entry));
    } catch (error) {
      console.error('Error updating candidate stage to Interview:', error);
    } finally {
      handleCloseInterviewDialog();
    }
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
        setJob(mapEntryToJob(entry));
        
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
    // Validate if candidate can change status (check for temp candidate)
    const validation = validateTempCandidateStatusChange(candidate, newStatus);
    
    if (!validation.canChangeStage) {
      // Show temp candidate alert instead of status change dialog
      setTempCandidateAlert({
        isOpen: true,
        candidateName: candidate.name,
        message: validation.message || null,
      });
      return;
    }

    // If this is a temp candidate changing to "CV Received", open create dialog
    if (validation.shouldOpenCreateDialog) {
      setAutoCreateCandidateDialog({
        isOpen: true,
        candidate: candidate,
      });
      return;
    }

    // If changing status to "Disqualified", show disqualification dialog
    if (newStatus === 'Disqualified') {
      setDisqualificationDialog({
        isOpen: true,
        candidate,

      });
      return;
    }

    setStatusChangeDialog({
      isOpen: true,
      candidate,
      newStatus,
    });
  };


  const handleConfirmStatusChange = async () => {
    if (statusChangeDialog.candidate && statusChangeDialog.newStatus) {
      try {
        await updateCandidateStatus(id, statusChangeDialog.candidate.id, {
          status: statusChangeDialog.newStatus,
          stage: mapUIStageToBackendStage(statusChangeDialog.candidate.currentStage),
          notes: `Status updated to ${statusChangeDialog.newStatus}`,
        });
        
        // Update the candidate status locally instead of doing a full refresh
        setJob(prevJob => {
          if (!prevJob) return prevJob;
          
          return {
            ...prevJob,
            candidates: prevJob.candidates.map(candidate => 
              candidate.id === statusChangeDialog.candidate?.id
                ? { ...candidate, status: statusChangeDialog.newStatus as any, subStatus: statusChangeDialog.newStatus || undefined }
                : candidate
            )
          };
        });
        
        setStatusChangeDialog({ isOpen: false, candidate: null, newStatus: null });
      } catch (error: any) {
        console.error('Error updating candidate status:', error);
        // Show user-friendly error message
        alert(error.message || 'Failed to update candidate status. Please try again.');
      }
    }
  };

  const handleViewResume = (candidate: Candidate) => {
    console.log('Viewing resume for candidate:', candidate.name);
    console.log('Resume URL:', candidate.resume);
    setPdfViewer({
      isOpen: true,
      pdfUrl: candidate.resume || null,
      candidateName: candidate.name || null,
    });
  };

  const handleClosePdfViewer = () => {
    setPdfViewer({
      isOpen: false,
      pdfUrl: null,
      candidateName: null,
    });
  };

  const handleCloseTempCandidateAlert = () => {
    setTempCandidateAlert({
      isOpen: false,
      candidateName: null,
      message: null,
    });
  };

  const handleCloseAutoCreateDialog = () => {
    setAutoCreateCandidateDialog({
      isOpen: false,
      candidate: null,
    });
  };

  const handleCloseDisqualificationDialog = () => {
    setDisqualificationDialog({
      isOpen: false,
      candidate: null,
      newStatus: null,
    });
  };

  const handleConfirmDisqualification = async (data: DisqualificationData) => {
    if (disqualificationDialog.candidate) {
      try {
        console.log('Disqualifying candidate:', disqualificationDialog.candidate.name, data);
        
        // Single API call to update candidate status with all disqualification data
        await updateCandidateStatus(id, disqualificationDialog.candidate.id, {
          status: 'Disqualified',
          stage: mapUIStageToBackendStage(disqualificationDialog.candidate.currentStage),
          notes: `Disqualified: ${data.disqualificationReason}`,
          disqualificationStage: data.disqualificationStage,
          disqualificationStatus: data.disqualificationStatus,
          disqualificationReason: data.disqualificationReason,
          disqualificationFeedback: data.disqualificationFeedback || "",
        });
        
        // Update the candidate status locally instead of doing a full refresh
        setJob(prevJob => {
          if (!prevJob) return prevJob;
          
          return {
            ...prevJob,
            candidates: prevJob.candidates.map(candidate => 
              candidate.id === disqualificationDialog.candidate?.id
                ? { 
                    ...candidate, 
                    status: 'Disqualified' as any, 
                    subStatus: 'Disqualified',
                    disqualified: {
                      disqualificationStage: data.disqualificationStage,
                      disqualificationStatus: data.disqualificationStatus,
                      disqualificationReason: data.disqualificationReason,
                      disqualificationFeedback: data.disqualificationFeedback || "",
                    }
                  }
                : candidate
            )
          };
        });

        
        handleCloseDisqualificationDialog();
      } catch (error: any) {
        console.error('Error disqualifying candidate:', error);
        alert(error.message || 'Failed to disqualify candidate. Please try again.');
      }
    }
  };

  const handleAutoCreateCandidateSubmit = async (candidate: any) => {
    try {
      console.log('Auto-create candidate for temp candidate:', autoCreateCandidateDialog.candidate?.name, candidate);
      
      // The conversion is now handled by the CreateCandidateForm itself
      // We just need to refresh the job data after successful conversion
      
      // Refresh the job data to reflect the changes
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
          currentStage: (c as any).currentStage || "Sourcing",
          avatar: undefined,
          experience: (c as any).candidateId?.experience,
          currentSalary: (c as any).candidateId?.currentSalary,
          currentSalaryCurrency: (c as any).candidateId?.currentSalaryCurrency,
          expectedSalary: (c as any).candidateId?.expectedSalary,
          expectedSalaryCurrency: (c as any).candidateId?.expectedSalaryCurrency,
          currentJobTitle: (c as any).candidateId?.currentJobTitle,
          previousCompanyName: (c as any).candidateId?.previousCompanyName,
          currentCompanyName: (c as any).candidateId?.currentCompanyName,
          status: (c as any).status,
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
          isTempCandidate: (c as any).candidateId?.isTempCandidate || false,
        })) as Candidate[],
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
      
      handleCloseAutoCreateDialog();
    } catch (error) {
      console.error('Error handling temp candidate conversion:', error);
      // Handle error appropriately
    }
  };

  const handleCancelStatusChange = () => {
    setStatusChangeDialog({ isOpen: false, candidate: null, newStatus: null });
  };

  // Function to get filtered candidates based on selected stage
  const getFilteredCandidates =useMemo(() => {
    if (!selectedStageFilter) return job?.candidates || [];
    return (job?.candidates || []).filter((candidate) => candidate.currentStage === selectedStageFilter);
  }, [job, selectedStageFilter]);

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

        <PipelineJobHeader job={job} onAddCandidate={handleAddCandidate} />

        <PipelineStageFilters
          job={job}
          selectedStage={selectedStageFilter}
          onSelectStage={setSelectedStageFilter}
        />

        {/* Candidates Table */}
        {selectedStageFilter && (
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 mb-4 ml-6 mr-6">
            Showing candidates in: <span className="font-semibold">{selectedStageFilter}</span>
            <span className="ml-2 text-blue-500">({getFilteredCandidates.length} candidates)</span>
          </div>
        )}
        <PipelineCandidatesTable
          job={job}
          candidates={getFilteredCandidates}
          onStageChange={handleStageChange}
          onStatusChange={handleStatusChange}
          onViewCandidate={handleViewCandidate}
          onViewResume={handleViewResume}
          onDeleteCandidate={handleDeleteCandidate}
        />
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

      {/* PDF Viewer */}
      <PDFViewer
        isOpen={pdfViewer.isOpen}
        onClose={handleClosePdfViewer}
        pdfUrl={pdfViewer.pdfUrl || undefined}
        candidateName={pdfViewer.candidateName || undefined}
      />

      {/* Interview Details Dialog */}
      <InterviewDetailsDialog
        isOpen={interviewDialog.isOpen}
        onClose={handleCloseInterviewDialog}
        onConfirm={handleConfirmInterviewDetails}
        candidateName={interviewDialog.candidate?.name}
      />

      {/* Temp Candidate Alert Dialog */}
      <TempCandidateAlertDialog
        isOpen={tempCandidateAlert.isOpen}
        onClose={handleCloseTempCandidateAlert}
        candidateName={tempCandidateAlert.candidateName || undefined}
        message={tempCandidateAlert.message || undefined}
      />

      {/* Auto-Create Candidate Dialog for Temp Candidates */}
      <CreateCandidateModal
        isOpen={autoCreateCandidateDialog.isOpen}
        onClose={handleCloseAutoCreateDialog}
        onCandidateCreated={handleAutoCreateCandidateSubmit}
        tempCandidateData={autoCreateCandidateDialog.candidate ? {
          name: autoCreateCandidateDialog.candidate.name,
          email: autoCreateCandidateDialog.candidate.email,
          phone: autoCreateCandidateDialog.candidate.phone,
          location: autoCreateCandidateDialog.candidate.location,
          description: autoCreateCandidateDialog.candidate.description,
          gender: autoCreateCandidateDialog.candidate.gender,
          dateOfBirth: autoCreateCandidateDialog.candidate.dateOfBirth,
          country: autoCreateCandidateDialog.candidate.country,
          nationality: autoCreateCandidateDialog.candidate.nationality,
          willingToRelocate: autoCreateCandidateDialog.candidate.willingToRelocate,
        } : undefined}
        isTempCandidateConversion={true}
        pipelineId={id}
        tempCandidateId={autoCreateCandidateDialog.candidate?.id}
      />

      {/* Disqualification Dialog */}
      <DisqualificationDialog
        isOpen={disqualificationDialog.isOpen}
        onClose={handleCloseDisqualificationDialog}
        onConfirm={handleConfirmDisqualification}
        candidateName={disqualificationDialog.candidate?.name || ''}
        currentStage={disqualificationDialog.candidate?.currentStage || ''}
        currentStageStatus={disqualificationDialog.candidate?.status || ''}
      />
    </>
  );
};

export default Page;
