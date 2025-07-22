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
    _id: "665b2c1234567890abcdef01", // Added unique _id
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    location: "New York",
    experience: "5 years",
    skills: ["React", "Node.js"],
    resume: "",
    status: "Active",
  },
  // Add more mock candidates as needed, each with a unique _id
];

// This function will fetch from API in the future
export async function fetchCandidatesFromAPI(): Promise<Candidate[]> {
  const res = await axios.get('/api/candidates');
  return res.data;
}
