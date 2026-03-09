import { getClients } from "@/services/clientService";

export async function fetchClients(search: string = "", page: number = 1): Promise<{ clients: { _id: string; name: string }[], hasMore: boolean }> {
  try {
    const limit = 15; // Increased limit for better initial view
    const { clients, totalPages } = await getClients({ search, limit, page });
    return {
      clients: clients.map((client: any) => ({ _id: client._id, name: client.name })),
      // Use both metadata and length check for robust hasMore detection
      hasMore: page < totalPages || clients.length === limit
    };
  } catch (error) {
    return { clients: [], hasMore: false };
  }
}