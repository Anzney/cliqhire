"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronRight, Users, MapPin, HandCoins , Building2, Loader2, Plus, Table as TableIcon, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HeadhunterAddCandidateDialog } from "@/components/Headhunter-Pipeline/headhunter-add-candidate-dialog";
import { AddExistingCandidateDialog } from "@/components/common/add-existing-candidate-dialog";
import { AddCandidateDialog } from "@/components/Recruiter-Pipeline/add-candidate-dialog";
import { CreateCandidateDialog, type CreateCandidateValues } from "./create-candidate-dialog";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { Button } from "@/components/ui/button";
import { deleteCandidateFromPipeline, updateCandidateStatus } from "@/services/recruitmentPipelineService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  type Job,
  type Candidate,
  mapUIStageToBackendStage
} from "./dummy-data";
import { CandidateDetailsDialog } from "./candidate-details-dialog";
import { HeadhunterCandidateViewDialog } from "@/components/Headhunter-Pipeline/headhunter-candidate-view-dialog";
import { StatusChangeConfirmationDialog } from "./status-change-confirmation-dialog";
import { useStageStore } from "./stage-store";
import { useRouter } from "next/navigation";
import { PipelineJobExpanded } from "./PipelineJobExpanded";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { validateTempCandidateStageChange, validateTempCandidateStatusChange } from "@/lib/temp-candidate-validation";
import { TempCandidateAlertDialog } from "./temp-candidate-alert-dialog";
import { DisqualificationDialog, type DisqualificationData } from "./disqualification-dialog";
import { InterviewDetailsDialog } from "./interview-details-dialog";

interface PipelineJobCardProps {
  job: Job;
  loadingJobId: string | null;
  onToggleExpansion: (jobId: string) => void;
  onUpdateCandidateStage: (
    jobId: string,
    candidateId: string,
    newStage: string,
    extras?: { interviewDate?: string; interviewMeetingLink?: string }
  ) => Promise<void>;
  onCandidateUpdate?: (jobId: string, updatedCandidate: Candidate) => void;
  isHighlighted?: boolean;
  canModify?: boolean;
  hideCopyFormAndViewTableButtons?: boolean;
  tableOptions?: { showStageColumn?: boolean; showClientNameColumn?: boolean };
  hideStageFilters?: boolean;
  hideClientName?: boolean;
  statusOptionsOverride?: string[];
  isHeadhunterMode?: boolean;
}

export function PipelineJobCard({ 
  job, 
  loadingJobId, 
  onToggleExpansion, 
  onUpdateCandidateStage,
  onCandidateUpdate,
  isHighlighted = false,
  canModify = true,
  hideCopyFormAndViewTableButtons = false,
  tableOptions,
  hideStageFilters = false,
  hideClientName = false,
  statusOptionsOverride,
  isHeadhunterMode = false,
}: PipelineJobCardProps) {
  const router = useRouter();
  const cardRef =useRef<HTMLDivElement | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateCandidateOpen, setIsCreateCandidateOpen]= useState(false);
  // Consolidated UI state
  const [isAddExistingOpen, setIsAddExistingOpen] = useState(false);
  const [isAddOptionsOpen, setIsAddOptionsOpen] = useState(false);
  const [selectedStageFilter, setSelectedStageFilter] = useState<string | null>(null);
  const [isFormLinkCopied, setIsFormLinkCopied] = useState(false);
  
  
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

  // Interview details dialog state
  const [interviewDialog, setInterviewDialog] = useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // Stage change confirmation dialog state
  const [stageChangeDialog, setStageChangeDialog] = useState<{
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

  // Delete candidate confirmation dialog state
  const [deleteCandidateDialog, setDeleteCandidateDialog] =useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // PDF viewer state
  const [pdfViewer, setPdfViewer] = useState<{
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
  const [autoCreateCandidateDialog, setAutoCreateCandidateDialog] =useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // Disqualification dialog state
  const [disqualificationDialog, setDisqualificationDialog] =useState<{
    isOpen: boolean;
    candidate: Candidate | null;
    newStatus: string | null;
  }>({
    isOpen: false,
    candidate: null,
    newStatus: null,
  });

  // Local stage store
  const { updateCandidateStage, getCandidateStage } = useStageStore();

  // React Query client and mutations
  const queryClient = useQueryClient();

  const deleteCandidateMutation = useMutation({
    mutationFn: (vars: { jobId: string; candidateId: string }) =>
      deleteCandidateFromPipeline(vars.jobId, vars.candidateId),
    onSuccess: () => {
      // Invalidate any cached pipeline/job data
      queryClient.invalidateQueries({ queryKey: ["pipeline", job.id] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (vars: { candidateId: string; payload: any }) =>
      updateCandidateStatus(job.id, vars.candidateId, vars.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline", job.id] });
    },
  });

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  const handleCopyCandidateFormLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const path = `${window.location.origin}/candidate?job=${encodeURIComponent(job.title)}`; // Route groups like (form) are ignored in URL paths
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(path);
      } else {
        const ta = document.createElement("textarea");
        ta.value = path;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setIsFormLinkCopied(true);
      window.setTimeout(() => setIsFormLinkCopied(false), 15000);
    } catch (err) {
      console.error("Failed to copy candidate form path", err);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCandidate(null);
  };

  const handleCandidateUpdate = async (updatedCandidate: Candidate) => {
    // Update the local selected candidate
    setSelectedCandidate(updatedCandidate);
    
    // Notify the parent component about the update
    onCandidateUpdate?.(job.id, updatedCandidate);
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

    // If moving to Interview, open interview details dialog first
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
      // Update local store
      updateCandidateStage(job.id, stageChangeDialog.candidate.id, stageChangeDialog.newStage);
      
      // Call the parent's update function (which now includes API integration)
      await onUpdateCandidateStage(job.id, stageChangeDialog.candidate.id, stageChangeDialog.newStage);
      
      // Close the dialog
      setStageChangeDialog({ isOpen: false, candidate: null, currentStage: '', newStage: '' });
    }
  };

  const handleCancelStageChange = () => {
    setStageChangeDialog({ isOpen: false, candidate: null, currentStage: '', newStage: '' });
  };

  const handleCloseInterviewDialog = () => {
    setInterviewDialog({ isOpen: false, candidate: null });
  };

  const handleConfirmInterviewDetails = async (dateTime: string, meetingLink: string) => {
    // For now, we are only required to collect details before updating the stage.
    // Proceed to update local store and call parent's stage update to Interview.
    const candidate = interviewDialog.candidate;
    if (!candidate) return;
    try {
      // Update local store immediately
      updateCandidateStage(job.id, candidate.id, 'Interview');
      // Call API via parent handler with interview details so they are persisted
      await onUpdateCandidateStage(job.id, candidate.id, 'Interview', {
        interviewDate: dateTime,
        interviewMeetingLink: meetingLink,
      });
      // Optionally, TODO: persist dateTime/meetingLink via dedicated API if available.
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
        // Call API to remove candidate from pipeline via React Query
        await deleteCandidateMutation.mutateAsync({
          jobId: job.id,
          candidateId: deleteCandidateDialog.candidate.id,
        });
        
        // Close the dialog
        setDeleteCandidateDialog({ isOpen: false, candidate: null });
        
        // Notify the parent component about the candidate deletion
        // This will trigger a refresh of the job data
        onCandidateUpdate?.(job.id, deleteCandidateDialog.candidate);
      } catch (error) {
        console.error('Error deleting candidate:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleCancelDeleteCandidate = () => {
    setDeleteCandidateDialog({ isOpen: false, candidate: null });
  };

  const handleAddCandidate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canModify) return;
    if (isHeadhunterMode) {
      setIsAddExistingOpen(true);
    } else {
      setIsAddOptionsOpen(true);
    }
  };

  const handleAddExistingCandidate = () => {
    if (!canModify) return;
    // Open the shared Add Existing Candidate dialog
    setIsAddExistingOpen(true);
  };

  const handleAddNewCandidate = () => {
    if (!canModify) return;
    if (isHeadhunterMode) {
      setAutoCreateCandidateDialog({ isOpen: true, candidate: null });
    } else {
      setIsCreateCandidateOpen(true);
    }
  };

  const handleCreateCandidateSubmit = async (_values: CreateCandidateValues) => {
    try {
      // Ask parent to refresh this job and list
      onCandidateUpdate?.(job.id, {} as any);
      // Invalidate the broader list query used by parent: ["pipelineEntries", userId]
      await queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "pipelineEntries" });
      // Force revalidation for any server-rendered segments
      router.refresh();
    } catch (e) {
      console.error('Error after creating new candidate:', e);
    }
  };

  

  // Filtering is handled in child via selectedStageFilter

  // Function to handle status change
  const handleStatusChange = (candidate: Candidate, newStatus: any) => {
    if (!isHeadhunterMode) {
      const validation = validateTempCandidateStatusChange(candidate, newStatus);
      if (!validation.canChangeStage) {
        setTempCandidateAlert({
          isOpen: true,
          candidateName: candidate.name,
          message: validation.message || null,
        });
        return;
      }
      if (validation.shouldOpenCreateDialog) {
        setAutoCreateCandidateDialog({
          isOpen: true,
          candidate: candidate,
        });
        return;
      }
      if (newStatus === 'Disqualified') {
        setDisqualificationDialog({
          isOpen: true,
          candidate,
          newStatus,
        });
        return;
      }
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
        if (isHeadhunterMode) {
          onCandidateUpdate?.(job.id, {
            ...statusChangeDialog.candidate,
            subStatus: statusChangeDialog.newStatus,
          } as any);
        } else {
          await updateStatusMutation.mutateAsync({
            candidateId: statusChangeDialog.candidate.id,
            payload: {
              status: statusChangeDialog.newStatus,
              stage: mapUIStageToBackendStage(statusChangeDialog.candidate.currentStage),
              notes: `Status updated to ${statusChangeDialog.newStatus}`,
            },
          });
          onCandidateUpdate?.(job.id, {
            ...statusChangeDialog.candidate,
            subStatus: statusChangeDialog.newStatus,
          });
        }
        setStatusChangeDialog({ isOpen: false, candidate: null, newStatus: null });
      } catch (error: any) {
        console.error('Error updating candidate status:', error);
        alert(error.message || 'Failed to update candidate status. Please try again.');
      }
    }
  };

  const handleViewResume = (candidate: Candidate) => {
    setPdfViewer({
      isOpen: true,
      pdfUrl: candidate.resume || null,
      candidateName: candidate.name || null,
    });
  };

  const handleCancelStatusChange = () => {
    setStatusChangeDialog({ isOpen: false, candidate: null, newStatus: null });
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
        // Single API call to update candidate status with all disqualification data via React Query
        await updateStatusMutation.mutateAsync({
          candidateId: disqualificationDialog.candidate.id,
          payload: {
            status: 'Disqualified',
            stage: mapUIStageToBackendStage(disqualificationDialog.candidate.currentStage),
            notes: `Disqualified: ${data.disqualificationReason}`,
            disqualificationStage: data.disqualificationStage,
            disqualificationStatus: data.disqualificationStatus,
            disqualificationReason: data.disqualificationReason,
            disqualificationFeedback: data.disqualificationFeedback || "",
          },
        });
        
        // Notify the parent component about the update
        onCandidateUpdate?.(job.id, {
          ...disqualificationDialog.candidate,
          status: 'Disqualified',

        });
        
        handleCloseDisqualificationDialog();
      } catch (error) {
        console.error('Error disqualifying candidate:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleAutoCreateCandidateSubmit = async (candidate: any) => {
    try {  
      // Notify the parent component about the update
      onCandidateUpdate?.(job.id, candidate);
      // Invalidate pipeline list/details queries to refetch latest data after create/convert
      await queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "pipelineEntries" });
      // Force revalidation for any server-rendered segments
      // router.refresh();
      
      handleCloseAutoCreateDialog();
    } catch (error) {
      console.error('Error handling temp candidate conversion:', error);
      // Handle error appropriately
    }
  };

  return (
    <>
      <Card 
        ref={cardRef}
        className={`overflow-hidden shadow-sm border-gray-200 transition-all ${
          isHighlighted ? 'ring-2 ring-blue-400 border-blue-300 bg-blue-50/40' : ''
        }`}
      >
        {/* Job Header - Clickable */}
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onToggleExpansion(job.id)}
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
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    {!hideClientName && (
                      <>
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.clientName}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <HandCoins  className="h-4 w-4 text-yellow-500" />
                    <span>{typeof job.salaryRange === 'string' ? job.salaryRange : String(job.salaryRange || '')}</span>
                  </div>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700">
                    {job.jobType}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>{job.totalCandidates || job.candidates.length} candidates</span>
                  </div>
                  {job.jobId?.stage && (
                    <Badge 
                      variant="outline" 
                      className="bg-gray-100 text-gray-700 border-gray-200"
                    >
                      {job.jobId.stage}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* View Table + Add Candidate (horizontal) */}
            <div className="flex items-center gap-2 ml-4">
              {hideCopyFormAndViewTableButtons ? (
                canModify && (
                  <Button
                    onClick={handleAddCandidate}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Candidate
                  </Button>
                )
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyCandidateFormLink}
                    title="Copy candidate form path"
                  >
                    {isFormLinkCopied ? (
                      <Check className="size-4 mr-1 text-green-600" />
                    ) : (
                      <Copy className="size-4 mr-1" />
                    )}
                    {isFormLinkCopied ? "Copied" : "Copy Form URL"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/reactruterpipeline/${job.id}`);
                    }}
                  >
                    <TableIcon className="size-4 mr-1" />
                    View Table
                  </Button>
                  {canModify && (
                    <Button
                      onClick={handleAddCandidate}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Attach Candidate
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Expanded Content */}
        {job.isExpanded && (
          <CardContent className="pt-0">
            <PipelineJobExpanded
              job={job}
              selectedStageFilter={selectedStageFilter}
              onChangeStageFilter={setSelectedStageFilter}
              resolveCurrentStage={(c) => getCandidateStage(job.id, c.id) || c.currentStage}
              onStageChange={handleStageChange}
              onStatusChange={handleStatusChange as any}
              onViewCandidate={handleViewCandidate}
              onViewResume={handleViewResume}
              onDeleteCandidate={handleDeleteCandidate}
              canModify={canModify}
              tableOptions={tableOptions}
              hideStageFilters={hideStageFilters}
              statusOptionsOverride={statusOptionsOverride}
              actionsVariant={isHeadhunterMode ? "viewOnly" : "full"}
            />
          </CardContent>
        )}
      </Card>
      
      {/* Candidate Details Dialog */}
      {isHeadhunterMode ? (
        <HeadhunterCandidateViewDialog
          candidate={selectedCandidate as any}
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseDialog();
            else setIsDialogOpen(true);
          }}
          onConfirm={(data) => {
            if (!selectedCandidate) return;
            const updated: any = { ...selectedCandidate };
            if (data?.rejectionReason || data?.rejectionDate) {
              updated.subStatus = "Rejected";
              if (data.rejectionReason) updated.rejectionReason = data.rejectionReason;
              if (data.rejectionDate) updated.rejectionDate = data.rejectionDate;
            }
            handleCandidateUpdate(updated as any);
          }}
        />
      ) : (
        <CandidateDetailsDialog
          candidate={selectedCandidate}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          pipelineId={job.id}
          onCandidateUpdate={handleCandidateUpdate}
        />
      )}
      
      {/* Status Change Confirmation Dialog */}
      <StatusChangeConfirmationDialog
        isOpen={stageChangeDialog.isOpen}
        onClose={handleCancelStageChange}
        onConfirm={handleConfirmStageChange}
        candidateName={stageChangeDialog.candidate?.name || ''}
        currentStage={stageChangeDialog.currentStage}
        newStage={stageChangeDialog.newStage}
      />

      

      {/* Shared Existing Candidate selection dialog */}
      {isHeadhunterMode ? (
        <HeadhunterAddCandidateDialog
          jobId={job.id}
          jobTitle={job.title}
          open={isAddExistingOpen}
          onOpenChange={setIsAddExistingOpen}
          isPipeline={true}
          pipelineId={job.id}
          onCandidatesAdded={() => {
            onCandidateUpdate?.(job.id, {} as any);
            queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "pipelineEntries" });
          }}
        />
      ) : (
        <AddExistingCandidateDialog
          jobId={job.id}
          jobTitle={job.title}
          open={isAddExistingOpen}
          onOpenChange={setIsAddExistingOpen}
          isPipeline={true}
          pipelineId={job.id}
          onCandidatesAdded={() => {
            onCandidateUpdate?.(job.id, {} as any);
            queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "pipelineEntries" });
          }}
        />
      )}

      {/* Add Candidate options dialog for pipeline (non-headhunter) */}
      {!isHeadhunterMode && (
        <AddCandidateDialog
          open={isAddOptionsOpen}
          onOpenChange={setIsAddOptionsOpen}
          onAddExisting={() => setIsAddExistingOpen(true)}
          onAddNew={() => setIsCreateCandidateOpen(true)}
          jobTitle={job.title}
        />
      )}

      <CreateCandidateDialog
        open={isCreateCandidateOpen}
        onOpenChange={setIsCreateCandidateOpen}
        pipelineId={job.id}
        onSubmit={handleCreateCandidateSubmit}
      />
      
      {/* Debug info */}
      {isCreateCandidateOpen && (
        <div style={{display: 'none'}}>
          Debug: job.id = {job.id}, job.title = {job.title}
        </div>
      )}

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
        pipelineId={job.id}
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
}

// Candidate card view removed and replaced by table rendering above
