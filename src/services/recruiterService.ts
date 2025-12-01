import { api } from "@/lib/axios-config";
import type { RecruiterJob, RecruiterCandidate } from "@/components/recruiter/types";

type HeadhunterAssignedJob = {
  _id: string;
  jobTitle: string;
  client?: { _id?: string; name?: string };
  location?: string;
  headcount?: number;
  stage?: string;
  jobType?: string;
  minimumSalary?: number;
  maximumSalary?: number;
  salaryCurrency?: string;
  salaryRange?: { min?: number; max?: number; currency?: string };
  createdAt?: string;
  updatedAt?: string;
  jobTeamInfo?: any;
  headhunterCandidates?: Array<{
    candidateId?: string;
    _id?: string;
    id?: string;
    name?: string;
    location?: string;
    skills?: string[];
    status?: string;
    phone?: string;
    email?: string;
    resume?: string;
    resumeUrl?: string;
    rejectedDate?: string;
    rejectionReason?: string;
  }>;
};

export async function getHeadhunterAssignedJobs(
  roleSegment: "recruiter" | "teamLead" | "hiringManager",
  userId: string
): Promise<RecruiterJob[]> {
  const url = `/api/jobs/internal-team/${roleSegment}/${userId}/headhunter-assigned`;
  const res = await api.get(url);
  const items: HeadhunterAssignedJob[] = res?.data?.data || [];

  return items.map((job) => {
    const candidates: RecruiterCandidate[] = (job.headhunterCandidates || []).map((c, idx) => {
      const candidateApiId = c.candidateId || c._id || c.id || undefined;

      return {
        id: candidateApiId || c.email || c.phone || `${c.name || ""}-${idx}`,
        apiId: candidateApiId,
        name: c.name || "",
        email: c.email || "",
        phone: c.phone || "",
        location: c.location || "",
        status: (c.status || "").toString(),
        currentStage: "",
        resume: c.resume || c.resumeUrl || "",
        rejectedDate: c.rejectedDate || undefined,
        rejectionReason: c.rejectionReason || undefined,
      };
    });

    const sr = job.salaryRange;
    const min = sr?.min ?? job.minimumSalary;
    const max = sr?.max ?? job.maximumSalary;
    const currency = sr?.currency ?? job.salaryCurrency;
    const salaryRangeStr =
      min != null && max != null && currency
        ? `${min} - ${max} ${currency}`
        : undefined;

    const mapped: RecruiterJob = {
      id: job._id,
      title: job.jobTitle,
      clientName: job.client?.name || "",
      location: job.location,
      salaryRange: salaryRangeStr,
      headcount: job.headcount,
      jobType: job.jobType,
      isExpanded: false,
      candidates,
      jobId: { stage: job.stage || "" },
      totalCandidates: candidates.length,
    };

    return mapped;
  });
}

export async function updateCandidateStatusForJob(
  candidateId: string,
  jobId: string,
  body: { status: string; rejectionReason?: string; rejectionReason1?: string }
): Promise<any> {
  const url = `/api/headhunter-candidates/${candidateId}/jobs/${jobId}/status`;
  const res = await api.patch(url, body, { headers: { "Content-Type": "application/json" } });
  return res.data?.data || res.data;
}
