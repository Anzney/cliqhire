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

interface JobsContentProps {
  clientId: string;
  clientName: string;
}

const jobStages: JobStage[] = [
  "Open",
  "Active",
  "Onboarding",
  "Hired",
  "On Hold",
  "Closed",
];

const stageColors: Record<JobStage, string> = {
  Open: "bg-blue-100 text-blue-800",
  Onboarding: "bg-purple-100 text-purple-800",
  Active: "bg-yellow-100 text-yellow-800",
  
  Hired: "bg-green-200 text-green-900",
  "On Hold": "bg-gray-200 text-gray-800",
  Closed: "bg-red-100 text-red-800",
};

function ConfirmStageChangeDialog({
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
          <AlertDialogTitle>Confirm Stage Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to update the job stage? This action will be saved immediately.
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

export function JobsContent({ clientId, clientName }: JobsContentProps) {
  const [clientJobs, setClientJobs] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{
    jobId: string;
    newStage: JobStage;
  } | null>(null);
  const router = useRouter();

  const fetchJobs = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/api/jobs/client/${clientId}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const responseData = await response.json();
      setClientJobs(responseData.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [clientId]);

  const handleStageChange = (jobId: string, newStage: JobStage) => {
    setPendingStageChange({ jobId, newStage });
    setConfirmOpen(true);
  };

  const confirmStageChange = async () => {
    if (!pendingStageChange) return;

    const { jobId, newStage } = pendingStageChange;

    try {
      // Update local state immediately for better UX
      setClientJobs((prev) =>
        prev.map((job) => (job._id === jobId ? { ...job, stage: newStage } : job)),
      );

      // Make API call to update the stage
      const response = await fetch(`https://aems-backend.onrender.com/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job stage");
      }
    } catch (error) {
      console.error("Error updating job stage:", error);
      // Revert the local state if the API call fails
      setClientJobs((prev) =>
        prev.map((job) => (job._id === jobId ? { ...job, stage: job.stage } : job)),
      );
    } finally {
      setPendingStageChange(null);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="border-b py-2 px-4">
        <div className="flex items-center">
          {/* <Checkbox id="selectAll" className="mr-4 border-gray-400" /> */}
          <div className="grid grid-cols-7 w-full text-sm font-medium text-gray-500">
            {["Position Name", "Job Type", "Location", "Headcount", "Stage", "Minimum Salary", "Maximum Salary"].map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        {clientJobs.length > 0 ? (
          clientJobs.map((job) => (
            <div
              key={job._id}
              className="border-b hover:bg-gray-50 py-3 px-4 cursor-pointer"
              onClick={() => router.push(`/jobs/${job._id}`)}
            >
              <div className="flex items-center">
                {/* <Checkbox id={`job-${job._id}`} className="mr-4 border-gray-400" /> */}
                <div className="grid grid-cols-7  w-full px-0 mx-0">
                  <div className="font-medium">{job.jobTitle}</div>
                  <div className="capitalize">{job.jobType || "N/A"}</div>
                  <div>{job.location}</div>
                  <div>{job.headcount}</div>
                  <div>
                    <Badge
                      className={`${stageColors[job.stage as JobStage]} cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStageChange(job._id, job.stage);
                      }}
                    >
                      {job.stage}
                    </Badge>
                  </div>
                  <div>{job.minimumSalary}</div>
                  <div>{job.maximumSalary}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No jobs found. Create a new job requirement.
          </div>
        )}
      </div>

      <ConfirmStageChangeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmStageChange}
      />
    </>
  );
}

