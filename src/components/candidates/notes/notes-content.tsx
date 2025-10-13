"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AddNoteDialog } from "@/components/clients/notes/add-note-dialog";
import { NotesList } from "@/components/clients/notes/notes-list";
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

function mapNote(noteFromApi: any): Note {
  return {
    id: noteFromApi?._id || noteFromApi?.id,
    content: noteFromApi?.content || "",
    author: noteFromApi?.createdBy || { name: "Unknown", avatar: "?" },
    createdAt: noteFromApi?.createdAt || noteFromApi?.updatedAt || new Date().toISOString(),
    isPrivate: false,
  };
}

export function CandidateNotesContent({ candidateId, canModify }: { candidateId: string; canModify?: boolean }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!candidateId) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/candidate-notes?candidate_id=${encodeURIComponent(
      candidateId
    )}`;
    axios
      .get(url)
      .then((res) => {
        const items = (res?.data?.data || []) as any[];
        setNotes(items.map(mapNote));
      })
      .catch((err) => console.error("Failed to fetch candidate notes:", err));
  }, [candidateId]);

  const handleAddNote = async (note: { content: string }) => {
    if (!candidateId) {
      alert("Candidate ID not found. Cannot create note.");
      return;
    }
    if (!canModify) {
      return;
    }
    const payload = {
      content: note.content,
      candidate_id: candidateId,
    };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/candidate-notes`,
        payload
      );
      setNotes([mapNote(res?.data?.data), ...notes]);
    } catch (error) {
      console.error("Failed to add candidate note:", error);
    }
  };

  const handleUpdateNote = async (updated: { content: string }) => {
    if (!editNote) return;
    if (!canModify) return;
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/candidate-notes/${editNote.id}`,
        { content: updated.content }
      );
      const updatedNote = mapNote(res?.data?.data);
      const updatedNotes = notes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
      setNotes(updatedNotes);
      setEditNote(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update candidate note:", error);
    }
  };

  const handleDeleteNote = async (noteToDelete: Note) => {
    if (!canModify) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/candidate-notes/${noteToDelete.id}`
      );
      setNotes(notes.filter((n) => n.id !== noteToDelete.id));
    } catch (error) {
      console.error("Failed to delete candidate note:", error);
    }
  };

  return (
    <div className="flex-1">
      <div className="mb-6 flex justify-end">
        {canModify && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Note
          </Button>
        )}
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
          canModify={canModify}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-48 h-48 mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full text-blue-500">
              <rect x="60" y="40" width="80" height="120" rx="8" fill="currentColor" fillOpacity="0.1" />
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


