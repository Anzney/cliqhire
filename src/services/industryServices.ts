import { api } from "@/lib/axios-config";

export interface Industry {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const getIndustries = async (): Promise<Industry[]> => {
    const response = await api.get("/api/industries");
    return response.data;
};

export const addIndustry = async (name: string): Promise<Industry> => {
    const response = await api.post("/api/industries", { name });
    return response.data;
};
