export interface CreatedBy {
  id: string;
  name: string;
}

export interface TemporaryCandidate {
  _id: string;
  name: string;
  profileLink: string;
  email: string;
  phone: string;
  pipelineId: string;
  showProfile: boolean;
  CreatedBy?: CreatedBy;
  createdAt: string;
  updatedAt: string;
}

export interface TemporaryCandidatesResponse {
  status: 'success' | 'error';
  results: number;
  data: TemporaryCandidate[];
}