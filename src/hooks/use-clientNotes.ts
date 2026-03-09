import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientNotesService } from "@/services/clientNotes-Service";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const useClientNotes = (entityId?: string, entityType: 'client' | 'candidate' = 'client') => {
    const queryClient = useQueryClient();
    const queryKey = ["notes", entityType, entityId];

    const notesQuery = useQuery({
        queryKey,
        queryFn: () => clientNotesService.getNotesByEntity(entityId!, entityType),
        enabled: !!entityId,
    });

    const createNoteMutation = useMutation({
        mutationFn: async (content: string) => {
            if (!entityId) throw new Error("Entity ID is required");
            const user = authService.getUserData();
            const addedBy = user?._id || user?.id;
            return clientNotesService.createNote({
                content,
                createdBy: entityId,
                addedBy,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Note added successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to add note");
        },
    });

    const updateNoteMutation = useMutation({
        mutationFn: async ({ noteId, content }: { noteId: string; content: string }) => {
            return clientNotesService.updateNote(noteId, { content });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Note updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to update note");
        },
    });

    const deleteNoteMutation = useMutation({
        mutationFn: async (noteId: string) => {
            return clientNotesService.deleteNote(noteId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Note deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to delete note");
        },
    });

    return {
        notes: notesQuery.data || [],
        isLoading: notesQuery.isLoading,
        isError: notesQuery.isError,
        createNote: createNoteMutation.mutateAsync,
        isCreating: createNoteMutation.isPending,
        updateNote: updateNoteMutation.mutateAsync,
        isUpdating: updateNoteMutation.isPending,
        deleteNote: deleteNoteMutation.mutateAsync,
        isDeleting: deleteNoteMutation.isPending,
    };
};
