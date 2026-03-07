"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AddNoteDialog } from "./add-note-dialog";
import { NotesList } from "./notes-list";
import axios from "axios";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export function NotesContent({
  clientId,
  candidateId,
  canModify,
}: {
  clientId?: string;
  candidateId?: string;
  canModify?: boolean;
}) {
  // const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]); // removed sample notes
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const entityId = clientId || candidateId;
    const entityType = clientId ? 'client' : 'candidate';

    if (!entityId) return;
    axios
      .get(`${API_BASE}/api/notes/${entityType}/${entityId}`)
      .then((res) => setNotes(res.data.data.map(mapNote)))
      .catch((err) => console.error("Failed to fetch notes:", err));
  }, [clientId, candidateId]);

  const handleAddNote = async (note: { content: string }) => {
    const entityId = clientId || candidateId;
    const entityType = clientId ? 'client' : 'candidate';

    if (!entityId) {
      alert(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ID not found in URL. Cannot create note.`);
      return;
    }
    const newNote = {
      content: note.content,
      createdBy: entityId,
      // relatedTo: ... // Add if needed
    };
    try {
      const res = await axios.post(`${API_BASE}/api/notes`, newNote);
      setNotes([mapNote(res.data.data), ...notes]);
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleUpdateNote = async (updated: { content: string }) => {
    if (!editNote) return;

    try {
      const res = await axios.patch(`${API_BASE}/api/notes/${editNote.id}`, {
        content: updated.content,
        // relatedTo: ... // Add if needed
      });
      const updatedNote = mapNote(res.data.data);
      const updatedNotes = notes.map((n) =>
        n.id === updatedNote.id ? updatedNote : n
      );
      setNotes(updatedNotes);
      setEditNote(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDeleteNote = async (noteToDelete: Note) => {
    try {
      await axios.delete(`${API_BASE}/api/notes/${noteToDelete.id}`);
      setNotes(notes.filter((n) => n.id !== noteToDelete.id)); // This is fine if you keep mapping _id -> id
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl p-6 flex flex-col h-full">
      {canModify && (
        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand/10 rounded-lg">
              <Plus className="w-4 h-4 text-brand" />
            </div>
            <h2 className="text-base font-semibold text-slate-800">Client Notes</h2>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="hover:bg-brand/90 transition-colors bg-brand text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Note
          </Button>
        </div>
      )}

      {notes.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm transition-all p-5">
          <NotesList
            notes={notes}
            canModify={canModify}
            onEdit={(note) => {
              setEditNote(note);
              setTimeout(() => {
                setIsEditDialogOpen(true);
              }, 0);
            }}
            onDelete={handleDeleteNote}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center bg-white rounded-xl border border-slate-200 shadow-sm p-12">
          <div className="w-24 h-24 mb-6 bg-slate-50 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No notes yet</h3>
          <p className="text-slate-500 text-center max-w-sm mb-6">
            Add your first note to keep track of important information.
          </p>
        </div>
      )}

      {canModify && (
        <AddNoteDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddNote}
        />
      )}

      {canModify && editNote && (
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
