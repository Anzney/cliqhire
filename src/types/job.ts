export enum JobStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  ON_HOLD = 'On Hold'
}

export type JobStage = 'New' | 'Sourcing' | 'Screening' | 'Interviewing' | 'Shortlisted' | 'Offer' | 'Hired' | 'On Hold' | 'Cancelled';



export interface Job {
  salaryRange: any
  // jobOwner: ReactNode;
  // id:string,
  _id: string;
  positionName: string;
  client: string;
  location: string;
  headcount: string;
  stage: JobStage;
  status: JobStatus;
  jobStatus?: JobStatus; // Optional legacy field for backward compatibility
  minSalary?: number;
  maxSalary?: number;
  minimumSalary?: number;
  maximumSalary?: number;
  department: string;
}

// Add the Updated InterFace
    
 export interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  stage: "Lead" | "Negotiation" | "Engaged" | "Signed";
  owner: string;
  team: string;
  createdAt: string;
  jobCount: number;
  incorporationDate: string;
}


// types/job.ts

export interface JobResponse {
   success: boolean;
  // data?: Job | Job[];
  message?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  jobTitle?: string;
  department?: string;
  client?: {
    name?: string;
  };
  location?: string;
  headcount?: number;
  minimumSalary?: number;
  maximumSalary?: number;
  salaryCurrency?: string;
  jobType?: string;
  experience?: string;
  jobDescription?: string;
  nationalities?: string[];
  gender?: string;
  deadline?: string;
  relationshipManager?: string;
  reportingTo?: string;
  teamSize?: number;
  link?: string;
  keySkills?: string;
  jobPosition?: string;
  stage?: string;
  salaryRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  dateRange?: {
    start?: string;
    end?: string;
  };
}
