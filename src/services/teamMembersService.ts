import axios from 'axios';
import { 
  TeamMember, 
  TeamMemberResponse, 
  TeamMemberFilters, 
  CreateTeamMemberData, 
  UpdateTeamMemberData 
} from '@/types/recruiter';

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

// ========================================
// DUMMY DATA - REMOVE WHEN API IS WORKING
// ========================================
const dummyTeamMembers: TeamMember[] = [
  {
    _id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    experience: "5 years",
    skills: ["Technical Recruiting", "ATS Management", "LinkedIn Recruiter", "Candidate Sourcing"],
    resume: "https://example.com/resumes/john_smith_resume.pdf",
    status: "Active",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-12-01T15:30:00Z",
    department: "Technical Recruiting",
    specialization: "Engineering & IT",
    manager: "Sarah Johnson",
    performanceRating: 4.5,
    activeJobs: 8,
    completedPlacements: 45
  },
  {
    _id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    experience: "3 years",
    skills: ["Executive Search", "Talent Acquisition", "Client Relationship Management"],
    resume: "https://example.com/resumes/sarah_johnson_resume.pdf",
    status: "Active",
    createdAt: "2023-03-20T09:15:00Z",
    updatedAt: "2023-12-01T14:20:00Z",
    department: "Executive Search",
    specialization: "C-Level & VP Positions",
    manager: "Mike Davis",
    performanceRating: 4.8,
    activeJobs: 5,
    completedPlacements: 32
  },
  {
    _id: "3",
    name: "Mike Davis",
    email: "mike.davis@company.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    experience: "7 years",
    skills: ["Engineering Recruiting", "Technical Assessment", "Market Research", "Negotiation"],
    resume: "https://example.com/resumes/mike_davis_resume.pdf",
    status: "On Leave",
    createdAt: "2022-11-10T11:30:00Z",
    updatedAt: "2023-11-15T16:45:00Z",
    department: "Technical Recruiting",
    specialization: "Senior Engineering",
    manager: "Emily Wilson",
    performanceRating: 4.2,
    activeJobs: 2,
    completedPlacements: 78
  },
  {
    _id: "4",
    name: "Emily Wilson",
    email: "emily.wilson@company.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    experience: "2 years",
    skills: ["Startup Recruiting", "Candidate Experience", "Interview Coordination"],
    resume: "https://example.com/resumes/emily_wilson_resume.pdf",
    status: "Inactive",
    createdAt: "2023-06-05T13:20:00Z",
    updatedAt: "2023-10-20T10:10:00Z",
    department: "Talent Acquisition",
    specialization: "Startup & Scale-up",
    manager: "John Smith",
    performanceRating: 3.9,
    activeJobs: 0,
    completedPlacements: 18
  },
  {
    _id: "5",
    name: "David Chen",
    email: "david.chen@company.com",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA",
    experience: "4 years",
    skills: ["Technical Recruiting", "Data Science", "Machine Learning", "ATS Management"],
    resume: "https://example.com/resumes/david_chen_resume.pdf",
    status: "Active",
    createdAt: "2023-02-12T08:45:00Z",
    updatedAt: "2023-12-01T12:15:00Z",
    department: "Technical Recruiting",
    specialization: "Data Science & AI",
    manager: "Sarah Johnson",
    performanceRating: 4.6,
    activeJobs: 6,
    completedPlacements: 52
  }
];

// ========================================
// END DUMMY DATA
// ========================================

// Get all team members with optional filters
export const getTeamMembers = async (filters?: TeamMemberFilters): Promise<{ teamMembers: TeamMember[] }> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredTeamMembers = [...dummyTeamMembers];
  
  // Apply filters to dummy data
  if (filters) {
    if (filters.name) {
      filteredTeamMembers = filteredTeamMembers.filter(teamMember =>
        teamMember.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    if (filters.status) {
      filteredTeamMembers = filteredTeamMembers.filter(teamMember =>
        teamMember.status === filters.status
      );
    }
    if (filters.location) {
      filteredTeamMembers = filteredTeamMembers.filter(teamMember =>
        teamMember.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters.department) {
      filteredTeamMembers = filteredTeamMembers.filter(teamMember =>
        teamMember.department?.toLowerCase().includes(filters.department!.toLowerCase())
      );
    }
    if (filters.experience) {
      filteredTeamMembers = filteredTeamMembers.filter(teamMember =>
        teamMember.experience.toLowerCase().includes(filters.experience!.toLowerCase())
      );
    }
  }
  
  return { teamMembers: filteredTeamMembers };
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.get(`${API_URL}/api/recruiters`, {
      params: filters
    });

    if (response.data && response.data.success) {
      return {
        recruiters: Array.isArray(response.data.data) ? response.data.data : response.data.data.recruiters || []
      };
    }
    throw new Error(response.data?.message || 'Failed to fetch recruiters');
  } catch (error: any) {
    console.error('Error fetching recruiters:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch recruiters');
  }
  */
  // ========================================
  // END REAL API CALL
  // ========================================
};

// Get a single team member by ID
export const getTeamMemberById = async (id: string): Promise<TeamMember> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const teamMember = dummyTeamMembers.find(r => r._id === id);
  if (!teamMember) {
    throw new Error('Team member not found');
  }
  
  return teamMember;
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.get(`${API_URL}/api/recruiters/${id}`);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch recruiter');
  } catch (error: any) {
    console.error('Error fetching recruiter:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch recruiter');
  }
  */
  // ========================================
  // END REAL API CALL
  // ========================================
};

// Create a new team member
export const createTeamMember = async (teamMemberData: CreateTeamMemberData): Promise<TeamMember> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newTeamMember: TeamMember = {
    _id: Date.now().toString(),
    ...teamMemberData,
    resume: teamMemberData.resume || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    performanceRating: 0,
    activeJobs: 0,
    completedPlacements: 0
  };
  
  // Add to dummy data array
  dummyTeamMembers.push(newTeamMember);
  
  return newTeamMember;
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.post(`${API_URL}/api/recruiters`, recruiterData);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to create recruiter');
  } catch (error: any) {
    console.error('Error creating recruiter:', error);
    throw new Error(error.response?.data?.message || 'Failed to create recruiter');
  }
  */
  // ========================================
  // END REAL API CALL
  // ========================================
};

// Update a team member
export const updateTeamMember = async (teamMemberData: UpdateTeamMemberData): Promise<TeamMember> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = dummyTeamMembers.findIndex(r => r._id === teamMemberData._id);
  if (index === -1) {
    throw new Error('Team member not found');
  }
  
  const updatedTeamMember = {
    ...dummyTeamMembers[index],
    ...teamMemberData,
    updatedAt: new Date().toISOString()
  };
  
  dummyTeamMembers[index] = updatedTeamMember;
  
  return updatedTeamMember;
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const { _id, ...updateData } = recruiterData;
    const response = await axios.put(`${API_URL}/api/recruiters/${_id}`, updateData);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to update recruiter');
  } catch (error: any) {
    console.error('Error updating recruiter:', error);
    throw new Error(error.response?.data?.message || 'Failed to update recruiter');
  }
  */
  // ========================================
  // END REAL API CALL
  // ========================================
};

// Delete a team member
export const deleteTeamMember = async (id: string): Promise<void> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = dummyTeamMembers.findIndex(r => r._id === id);
  if (index === -1) {
    throw new Error('Team member not found');
  }
  
  dummyTeamMembers.splice(index, 1);
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.delete(`${API_URL}/api/recruiters/${id}`);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Failed to delete recruiter');
    }
  } catch (error: any) {
    console.error('Error deleting recruiter:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete recruiter');
  }
  */
  // ========================================
  // END REAL API CALL
  // ========================================
};

// Update team member status
export const updateTeamMemberStatus = async (id: string, status: string): Promise<TeamMember> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const teamMember = dummyTeamMembers.find(r => r._id === id);
  if (!teamMember) {
    throw new Error('Team member not found');
  }
  
  teamMember.status = status as any;
  teamMember.updatedAt = new Date().toISOString();
  
  return teamMember;
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.patch(`${API_URL}/api/recruiters/${id}/status`, { status });
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to update recruiter status');
  } catch (error: any) {
    console.error('Error updating recruiter status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update recruiter status');
  }
  */
  // ========================================
  // END REAL API CALL
  // ========================================
};

// Upload team member resume
export const uploadResume = async (id: string, file: File): Promise<{ resumeUrl: string }> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const teamMember = dummyTeamMembers.find(r => r._id === id);
  if (!teamMember) {
    throw new Error('Team member not found');
  }
  
  const resumeUrl = `https://example.com/resumes/${file.name}`;
  teamMember.resume = resumeUrl;
  teamMember.updatedAt = new Date().toISOString();
  
  return { resumeUrl };
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await axios.post(`${API_URL}/api/recruiters/${id}/resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data && response.data.success) {
      return { resumeUrl: response.data.data.resumeUrl };
    }
    throw new Error(response.data?.message || 'Failed to upload resume');
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload resume');
  }
  */
  // ========================================
  // END REAL API CALL
  // ========================================
};

// Get team member statistics
export const getTeamMemberStats = async (id: string): Promise<{
  activeJobs: number;
  completedPlacements: number;
  performanceRating: number;
}> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const teamMember = dummyTeamMembers.find(r => r._id === id);
  if (!teamMember) {
    throw new Error('Team member not found');
  }
  
  return {
    activeJobs: teamMember.activeJobs || 0,
    completedPlacements: teamMember.completedPlacements || 0,
    performanceRating: teamMember.performanceRating || 0
  };
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.get(`${API_URL}/api/recruiters/${id}/stats`);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch recruiter stats');
  } catch (error: any) {
    console.error('Error fetching recruiter stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch recruiter stats');
  }
  */
  // ========================================
  // END REAL API CALL
  // ========================================
}; 