"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AddNoteDialog } from "@/components/clients/notes/add-note-dialog";
import { NotesList } from "@/components/clients/notes/notes-list";
import axios from "axios";
import { toast } from "sonner";
import {
  createJobNote,
  getJobNotesByJobId,
  updateJobNote,
  deleteJobNote,
} from "@/services/jobService";

export interface Note {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  isPrivate: boolean;
}

// Utility to map backend note to frontend note
function mapNote(noteFromApi: any): Note {
  return {
    id: noteFromApi._id || noteFromApi.id,
    content: noteFromApi.content,
    author: noteFromApi.createdBy || { name: "Unknown", avatar: "?" },
    createdAt: noteFromApi.createdAt,
    isPrivate: false, // Adjust if you add this to backend
  };
}

export function NotesContent({ jobId }: { jobId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!jobId) return;
    getJobNotesByJobId(jobId)
      .then((data) => setNotes(data.map(mapNote)))
      .catch((err) => console.error("Failed to fetch notes:", err));
  }, [jobId]);

  const handleAddNote = async (note: { content: string }) => {
    if (!jobId) {
      alert("Job ID not found in URL. Cannot create note.");
      return;
    }
    try {
      const res = await createJobNote({ content: note.content, jobId });
      setNotes([mapNote(res), ...notes]);
      toast.success("Notes Add Successfully");
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error("Failed to add note");
    }
  };

  const handleUpdateNote = async (updated: { content: string }) => {
    if (!editNote) return;
    try {
      const res = await updateJobNote(editNote.id, updated.content, jobId);
      const updatedNote = mapNote(res);
      const updatedNotes = notes.map((n) =>
        n.id === updatedNote.id ? updatedNote : n
      );
      setNotes(updatedNotes);
      setEditNote(null);
      setIsEditDialogOpen(false);
      toast.success("Note updated successfully");
    } catch (error) {
      console.error("Failed to update note:", error);
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteToDelete: Note) => {
    try {
      await deleteJobNote(noteToDelete.id);
      setNotes(notes.filter((n) => n.id !== noteToDelete.id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Note
        </Button>
      </div>

      {notes.length > 0 ? (
        <NotesList
          notes={notes}
          onEdit={(note) => {
            setEditNote(note);
            setTimeout(() => {
              setIsEditDialogOpen(true);
            }, 0);
          }}
          onDelete={handleDeleteNote}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="w-48 h-48 mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full text-blue-500">
              <rect
                x="60"
                y="40"
                width="80"
                height="120"
                rx="8"
                fill="currentColor"
                fillOpacity="0.1"
              />
              <rect x="70" y="60" width="60" height="4" rx="2" fill="currentColor" />
              <rect x="70" y="80" width="40" height="4" rx="2" fill="currentColor" />
              <rect x="70" y="100" width="50" height="4" rx="2" fill="currentColor" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
          <p className="text-muted-foreground text-center mb-8">
            Add your first note to keep track of important information.
          </p>
        </div>
      )}

      <AddNoteDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddNote}
      />

      {editNote && (
        <AddNoteDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setEditNote(null);
          }}
          onSubmit={handleUpdateNote}
          initialContent={editNote.content}
          isEdit
        />
      )}
    </div>
  );
}
