"use client";

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
import { Loader2, Search, Briefcase, Building } from "lucide-react";
import { getJobs, Job } from "@/services/jobService";
import { toast } from "sonner";

interface AddToJobDialogProps {
  candidateId: string;
  candidateName: string;
  trigger: React.ReactNode;
}

export function AddToJobDialog({ candidateId, candidateName, trigger }: AddToJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch jobs when dialog opens
  useEffect(() => {
    if (open) {
      fetchJobs();
    }
  }, [open]);

  // Reset search term when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setSelectedJobIds([]);
    }
  }, [open]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getJobs(); // Fetch up to 100 jobs
      if (response.jobs) {
        setJobs(response.jobs);
      } else if (response.data && Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToJobs = async () => {
    if (selectedJobIds.length === 0) {
      toast.error("Please select at least one job");
      return;
    }

    try {
      // TODO: Implement the API call to add candidate to selected jobs
      // This would typically be a call like: await candidateService.addCandidateToJobs(candidateId, selectedJobIds);
      
      // For now, just show a success message
      toast.success(`Successfully added ${candidateName} to ${selectedJobIds.length} job(s)`);
      
      // Reset and close dialog
      setSelectedJobIds([]);
      setOpen(false);
    } catch (error) {
      console.error("Error adding candidate to jobs:", error);
      toast.error("Failed to add candidate to jobs. Please try again.");
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.client && typeof job.client === 'object' && job.client.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getJobDisplayName = (job: Job) => {
    const clientName = job.client && typeof job.client === 'object' ? job.client.name : 'Unknown Client';
    return `${job.jobTitle} - ${clientName}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Add to Job
          </DialogTitle>
          <DialogDescription>
            Select one or more jobs to add <strong>{candidateName}</strong> to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading jobs...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Search and select jobs</label>
                                 <MultiSelector
                   values={selectedJobIds}
                   onValuesChange={setSelectedJobIds}
                   className="w-full"
                 >
                   <MultiSelectorTrigger className="min-h-10">
                     <MultiSelectorInput 
                       placeholder="Search jobs..." 
                       value={searchTerm}
                       onValueChange={setSearchTerm}
                     />
                   </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                          <MultiSelectorItem
                            key={job._id}
                            value={job._id}
                            className="flex items-center gap-2"
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{job.jobTitle}</span>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Building className="h-3 w-3" />
                                {job.client && typeof job.client === 'object' ? job.client.name : 'Unknown Client'}
                              </div>
                            </div>
                          </MultiSelectorItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          {searchTerm ? "No jobs found matching your search" : "No jobs available"}
                        </div>
                      )}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </div>

              {selectedJobIds.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selected Jobs ({selectedJobIds.length})</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobIds.map((jobId) => {
                      const job = jobs.find(j => j._id === jobId);
                      return job ? (
                        <Badge key={jobId} variant="secondary" className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {getJobDisplayName(job)}
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
            onClick={handleAddToJobs}
            disabled={selectedJobIds.length === 0 || loading}
          >
            Add to {selectedJobIds.length > 0 ? `${selectedJobIds.length} Job${selectedJobIds.length > 1 ? 's' : ''}` : 'Jobs'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
