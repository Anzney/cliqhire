export type Candidate = {
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
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    location: "New York",
    experience: "5 years",
    skills: ["React", "Node.js"],
    resume: "",
    status: "Active",
  },
  // Add more mock candidates as needed
];

// This function will fetch from API in the future
export async function fetchCandidatesFromAPI(): Promise<Candidate[]> {
  // Example: return fetch('/api/candidates').then(res => res.json());
  return mockCandidates; // For now, return mock
}
