"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { Loader2, User, Mail, X } from "lucide-react";
import { candidateService, Candidate } from "@/services/candidateService";
import { addCandidateToPipeline } from "@/services/recruitmentPipelineService";
import { toast } from "sonner";
import { api } from "@/lib/axios-config";

interface AddExistingCandidateDialogProps {
  jobId: string;
  jobTitle: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCandidatesAdded?: (candidateIds: string[], candidateData?: Candidate[]) => void;
  // New props for pipeline support
  isPipeline?: boolean;
  pipelineId?: string;
}

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function AddExistingCandidateDialog({
  jobId,
  jobTitle,
  trigger,
  onCandidatesAdded,
  open,
  onOpenChange,
  isPipeline = false,
  pipelineId
}: AddExistingCandidateDialogProps) {
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

  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);

  // Search and Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 100;

  const listRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const getCandidateDisplayName = (candidate: Candidate) => {
    const name = candidate.name || "Unknown Candidate";
    const jobTitle = candidate.currentJobTitle ? ` - ${candidate.currentJobTitle}` : "";
    return `${name}${jobTitle}`;
  };

  const getCandidateIdFromDisplayName = (displayName: string) => {
    // Check both current candidates and already selected candidates to find ID
    const candidate = candidates.find(candidate => getCandidateDisplayName(candidate) === displayName)
      || selectedCandidates.find(candidate => getCandidateDisplayName(candidate) === displayName);
    return candidate?._id;
  };

  const getDisplayNameFromCandidateId = (candidateId: string) => {
    const candidate = candidates.find(candidate => candidate._id === candidateId)
      || selectedCandidates.find(candidate => candidate._id === candidateId);
    return candidate ? getCandidateDisplayName(candidate) : '';
  };

  const selectedCandidateDisplayNames = selectedCandidateIds.map(id => getDisplayNameFromCandidateId(id)).filter(Boolean);

  const handleSelectionChange = (displayNames: string[]) => {
    // Map display names back to IDs
    const newSelectedIds = displayNames.map(name => getCandidateIdFromDisplayName(name)).filter(Boolean) as string[];

    // Determine which candidates were added to add them to the persistent 'selectedCandidates' list
    const addedIds = newSelectedIds.filter(id => !selectedCandidateIds.includes(id));
    if (addedIds.length > 0) {
      const addedCandidates = candidates.filter(c => c._id && addedIds.includes(c._id));
      setSelectedCandidates(prev => [...prev, ...addedCandidates]);
    }

    // Determine which candidates were removed to remove them from persistent list
    const removedIds = selectedCandidateIds.filter(id => !newSelectedIds.includes(id));
    if (removedIds.length > 0) {
      setSelectedCandidates(prev => prev.filter(c => c._id && !removedIds.includes(c._id)));
    }

    setSelectedCandidateIds(newSelectedIds);
  };

  // Reset state when dialog opens
  useEffect(() => {
    if (currentOpen) {
      // Initial fetch is handled by the useEffect watching debouncedSearchTerm/page
      // specific logic to reset:
      setCandidates([]);
      setPage(1);
      setHasMore(true);
      setSearchTerm("");

      // We need to trigger a fetch. Since page is 1 and searchTerm is "", 
      // the below effect might not trigger re-fetch if dependencies haven't changed enough?
      // Actually, if we just rely on `debouncedSearchTerm` and `page`, we need to make sure they trigger.
      // But if user closes and re-opens, we want fresh data.
      fetchCandidates(1, "", true);
    } else {
      setSearchTerm("");
      setSelectedCandidateIds([]);
      setSelectedCandidates([]); // Clear persistent selection
    }
  }, [currentOpen]);

  // Effect for Search - Reset page when search changes
  useEffect(() => {
    // Avoid double fetch on open (handled by open effect) by checking if open is true
    // But open effect does `fetchCandidates(1, "", true)`.
    // If searchTerm changes, we want to reset page to 1.
    if (currentOpen) {
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  // Effect to Fetch Candidates
  useEffect(() => {
    if (!currentOpen) return;

    // If it's a new search (page 1), we want to replace. If page > 1, append.
    // However, react state updates are async. 
    // We can just call fetchCandidates here.

    // Only fetch if we haven't just fetched in the 'open' effect?
    // Let's simplify: 
    // The `fetchCandidates` function handles logic.
    // We should call it when `page` or `debouncedSearchTerm` changes.
    // BUT, we manually called it on open.
    // Let's rely on this effect mainly, but ensure on-open we reset.

    fetchCandidates(page, debouncedSearchTerm, page === 1);

  }, [page, debouncedSearchTerm, currentOpen]);


  const fetchCandidates = async (currentPage: number, search: string, replace: boolean = false) => {
    // If already loading and it's an infinite scroll load (not replace), prevent dupes
    // But simpler: just set loading.

    // NOTE: This effect runs on mount if dependencies match.
    // We used a manual call in onOpen. To avoid race conditions, let's just rely on this effect
    // and ensuring state is reset.
    // But `setCandidates([])` in onOpen doesn't stop this effect from running with stale state if not careful.

    // Ideally:
    // onOpen -> setPage(1), setSearchTerm(""), setHasMore(true) -> triggers effect.

    // We'll trust the effect. Remove the manual call in onOpen, just reset states.
    if (!currentOpen) return;

    setLoading(true);
    try {
      const response = await candidateService.getCandidates({
        page: currentPage,
        limit: LIMIT,
        search: search
      });

      const newCandidates = response.candidates;

      setCandidates(prev => {
        if (replace) return newCandidates;

        // Filter out duplicates just in case
        const existingIds = new Set(prev.map(c => c._id));
        const uniqueNew = newCandidates.filter(c => !existingIds.has(c._id));
        return [...prev, ...uniqueNew];
      });

      // Update hasMore
      if (newCandidates.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Buffer of 20px
    if (scrollHeight - scrollTop <= clientHeight + 20) {
      if (hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }
  };

  // Just for the 'open' reset
  useEffect(() => {
    if (currentOpen) {
      setPage(1);
      setHasMore(true);
      // Don't clear candidates immediately to avoid flash if we could keep cache, 
      // but for "Attach Existing" fresh is better.
      setCandidates([]);
      setSelectedCandidates([]);
    }
  }, [currentOpen]);


  const handleAddCandidates = async () => {
    if (selectedCandidateIds.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }

    try {
      if (isPipeline && pipelineId) {
        // Use recruiter pipeline API
        await Promise.all(selectedCandidateIds.map((candidateId) =>
          addCandidateToPipeline(pipelineId, candidateId)
        ));
      } else {
        // Use regular job API
        await Promise.all(selectedCandidateIds.map((candidateId) =>
          candidateService.applyToJob(candidateId, jobId)
        ));
      }

      // Use persisted selectedCandidates instead of filtering from current (potentially filtered) list
      // We still backup with the current candidates list just in case
      const finalSelectedCandidates = selectedCandidates.length > 0
        ? selectedCandidates
        : candidates.filter(candidate => selectedCandidateIds.includes(candidate._id || ""));

      toast.success(`Successfully added ${selectedCandidateIds.length} candidate(s) to ${jobTitle}`);

      // Call the callback to update the UI
      if (onCandidatesAdded) {
        onCandidatesAdded(selectedCandidateIds, finalSelectedCandidates);
      }

      // Reset and close dialog
      setSelectedCandidateIds([]);
      setSelectedCandidates([]);
      setOpen(false);
    } catch (error) {
      console.error("Error adding candidates:", error);
      toast.error("Failed to add candidates. Please try again.");
    }
  };

  const getCandidateEmail = (candidate: Candidate) => {
    return candidate.email || "Email not specified";
  };

  // Ensure trigger reliably opens the dialog
  const enhancedTrigger = trigger && React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
      onClick: (e: any) => {
        setOpen(true);
        const orig = (trigger as any).props?.onClick;
        if (typeof orig === "function") orig(e);
      },
      onMouseDown: (e: any) => {
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
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Add Candidate
            </DialogTitle>
            <DialogDescription>
              Select one or more candidates to add to <strong>{jobTitle}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] h-[500px] flex flex-col">
            <div className="flex-1 min-h-0 relative">
              <label className="text-sm font-medium mb-1 block">Search and select candidates</label>
              <MultiSelector
                values={selectedCandidateDisplayNames}
                onValuesChange={handleSelectionChange}
                className="w-full h-full flex flex-col"
                shouldFilter={false} // Disable client-side filtering
                onSearch={setSearchTerm}
              >
                <MultiSelectorTrigger className="min-h-10 shrink-0">
                  <MultiSelectorInput
                    placeholder="Search candidates by name or email..."
                  />
                </MultiSelectorTrigger>

                {/* The content container */}
                <MultiSelectorContent>
                  <MultiSelectorList
                    onScroll={handleScroll}
                    className="max-h-[300px] overflow-y-auto relative"
                  >
                    {candidates.length > 0 ? (
                      candidates.map((candidate) => (
                        <MultiSelectorItem
                          key={candidate._id}
                          value={getCandidateDisplayName(candidate)}
                          className="flex items-center gap-2"
                        >
                          <div className="flex flex-col items-start w-full">
                            <span className="font-medium">
                              {getCandidateDisplayName(candidate)}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {getCandidateEmail(candidate)}
                            </div>
                          </div>
                        </MultiSelectorItem>
                      ))
                    ) : (
                      !loading && (
                        <div className="p-4 text-center text-muted-foreground">
                          {searchTerm
                            ? "No candidates found matching your search"
                            : "No candidates available"}
                        </div>
                      )
                    )}

                    {loading && (
                      <div className="p-2 flex justify-center items-center text-sm text-muted-foreground w-full">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {page === 1 ? 'Loading candidates...' : 'Loading more...'}
                      </div>
                    )}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
            </div>

            {/* Detailed view of selected candidates */}
            {selectedCandidateIds.length > 0 && (
              <div className="mt-4 border-t pt-4 shrink-0">
                <h3 className="text-sm font-semibold mb-3">Selected Candidate Details</h3>
                <div className="space-y-3 max-h-[150px] overflow-y-auto">
                  {selectedCandidateIds.map((candidateId) => {
                    // Use persisted selectedCandidates first
                    const candidate = selectedCandidates.find((c) => c._id === candidateId)
                      || candidates.find((c) => c._id === candidateId);

                    if (!candidate) return (
                      <div key={candidateId} className="p-2 border rounded text-xs text-red-500">
                        Candidate details not found (might be from previous search)
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedCandidateIds(ids => ids.filter(id => id !== candidateId));
                            setSelectedCandidates(prev => prev.filter(c => c._id !== candidateId));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );

                    return (
                      <div key={candidateId} className="p-4 rounded-lg border bg-gray-50/50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500 min-w-[80px]">
                                  Name:
                                </span>
                                <span className="text-sm font-medium">
                                  {candidate.name || "Unnamed Candidate"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500 min-w-[80px]">
                                  Position:
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {candidate.currentJobTitle || "—"}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500 min-w-[80px]">
                                  Email:
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {candidate.email || "—"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500 min-w-[80px]">
                                  Location:
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {candidate.location || "—"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              setSelectedCandidateIds((ids) =>
                                ids.filter((id) => id !== candidate._id),
                              );
                              setSelectedCandidates((prev) =>
                                prev.filter((c) => c._id !== candidate._id),
                              );
                            }}
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCandidates}
              disabled={selectedCandidateIds.length === 0 || loading}
            >
              Add{" "}
              {selectedCandidateIds.length > 0
                ? `${selectedCandidateIds.length} Candidate${selectedCandidateIds.length > 1 ? "s" : ""}`
                : "Candidates"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


