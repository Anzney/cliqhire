import { useQuery } from "@tanstack/react-query";
import { getClients, getClientById, ClientResponse } from "@/services/clientService";

export interface ClientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  clientStage?: "Lead" | "Engaged" | "Signed";
  clientTeam?: "Enterprise" | "SMB" | "Mid-Market";
}

export interface ClientsPage {
  clients: ClientResponse[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useClients(params: ClientsQueryParams = {}) {
  const { page = 1, limit = 10, ...rest } = params;

  return useQuery<ClientsPage>({
    queryKey: ["clients", { page, limit, ...rest }],
    queryFn: () => getClients({ page, limit, ...rest }),
  });
}

export function useClientById(id: string) {
  return useQuery<ClientResponse>({
    queryKey: ["clientsData", id],
    queryFn: () => getClientById(id),
    enabled: Boolean(id),
  });
}
