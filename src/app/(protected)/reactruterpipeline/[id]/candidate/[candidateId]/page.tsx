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
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center shadow-sm sticky top-0 z-10">
        <Button variant="ghost" onClick={() => router.push(`/reactruterpipeline/${pipelineId}`)} className="mr-4 -ml-2 text-slate-500 hover:text-slate-900">
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">View & Edit Details</h1>
          <p className="text-sm text-slate-500">Pipeline: {job.title}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-6">
        {/* Candidate Title Block */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-blue-50 shadow-md">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-100 to-blue-200 text-slate-700">
                  {candidate.name ? candidate.name.split(' ').map((n: string) => n[0]).join('') : 'NA'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {candidate.name || 'Unknown Candidate'}
                </h2>
                {candidate.isTempCandidate && (
                  <Badge variant="destructive" className="text-xs px-2 py-0.5">
                    TEMP
                  </Badge>
                )}
              </div>
              <p className="text-lg text-gray-600 font-medium">
                {candidate.currentJobTitle || "Professional"}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge 
                  variant="outline" 
                  className={`font-medium ${
                    candidate.status === 'Disqualified'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {candidate.status === 'Disqualified' 
                    ? (candidate.disqualified?.disqualificationStage || candidate.currentStage)
                    : candidate.currentStage
                  }
                </Badge>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{candidate.source}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Progress Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <div className="w-full bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl p-4 border border-indigo-100/50">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Pipeline Progress</h4>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500 italic">Click any stage to view details</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${candidate.status === 'Disqualified' ? 'bg-red-500' : 'bg-indigo-500 animate-pulse'}`}></div>
                  <span className="text-sm text-gray-600 font-medium">
                    {candidate.status === 'Disqualified' 
                      ? (candidate.disqualified?.disqualificationStage || 'Disqualified')
                      : (candidate.status || 'No Status')
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="relative px-2 mb-2">
              <div className="w-full h-8 bg-white/60 rounded-full relative overflow-hidden shadow-inner border border-slate-200/50">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${
                    candidate.status === 'Disqualified' 
                      ? 'bg-gradient-to-r from-red-300 to-red-400' 
                      : 'bg-gradient-to-r from-blue-400 to-indigo-400'
                  }`}
                  style={{ 
                    width: `${(() => {
                      if (candidate.status === 'Disqualified') {
                        const disqualificationStage = candidate.disqualified?.disqualificationStage || candidate.currentStage;
                        return ((pipelineStages.indexOf(disqualificationStage) + 1) / pipelineStages.length) * 100;
                      }
                      return ((pipelineStages.indexOf(candidate.currentStage) + 1) / pipelineStages.length) * 100;
                    })()}%` 
                  }}
                ></div>
                
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  {pipelineStages.map((stage, index) => {
                    const disqualificationStage = candidate.disqualified?.disqualificationStage || candidate.currentStage;
                    const isDisqualified = candidate.status === 'Disqualified';
                    
                    let isCompleted, isCurrent;
                    if (isDisqualified) {
                      const disqualificationIndex = pipelineStages.indexOf(disqualificationStage);
                      isCompleted = disqualificationIndex >= index;
                      isCurrent = disqualificationStage === stage;
                    } else {
                      const currentIndex = pipelineStages.indexOf(candidate.currentStage);
                      isCompleted = currentIndex >= index;
                      isCurrent = candidate.currentStage === stage;
                    }
                    
                    const isSelected = selectedStage === stage;
                    const isClickable = isCompleted; 
                    
                    return (
                      <div 
                        key={stage} 
                        className={`flex items-center ${isClickable ? 'cursor-pointer group' : 'cursor-default'}`}
                        onClick={() => isClickable ? setSelectedStage(stage) : undefined}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-1.5 shadow-sm transition-all duration-200 ${
                          isCompleted 
                            ? isDisqualified 
                              ? 'bg-white text-red-500 ring-1 ring-red-200' 
                              : 'bg-white text-blue-500 ring-1 ring-indigo-200 block'
                            : 'bg-slate-100 text-slate-300 border border-slate-200'
                        } ${isSelected ? (isDisqualified ? 'ring-2 ring-red-400 scale-110' : 'ring-2 ring-indigo-400 scale-110') : ''} `}>
                          {isCompleted && <Check className="h-3 w-3" />}
                        </div>
                        <span className={`text-[11px] uppercase tracking-wider font-bold transition-all duration-200 ${
                          isCurrent ? 'text-white' : isCompleted ? 'text-white/90' : 'text-slate-400 font-medium'
                        } ${isSelected ? (isDisqualified ? 'text-red-50' : 'text-indigo-50') : ''} `}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Disqualification Details */}
          {candidate.status === 'Disqualified' && (
            <div className="mt-6 bg-red-50/50 border border-red-100 rounded-xl p-5">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-red-900">Disqualification Details</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center shrink-0">
                    <Briefcase className="h-3 w-3 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900">Disqualified Stage</p>
                    <p className="text-sm text-red-700">{candidate.disqualified?.disqualificationStage || candidate.currentStage || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900">Disqualification Status</p>
                    <p className="text-sm text-red-700">{candidate.disqualified?.disqualificationStatus || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center shrink-0">
                    <FileText className="h-3 w-3 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900">Reason</p>
                    <p className="text-sm text-red-700">{candidate.disqualified?.disqualificationReason || candidate.notes || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center shrink-0">
                    <FileText className="h-3 w-3 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900">Disqualification Feedback</p>
                    <p className="text-sm text-red-700">{candidate.disqualified?.disqualificationFeedback || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pipeline Stage Details */}
          <div className="mt-8">
            <PipelineStageDetails 
              candidate={candidate}
              selectedStage={selectedStage}
              onStageSelect={setSelectedStage}
              onUpdateCandidate={handleUpdateCandidate}
              pipelineId={pipelineId}
              canModify={canModifyPipeline}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <h4 className="font-semibold text-slate-900 mb-5 flex items-center">
              <Briefcase className="h-5 w-5 text-blue-500 mr-2.5" />
              Basic Information
            </h4>
            <div className="space-y-5">
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 bg-blue-50/50 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Current Position</p>
                  <p className="text-sm text-slate-800 font-medium">{candidate.currentJobTitle || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 bg-indigo-50/50 rounded-lg flex items-center justify-center shrink-0 border border-indigo-100">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Previous Company</p>
                  <p className="text-sm text-slate-800 font-medium">{candidate.previousCompanyName || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 bg-emerald-50/50 rounded-lg flex items-center justify-center shrink-0 border border-emerald-100">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Experience</p>
                  <p className="text-sm text-slate-800 font-medium">{candidate.experience || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <h4 className="font-semibold text-slate-900 mb-5 flex items-center">
              <Mail className="h-5 w-5 text-rose-500 mr-2.5" />
              Contact Information
            </h4>
            <div className="space-y-5">
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 bg-rose-50/50 rounded-lg flex items-center justify-center shrink-0 border border-rose-100">
                  <Mail className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm text-slate-800 font-medium">{candidate.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 bg-green-50/50 rounded-lg flex items-center justify-center shrink-0 border border-green-100">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-sm text-slate-800 font-medium">{candidate.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 bg-orange-50/50 rounded-lg flex items-center justify-center shrink-0 border border-orange-100">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-sm text-slate-800 font-medium">{candidate.location || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <h4 className="font-semibold text-slate-900 mb-5 flex items-center">
              <Award className="h-5 w-5 text-purple-500 mr-2.5" />
              Additional Info
            </h4>
            <div className="space-y-5">
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 bg-purple-50/50 rounded-lg flex items-center justify-center shrink-0 border border-purple-100">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Education</p>
                  <p className="text-sm text-slate-800 font-medium">{candidate.educationDegree || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 bg-sky-50/50 rounded-lg flex items-center justify-center shrink-0 border border-sky-100">
                  <Languages className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Languages</p>
                  <p className="text-sm text-slate-800 font-medium">{candidate.primaryLanguage || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 bg-amber-50/50 rounded-lg flex items-center justify-center shrink-0 border border-amber-100">
                  <Award className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Skills</p>
                  <p className="text-sm text-slate-800 font-medium">{candidate.skills?.join(', ') || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Desc & Resume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidate.description && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 h-full">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-slate-500 mr-2.5" />
                Description
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/60">
                <p className="text-sm text-slate-700 leading-relaxed">{candidate.description}</p>
              </div>
            </div>
          )}

          {candidate.resume && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 h-full">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2.5" />
                Documents
              </h4>
              <div className="flex items-center space-x-3 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 mb-0.5">Resume / CV</span>
                  <a 
                    href={candidate.resume} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold underline hover:no-underline transition-all"
                  >
                    View Document
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
