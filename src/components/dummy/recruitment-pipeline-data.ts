export interface RecruitmentCandidate {
  id: string;
  candidateName: string;
  jobPosition: string;
  clientName: string;
  hiringManager: string;
  stage: string;
}

export const dummyRecruitmentData: RecruitmentCandidate[] = [
  // Screening Stage
  {
    id: "1",
    candidateName: "John Smith",
    jobPosition: "Senior Software Engineer",
    clientName: "TechCorp Inc.",
    hiringManager: "Sarah Johnson",
    stage: "screening"
  },
  {
    id: "2",
    candidateName: "Emily Davis",
    jobPosition: "Product Manager",
    clientName: "InnovateTech",
    hiringManager: "Michael Chen",
    stage: "screening"
  },
  {
    id: "3",
    candidateName: "David Wilson",
    jobPosition: "UX Designer",
    clientName: "DesignStudio",
    hiringManager: "Lisa Rodriguez",
    stage: "screening"
  },

  // SR/Completed Stage
  {
    id: "4",
    candidateName: "Jennifer Brown",
    jobPosition: "Data Scientist",
    clientName: "DataFlow Solutions",
    hiringManager: "Robert Kim",
    stage: "sr-completed"
  },
  {
    id: "5",
    candidateName: "Alex Thompson",
    jobPosition: "DevOps Engineer",
    clientName: "CloudTech",
    hiringManager: "Amanda White",
    stage: "sr-completed"
  },

  // Sourcing Stage
  {
    id: "6",
    candidateName: "Maria Garcia",
    jobPosition: "Frontend Developer",
    clientName: "WebSolutions",
    hiringManager: "James Wilson",
    stage: "sourcing"
  },
  {
    id: "7",
    candidateName: "Kevin Lee",
    jobPosition: "Backend Developer",
    clientName: "ServerTech",
    hiringManager: "Rachel Green",
    stage: "sourcing"
  },
  {
    id: "8",
    candidateName: "Sophie Anderson",
    jobPosition: "QA Engineer",
    clientName: "QualityAssurance",
    hiringManager: "Tom Martinez",
    stage: "sourcing"
  },

  // Interview Stage
  {
    id: "9",
    candidateName: "Ryan Cooper",
    jobPosition: "Full Stack Developer",
    clientName: "FullStack Inc.",
    hiringManager: "Patricia Taylor",
    stage: "interview"
  },
  {
    id: "10",
    candidateName: "Nina Patel",
    jobPosition: "Mobile Developer",
    clientName: "MobileFirst",
    hiringManager: "Daniel Brown",
    stage: "interview"
  },

  // Verification Stage
  {
    id: "11",
    candidateName: "Chris Miller",
    jobPosition: "Security Engineer",
    clientName: "SecureNet",
    hiringManager: "Jessica Davis",
    stage: "verification"
  },

  // Onboarding Stage
  {
    id: "12",
    candidateName: "Laura Turner",
    jobPosition: "Business Analyst",
    clientName: "BusinessLogic",
    hiringManager: "Steven Clark",
    stage: "onboarding"
  },

  // Hired Stage
  {
    id: "13",
    candidateName: "Mark Johnson",
    jobPosition: "Project Manager",
    clientName: "ProjectPro",
    hiringManager: "Catherine Lee",
    stage: "hired"
  },
  {
    id: "14",
    candidateName: "Anna Rodriguez",
    jobPosition: "Marketing Specialist",
    clientName: "MarketMasters",
    hiringManager: "Kevin Smith",
    stage: "hired"
  },

  // Disqualified Stage
  {
    id: "15",
    candidateName: "Paul Williams",
    jobPosition: "Sales Representative",
    clientName: "SalesForce",
    hiringManager: "Michelle Johnson",
    stage: "disqualified"
  },
  {
    id: "16",
    candidateName: "Grace Kim",
    jobPosition: "Content Writer",
    clientName: "ContentCreators",
    hiringManager: "Andrew Wilson",
    stage: "disqualified"
  }
];

export const getCandidatesByStage = (stage: string): RecruitmentCandidate[] => {
  return dummyRecruitmentData.filter(candidate => candidate.stage === stage);
};
