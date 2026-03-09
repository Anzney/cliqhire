import { useQuery } from "@tanstack/react-query";
import { clientHistoryService } from "@/services/client-HistoryService";

export const useClientHistory = (clientId?: string, page: number = 1, limit: number = 10) => {
    const queryKey = ["clientHistory", clientId, page, limit];

    const historyQuery = useQuery({
        queryKey,
        queryFn: () => clientHistoryService.getHistoryByClientId(clientId!, page, limit),
        enabled: !!clientId,
    });

    return {
        history: historyQuery.data?.data || [],
        pagination: historyQuery.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
        isLoading: historyQuery.isLoading,
        isError: historyQuery.isError,
        error: historyQuery.error
    };
};
