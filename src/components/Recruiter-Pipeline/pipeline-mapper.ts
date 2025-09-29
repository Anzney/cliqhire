import { type Job, type Candidate, mapBackendStageToUIStage } from "./dummy-data";

// Maps API pipeline entry to UI Job type used across the Recruiter Pipeline
export function mapEntryToJob(entry: any): Job {
  const jobData: any = entry.jobId || {};

  const salaryMin = jobData?.salaryRange?.min ?? jobData?.minimumSalary;
  const salaryMax = jobData?.salaryRange?.max ?? jobData?.maximumSalary;
  const salaryCurrency = jobData?.salaryRange?.currency ?? jobData?.salaryCurrency ?? "";
  const salaryRangeString =
    salaryMin !== undefined && salaryMin !== null && salaryMax !== undefined && salaryMax !== null
      ? `${salaryMin}-${salaryMax} ${salaryCurrency}`
      : "";

  const candidates: Candidate[] = (entry.candidateIdArray || []).map((c: any) => ({
    id: c?._id || c?.candidateId?._id || "",
    name: c?.candidateId?.name || "",
    source: c?.sourcing?.source || "",
    currentStage: mapBackendStageToUIStage(c?.currentStage || c?.status || "Sourcing"),
    avatar: undefined,
    experience: c?.candidateId?.experience,
    currentSalary: c?.candidateId?.currentSalary,
    currentSalaryCurrency: c?.candidateId?.currentSalaryCurrency,
    expectedSalary: c?.candidateId?.expectedSalary,
    expectedSalaryCurrency: c?.candidateId?.expectedSalaryCurrency,
    currentJobTitle: c?.candidateId?.currentJobTitle,
    previousCompanyName: c?.candidateId?.previousCompanyName,
    currentCompanyName: c?.candidateId?.currentCompanyName,
    status: c?.status,
    subStatus: c?.status,
    email: c?.candidateId?.email,
    phone: c?.candidateId?.phone,
    location: c?.candidateId?.location,
    skills: c?.candidateId?.skills,
    softSkill: c?.candidateId?.softSkill,
    technicalSkill: c?.candidateId?.technicalSkill,
    gender: c?.candidateId?.gender,
    dateOfBirth: c?.candidateId?.dateOfBirth,
    country: c?.candidateId?.country,
    nationality: c?.candidateId?.nationality,
    willingToRelocate: c?.candidateId?.willingToRelocate,
    description: c?.candidateId?.description,
    linkedin: c?.candidateId?.linkedin,
    reportingTo: c?.candidateId?.reportingTo,
    educationDegree: c?.candidateId?.educationDegree,
    primaryLanguage: c?.candidateId?.primaryLanguage,
    resume: c?.candidateId?.resume,
    priority: c?.priority,
    notes: c?.notes,
    sourcing: c?.sourcing,
    screening: c?.screening,
    clientScreening: c?.clientScreening,
    interview: c?.interview,
    verification: c?.verification,
    onboarding: c?.onboarding,
    hired: c?.hired,
    disqualified: c?.disqualified,
    connection: c?.connection,
    hiringManager: c?.hiringManager,
    recruiter: c?.recruiter,
    isTempCandidate: c?.candidateId?.isTempCandidate || false,
  }));

  return {
    id: entry._id,
    title: jobData?.jobTitle || "",
    clientName: (jobData as any)?.client?.name || "",
    location: Array.isArray(jobData?.location) ? jobData.location.join(", ") : jobData?.location || "",
    salaryRange: salaryRangeString,
    headcount: jobData?.numberOfPositions || jobData?.headcount || 0,
    jobType: jobData?.jobType || "",
    isExpanded: true,
    jobId: entry.jobId,
    candidates,
    priority: entry.priority,
    notes: entry.notes,
    assignedDate: entry.assignedDate,
    totalCandidates: entry.totalCandidates,
    activeCandidates: entry.activeCandidates,
    completedCandidates: entry.completedCandidates,
    droppedCandidates: entry.droppedCandidates,
    recruiterName: entry.recruiterId?.name,
    recruiterEmail: entry.recruiterId?.email,
  } as Job;
}



