import axios from 'axios';
import { 
  Recruiter, 
  RecruiterResponse, 
  RecruiterFilters, 
  CreateRecruiterData, 
  UpdateRecruiterData 
} from '@/types/recruiter';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

// ========================================
// DUMMY DATA - REMOVE WHEN API IS WORKING
// ========================================
const dummyRecruiters: Recruiter[] = [
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

// Get all recruiters with optional filters
export const getRecruiters = async (filters?: RecruiterFilters): Promise<{ recruiters: Recruiter[] }> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredRecruiters = [...dummyRecruiters];
  
  // Apply filters to dummy data
  if (filters) {
    if (filters.name) {
      filteredRecruiters = filteredRecruiters.filter(recruiter =>
        recruiter.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    if (filters.status) {
      filteredRecruiters = filteredRecruiters.filter(recruiter =>
        recruiter.status === filters.status
      );
    }
    if (filters.location) {
      filteredRecruiters = filteredRecruiters.filter(recruiter =>
        recruiter.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters.department) {
      filteredRecruiters = filteredRecruiters.filter(recruiter =>
        recruiter.department?.toLowerCase().includes(filters.department!.toLowerCase())
      );
    }
    if (filters.experience) {
      filteredRecruiters = filteredRecruiters.filter(recruiter =>
        recruiter.experience.toLowerCase().includes(filters.experience!.toLowerCase())
      );
    }
  }
  
  return { recruiters: filteredRecruiters };
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.get(`${API_URL}/recruiters`, {
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

// Get a single recruiter by ID
export const getRecruiterById = async (id: string): Promise<Recruiter> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const recruiter = dummyRecruiters.find(r => r._id === id);
  if (!recruiter) {
    throw new Error('Recruiter not found');
  }
  
  return recruiter;
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.get(`${API_URL}/recruiters/${id}`);
    
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

// Create a new recruiter
export const createRecruiter = async (recruiterData: CreateRecruiterData): Promise<Recruiter> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newRecruiter: Recruiter = {
    _id: Date.now().toString(),
    ...recruiterData,
    resume: recruiterData.resume || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    performanceRating: 0,
    activeJobs: 0,
    completedPlacements: 0
  };
  
  // Add to dummy data array
  dummyRecruiters.push(newRecruiter);
  
  return newRecruiter;
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.post(`${API_URL}/recruiters`, recruiterData);
    
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

// Update a recruiter
export const updateRecruiter = async (recruiterData: UpdateRecruiterData): Promise<Recruiter> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = dummyRecruiters.findIndex(r => r._id === recruiterData._id);
  if (index === -1) {
    throw new Error('Recruiter not found');
  }
  
  const updatedRecruiter = {
    ...dummyRecruiters[index],
    ...recruiterData,
    updatedAt: new Date().toISOString()
  };
  
  dummyRecruiters[index] = updatedRecruiter;
  
  return updatedRecruiter;
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const { _id, ...updateData } = recruiterData;
    const response = await axios.put(`${API_URL}/recruiters/${_id}`, updateData);
    
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

// Delete a recruiter
export const deleteRecruiter = async (id: string): Promise<void> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = dummyRecruiters.findIndex(r => r._id === id);
  if (index === -1) {
    throw new Error('Recruiter not found');
  }
  
  dummyRecruiters.splice(index, 1);
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.delete(`${API_URL}/recruiters/${id}`);
    
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

// Update recruiter status
export const updateRecruiterStatus = async (id: string, status: string): Promise<Recruiter> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const recruiter = dummyRecruiters.find(r => r._id === id);
  if (!recruiter) {
    throw new Error('Recruiter not found');
  }
  
  recruiter.status = status as any;
  recruiter.updatedAt = new Date().toISOString();
  
  return recruiter;
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.patch(`${API_URL}/recruiters/${id}/status`, { status });
    
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

// Upload recruiter resume
export const uploadResume = async (id: string, file: File): Promise<{ resumeUrl: string }> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const recruiter = dummyRecruiters.find(r => r._id === id);
  if (!recruiter) {
    throw new Error('Recruiter not found');
  }
  
  const resumeUrl = `https://example.com/resumes/${file.name}`;
  recruiter.resume = resumeUrl;
  recruiter.updatedAt = new Date().toISOString();
  
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
    
    const response = await axios.post(`${API_URL}/recruiters/${id}/resume`, formData, {
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

// Get recruiter statistics
export const getRecruiterStats = async (id: string): Promise<{
  activeJobs: number;
  completedPlacements: number;
  performanceRating: number;
}> => {
  // ========================================
  // DUMMY DATA RESPONSE - REMOVE WHEN API IS WORKING
  // ========================================
  console.log("🔴 USING DUMMY DATA - Replace with real API call when ready");
  
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const recruiter = dummyRecruiters.find(r => r._id === id);
  if (!recruiter) {
    throw new Error('Recruiter not found');
  }
  
  return {
    activeJobs: recruiter.activeJobs || 0,
    completedPlacements: recruiter.completedPlacements || 0,
    performanceRating: recruiter.performanceRating || 0
  };
  // ========================================
  // END DUMMY DATA RESPONSE
  // ========================================

  // ========================================
  // REAL API CALL - UNCOMMENT WHEN API IS WORKING
  // ========================================
  /*
  try {
    const response = await axios.get(`${API_URL}/recruiters/${id}/stats`);
    
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