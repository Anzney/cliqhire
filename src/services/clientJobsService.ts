import axios from "axios"
import { getClientToken } from "@/services/clientAuthService"

export interface ClientPipelineJobSummaryItem {
  jobId: string
  jobTitle: string
  jobStatus: string
  candidateCount: number
}

export interface ClientPipelineJobsSummaryResponse {
  success: boolean
  message: string
  count: number
  data: ClientPipelineJobSummaryItem[]
}

const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000,
})

// Attach Bearer token from client login for protected client APIs
clientApi.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? getClientToken() : null
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as any).Authorization = `Bearer ${token}`
    }
  } catch (_) {
    // no-op
  }
  return config
})

export async function fetchClientPipelineJobsSummary(): Promise<ClientPipelineJobSummaryItem[]> {
  const res = await clientApi.get<ClientPipelineJobsSummaryResponse>("/api/clients/pipeline-jobs-summary")
  const data = res.data
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load jobs summary")
  }
  return Array.isArray(data.data) ? data.data : []
}
