import axios from 'axios';

export type Candidate = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  resume: string;
  status: string;
};

export const mockCandidates: Candidate[] = [
  {
    _id: "665b2c1234567890abcdef01",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    location: "New York",
    experience: "5 years",
    skills: ["React", "Node.js"],
    resume: "",
    status: "Active",
  },
  {
    _id: "665b2c1234567890abcdef02",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "2345678901",
    location: "San Francisco",
    experience: "3 years",
    skills: ["Angular", "TypeScript"],
    resume: "",
    status: "Interviewing",
  },
  {
    _id: "665b2c1234567890abcdef03",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "3456789012",
    location: "Chicago",
    experience: "7 years",
    skills: ["Python", "Django"],
    resume: "",
    status: "Rejected",
  },
  {
    _id: "665b2c1234567890abcdef04",
    name: "Emily Brown",
    email: "emily@example.com",
    phone: "4567890123",
    location: "Austin",
    experience: "2 years",
    skills: ["Vue", "JavaScript"],
    resume: "",
    status: "Active",
  },
  {
    _id: "665b2c1234567890abcdef05",
    name: "Chris Green",
    email: "chris@example.com",
    phone: "5678901234",
    location: "Seattle",
    experience: "4 years",
    skills: ["Java", "Spring"],
    resume: "",
    status: "Offer",
  },
];

// This function will fetch from API in the future
export async function fetchCandidatesFromAPI(): Promise<Candidate[]> {
  // For now, return mock candidates
  return mockCandidates;
}
