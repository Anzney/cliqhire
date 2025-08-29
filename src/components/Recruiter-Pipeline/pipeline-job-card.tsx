"use client";

import React from "react";
import { ChevronDown, ChevronRight, Users, MapPin, DollarSign, Briefcase, Building2, Tag, Pin, Loader2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  pipelineStages, 
  getStageColor, 
  type Job,
  type Candidate 
} from "./dummy-data";
import { CandidateDetailsDialog } from "./candidate-details-dialog";

interface PipelineJobCardProps {
  job: Job;
  loadingJobId: string | null;
  onToggleExpansion: (jobId: string) => void;
  onUpdateCandidateStage: (jobId: string, candidateId: string, newStage: string) => void;
}

export function PipelineJobCard({ 
  job, 
  loadingJobId, 
  onToggleExpansion, 
  onUpdateCandidateStage 
}: PipelineJobCardProps) {
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCandidate(null);
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
                    <span>{job.candidates.length} candidates</span>
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
          </div>
        </CardHeader>

        {/* Expanded Content */}
        {job.isExpanded && (
          <CardContent className="pt-0">
            
            {/* Pipeline Stage Badges - Use candidateSummary.byStatus for accurate counts */}
            <div className="flex flex-wrap gap-2 mb-6">
              {job.candidateSummary && job.candidateSummary.byStatus ? (
                // Use the API-provided status counts from candidateSummary.byStatus
                Object.entries(job.candidateSummary.byStatus).map(([status, count]) => (
                  <Badge 
                    key={status}
                    variant="outline" 
                    className={`${getStageColor(status)} border`}
                  >
                    {status}: {count}
                  </Badge>
                ))
              ) : (
                // Fallback to calculating from candidates array if candidateSummary is not available
                pipelineStages.map((stage) => {
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
                })
              )}
            </div>

            {/* Candidate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {job.candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  jobId={job.id}
                  onUpdateStage={onUpdateCandidateStage}
                  onViewCandidate={handleViewCandidate}
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Candidate Details Dialog */}
      <CandidateDetailsDialog
        candidate={selectedCandidate}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
}

interface CandidateCardProps {
  candidate: Candidate;
  jobId: string;
  onUpdateStage: (jobId: string, candidateId: string, newStage: string) => void;
  onViewCandidate: (candidate: Candidate) => void;
}

function CandidateCard({ candidate, jobId, onUpdateStage, onViewCandidate }: CandidateCardProps) {
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
        <button
          className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onViewCandidate(candidate);
          }}
          title="View candidate details"
        >
          <div className="flex flex-col space-y-0.5">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </button>
      </div>
      
      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        {/* Left side - Status dropdowns */}
        <div className="flex items-center space-x-2 flex-1">
          <Select
            value={candidate.currentStage}
            onValueChange={(value) => onUpdateStage(jobId, candidate.id, value)}
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
          
          <Select
            value={candidate.subStatus || "Select"}
            onValueChange={(value) => console.log('Sub-status changed:', value)}
          >
            <SelectTrigger className="h-6 text-xs px-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select" className="text-xs">Select</SelectItem>
              <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
              <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
              <SelectItem value="Completed" className="text-xs">Completed</SelectItem>
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
