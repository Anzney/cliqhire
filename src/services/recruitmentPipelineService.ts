import { api } from '@/lib/axios-config';

export interface AddSingleJobToPipelineRequest {
  jobId: string;
}

export interface AddMultipleJobsToPipelineRequest {
  jobIds: string[];
}

export interface CreatePipelineRequest {
  jobId: string;
}

export interface AddJobToPipelineResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PipelineJob {
  _id: string;
  jobTitle: string;
  jobPosition: string;
  department: string;
  location: string;
  locations: string[];
  headcount: number;
  stage: string;
  workVisa: boolean;
  minimumSalary: number;
  maximumSalary: number;
  salaryCurrency: string;
  salaryRange: string;
  jobType: string;
  experience: string;
  education: string;
  specialization: string;
  certifications: string[];
  otherBenefits: string;
  jobDescription: string;
  jobDescriptionByInternalTeam: string;
  jobDescriptionPdf: string;
  benefitPdf: string;
  nationalities: string[];
  gender: string;
  deadlineByClient: string | null;
  startDateByInternalTeam: string | null;
  endDateByInternalTeam: string | null;
  relationshipManager: string;
  reportingTo: string;
  teamSize: number;
  link: string;
  keySkills: string[];
  numberOfPositions: number;
  primaryContact: string[];
  jobTeamInfo: {
    recruitmentManager: string;
    teamLead: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClientInfo {
  _id: string;
  name: string;
  industry: string;
  location: string;
  clientStage: string;
  countryOfBusiness: string;
  website: string;
  phoneNumber: string;
  emails: string[];
}

export interface PrimaryContact {
  _id: string;
  email: string;
  phone: string;
  designation?: string;
  name: string;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone: string;
  otherPhone: string;
  location: string;
  experience: string;
  totalRelevantExperience: string;
  noticePeriod: string;
  skills: string[];
  softSkill: string[];
  technicalSkill: string[];
  resume: string;
  status: string;
  referredBy: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  country: string;
  nationality: string;
  universityName: string;
  educationDegree: string;
  primaryLanguage: string;
  willingToRelocate: boolean;
  description: string;
  linkedin: string;
  currentSalary: number;
  currentSalaryCurrency: string;
  expectedSalary: number;
  expectedSalaryCurrency: string;
  previousCompanyName: string;
  currentJobTitle: string;
  reportingTo: string;
  totalStaffReporting: number;
  recruitmentManager: string;
  recruiter: string;
  teamLead: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateApplication {
  applicationId: string;
  status: string;
  appliedDate: string;
  lastUpdated: string;
  salaryCurrency: string;
  applicationDuration: number;
  candidate: Candidate;
}

export interface CandidateSummary {
  totalCandidates: number;
  byStatus: {
    [key: string]: number; // Status counts for candidates in this specific job/pipeline
  };
}

export interface OverallCandidateSummary {
  totalCandidates: number;
  byStatus: {
    [key: string]: number; // Overall status counts across all pipelines
  };
}

export interface PipelineInfo {
  _id: string;
  status: string;
  priority: string;
  assignedDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineEntryDetail {
  pipelineInfo: PipelineInfo;
  jobDetails: PipelineJob;
  clientInfo: ClientInfo;
  primaryContacts: PrimaryContact[];
  candidateSummary: CandidateSummary;
  candidates: CandidateApplication[];
}

export interface GetPipelineEntryResponse {
  success: boolean;
  message: string;
  data: PipelineEntryDetail;
}

export interface GetAllPipelineEntriesResponse {
  success: boolean;
  message: string;
  data: {
    totalPipelines: number;
    totalCandidates: number;
    overallCandidateSummary: {
      totalCandidates: number;
      byStatus: {
        [key: string]: number;
      };
    };
    pipelines: PipelineEntryDetail[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPipelines: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
  };
}

/**
 * Create a new pipeline entry for a job
 */
export const createPipeline = async (request: CreatePipelineRequest): Promise<AddJobToPipelineResponse> => {
  try {
    const response = await api.post('/api/recruiter-pipeline/create', request);
    return response.data;
  } catch (error: any) {
    console.error('Error creating pipeline:', error);
    throw new Error(error.response?.data?.message || 'Failed to create pipeline');
  }
};

/**
 * Add a single job to the recruitment pipeline
 */
export const addSingleJobToPipeline = async (request: AddSingleJobToPipelineRequest): Promise<AddJobToPipelineResponse> => {
  try {
    const response = await api.post('/api/recruiter-pipeline/add-single', request);
    return response.data;
  } catch (error: any) {
    console.error('Error adding single job to pipeline:', error);
    throw new Error(error.response?.data?.message || 'Failed to add job to pipeline');
  }
};

/**
 * Add multiple jobs to the recruitment pipeline
 */
export const addMultipleJobsToPipeline = async (request: AddMultipleJobsToPipelineRequest): Promise<AddJobToPipelineResponse> => {
  try {
    const response = await api.post('/api/recruiter-pipeline/add-multiple', request);
    return response.data;
  } catch (error: any) {
    console.error('Error adding multiple jobs to pipeline:', error);
    throw new Error(error.response?.data?.message || 'Failed to add jobs to pipeline');
  }
};

/**
 * Get a pipeline entry by ID
 */
export const getPipelineEntry = async (pipelineId: string): Promise<GetPipelineEntryResponse> => {
  try {
    const response = await api.get(`/api/recruiter-pipeline/entry/${pipelineId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching pipeline entry:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch pipeline entry');
  }
};

/**
 * Get all pipeline entries
 */
export const getAllPipelineEntries = async (): Promise<GetAllPipelineEntriesResponse> => {
  try {
    const response = await api.get('/api/recruiter-pipeline');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching all pipeline entries:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch pipeline entries');
  }
};

