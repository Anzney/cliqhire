import { api } from "@/lib/axios-config";

export interface HistoryUser {
    _id: string;
    name: string;
    email: string;
}

export interface HistoryChanges {
    before?: Record<string, any>;
    after?: Record<string, any>;
}

export interface HistoryRecord {
    _id?: string;
    entity_id: string;
    entity_type: string;
    action: string;
    performedBy?: HistoryUser | null;
    changes?: HistoryChanges;
    created_at: string;
}

export interface HistoryPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface HistoryResponse {
    success: boolean;
    pagination: HistoryPagination;
    data: HistoryRecord[];
}

export const clientHistoryService = {
    getHistoryByClientId: async (clientId: string, page: number = 1, limit: number = 10): Promise<HistoryResponse> => {
        const response = await api.get(`/api/history/clients/${clientId}`, {
            params: { page, limit }
        });
        return response.data;
    }
};
