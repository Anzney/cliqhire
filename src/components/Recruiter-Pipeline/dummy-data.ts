// Dummy data for Recruiter Pipeline
// Replace these entries with your actual data in the future

export interface Candidate {
  id: string;
  name: string;
  source: string;
  currentStage: string;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  clientName: string;
  location: string;
  salaryRange: string;
  headcount: number;
  jobType: string;
  isExpanded: boolean;
  candidates: Candidate[];
}

export const pipelineStages = [
  "Sourcing",
  "Screening", 
  "SR/Completed",
  "Interview",
  "Verification",
  "Onboarding",
  "Hired",
  "Disqualified"
];

export const dummyJobs: Job[] = [
  {
    id: "1",
    title: "Product Manager",
    clientName: "NextGen Ltd.",
    location: "New York, NY",
    salaryRange: "$95k - $120k",
    headcount: 4,
    jobType: "Contract",
    isExpanded: true,
    candidates: [
      { id: "1", name: "Anjali Verma", source: "LinkedIn", currentStage: "Sourcing" },
      { id: "2", name: "Rohit Agarwal", source: "Indeed", currentStage: "Screening" },
      { id: "3", name: "Kavya Reddy", source: "Referral", currentStage: "Onboarding" },
      { id: "4", name: "Manish Jain", source: "LinkedIn", currentStage: "Disqualified" }
    ]
  },
  {
    id: "2",
    title: "Senior React Developer",
    clientName: "TechCorp Inc.",
    location: "San Francisco, CA",
    salaryRange: "$120k - $150k",
    headcount: 2,
    jobType: "Full-time",
    isExpanded: false,
    candidates: [
      { id: "5", name: "John Smith", source: "LinkedIn", currentStage: "Hired" },
      { id: "6", name: "Sarah Johnson", source: "Indeed", currentStage: "Interview" },
      { id: "7", name: "Mike Davis", source: "Referral", currentStage: "Screening" }
    ]
  },
  {
    id: "3",
    title: "UX Designer",
    clientName: "Design Studio",
    location: "Austin, TX",
    salaryRange: "$80k - $100k",
    headcount: 1,
    jobType: "Full-time",
    isExpanded: false,
    candidates: [
      { id: "8", name: "Emily Wilson", source: "LinkedIn", currentStage: "Hired" },
      { id: "9", name: "David Brown", source: "Indeed", currentStage: "Disqualified" },
      { id: "10", name: "Lisa Anderson", source: "Referral", currentStage: "Verification" }
    ]
  },
  {
    id: "4",
    title: "DevOps Engineer",
    clientName: "Cloud Solutions",
    location: "Seattle, WA",
    salaryRange: "$110k - $140k",
    headcount: 1,
    jobType: "Contract",
    isExpanded: false,
    candidates: [
      { id: "11", name: "Alex Turner", source: "LinkedIn", currentStage: "Sourcing" },
      { id: "12", name: "Maria Garcia", source: "Indeed", currentStage: "Screening" }
    ]
  }
];

// Additional dummy data for different scenarios
export const dummyJobsAlternative: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    clientName: "StartupXYZ",
    location: "Remote",
    salaryRange: "$90k - $110k",
    headcount: 3,
    jobType: "Full-time",
    isExpanded: false,
    candidates: [
      { id: "1", name: "Alice Johnson", source: "LinkedIn", currentStage: "Interview" },
      { id: "2", name: "Bob Wilson", source: "Indeed", currentStage: "Screening" },
      { id: "3", name: "Carol Davis", source: "Referral", currentStage: "Hired" }
    ]
  },
  {
    id: "2",
    title: "Data Scientist",
    clientName: "AI Solutions",
    location: "Boston, MA",
    salaryRange: "$130k - $160k",
    headcount: 2,
    jobType: "Full-time",
    isExpanded: false,
    candidates: [
      { id: "4", name: "David Chen", source: "LinkedIn", currentStage: "Verification" },
      { id: "5", name: "Eva Rodriguez", source: "Indeed", currentStage: "Onboarding" }
    ]
  },
  {
    id: "3",
    title: "Marketing Manager",
    clientName: "Growth Co.",
    location: "Chicago, IL",
    salaryRange: "$85k - $105k",
    headcount: 1,
    jobType: "Full-time",
    isExpanded: false,
    candidates: [
      { id: "6", name: "Frank Miller", source: "LinkedIn", currentStage: "Disqualified" },
      { id: "7", name: "Grace Lee", source: "Indeed", currentStage: "Sourcing" },
      { id: "8", name: "Henry Taylor", source: "Referral", currentStage: "Screening" }
    ]
  },
  {
    id: "4",
    title: "Sales Representative",
    clientName: "SalesForce Inc.",
    location: "Dallas, TX",
    salaryRange: "$70k - $90k",
    headcount: 5,
    jobType: "Full-time",
    isExpanded: false,
    candidates: [
      { id: "9", name: "Ivy Martinez", source: "LinkedIn", currentStage: "Interview" },
      { id: "10", name: "Jack Anderson", source: "Indeed", currentStage: "Hired" },
      { id: "11", name: "Kate Thompson", source: "Referral", currentStage: "Screening" },
      { id: "12", name: "Liam O'Connor", source: "LinkedIn", currentStage: "Disqualified" },
      { id: "13", name: "Maya Patel", source: "Indeed", currentStage: "Onboarding" }
    ]
  }
];

// Helper function to get stage colors
export const getStageColor = (stage: string) => {
  const colors = {
    "Sourcing": "bg-purple-100 text-purple-800 border-purple-200",
    "Screening": "bg-orange-100 text-orange-800 border-orange-200",
    "SR/Completed": "bg-green-100 text-green-800 border-green-200",
    "Interview": "bg-blue-100 text-blue-800 border-blue-200",
    "Verification": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Onboarding": "bg-green-100 text-green-800 border-green-200",
    "Hired": "bg-red-100 text-red-800 border-red-200",
    "Disqualified": "bg-red-100 text-red-800 border-red-200"
  };
  return colors[stage as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Helper function to get candidate count by stage
export const getCandidateCountByStage = (candidates: Candidate[], stage: string) => {
  return candidates.filter(candidate => candidate.currentStage === stage).length;
};
