import { api } from "@/lib/axios-config";

export interface NoteUser {
    _id: string;
    name: string;
    email: string;
}

export interface NoteSchema {
    _id: string;
    content: string;
    createdBy: string;
    addedBy?: NoteUser | null;
    relatedTo?: string | null;
    createdAt: string;
    updatedAt: string;
}

export const clientNotesService = {
    getNotesByEntity: async (entityId: string, entityType: 'client' | 'candidate' = 'client'): Promise<NoteSchema[]> => {
        const response = await api.get(`/api/notes/${entityType}/${entityId}`);
        return response.data.data;
    },

    getAllNotes: async (): Promise<NoteSchema[]> => {
        const response = await api.get(`/api/notes`);
        return response.data.data;
    },

    createNote: async (data: { content: string; createdBy: string; addedBy?: string; relatedTo?: string }): Promise<NoteSchema> => {
        const response = await api.post(`/api/notes`, data);
        return response.data.data;
    },

    updateNote: async (noteId: string, data: { content: string }): Promise<NoteSchema> => {
        const response = await api.patch(`/api/notes/${noteId}`, data);
        return response.data.data;
    },

    deleteNote: async (noteId: string): Promise<void> => {
        await api.delete(`/api/notes/${noteId}`);
    }
};
