import { useQuery } from "@tanstack/react-query";
import { getJobs, JobsPage } from "@/services/jobService";

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  stage?: string;
  jobType?: string;
  location?: string;
  client?: string;
  clientId?: string;
  search?: string;
  gender?: string;
  sort?: string;
}

export function useJobs(params: JobsQueryParams = {}) {
  const { page = 1, limit = 10, ...rest } = params;

  return useQuery<JobsPage>({
    queryKey: ["jobs", { page, limit, ...rest }],
    queryFn: () => getJobs({ page, limit, ...rest }),
    placeholderData: (prev) => prev, // keeps previous data visible while next page is fetching
  });
}
