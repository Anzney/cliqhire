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
  jobPosition: string[];
  department: string;
  location: string;
  locations: string[];
  headcount: number;
  stage: string;
  workVisa: {
    workVisa: string;
    visaCountries: string[];
  };
  minimumSalary: number;
  maximumSalary: number;
  salaryCurrency: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: string;
  experience: string;
  education: string[];
  specialization: string[];
  certifications: string[];
  otherBenefits: string[];
  jobDescription: string;
  jobDescriptionByInternalTeam: string;
  nationalities: string[];
  gender: string;
  deadlineByClient: string | null;
  startDateByInternalTeam: string | null;
  endDateByInternalTeam: string | null;
  relationshipManager: string;
  teamSize: number;
  numberOfPositions: number;
  primaryContact: PrimaryContact[];
  jobTeamInfo: {
    teamId: {
      _id: string;
      teamName: string;
    };
    hiringManager: {
      _id: string;
      name: string;
      email: string;
    };
    teamLead: {
      _id: string;
      name: string;
      email: string;
    };
    recruiter: {
      _id: string;
      name: string;
      email: string;
    };
  };
  client: ClientInfo;
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
  willingToRelocate: string;
  description: string;
  linkedin: string;
  currentSalary: number;
  currentSalaryCurrency: string;
  expectedSalary: number;
  expectedSalaryCurrency: string;
  previousCompanyName: string;
  currentJobTitle: string;
  reportingTo: string;
  totalStaffReporting: string;
  recruitmentManager: string;
  recruiter: string;
  teamLead: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidatePipelineInfo {
  candidateId: Candidate;
  currentStage: string;
  status: string;
  priority: string;
  notes: string;
  addedToPipelineDate: string;
  lastUpdated: string;
  sourcing: {
    sourcingDate: string;
    connection: string;
    referredBy: string;
    source: string;
    notes: string;
    status: string;
  } | null;
  screening: {
    screeningDate: string;
    aemsInterviewDate: string;
    screeningStatus: string;
    screeningNotes: string;
    technicalAssessment: string;
    softSkillsAssessment: string;
    overallRating: number;
    feedback: string;
  } | null;
  clientScreening: any | null;
  interview: any | null;
  verification: any | null;
  onboarding: any | null;
  hired: any | null;
  rejectionHistory: any[];
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
  _id: string;
  jobId: PipelineJob;
  recruiterId: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  priority: string;
  assignedDate: string;
  notes: string;
  totalCandidates: number;
  activeCandidates: number;
  completedCandidates: number;
  droppedCandidates: number;
  candidateIdArray: CandidatePipelineInfo[];
  createdAt: string;
  updatedAt: string;
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
    pipelines: PipelineListItem[];
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

// Updated interface to match the new API response structure
export interface PipelineListItem {
  _id: string;
  jobId: {
    _id: string;
    jobTitle: string;
    department: string;
    location: string;
    minimumSalary?: number;
    maximumSalary?: number;
    salaryCurrency?: string;
    jobType?: string;
    numberOfPositions?: number;
    stage?: string;
    clientName?: string | null;
  };
  recruiterId?: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  priority: string;
  assignedDate: string;
  notes?: string;
  totalCandidates: number;
  activeCandidates: number;
  completedCandidates: number;
  droppedCandidates: number;
  numberOfCandidates: number;
  createdAt: string;
  updatedAt: string;
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

// Interface for stage-specific data
export interface StageData {
  screeningDate?: string;
  screeningNotes?: string;
  aemsInterviewDate?: string;
  screeningStatus?: string;
  technicalAssessment?: string;
  softSkillsAssessment?: string;
  overallRating?: number;
  feedback?: string;
  // Add other stage-specific fields as needed
}

// Interface for updating candidate stage request
export interface UpdateCandidateStageRequest {
  newStage: string;
  stageData?: StageData;
  notes?: string;
  /** ISO string containing both date and time for interview scheduling, e.g. '2025-09-19T14:30' */
  interviewDate?: string;
  /** Meeting link for the scheduled interview */
  interviewMeetingLink?: string;
}

// Interface for updating candidate stage response
export interface UpdateCandidateStageResponse {
  success: boolean;
  message: string;
  data?: {
    candidateId: string;
    newStage: string;
    updatedAt: string;
  };
}

/**
 * Update a candidate's stage in the recruitment pipeline
 */
export const updateCandidateStage = async (
  pipelineId: string,
  candidateId: string,
  request: UpdateCandidateStageRequest
): Promise<UpdateCandidateStageResponse> => {
  try {
    const response = await api.patch(
      `/api/recruiter-pipeline/${pipelineId}/candidate/${candidateId}/stage`,
      request
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating candidate stage:', error);
    throw new Error(error.response?.data?.message || 'Failed to update candidate stage');
  }
};

// Interface for delete candidate response
export interface DeleteCandidateResponse {
  success: boolean;
  message: string;
  data?: {
    pipelineId: string;
    candidateId: string;
    removedAt: string;
  };
}

// Interface for add candidate to pipeline request
export interface AddCandidateToPipelineRequest {
  candidateId: string;
}

// Interface for add candidate to pipeline response
export interface AddCandidateToPipelineResponse {
  success: boolean;
  message: string;
  data?: {
    pipelineId: string;
    candidateId: string;
    addedAt: string;
  };
}

/**
 * Add a candidate to the recruitment pipeline
 */
export const addCandidateToPipeline = async (
  pipelineId: string,
  candidateId: string
): Promise<AddCandidateToPipelineResponse> => {
  try {
    const response = await api.post(
      `/api/recruiter-pipeline/${pipelineId}/add-candidate`,
      { candidateId }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error adding candidate to pipeline:', error);
    throw new Error(error.response?.data?.message || 'Failed to add candidate to pipeline');
  }
};

/**
 * Remove a candidate from the recruitment pipeline
 */
export const deleteCandidateFromPipeline = async (
  pipelineId: string,
  candidateId: string
): Promise<DeleteCandidateResponse> => {
  try {
    const response = await api.delete(
      `/api/recruiter-pipeline/${pipelineId}/candidate/${candidateId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error deleting candidate from pipeline:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete candidate from pipeline');
  }
};

// Interface for updating candidate status request
export interface UpdateCandidateStatusRequest {
  status: string;
  stage: string;
  notes?: string;
  disqualificationStage?: string | null;
  disqualificationStatus?: string;
  disqualificationReason?: string;
  disqualificationFeedback?: string;
}

// Interface for updating candidate status response
export interface UpdateCandidateStatusResponse {
  success: boolean;
  message: string;
  data?: {
    candidateId: string;
    status: string;
    stage: string;
    updatedAt: string;
  };
}

/**
 * Update a candidate's status in the recruitment pipeline
 */
export const updateCandidateStatus = async (
  pipelineId: string,
  candidateId: string,
  request: UpdateCandidateStatusRequest
): Promise<UpdateCandidateStatusResponse> => {
  try {
    const response = await api.patch(
      `/api/recruiter-pipeline/${pipelineId}/candidate/${candidateId}/status`,
      request
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating candidate status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update candidate status');
  }
};

// Interface for converting temp candidate to real candidate
export interface ConvertTempCandidateRequest {
  name: string;
  email: string;
  phone: string;
  location?: string;
  experience?: string;
  skills?: string[];
  description?: string;
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  nationality?: string;
  willingToRelocate?: string;
  currentJobTitle?: string;
  currentCompanyName?: string;
  previousCompanyName?: string;
  currentSalary?: number;
  currentSalaryCurrency?: string;
  expectedSalary?: number;
  expectedSalaryCurrency?: string;
  linkedin?: string;
  reportingTo?: string;
  educationDegree?: string;
  primaryLanguage?: string;
  softSkill?: string[];
  technicalSkill?: string[];
}

export interface ConvertTempCandidateResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Convert a temp candidate to a real candidate in the pipeline
 */
export const convertTempCandidateToReal = async (
  pipelineId: string,
  tempCandidateId: string,
  candidateData: ConvertTempCandidateRequest
): Promise<ConvertTempCandidateResponse> => {
  try {
    const response = await api.post(
      `/api/recruiter-pipeline/${pipelineId}/candidate/${tempCandidateId}/convert-to-real`,
      candidateData
    );
    return {
      success: true,
      message: 'Temp candidate converted to real candidate successfully',
      data: response.data
    };
  } catch (error: any) {
    console.error('Error converting temp candidate:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    return {
      success: false,
      message: 'Failed to convert temp candidate',
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
};

