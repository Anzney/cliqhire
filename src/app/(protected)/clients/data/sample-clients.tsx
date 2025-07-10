import { Client } from "@/types/client";
import { getClients } from "@/services/clientService";

let sampleClients: Client[] = [];

const LOCAL_STORAGE_KEY = 'cliqhire_clients';

// Function to save clients to localStorage
const saveClientsToLocalStorage = (clients: Client[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
  }
};

// Function to get clients from localStorage
const getClientsFromLocalStorage = (): Client[] | null => {
  if (typeof window !== 'undefined') {
    const storedClients = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedClients ? JSON.parse(storedClients) : null;
  }
  return null;
};

const fetchClients = async () => {
  try {
    // First check if we have clients in localStorage
    const storedClients = getClientsFromLocalStorage();
    if (storedClients && storedClients.length > 0) {
      sampleClients = storedClients;
      return sampleClients;
    }
    
    // If not, fetch from API
    const response = await getClients();
    const clients = Array.isArray(response) ? response : [];
    
    if (!Array.isArray(clients)) {
      throw new Error("Expected an array of clients");
    }
    
    sampleClients = clients.map((client) => ({
      id: client._id,
      name: client.name,
      jobCount: client.jobCount,
      industry: client.industry || "", 
      location: client.location || "", 
      stage: client.clientStage || "Lead", 
      owner: client.clientRm || "", 
      team: client.clientTeam || "", 
      createdAt: client.createdAt,
      incorporationDate: client.incorporationDate || "", 
    }));
    
    // Save to localStorage
    saveClientsToLocalStorage(sampleClients);
    return sampleClients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

const getSampleClients = async () => {
  return await fetchClients();
};

// Function to update a client's stage and persist it
export const updateClientStage = (clientId: string, newStage: "Lead" | "Negotiation" | "Engaged" | "Signed") => {
  const storedClients = getClientsFromLocalStorage() || sampleClients;
  
  const updatedClients = storedClients.map(client => 
    client.id === clientId ? { ...client, stage: newStage } : client
  );
  
  // Update localStorage
  saveClientsToLocalStorage(updatedClients);
  
  // Update in-memory clients
  sampleClients = updatedClients;
  
  return updatedClients;
};

export { getSampleClients };