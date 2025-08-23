export interface JobData {
  certifications: string[];
  client: { _id: string; name: string };
  createdAt: string;
  dateRange: { start: string | null; end: string | null };
  department: string;
  education: [];
  experience: string;
  gender: string;
  headcount: number;
  jobDescription: string;
  jobDescriptionPdf: File | null;
  benefitPdf: File | null;
  jobPosition: string[];
  jobTitle: string;
  jobType: string;
  location: string;
  locations: string[];
  maximumSalary: number;
  minimumSalary: number;
  nationalities: string[];
  numberOfPositions: number;
  otherBenefits: string[];
  relationshipManager: string;
  salaryCurrency: string;
  salaryRange: { min: number; max: number; currency: string };
  specialization: string[];
  stage: string;
  teamSize: number;
  updatedAt: string;
  deadlineByClient: Date | undefined;
  startDateByInternalTeam: Date | undefined;
  endDateByInternalTeam: Date | undefined;
  keySkills: string;
  jobDescriptionByInternalTeam: string;
  workVisa: { workVisa: string; visaCountries: string[] };
  reportingTo: string;
  // Team assignment fields
  teamId?: string;
  teamName?: string;
  teamAssignment?: string; // JSON string containing team data
  recruitmentManagerId?: string;
  recruitmentManager?: string;
  teamLeadId?: string;
  teamLead?: string;
  recruiterId?: string;
  recruiter?: string;
  _id: string;
}
