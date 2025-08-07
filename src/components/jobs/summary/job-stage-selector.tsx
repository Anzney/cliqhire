"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

interface JobStageSelectorProps {
  open: boolean;
  onClose: () => void;
  currentValue?: string;
  onSave: (value: string) => void;
}

export function JobStageSelector({
  open,
  onClose,
  currentValue = "",
  onSave,
}: JobStageSelectorProps) {
  const [selectedStage, setSelectedStage] = useState(currentValue);

  const jobStageOptions = [
    { value: "Open", label: "Open" },
    { value: "Active", label: "Active" },
    { value: "Hired", label: "Hired" },
    { value: "On Hold", label: "On Hold" },
    { value: "Closed", label: "Closed" },
    { value: "Onboarding", label: "Onboarding" },
  ];

  const handleSave = () => {
    onSave(selectedStage);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Job Stage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Job Stage</Label>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue placeholder="Select Job Stage" />
              </SelectTrigger>
              <SelectContent>
                {jobStageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
