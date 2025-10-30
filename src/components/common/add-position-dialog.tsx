"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPosition } from "@/services/positionService";

interface AddPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (name: string) => void | Promise<void>;
  title?: string;
  existingNames?: string[];
}

export function AddPositionDialog({ open, onOpenChange, onCreated, title = "Add Position", existingNames = [] }: AddPositionDialogProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Position name is required");
      return;
    }
    const duplicate = existingNames.map(n => n.toLowerCase()).includes(trimmed.toLowerCase());
    if (duplicate) {
      setError("This position already exists");
      return;
    }
    try {
      setSubmitting(true);
      const created = await createPosition(trimmed);
      await onCreated(created.name);
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to add position");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="positionName">Position name</Label>
            <Input
              id="positionName"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              placeholder="e.g. Head of Sales"
              autoFocus
            />
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={(e) => { e.stopPropagation(); onOpenChange(false); }} disabled={submitting}>Cancel</Button>
            <Button type="submit" onClick={(e) => e.stopPropagation()} disabled={submitting}>{submitting ? "Adding..." : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
