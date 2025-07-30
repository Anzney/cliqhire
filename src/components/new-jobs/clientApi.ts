import { getClients } from "@/services/clientService";

export async function fetchClients(search: string = ""): Promise<{ _id: string; name: string }[]> {
  try {
    const { clients } = await getClients({ search, limit: 20 });
    return clients.map((client: any) => ({ _id: client._id, name: client.name }));
  } catch (error) {
    return [];
  }
} 