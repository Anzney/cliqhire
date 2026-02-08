// Task Types and Interfaces for Today Tasks

export interface AssignedJob {
  id: string;
  jobTitle: string;
  clientName: string;
  // Optional UI fields used in dummy data and UI display
  location?: string;
  priority?: "high" | "medium" | "low";
  deadline?: string;
  aemsDeadline?: string;
  recruiter?: string;
  candidatesCount: number;
  status: "To-do" | "In Progress" | "Completed";
  // Additional fields from API
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
  position?: string;
  jobId?: string;
  clientId?: string;
}

export interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  clientName: string;
  interviewType: "phone" | "video" | "in-person";
  scheduledTime: string | null;
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
  status: "to-do" | "inprogress" | "completed";
  category: string; // Allow any string since API can return different categories
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
