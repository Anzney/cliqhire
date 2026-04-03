"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Building2, 
  Calendar,
  GraduationCap,
  Languages,
  Award,
  FileText,
  Mail,
  Phone,
  MapPin,
  Check,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { getPipelineEntry } from "@/services/recruitmentPipelineService";
import { mapEntryToJob } from "@/components/Recruiter-Pipeline/pipeline-mapper";
import { PipelineStageDetails } from "@/components/Recruiter-Pipeline/pipeline-stage-details/PipelineStageDetails";
import { useAuth } from "@/contexts/AuthContext";
import { type Job, type Candidate, pipelineStages } from "@/components/Recruiter-Pipeline/dummy-data";

import { CandidateHeaderCard } from "@/components/Recruiter-Pipeline/candidate-details/CandidateHeaderCard";
import { CandidateProgressCard } from "@/components/Recruiter-Pipeline/candidate-details/CandidateProgressCard";
import { CandidateDisqualificationCard } from "@/components/Recruiter-Pipeline/candidate-details/CandidateDisqualificationCard";
import { CandidateInfoGrid } from "@/components/Recruiter-Pipeline/candidate-details/CandidateInfoGrid";
import { CandidateDocumentsCard } from "@/components/Recruiter-Pipeline/candidate-details/CandidateDocumentsCard";

export default function CandidatePipelineDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const pipelineId = (params as any)?.id as string;
  const candidateId = (params as any)?.candidateId as string;
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const finalPermissions = (user?.permissions && user.permissions.length > 0)
    ? user.permissions
    : (user?.defaultPermissions || []);
  const canModifyPipeline = isAdmin || finalPermissions.includes('RECRUITMENT_PIPELINE_MODIFY');

  const { data: job, isLoading, error } = useQuery<Job | null>({
    queryKey: ["pipeline", pipelineId],
    queryFn: async () => {
      const res = await getPipelineEntry(pipelineId);
      const mappedJob = mapEntryToJob(res.data);
      return mappedJob as Job;
    },
    enabled: !!pipelineId,
  });

  const [selectedStage, setSelectedStage] = useState<string | undefined>(undefined);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Pipeline
        </Button>
        <div className="text-red-600">Failed to load pipeline or candidate data.</div>
      </div>
    );
  }

  const candidate = job.candidates.find(c => c.id === candidateId);

  if (!candidate) {
    return (
      <div className="p-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Pipeline
        </Button>
        <div className="text-red-600">Candidate not found in this pipeline.</div>
      </div>
    );
  }

  const handleUpdateCandidate = async () => {
    // Invalidate the query to fetch fresh candidate data for the pipeline
    await queryClient.invalidateQueries({ queryKey: ["pipeline", pipelineId] });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8">
      <div className="max-w-6xl mx-auto px-4 mt-4 space-y-4">
        {/* Modern Back Button */}
        <div 
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer w-fit -ml-1 py-1" 
          onClick={() => router.push(`/reactruterpipeline/${pipelineId}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Pipeline
        </div>
        
        <CandidateHeaderCard candidate={candidate} />
        
        <CandidateProgressCard 
          candidate={candidate} 
          selectedStage={selectedStage} 
          setSelectedStage={setSelectedStage} 
        />
        
        <CandidateDisqualificationCard candidate={candidate} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4">
          <PipelineStageDetails 
            candidate={candidate}
            selectedStage={selectedStage}
            onStageSelect={setSelectedStage}
            onUpdateCandidate={handleUpdateCandidate}
            pipelineId={pipelineId}
            canModify={canModifyPipeline}
          />
        </div>

        <CandidateInfoGrid candidate={candidate} />
        
        <CandidateDocumentsCard candidate={candidate} />
      </div>
    </div>
  );
}
