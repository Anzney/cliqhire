"use client";

import React from "react";
import { ChevronDown, EllipsisVertical, ChevronRight, Users, MapPin, DollarSign, Briefcase, Building2, Tag, Pin, Loader2, Eye, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddCandidateDialog } from "./add-candidate-dialog";
import { AddExistingCandidateDialog } from "@/components/common/add-existing-candidate-dialog";
import { CreateCandidateDialog, type CreateCandidateValues } from "./create-candidate-dialog";
import { Button } from "@/components/ui/button";
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
                  {/* {job.priority && (
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
                  )} */}
                </div>
              </div>
            </div>
            
            {/* Add Candidate Button */}
            <Button
              onClick={handleAddCandidate}
              size="sm"
              className="ml-4  text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Candidate
            </Button>
          </div>
        </CardHeader>

        {/* Expanded Content */}
        {job.isExpanded && (
          <CardContent className="pt-0">
            
            {/* Pipeline Stage Badges - Updated counts considering local changes */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(() => {
                const updatedCounts = getUpdatedStageCounts();
                return pipelineStages.map((stage) => {
                  const count = updatedCounts[stage] || 0;
                  return (
                    <Badge 
                      key={stage}
                      variant="outline" 
                      className={`${getStageColor(stage)} border`}
                    >
                      {stage}: {count}
                    </Badge>
                  );
                });
              })()}
            </div>

            {/* Candidate Cards - Fixed height with scrollable content */}
            <div className="max-h-[300px] overflow-y-auto border-2 border-blue-200 rounded-md p-2 bg-gray-50" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6'
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
                {job.candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    jobId={job.id}
                    onStageChange={handleStageChange}
                    onViewCandidate={handleViewCandidate}
                    onViewResume={(candidate) => console.log('View resume for:', candidate.name)}
                    onDeleteCandidate={handleDeleteCandidate}
                    getCurrentStage={getCandidateStage}
                  />
                ))}
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
    </>
  );
}

interface CandidateCardProps {
  candidate: Candidate;
  jobId: string;
  onStageChange: (candidate: Candidate, newStage: string) => void;
  onViewCandidate: (candidate: Candidate) => void;
  onViewResume: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
  getCurrentStage: (jobId: string, candidateId: string) => string | null;
}

function CandidateCard({ candidate, jobId, onStageChange, onViewCandidate, onViewResume, onDeleteCandidate, getCurrentStage }: CandidateCardProps) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-3">
        {/* Left side - Avatar, Name, Current Position */}
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback className="text-xs bg-gray-200">
              {candidate.name ? candidate.name.split(' ').map(n => n[0]).join('') : 'NA'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {candidate.name || 'Unknown Candidate'}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {candidate.currentJobTitle || 'Position not specified'}
            </p>
          </div>
        </div>
        
                 {/* Right side - Three-dot menu */}
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <button
               className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
               onClick={(e) => e.stopPropagation()}
               title="More options"
             >
              <EllipsisVertical className="h-4 w-4" />
             </button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-40">
             <DropdownMenuItem 
               onClick={(e) => {
                 e.stopPropagation();
                 onViewCandidate(candidate);
               }}
               className="cursor-pointer"
             >
               <Eye className="h-4 w-4 mr-2" />
               View & Edit Details
             </DropdownMenuItem>
             <DropdownMenuItem 
               onClick={(e) => {
                 e.stopPropagation();
                 onViewResume(candidate);
               }}
               className="cursor-pointer"
             >
               <Briefcase className="h-4 w-4 mr-2" />
               View Resume
             </DropdownMenuItem>
                           <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCandidate(candidate);
                }}
                className="cursor-pointer"
              >
                                <Trash2 className="size-4 mr-2 text-red-500" />
                                Delete Candidate
                              </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
      </div>
      
      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        {/* Left side - Status dropdowns */}
        <div className="flex items-center space-x-2 flex-1">
          <Select
            value={getCurrentStage(jobId, candidate.id) || candidate.currentStage}
            onValueChange={(value) => onStageChange(candidate, value)}
          >
            <SelectTrigger className="h-6 text-xs px-2">
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
        
        {/* Right side - Two avatars */}
        <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/api/placeholder/24/24" />
            <AvatarFallback className="text-xs bg-blue-200">JD</AvatarFallback>
          </Avatar>
          <Avatar className="h-6 w-6">
            <AvatarImage src="/api/placeholder/24/24" />
            <AvatarFallback className="text-xs bg-green-200">HR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
