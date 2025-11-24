"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Candidate } from "@/components/Recruiter-Pipeline/dummy-data";

interface Props {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (data: { rejectionDate?: string; rejectionReason?: string }) => void;
}

export function HeadhunterCandidateViewDialog({ candidate, open, onOpenChange, onConfirm }: Props) {
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const formatDate = (value?: string) => {
    if (!value) return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString();
  };

  React.useEffect(() => {
    if (open) {
      setRejectionReason("");
    }
  }, [open]);

  if (!candidate) return null;

  const handleSave = async () => {
    await onConfirm?.({ rejectionDate: undefined, rejectionReason: rejectionReason || undefined });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
          <DialogDescription>View candidate information and optionally record rejection details.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={candidate.name || ""} disabled className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={candidate.email || ""} disabled className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={candidate.phone || ""} disabled className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Input value={(candidate.subStatus as any) || (candidate.status as any) || ""} disabled className="bg-gray-50" />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Location</Label>
            <Input value={candidate.location || ""} disabled className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label>Rejection Date</Label>
            <Input value={formatDate((candidate as any).rejectionDate)} disabled className="bg-gray-50" />
          </div>
          <div className="space-y-2"></div>
          <div className="space-y-2 col-span-2">
            <Label>Rejection Reason</Label>
            <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} className="resize-none" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}