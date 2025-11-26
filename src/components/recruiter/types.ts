export type RecruiterCandidate = {
  id: string
  name: string
  source?: string
  currentJobTitle?: string
  email?: string
  phone?: string
  location?: string
  currentStage?: string
  status?: string | undefined
}

export type RecruiterJob = {
  id: string
  title: string
  clientName: string
  location?: string
  salaryRange?: string
  headcount?: number
  jobType?: string
  isExpanded: boolean
  candidates: RecruiterCandidate[]
  jobId: { stage: string }
  totalCandidates: number
}

