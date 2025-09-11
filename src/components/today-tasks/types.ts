// Task Types and Interfaces for Today Tasks

export interface AssignedJob {
  id: string;
  jobTitle: string;
  clientName: string;
  location: string;
  priority: "high" | "medium" | "low";
  deadline: string;
  candidatesCount: number;
  status: "active" | "paused" | "completed";
  recruiter: string;
}

export interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  clientName: string;
  interviewType: "phone" | "video" | "in-person";
  scheduledTime: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  meetingLink?: string;
  location?: string;
  notes?: string;
}

export interface PersonalTask {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  dueTime?: string;
  status: "pending" | "in-progress" | "completed";
  category: "follow-up" | "admin" | "research" | "meeting" | "other";
  createdAt: string;
  // Follow-up specific fields
  followUpType?: "cv-received" | "candidate-response" | "client-feedback" | "interview-scheduled" | "offer-sent" | "other";
  followUpStatus?: "pending" | "in-progress" | "completed";
  relatedCandidate?: string;
  relatedJob?: string;
  relatedClient?: string;
}

export interface AddTaskFormData {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'follow-up' | 'admin' | 'research' | 'meeting' | 'other';
  dueDate: string;
  dueTime: string;
  // Follow-up specific fields
  followUpType: 'cv-received' | 'candidate-response' | 'client-feedback' | 'interview-scheduled' | 'offer-sent' | 'other';
  relatedCandidate: string;
  relatedJob: string;
  relatedClient: string;
}
