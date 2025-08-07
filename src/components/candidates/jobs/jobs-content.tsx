"use client";
import React, { useState, useEffect } from "react";
import { Job, JobStage } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { CandidateJobApplication, ApplicationStatus, JobsContentProps } from "./types";

const jobStages: JobStage[] = [
  "New",
  "Sourcing",
  "Screening",
  "Interviewing",
  "Shortlisted",
  "Offer",
  "Hired",
  "On Hold",
  "Cancelled",
];

const stageColors: Record<JobStage, string> = {
  New: "bg-blue-100 text-blue-800",
  Sourcing: "bg-purple-100 text-purple-800",
  Screening: "bg-yellow-100 text-yellow-800",
  Interviewing: "bg-orange-100 text-orange-800",
  Shortlisted: "bg-green-100 text-green-800",
  Offer: "bg-pink-100 text-pink-800",
  Hired: "bg-green-200 text-green-900",
  "On Hold": "bg-gray-200 text-gray-800",
  Cancelled: "bg-red-100 text-red-800",
};

const applicationStatusColors: Record<ApplicationStatus, string> = {
  "Applied": "bg-blue-100 text-blue-800",
  "Under Review": "bg-yellow-100 text-yellow-800",
  "Interview Scheduled": "bg-purple-100 text-purple-800",
  "Interviewed": "bg-orange-100 text-orange-800",
  "Shortlisted": "bg-green-100 text-green-800",
  "Offer Extended": "bg-pink-100 text-pink-800",
  "Hired": "bg-green-200 text-green-900",
  "Rejected": "bg-red-100 text-red-800",
  "Withdrawn": "bg-gray-100 text-gray-800",
};

function ConfirmStatusChangeDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to update the application status? This action will be saved immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function JobsContent({ candidateId, candidateName }: JobsContentProps) {
  const [candidateJobs, setCandidateJobs] = useState<CandidateJobApplication[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    applicationId: string;
    newStatus: ApplicationStatus;
  } | null>(null);
  const router = useRouter();

  const fetchCandidateJobs = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/candidates/${candidateId}/applications`);
      // if (!response.ok) throw new Error("Failed to fetch candidate jobs");
      // const data = await response.json();
      // setCandidateJobs(data);
      
      // For now, set empty array
      setCandidateJobs([]);
    } catch (error) {
      console.error("Error fetching candidate jobs:", error);
    }
  };

  useEffect(() => {
    fetchCandidateJobs();
  }, [candidateId]);

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    setPendingStatusChange({ applicationId, newStatus });
    setConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const { applicationId, newStatus } = pendingStatusChange;

    try {
      // Update local state immediately for better UX
      setCandidateJobs((prev) =>
        prev.map((job) => 
          job._id === applicationId 
            ? { ...job, applicationStatus: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
            : job
        ),
      );

      // Make API call to update the status
      // const response = await fetch(`/api/candidates/${candidateId}/applications/${applicationId}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ applicationStatus: newStatus }),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to update application status");
      // }
    } catch (error) {
      console.error("Error updating application status:", error);
      // Revert the local state if the API call fails
      setCandidateJobs((prev) =>
        prev.map((job) => 
          job._id === applicationId 
            ? { ...job, applicationStatus: job.applicationStatus }
            : job
        ),
      );
    } finally {
      setPendingStatusChange(null);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="border-b py-2 px-4 w-full">
        <div className="flex items-center w-full">
          <div className="grid grid-cols-8 w-full text-sm font-medium text-gray-500">
            {["Job Title", "Client", "Location", "Job Type", "Salary", "Application Status", "Applied Date", "Last Updated"].map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        {candidateJobs.length > 0 ? (
          candidateJobs.map((job) => (
            <div
              key={job._id}
              className="border-b hover:bg-gray-50 py-3 px-4 cursor-pointer"
              onClick={() => router.push(`/jobs/${job._id}`)}
            >
              <div className="flex items-center">
                <div className="grid grid-cols-8 w-full">
                  <div className="font-medium">{job.jobTitle}</div>
                  <div>{job.clientName}</div>
                  <div>{job.location}</div>
                  <div className="capitalize">{job.jobType}</div>
                  <div>{job.salary}</div>
                  <div>
                    <Badge
                      className={`${applicationStatusColors[job.applicationStatus] || "bg-gray-100 text-gray-800"} cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(job._id, job.applicationStatus);
                      }}
                    >
                      {job.applicationStatus}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{job.appliedDate}</div>
                  <div className="text-sm text-gray-600">{job.lastUpdated}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No job applications found for this candidate.
          </div>
        )}
      </div>

      <ConfirmStatusChangeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmStatusChange}
      />
    </>
  );
}
