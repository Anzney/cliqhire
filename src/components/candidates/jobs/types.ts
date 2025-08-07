export interface CandidateJobApplication {
  _id: string;
  jobTitle: string;
  clientName: string;
  location: string;
  jobType: string;
  salary: string;
  applicationStatus: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
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
}
