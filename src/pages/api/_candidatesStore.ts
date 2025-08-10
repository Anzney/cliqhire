export interface CandidateRecord {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: string;
  status?: string;
  appliedJobs: string[];
  // Allow extra fields
  [key: string]: any;
}

// Simple in-memory store shared across API route modules
const candidatesById = new Map<string, CandidateRecord>();

function listCandidates(): CandidateRecord[] {
  return Array.from(candidatesById.values());
}

function getCandidate(candidateId: string): CandidateRecord | undefined {
  return candidatesById.get(candidateId);
}

function upsertCandidate(candidate: Partial<CandidateRecord> & { _id: string }): CandidateRecord {
  const existing = candidatesById.get(candidate._id);
  const next: CandidateRecord = {
    _id: candidate._id,
    appliedJobs: existing?.appliedJobs || [],
  } as CandidateRecord;
  if (existing) Object.assign(next, existing);
  Object.assign(next, candidate);
  candidatesById.set(next._id, next);
  return next;
}

function addAppliedJob(candidateId: string, jobId: string): CandidateRecord {
  const existing = candidatesById.get(candidateId) || upsertCandidate({ _id: candidateId });
  if (!existing.appliedJobs.includes(jobId)) {
    existing.appliedJobs.push(jobId);
  }
  candidatesById.set(candidateId, existing);
  return existing;
}

export const candidatesStore = {
  listCandidates,
  getCandidate,
  upsertCandidate,
  addAppliedJob,
};

export default candidatesStore;


