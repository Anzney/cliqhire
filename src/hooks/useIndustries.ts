import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIndustries, addIndustry, Industry } from "@/services/industryServices";
import { toast } from "sonner";

export const useIndustries = () => {
    const queryClient = useQueryClient();

    const industriesQuery = useQuery({
        queryKey: ["industries"],
        queryFn: getIndustries,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const addIndustryMutation = useMutation({
        mutationFn: addIndustry,
        onSuccess: (newIndustry) => {
            queryClient.invalidateQueries({ queryKey: ["industries"] });
            toast.success(`Industry "${newIndustry.name}" added successfully`);
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Failed to add industry";
            toast.error(message);
        },
    });

    return {
        industries: industriesQuery.data || [],
        isLoading: industriesQuery.isLoading,
        isError: industriesQuery.isError,
        addIndustry: addIndustryMutation.mutateAsync, // Expose mutateAsync for await usage if needed
        isAdding: addIndustryMutation.isPending,
    };
};
