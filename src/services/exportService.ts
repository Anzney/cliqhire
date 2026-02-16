import { api } from "@/lib/axios-config";

export interface ExportCandidatesParams {
    year?: number;
    month?: number;
}

export const exportService = {
    exportCandidates: async (params?: ExportCandidatesParams) => {
        try {
            const response = await api.get('/api/export/candidates', {
                params,
                responseType: 'blob', // Important for file download
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting candidates:', error);
            throw error;
        }
    },
    exportClients: async (params?: ExportCandidatesParams) => {
        try {
            const response = await api.get('/api/export/clients', {
                params,
                responseType: 'blob', // Important for file download
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting clients:', error);
            throw error;
        }
    },
    exportJobs: async (params?: ExportCandidatesParams) => {
        try {
            const response = await api.get('/api/export/jobs', {
                params,
                responseType: 'blob', // Important for file download
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting jobs:', error);
            throw error;
        }
    },
};
