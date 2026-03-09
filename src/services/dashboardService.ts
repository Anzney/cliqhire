import { api } from "@/lib/axios-config";

export interface DashboardStats {
    jobs: {
        total: number;
        active: number;
    };
    candidates: {
        total: number;
        active: number;
    };
    clients: {
        total: number;
        byStage: {
            lead: number;
            engaged: number;
            signed: number;
        };
    };
    users: {
        total: number;
        active: number;
    };
    contracts: {
        total: number;
    };
    pipeline: {
        activePipelines: number;
        candidatesInterviewing: number;
        candidatesHired: number;
    };
    tasks: {
        pending: number;
        completed: number;
    };
}

export interface DashboardResponse {
    success: boolean;
    data: DashboardStats;
    message?: string;
    error?: string;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const response = await api.get<DashboardResponse>('/api/dashboard/stats');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};
