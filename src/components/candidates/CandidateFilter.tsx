"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type CandidateStatus =
  | "Active"
  | "Inactive"
  | "Shortlisted"
  | "Interviewing"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export interface CandidateFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  experience: string;
  onExperienceChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  selectedStatuses: CandidateStatus[];
  onStatusesChange: (statuses: CandidateStatus[]) => void;
  availableStatuses?: CandidateStatus[];
  onApply?: () => void;
  onClear?: () => void;
}

export default function CandidateFilter({
  open,
  onOpenChange,
  name,
  onNameChange,
  email,
  onEmailChange,
  experience,
  onExperienceChange,
  location,
  onLocationChange,
  selectedStatuses,
  onStatusesChange,
  availableStatuses = [
    "Active",
    "Inactive",
    "Shortlisted",
    "Interviewing",
    "Offer",
    "Rejected",
    "Withdrawn",
  ],
  onApply,
  onClear,
}: CandidateFilterProps) {
  const toggleStatus = (status: CandidateStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusesChange([...selectedStatuses, status]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[260px] sm:w-[300px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <Label htmlFor="candidateName">Candidate Name</Label>
            <Input
              id="candidateName"
              placeholder="Search by name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="candidateEmail">Candidate Email</Label>
            <Input
              id="candidateEmail"
              placeholder="Search by email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              placeholder="e.g. 3 years"
              value={experience}
              onChange={(e) => onExperienceChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. New York"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-3">
              {availableStatuses.map((status) => (
                <label key={status} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClear}>Clear</Button>
          <Button onClick={onApply}>Apply</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
