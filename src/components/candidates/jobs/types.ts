export interface CandidateJobApplication {
  _id: string;
  jobId: string; // Actual job ID for navigation
  jobTitle: string;
  clientName: string;
  location: string;
  jobType: string;
  minimumSalary: string;
  maximumSalary: string;
  experience: string;
  stage: string;
}

export type ApplicationStatus = 
  | "Applied"
  | "Under Review"
  | "Interview Scheduled"
  | "Interviewed"
  | "Shortlisted"
  | "Offer Extended"
  | "Hired"
  | "Rejected"
  | "Withdrawn";

export interface JobsContentProps {
  candidateId: string;
  candidateName: string;
  onJobsUpdated?: () => void;
}
