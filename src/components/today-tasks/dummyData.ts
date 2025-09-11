import { AssignedJob, Interview, PersonalTask } from "./types";

// Dummy data for Today Tasks page
// TODO: Replace with real API calls when backend is ready

export const dummyAssignedJobs: AssignedJob[] = [
  {
    id: "1",
    jobTitle: "Senior Software Engineer",
    clientName: "TechCorp Solutions",
    location: "San Francisco, CA",
    priority: "high",
    deadline: "2024-01-15",
    candidatesCount: 8,
    status: "active",
    recruiter: "John Smith"
  },
  {
    id: "2", 
    jobTitle: "Product Manager",
    clientName: "InnovateLabs",
    location: "New York, NY",
    priority: "medium",
    deadline: "2024-01-20",
    candidatesCount: 5,
    status: "active",
    recruiter: "Sarah Johnson"
  },
  {
    id: "3",
    jobTitle: "UX Designer",
    clientName: "DesignStudio Pro",
    location: "Austin, TX",
    priority: "low",
    deadline: "2024-01-25",
    candidatesCount: 12,
    status: "paused",
    recruiter: "Mike Chen"
  }
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    candidateName: "Alice Johnson",
    candidateEmail: "alice.johnson@email.com",
    candidatePhone: "+1 (555) 123-4567",
    jobTitle: "Senior Software Engineer",
    clientName: "TechCorp Solutions",
    interviewType: "video",
    scheduledTime: "2024-01-10T10:00:00",
    duration: 60,
    status: "scheduled",
    meetingLink: "https://meet.zoom.us/j/123456789",
    notes: "Technical interview focusing on React and Node.js"
  },
  {
    id: "2",
    candidateName: "Bob Smith",
    candidateEmail: "bob.smith@email.com", 
    candidatePhone: "+1 (555) 987-6543",
    jobTitle: "Product Manager",
    clientName: "InnovateLabs",
    interviewType: "phone",
    scheduledTime: "2024-01-10T14:30:00",
    duration: 45,
    status: "scheduled",
    notes: "Initial screening call"
  },
  {
    id: "3",
    candidateName: "Carol Davis",
    candidateEmail: "carol.davis@email.com",
    candidatePhone: "+1 (555) 456-7890",
    jobTitle: "UX Designer", 
    clientName: "DesignStudio Pro",
    interviewType: "in-person",
    scheduledTime: "2024-01-10T16:00:00",
    duration: 90,
    status: "scheduled",
    location: "DesignStudio Pro Office, Austin TX",
    notes: "Portfolio review and design challenge"
  }
];

export const dummyPersonalTasks: PersonalTask[] = [
  {
    id: "1",
    title: "Check CV status for John Smith",
    description: "Follow up on CV submission for Senior Developer position at TechCorp",
    priority: "high",
    dueDate: "2024-01-10",
    dueTime: "10:00",
    status: "pending",
    category: "follow-up",
    followUpType: "cv-received",
    followUpStatus: "pending",
    relatedCandidate: "John Smith",
    relatedJob: "Senior Developer",
    relatedClient: "TechCorp",
    createdAt: "2024-01-09"
  },
  {
    id: "2",
    title: "Update job descriptions",
    description: "Review and update 5 job descriptions based on client feedback",
    priority: "high",
    dueDate: "2024-01-10",
    dueTime: "12:00",
    status: "in-progress",
    category: "admin",
    createdAt: "2024-01-08"
  },
  {
    id: "3",
    title: "Follow up on candidate response",
    description: "Check if Sarah Johnson has responded to our interview invitation",
    priority: "medium",
    dueDate: "2024-01-10",
    dueTime: "14:00",
    status: "pending",
    category: "follow-up",
    followUpType: "candidate-response",
    followUpStatus: "pending",
    relatedCandidate: "Sarah Johnson",
    relatedJob: "Product Manager",
    relatedClient: "InnovateLabs",
    createdAt: "2024-01-09"
  },
  {
    id: "4",
    title: "Research new sourcing channels",
    description: "Explore LinkedIn Recruiter alternatives and new job boards",
    priority: "low",
    dueDate: "2024-01-12",
    status: "pending",
    category: "research",
    createdAt: "2024-01-07"
  }
];
