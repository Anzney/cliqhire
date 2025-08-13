export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  resume: string;
  status: TeamMemberStatus;
  createdAt: string;
  updatedAt: string;
  teamMemberId?: string;
  role?: string;
  department?: string;
  specialization?: string;
  hireDate?: string;
  manager?: string;
  performanceRating?: number;
  activeJobs?: number;
  completedPlacements?: number;
}

export type TeamMemberStatus = "Active" | "Inactive" | "On Leave" | "Terminated";

export interface TeamMemberResponse {
  success: boolean;
  data: TeamMember | TeamMember[];
  message?: string;
}

export interface TeamMemberFilters {
  name?: string;
  status?: TeamMemberStatus;
  location?: string;
  department?: string;
  experience?: string;
}

export interface CreateTeamMemberData {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  resume?: string;
  status: TeamMemberStatus;
  department?: string;
  specialization?: string;
  manager?: string;
}

export interface UpdateTeamMemberData extends Partial<CreateTeamMemberData> {
  _id: string;
} 