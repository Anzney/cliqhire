"use client";

/**
 * AddCandidateDialog Component
 * 
 * A dialog component that allows users to select and add multiple candidates to a job.
 * This component follows the same pattern as the AddToJobDialog but with reversed roles.
 * 
 * Usage:
 * <AddCandidateDialog
 *   jobId="job-id"
 *   jobTitle="Software Engineer"
 *   trigger={<Button>Add Candidate</Button>}
 *   onCandidatesAdded={(candidateIds, candidateData) => {
 *     // Handle the newly added candidates
 *   }}
 * />
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, User, MapPin, Briefcase } from "lucide-react";
import { candidateService, Candidate } from "@/services/candidateService";
import { toast } from "sonner";

interface AddCandidateDialogProps {
  jobId: string;
  jobTitle: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCandidatesAdded?: (candidateIds: string[], candidateData?: Candidate[]) => void;
}

export function AddCandidateDialog({ jobId, jobTitle, trigger, onCandidatesAdded, open, onOpenChange }: AddCandidateDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const currentOpen = isControlled ? (open as boolean) : internalOpen;
  const setOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch candidates when dialog opens
  useEffect(() => {
    if (currentOpen) {
      fetchCandidates();
    }
  }, [currentOpen]);

  // Reset search term when dialog closes
  useEffect(() => {
    if (!currentOpen) {
      setSearchTerm("");
      setSelectedCandidateIds([]);
    }
  }, [currentOpen]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await candidateService.getCandidates({ limit: 100 });
      setCandidates(response.candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidates = async () => {
    if (selectedCandidateIds.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }

    try {
      // Apply each selected candidate to the job
      await Promise.all(selectedCandidateIds.map((candidateId) => 
        candidateService.applyToJob(candidateId, jobId)
      ));
      
      // Get the selected candidate data
      const selectedCandidates = candidates.filter(candidate => 
        selectedCandidateIds.includes(candidate._id || "")
      );
      
      toast.success(`Successfully added ${selectedCandidateIds.length} candidate(s) to ${jobTitle}`);
      
      // Call the callback to update the Candidates tab with candidate data
      if (onCandidatesAdded) {
        onCandidatesAdded(selectedCandidateIds, selectedCandidates);
      }
      
      // Reset and close dialog
      setSelectedCandidateIds([]);
      setOpen(false);
    } catch (error) {
      console.error("Error adding candidates to job:", error);
      toast.error("Failed to add candidates to job. Please try again.");
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.currentJobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCandidateDisplayName = (candidate: Candidate) => {
    const name = candidate.name || "Unknown Candidate";
    const jobTitle = candidate.currentJobTitle ? ` - ${candidate.currentJobTitle}` : "";
    return `${name}${jobTitle}`;
  };

  const getCandidateLocation = (candidate: Candidate) => {
    return candidate.location || "Location not specified";
  };

  // Ensure trigger reliably opens the dialog even if Trigger-asChild props don't attach
  const enhancedTrigger = trigger && React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: (e: any) => {
          setOpen(true);
          const orig = (trigger as any).props?.onClick;
          if (typeof orig === "function") orig(e);
        },
        onMouseDown: (e: any) => {
          // Some environments attach handlers on mouse down; open here too
          setOpen(true);
          const orig = (trigger as any).props?.onMouseDown;
          if (typeof orig === "function") orig(e);
        },
        type: (trigger as any).props?.type || "button",
      })
    : trigger;

  return (
    <>
      {enhancedTrigger}
      <Dialog open={currentOpen} onOpenChange={setOpen}>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] h-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add Candidate
          </DialogTitle>
          <DialogDescription>
            Select one or more candidates to add to <strong>{jobTitle}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading candidates...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Search and select candidates</label>
                <MultiSelector
                  values={selectedCandidateIds}
                  onValuesChange={setSelectedCandidateIds}
                  className="w-full"
                >
                  <MultiSelectorTrigger className="min-h-10">
                    <MultiSelectorInput 
                      placeholder="Search candidates..." 
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((candidate) => (
                          <MultiSelectorItem
                            key={candidate._id}
                            value={candidate._id || ""}
                            className="flex items-center gap-2"
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{getCandidateDisplayName(candidate)}</span>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {getCandidateLocation(candidate)}
                              </div>
                            </div>
                          </MultiSelectorItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          {searchTerm ? "No candidates found matching your search" : "No candidates available"}
                        </div>
                      )}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </div>

              {selectedCandidateIds.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selected Candidates ({selectedCandidateIds.length})</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidateIds.map((candidateId) => {
                      const candidate = candidates.find(c => c._id === candidateId);
                      return candidate ? (
                        <Badge key={candidateId} variant="secondary" className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {getCandidateDisplayName(candidate)}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddCandidates}
            disabled={selectedCandidateIds.length === 0 || loading}
          >
            Add {selectedCandidateIds.length > 0 ? `${selectedCandidateIds.length} Candidate${selectedCandidateIds.length > 1 ? 's' : ''}` : 'Candidates'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
