"use client";

import React from "react";
import { ChevronDown, EllipsisVertical, ChevronRight, Users, MapPin, CircleDollarSign , Briefcase, Building2, Tag, Pin, Loader2, Eye, Plus, Trash2, X, Table as TableIcon} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddCandidateDialog } from "./add-candidate-dialog";
import { AddExistingCandidateDialog } from "@/components/common/add-existing-candidate-dialog";
import { CreateCandidateDialog, type CreateCandidateValues } from "./create-candidate-dialog";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { deleteCandidateFromPipeline, updateCandidateStatus } from "@/services/recruitmentPipelineService";
import { RecruiterPipelineService } from "@/services/recruiterPipelineService";
import { 
  pipelineStages, 
  getStageColor, 
  type Job,
  type JobTeamInfo,
  type Candidate,
  mapUIStageToBackendStage
} from "./dummy-data";
import { CandidateDetailsDialog } from "./candidate-details-dialog";
import { StatusChangeConfirmationDialog } from "./status-change-confirmation-dialog";
import { useStageStore } from "./stage-store";
import { useRouter } from "next/navigation";
import { PipelineStageBadge } from "./pipeline-stage-badge";
import { StatusBadge } from "./status-badge";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { validateTempCandidateStageChange, isTempCandidate, validateTempCandidateStatusChange } from "@/lib/temp-candidate-validation";
import { TempCandidateAlertDialog } from "./temp-candidate-alert-dialog";
import { DisqualificationDialog, type DisqualificationData } from "./disqualification-dialog";

interface PipelineJobCardProps {
  job: Job;
  loadingJobId: string | null;
  onToggleExpansion: (jobId: string) => void;
  onUpdateCandidateStage: (jobId: string, candidateId: string, newStage: string) => Promise<void>;
  onCandidateUpdate?: (jobId: string, updatedCandidate: Candidate) => void;
}

export function PipelineJobCard({ 
  job, 
  loadingJobId, 
  onToggleExpansion, 
  onUpdateCandidateStage,
  onCandidateUpdate
}: PipelineJobCardProps) {
  const router = useRouter();
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = React.useState(false);
  const [isCreateCandidateOpen, setIsCreateCandidateOpen] = React.useState(false);
  
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

  // Delete candidate confirmation dialog state
  const [deleteCandidateDialog, setDeleteCandidateDialog] = React.useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // PDF viewer state
  const [pdfViewer, setPdfViewer] = React.useState<{
    isOpen: boolean;
    pdfUrl: string | null;
    candidateName: string | null;
  }>({
    isOpen: false,
    pdfUrl: null,
    candidateName: null,
  });

  // Temp candidate alert dialog state
  const [tempCandidateAlert, setTempCandidateAlert] = React.useState<{
    isOpen: boolean;
    candidateName: string | null;
    message: string | null;
  }>({
    isOpen: false,
    candidateName: null,
    message: null,
  });

  // Auto-create candidate dialog state for temp candidates
  const [autoCreateCandidateDialog, setAutoCreateCandidateDialog] = React.useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // Disqualification dialog state
  const [disqualificationDialog, setDisqualificationDialog] = React.useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({
    isOpen: false,
    candidate: null,
  });

  // Local stage store
  const { updateCandidateStage, getCandidateStage } = useStageStore();

  // Function to calculate updated stage counts considering local changes
  const getUpdatedStageCounts = () => {
    const stageCounts: { [key: string]: number } = {};
    
    // Initialize counts for all stages
    pipelineStages.forEach(stage => {
      stageCounts[stage] = 0;
    });
    
    // Count candidates based on their current stage (including local changes)
    job.candidates.forEach(candidate => {
      const currentStage = getCandidateStage(job.id, candidate.id) || candidate.currentStage;
      stageCounts[currentStage] = (stageCounts[currentStage] || 0) + 1;
    });
    
    return stageCounts;
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
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
    
    console.log('Candidate updated in pipeline job card:', updatedCandidate);
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

    // If changing to Disqualified, show disqualification dialog
    if (newStage === 'Disqualified') {
      setDisqualificationDialog({
        isOpen: true,
        candidate,
      });
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

  const handleDeleteCandidate = (candidate: Candidate) => {
    setDeleteCandidateDialog({
      isOpen: true,
      candidate,
    });
  };

  const handleConfirmDeleteCandidate = async () => {
    if (deleteCandidateDialog.candidate) {
      try {
        // Call API to remove candidate from pipeline
        await deleteCandidateFromPipeline(job.id, deleteCandidateDialog.candidate.id);
        
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
    e.stopPropagation(); // Prevent triggering the card expansion
    setIsAddCandidateOpen(true);
  };

  const handleAddExistingCandidate = () => {
    // Open the shared Add Existing Candidate dialog
    setIsAddExistingOpen(true);
  };

  const handleAddNewCandidate = () => {
    setIsCreateCandidateOpen(true);
  };

  const handleCreateCandidateSubmit = (values: CreateCandidateValues) => {
    console.log('Create candidate for job:', job.id, values);
    console.log('Job object:', job);
    console.log('Job ID type:', typeof job.id);
    // TODO: integrate API call
  };

  const [isAddExistingOpen, setIsAddExistingOpen] = React.useState(false);
  
  // Filter state for stage filtering
  const [selectedStageFilter, setSelectedStageFilter] = React.useState<string | null>(null);

  // Function to get filtered candidates based on selected stage
  const getFilteredCandidates = () => {
    if (!selectedStageFilter) {
      return job.candidates;
    }
    return job.candidates.filter(candidate => {
      const currentStage = getCandidateStage(job.id, candidate.id) || candidate.currentStage;
      return currentStage === selectedStageFilter;
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

  // Function to handle status change
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

    setStatusChangeDialog({
      isOpen: true,
      candidate,
      newStatus,
    });
  };


  const handleConfirmStatusChange = async () => {
    if (statusChangeDialog.candidate && statusChangeDialog.newStatus) {
      try {
        await updateCandidateStatus(job.id, statusChangeDialog.candidate.id, {
          status: statusChangeDialog.newStatus,
          stage: mapUIStageToBackendStage(statusChangeDialog.candidate.currentStage),
          notes: `Status updated to ${statusChangeDialog.newStatus}`,
        });
        
        // Notify the parent component about the update
        onCandidateUpdate?.(job.id, {
          ...statusChangeDialog.candidate,
          subStatus: statusChangeDialog.newStatus,
        });
        
        setStatusChangeDialog({ isOpen: false, candidate: null, newStatus: null });
      } catch (error) {
        console.error('Error updating candidate status:', error);
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
    });
  };

  const handleConfirmDisqualification = async (data: DisqualificationData) => {
    if (disqualificationDialog.candidate) {
      try {
        console.log('Disqualifying candidate:', disqualificationDialog.candidate.name, data);
        
        // First, call API to update disqualification fields
        const fieldsUpdateResult = await RecruiterPipelineService.updateStageFields(
          job.id,
          disqualificationDialog.candidate.id,
          'Disqualified',
          {
            fields: {
              disqualificationStage: data.disqualificationStage,
              disqualificationStatus: data.disqualificationStatus,
              disqualificationReason: data.disqualificationReason,
            },
            notes: `Disqualified: ${data.disqualificationReason}`
          }
        );

        if (!fieldsUpdateResult.success) {
          throw new Error(fieldsUpdateResult.error || 'Failed to update disqualification fields');
        }

        // Then call API to update candidate stage to Disqualified
        await onUpdateCandidateStage(job.id, disqualificationDialog.candidate.id, 'Disqualified');
        
        handleCloseDisqualificationDialog();
      } catch (error) {
        console.error('Error disqualifying candidate:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleAutoCreateCandidateSubmit = async (candidate: any) => {
    try {
      console.log('Auto-create candidate for temp candidate:', autoCreateCandidateDialog.candidate?.name, candidate);
      
      // The conversion is now handled by the CreateCandidateForm itself
      // We just need to refresh the job data after successful conversion
      
      // Notify the parent component about the update
      onCandidateUpdate?.(job.id, candidate);
      
      handleCloseAutoCreateDialog();
    } catch (error) {
      console.error('Error handling temp candidate conversion:', error);
      // Handle error appropriately
    }
  };

  return (
    <>
      <Card className="overflow-hidden shadow-sm border-gray-200">
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
                    <CircleDollarSign  className="h-4 w-4 text-yellow-500" />
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
        </CardHeader>

        {/* Expanded Content */}
        {job.isExpanded && (
          <CardContent className="pt-0">
            
            {/* Pipeline Stage Badges - Clickable filters */}
            <div className="flex flex-wrap gap-2 mb-6 ml-6">
              {(() => {
                const updatedCounts = getUpdatedStageCounts();
                return pipelineStages.map((stage) => {
                  const count = updatedCounts[stage] || 0;
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
                });
              })()}
              {selectedStageFilter && (
                <Badge 
                  variant="outline" 
                  className="bg-gray-100 text-gray-600 border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedStageFilter(null)}
                >
                  <X className="text-red-500 h-3 w-3 mr-1" />
                  Clear Filter
                </Badge>
              )}
            </div>

            {/* Candidates Table - Single table with sticky header */}
            <div className="border-2 border-blue-200 rounded-md bg-gray-50 max-h-[300px] overflow-hidden">
              {selectedStageFilter && (
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 text-sm text-blue-700 ">
                  Showing candidates in: <span className="font-semibold">{selectedStageFilter}</span>
                  <span className="ml-2 text-blue-500">({getFilteredCandidates().length} candidates)</span>
                </div>
              )}
              <div className="overflow-y-auto max-h-[300px]" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#d1d5db #f3f4f6'
              }}>
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
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
                      <TableRow key={candidate.id} className="bg-white">
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
                            stage={getCandidateStage(job.id, candidate.id) || candidate.currentStage}
                            onStageChange={(newStage) => handleStageChange(candidate, newStage)}
                          />
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const currentStage = getCandidateStage(job.id, candidate.id) || candidate.currentStage;
                            const stagesWithStatus = ['Sourcing', 'Screening', 'Client Status', 'Interview', 'Verification'];
                            if (stagesWithStatus.includes(currentStage)) {
                              return (
                                <StatusBadge
                                  status={(candidate.status as any) || null}
                                  stage={currentStage}
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
                              {candidate.resume && (
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewResume(candidate);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Briefcase className="h-4 w-4 mr-2" />
                                  View Resume
                                </DropdownMenuItem>
                              )}
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
            </div>
          </CardContent>
        )}
      </Card>
      
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
