// Types and utilities for Recruiter Pipeline
// Updated to match the new API response structure

export interface Candidate {
  id: string;
  name: string;
  source: string;
  currentStage: string;
  avatar?: string;
  experience?: string;
  currentSalary?: number;
  currentSalaryCurrency?: string;
  expectedSalary?: number;
  expectedSalaryCurrency?: string;
  currentJobTitle?: string;
  previousCompanyName?: string;
  currentCompanyName?: string;
  subStatus?: string;
  // Additional fields from new API structure
  applicationId?: string;
  appliedDate?: string;
  lastUpdated?: string;
  applicationDuration?: number;
  // Candidate details
  email?: string;
  phone?: string;
  location?: string;
  skills?: string[];
  softSkill?: string[];
  technicalSkill?: string[];
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  nationality?: string;
  willingToRelocate?: string;
  description?: string;
  linkedin?: string;
  reportingTo?: string;
  // Additional fields for dialog
  educationDegree?: string;
  primaryLanguage?: string;
  resume?: string;
  // Pipeline-specific data
  priority?: string;
  notes?: string;
}

export interface Job {
  id: string;
  title: string;
  clientName: string;
  location: string;
  salaryRange: string;
  headcount: number;
  jobType: string;
  isExpanded: boolean;
  candidates: Candidate[];
  // Pipeline-specific fields from new API structure
  pipelineStatus?: string;
  priority?: string;
  notes?: string;
  assignedDate?: string;
  // Candidate counts from new API structure
  totalCandidates?: number;
  activeCandidates?: number;
  completedCandidates?: number;
  droppedCandidates?: number;
  numberOfCandidates?: number;
  // Recruiter information
  recruiterName?: string;
  recruiterEmail?: string;
  // Job details from API
  jobPosition?: string;
  department?: string;
  experience?: string;
  education?: string;
  specialization?: string;
  teamSize?: number;
  numberOfPositions?: number;
  workVisa?: boolean;
  gender?: string;
  deadlineByClient?: string;
  keySkills?: string[];
  certifications?: string[];
  otherBenefits?: string;
  jobDescription?: string;
  // Client information from API
  clientIndustry?: string;
  clientLocation?: string;
  clientStage?: string;
  clientCountry?: string;
  clientWebsite?: string;
  clientPhone?: string;
  clientEmails?: string[];
}

export const pipelineStages = [
    "Sourcing",
    "Screening", 
    "Client Screening",
    "Interview",
    "Verification",
    "Onboarding",
    "Hired",
    "Disqualified"
];

// Helper function to get stage colors
export const getStageColor = (stage: string) => {
  const colors = {
    "Sourcing": "bg-purple-100 text-purple-800 border-purple-200",
    "Screening": "bg-orange-100 text-orange-800 border-orange-200",
    "Client Screening": "bg-green-100 text-green-800 border-green-200",
    "Interview": "bg-blue-100 text-blue-800 border-blue-200",
    "Verification": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Onboarding": "bg-green-100 text-green-800 border-green-200",
    "Hired": "bg-red-100 text-red-800 border-red-200",
    "Disqualified": "bg-red-100 text-red-800 border-red-200"
  };
  return colors[stage as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Helper function to get candidate count by stage
export const getCandidateCountByStage = (candidates: Candidate[], stage: string) => {
  return candidates.filter(candidate => candidate.currentStage === stage).length;
};
