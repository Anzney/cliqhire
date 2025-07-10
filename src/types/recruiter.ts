export interface Recruiter {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  resume: string;
  status: RecruiterStatus;
  createdAt: string;
  updatedAt: string;
  recruiterId?: string;
  department?: string;
  specialization?: string;
  hireDate?: string;
  manager?: string;
  performanceRating?: number;
  activeJobs?: number;
  completedPlacements?: number;
}

export type RecruiterStatus = "Active" | "Inactive" | "On Leave" | "Terminated";

export interface RecruiterResponse {
  success: boolean;
  data: Recruiter | Recruiter[];
  message?: string;
}

export interface RecruiterFilters {
  name?: string;
  status?: RecruiterStatus;
  location?: string;
  department?: string;
  experience?: string;
}

export interface CreateRecruiterData {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  resume?: string;
  status: RecruiterStatus;
  department?: string;
  specialization?: string;
  manager?: string;
}

export interface UpdateRecruiterData extends Partial<CreateRecruiterData> {
  _id: string;
} 