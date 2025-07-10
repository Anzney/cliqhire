import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (note: { content: string }) => void;
  initialContent?: string;
  isEdit?: boolean;
}

import { useState} from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";

export function AddNoteDialog({
  open,
  onOpenChange,
  onSubmit,
  initialContent = "",
  isEdit = false,
}: AddNoteDialogProps) {
  // Add a key that changes every time dialog opens or initialContent changes
  const [notes, setNotes] = useState(initialContent ?? "");

  const handleSubmit = () => {
    onSubmit({
      content: notes,
    });
    onOpenChange(false);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]  rounded-lg overflow-hidden ">
        <DialogHeader>
          <DialogTitle>Add New notes</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Enter you notes..."
          rows={10}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full resize-y whitespace-pre-wrap break-words "
          value={notes}
        />
        <DialogFooter>
          <Button onClick={handleSubmit}>{isEdit ? "Edit" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
