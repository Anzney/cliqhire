import axios from "axios";

interface ContractData extends FormData {
  append(name: string, value: string | Blob, fileName?: string): void;
}

export interface ContractResponse {
  _id: string;
  clientId: string;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  contractType?: "Fixed Percentage" | "Fix with Advance" | "Fix without Advance" | "Level Based (Hiring)" | null;
  levelBasedDetails?: {
    seniorLevel?: { percentage: number; notes: string };
    executives?: { percentage: number; notes: string };
    nonExecutives?: { percentage: number; notes: string };
    other?: { percentage: number; notes: string };
  } | null;
  agreement?: {
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
  } | null;
  referralPercentage: number;
  notes?: string;
  lineOfBusiness?: string[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const createContract = async (contractData: ContractData) => {
  try {
    const response = await api.post("/clients", contractData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error creating contract");
  }
};

const updateContract = async (id: string, contractData: ContractData) => {
  try {
    const response = await api.patch(`/uplodas/${id}`, contractData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error updating contract");
  }
};

const getContractByClient = async (clientId: string): Promise<ContractResponse> => {
  try {
    const response = await api.get(`/clients/${clientId}`);
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error fetching contract");
  }
};

const downloadAgreement = async (fileName: string): Promise<Blob> => {
  try {
    const response = await api.get(`/uploads/${fileName}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw handleError(error, "Error downloading agreement");
  }
};

const deleteAgreement = async (fileName: string) => {
  try {
    const response = await api.delete(`/uploads/delete/${fileName}`);
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error deleting agreement");
  }
};

const handleError = (error: any, message: string) => {
  if (error.response) {
    const errorMessage = error.response.data?.error || "Unknown error occurred";
    console.error("Server response:", error.response.data);
    return new Error(`${message}: ${errorMessage}`);
  }
  console.error("Unexpected error:", error.message);
  return new Error(`${message}: ${error.message}`);
};

export { createContract, updateContract, getContractByClient, downloadAgreement, deleteAgreement };