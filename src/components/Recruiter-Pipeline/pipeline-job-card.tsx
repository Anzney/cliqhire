"use client";

import React from "react";
import { ChevronDown, EllipsisVertical, ChevronRight, Users, MapPin, DollarSign, Briefcase, Building2, Tag, Pin, Loader2, Eye, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddCandidateDialog } from "./add-candidate-dialog";
import { AddExistingCandidateDialog } from "@/components/common/add-existing-candidate-dialog";
import { CreateCandidateDialog, type CreateCandidateValues } from "./create-candidate-dialog";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { deleteCandidateFromPipeline } from "@/services/recruitmentPipelineService";
import { 
  pipelineStages, 
  getStageColor, 
  type Job,
  type Candidate 
} from "./dummy-data";
import { CandidateDetailsDialog } from "./candidate-details-dialog";
import { StatusChangeConfirmationDialog } from "./status-change-confirmation-dialog";
import { useStageStore } from "./stage-store";
import { useRouter } from "next/navigation";
import { PipelineStageBadge } from "./pipeline-stage-badge";
import { ConnectionBadge } from "./connection-badge";

interface PipelineJobCardProps {
  job: Job;
  loadingJobId: string | null;
  onToggleExpansion: (jobId: string) => void;
  onUpdateCandidateStage: (jobId: string, candidateId: string, newStage: string) => Promise<void>;
}

export function PipelineJobCard({ 
  job, 
  loadingJobId, 
  onToggleExpansion, 
  onUpdateCandidateStage 
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

  // Connection change confirmation dialog state
  const [connectionChangeDialog, setConnectionChangeDialog] = React.useState<{
    isOpen: boolean;
    candidate: Candidate | null;
    newConnection: string | null;
  }>({
    isOpen: false,
    candidate: null,
    newConnection: null,
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

  const handleStageChange = (candidate: Candidate, newStage: string) => {
    setStatusChangeDialog({
      isOpen: true,
      candidate,
      currentStage: candidate.currentStage,
      newStage,
    });
  };

  const handleConfirmStageChange = async () => {
    if (statusChangeDialog.candidate) {
      // Update local store
      updateCandidateStage(job.id, statusChangeDialog.candidate.id, statusChangeDialog.newStage);
      
      // Call the parent's update function (which now includes API integration)
      await onUpdateCandidateStage(job.id, statusChangeDialog.candidate.id, statusChangeDialog.newStage);
      
      // Close the dialog
      setStatusChangeDialog({ isOpen: false, candidate: null, currentStage: '', newStage: '' });
    }
  };

  const handleCancelStageChange = () => {
    setStatusChangeDialog({ isOpen: false, candidate: null, currentStage: '', newStage: '' });
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
        
        // TODO: Refresh the job data or trigger a reload
      } catch (error) {
        console.error('Error deleting candidate:', error);
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

  // Function to handle connection change
  const handleConnectionChange = (candidate: Candidate, newConnection: any) => {
    setConnectionChangeDialog({
      isOpen: true,
      candidate,
      newConnection,
    });
  };

  const handleConfirmConnectionChange = async () => {
    if (connectionChangeDialog.candidate && connectionChangeDialog.newConnection) {
      console.log('Connection changed for candidate:', connectionChangeDialog.candidate.name, 'to:', connectionChangeDialog.newConnection);
      // TODO: Implement API call to update connection
      
      // Close the dialog
      setConnectionChangeDialog({ isOpen: false, candidate: null, newConnection: null });
    }
  };

  const handleCancelConnectionChange = () => {
    setConnectionChangeDialog({ isOpen: false, candidate: null, newConnection: null });
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
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                    <span>{typeof job.salaryRange === 'string' ? job.salaryRange : String(job.salaryRange || '')}</span>
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
            <div className="flex flex-wrap gap-2 mb-6">
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
                  Clear Filter
                </Badge>
              )}
            </div>

            {/* Candidates Table - Single table with sticky header */}
            <div className="border-2 border-blue-200 rounded-md bg-gray-50 max-h-[300px] overflow-hidden">
              {selectedStageFilter && (
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 text-sm text-blue-700">
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
                      <TableHead className="w-[120px]">Connection</TableHead>
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
                            if (currentStage === 'Sourcing') {
                              return (
                                <ConnectionBadge
                                  connection={candidate.connection || null}
                                  onConnectionChange={(newConnection) => handleConnectionChange(candidate, newConnection)}
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
                          {candidate.hiringManager || 'Not assigned'}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {candidate.recruiter || 'Not assigned'}
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
      />
      
      {/* Status Change Confirmation Dialog */}
      <StatusChangeConfirmationDialog
        isOpen={statusChangeDialog.isOpen}
        onClose={handleCancelStageChange}
        onConfirm={handleConfirmStageChange}
        candidateName={statusChangeDialog.candidate?.name || ''}
        currentStage={statusChangeDialog.currentStage}
        newStage={statusChangeDialog.newStage}
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

      {/* Connection Change Confirmation Dialog */}
      <Dialog open={connectionChangeDialog.isOpen} onOpenChange={(open) => setConnectionChangeDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the connection for <strong>{connectionChangeDialog.newConnection}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelConnectionChange}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmConnectionChange}
            >
              Update Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Candidate card view removed and replaced by table rendering above
