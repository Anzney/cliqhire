
import { useMutation } from "@tanstack/react-query";
import { exportService, ExportCandidatesParams } from "@/services/exportService";
import { toast } from "sonner";

export const useExportUsers = () => {
    return useMutation({
        mutationFn: (params?: ExportCandidatesParams) => exportService.exportUsers(params),
        onSuccess: (data) => {
            toast.success("Data ready for download");
        },
        onError: (error) => {
            console.error("Export failed:", error);
            toast.error("Failed to export users");
        },
    });
};
