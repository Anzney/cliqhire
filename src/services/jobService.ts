import axios, { AxiosError } from "axios";

// =========================
// Job Service
// =========================

interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

interface WorkVisa {
  workVisa: string;
  visaCountries: string[];
}

export interface ClientRef {
  _id: string;
  name: string;
}

export interface JobData {
  jobTitle: string;
  jobPosition?: string[];
  department?: string;
  client: string | ClientRef;
  location?: string[];
  headcount?: number;
  stage?: string;
  workVisa?: WorkVisa;
  minimumSalary?: number;
  maximumSalary?: number;
  salaryCurrency?: string;
  salaryRange?: SalaryRange;
  jobType: string;
  experience: string;
  education?: string[];
  specialization?: string[];
  certifications?: string[];
  benefits?: string[];
  jobDescription?: string;
  jobDescriptionPdf?: string;
  nationalities?: string[];
  gender?: string;
  deadlineclient?: string | Date | null;
  deadlineinternal?: string | Date | null;
  reportingTo?: string;
  teamSize?: number;
  link?: string;
  keySkills?: string;
  numberOfPositions?: number;
  jobDescriptionInternal?: string; // <-- Added for internal job description
}

export interface Job extends JobData {
  _id: string;
  client: ClientRef;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  jobDescriptionInternal?: string; // <-- Added for internal job description
}

export interface JobResponse {
  success: boolean;
  data?: Job | Job[];
  message?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

export interface PaginatedJobResponse extends JobResponse {
  jobs: Job[];
  total: number;
  page: number;
  pages: number;
}

export interface JobCountByClient {
  _id: string;
  count: number;
  clientName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Utility function to handle API errors consistently
const handleApiError = (error: any, context: string) => {
  if (error.response) {
    const status = error.response.status;
    const errorMessage = error.response.data?.message || 'Unknown error occurred';
    console.error(`API Error (${context}):`, {
      status,
      message: errorMessage,
      url: error.config.url,
      data: error.response.data
    });
    throw new Error(`${context} failed: ${errorMessage} (Status: ${status})`);
  } else if (error.request) {
    console.error(`Network Error (${context}):`, error.request);
    throw new Error(`Network error during ${context}: No response received`);
  } else {
    console.error(`Request Setup Error (${context}):`, error.message);
    throw new Error(`Error setting up ${context} request: ${error.message}`);
  }
};

// Process job data before sending to API
const processJobData = (jobData: JobData | Partial<JobData>) => {
  const dataToSend = { ...jobData };
  // Ensure client is just the ID string before sending
  if (dataToSend.client && typeof dataToSend.client === 'object' && (dataToSend.client as ClientRef)._id) {
    dataToSend.client = (dataToSend.client as ClientRef)._id;
  }
  return {
    ...dataToSend,
    deadlineclient: dataToSend.deadlineclient ? new Date(dataToSend.deadlineclient).toISOString() : null,
    deadlineinternal: dataToSend.deadlineinternal ? new Date(dataToSend.deadlineinternal).toISOString() : null,
    jobType: dataToSend.jobType?.toLowerCase(),
    gender: dataToSend.gender?.toLowerCase(),
    salaryRange: dataToSend.salaryRange || (dataToSend.minimumSalary !== undefined || dataToSend.maximumSalary !== undefined ? {
      min: dataToSend.minimumSalary || 0,
      max: dataToSend.maximumSalary || 0,
      currency: dataToSend.salaryCurrency || 'SAR'
    } : undefined)
  };
};

const createJob = async (jobData: JobData): Promise<JobResponse> => {
  try {
    const processedData = processJobData(jobData);
    const response = await axios.post<JobResponse>(`${API_URL}/api/jobs`, processedData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'job creation');
    throw error;
  }
};

const getJobs = async (
  params?: {
    stage?: string;
    jobType?: string;
    location?: string;
    client?: string;
    minSalary?: number;
    maxSalary?: number;
    currency?: string;
    gender?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }
): Promise<PaginatedJobResponse> => {
  try {
    const processedParams = {
      ...params,
      ...(params?.jobType && { jobType: params.jobType.toLowerCase() }),
      ...(params?.gender && { gender: params.gender.toLowerCase() })
    };
    const response = await axios.get<PaginatedJobResponse>(`${API_URL}/api/jobs`, {
      params: processedParams
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'jobs fetching');
    throw error;
  }
};

const getJobById = async (id: string): Promise<JobResponse> => {
  try {
    const response = await axios.get<JobResponse>(`${API_URL}/api/jobs/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Job not found');
    }
    handleApiError(error, 'job fetching');
    throw error;
  }
};

const updateJobById = async (id: string, jobData: Partial<JobData>): Promise<JobResponse> => {
  try {
    const response = await axios.patch<JobResponse>(`${API_URL}/api/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'job update');
    throw error;
  }
};

const deleteJobById = async (id: string): Promise<JobResponse> => {
  try {
    const response = await axios.delete<JobResponse>(`${API_URL}/api/jobs/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'job deletion');
    throw error;
  }
};

// Bulk job count by client
const getJobCountsByClient = async (): Promise<JobCountByClient[]> => {
  try {
    const response = await axios.get<{ success: boolean, data: JobCountByClient[] }>(
      `${API_URL}/api/jobs/clients/count`
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'fetching job counts by client');
    throw error;
  }
};

// Job Notes API
export async function createJobNote(note: { content: string; jobId: string }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  // Backend expects job_id, not jobId
  const res = await axios.post(`${API_BASE}/api/jobnotes`, { content: note.content, job_id: note.jobId });
  return res.data.data;
}

export async function getAllJobNotes() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const res = await axios.get(`${API_BASE}/api/jobnotes`);
  return res.data.data;
}

export async function getJobNotesByJobId(jobId: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const res = await axios.get(`${API_BASE}/api/jobnotes/job/${jobId}`);
  return res.data.data;
}

export async function updateJobNote(id: string, content: string, jobId: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  // Backend expects job_id, not jobId
  const res = await axios.patch(`${API_BASE}/api/jobnotes/${id}`, { content, job_id: jobId });
  return res.data.data;
}

export async function deleteJobNote(id: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const res = await axios.delete(`${API_BASE}/api/jobnotes/${id}`);
  return res.data.data;
}

const updateJobStage = async (id: string, stage: string): Promise<JobResponse> => {
  try {
    const response = await axios.patch<JobResponse>(`${API_URL}/api/jobs/${id}/stage`, { stage });
    return response.data;
  } catch (error) {
    handleApiError(error, 'job stage update');
    throw error;
  }
};

const updateJobPrimaryContacts = async (jobId: string, selectedContacts: any[], selectedContactIds: string[], newContacts: any[] = [], clientId?: string): Promise<JobResponse> => {
  try {
    console.log(`Updating primary contacts for job ${jobId}`);
    console.log("Selected contacts (full data):", selectedContacts);
    console.log("New contacts:", newContacts);

    // Make sure selectedContacts is an array
    if (!Array.isArray(selectedContacts)) {
      console.error("selectedContacts is not an array:", selectedContacts);
      throw new Error("selectedContacts must be an array");
    }

    // Create the request payload with complete contact data and IDs
    const payload = {
      selectedContacts: selectedContacts, // Full contact objects
      selectedContactIds: selectedContactIds, // Contact IDs
      newContact: newContacts || [],
      clientId: clientId || ""
    };
    console.log("Request payload:", payload);

    // Send the request
    const response = await axios.patch<JobResponse>(
      `${API_URL}/api/jobs/${jobId}/primarycontact`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Response from server:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating primary contacts:", error);
    handleApiError(error, 'job primary contacts update');
    throw error;
  }
};

const getPrimaryContactsByJobId = async (jobId: string): Promise<any> => {
  try {
    console.log(`Fetching primary contacts for job ${jobId}`);
    const response = await axios.get(`${API_URL}/api/jobs/${jobId}/primarycontact`);
    console.log("Primary contacts response:", response.data);

    // Normalize the response structure to ensure consistent data format
    if (response.data) {
      // If the response has primaryContacts array directly in data
      if (response.data.primaryContacts) {
        return {
          success: true,
          data: {
            primaryContacts: response.data.primaryContacts
          }
        };
      }
      // If the response has data.primaryContacts
      else if (response.data.data && response.data.data.primaryContacts) {
        return {
          success: true,
          data: {
            primaryContacts: response.data.data.primaryContacts
          }
        };
      }
      // If the response is an array directly
      else if (Array.isArray(response.data)) {
        return {
          success: true,
          data: {
            primaryContacts: response.data
          }
        };
      }
      // If the response has data as an array
      else if (response.data.data && Array.isArray(response.data.data)) {
        return {
          success: true,
          data: {
            primaryContacts: response.data.data
          }
        };
      }
    }

    // Default case - return the original response
    return response.data;
  } catch (error) {
    // If it's a 404, it might mean no contacts are assigned yet
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log("No primary contacts found (404), returning empty array");
      return {
        success: true,
        data: {
          primaryContacts: []
        }
      };
    }
    console.error("Error fetching primary contacts:", error);
    handleApiError(error, 'fetching job primary contacts');
    throw error;
  }
};

export {
  createJob,
  getJobs,
  getJobById,
  updateJobById,
  deleteJobById,
  getJobCountsByClient,
  updateJobStage,
  updateJobPrimaryContacts,
  getPrimaryContactsByJobId
};
