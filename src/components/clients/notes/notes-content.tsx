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

export function NotesContent({ 
  clientId, 
  candidateId 
}: { 
  clientId?: string;
  candidateId?: string;
}) {
  // const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]); // removed sample notes
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

const API_BASE = process.env.NEXT_PUBLIC_API_URL ;

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
    <div className="flex-1">
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
        <div className="flex flex-col items-center justify-center text-center">
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
