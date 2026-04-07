import React from "react";
import { Briefcase, Check, FileText } from "lucide-react";
import { type Candidate } from "@/components/Recruiter-Pipeline/dummy-data";

export function CandidateDisqualificationCard({ candidate }: { candidate: Candidate }) {
  if (candidate.status !== 'Disqualified') return null;

  return (
    <div className="bg-red-50/40 border border-red-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center mr-2">
          <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-red-900">Disqualification Details</h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <p className="text-[10px] uppercase font-bold text-red-800/70 tracking-wider mb-0.5">Disqualified Stage</p>
          <p className="text-xs text-red-900 font-medium">{candidate.disqualified?.disqualificationStage || candidate.currentStage || 'Not specified'}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] uppercase font-bold text-red-800/70 tracking-wider mb-0.5">Status</p>
          <p className="text-xs text-red-900 font-medium">{candidate.disqualified?.disqualificationStatus || 'Not specified'}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] uppercase font-bold text-red-800/70 tracking-wider mb-0.5">Reason</p>
          <p className="text-xs text-red-900 font-medium">{candidate.disqualified?.disqualificationReason || candidate.notes || 'Not specified'}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] uppercase font-bold text-red-800/70 tracking-wider mb-0.5">Feedback</p>
          <p className="text-xs text-red-900 font-medium">{candidate.disqualified?.disqualificationFeedback || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
}
