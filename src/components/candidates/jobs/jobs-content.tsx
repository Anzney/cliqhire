"use client";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { JobStage } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { getJobById, Job } from "@/services/jobService";

export interface JobsContentRef {
  addJobsToCandidate: (jobIds: string[], jobData?: any[]) => Promise<void>;
}

export interface JobsContentProps {
  candidateId: string;
  candidateName: string;
  onJobsUpdated?: () => void;
}

// Interface for the job application display (subset of Job data)
interface CandidateJobApplication {
  _id: string;
  jobId: string; // Actual job ID for navigation
  jobTitle: string;
  clientName: string;
  location: string;
  jobType: string;
  minimumSalary: string;
  maximumSalary: string;
  experience: string;
  stage: string;
}

export const JobsContent = forwardRef<JobsContentRef, JobsContentProps>(
  ({ candidateId, candidateName, onJobsUpdated }, ref) => {
  const [candidateJobs, setCandidateJobs] = useState<CandidateJobApplication[]>([]);
  const router = useRouter();

  const fetchCandidateJobs = async () => {
    try {
      // TODO: Replace with actual API call to fetch existing candidate applications
      // const response = await fetch(`/api/candidates/${candidateId}/applications`);
      // if (!response.ok) throw new Error("Failed to fetch candidate jobs");
      // const data = await response.json();
      // setCandidateJobs(data);
      
      setCandidateJobs([]);
    } catch (error) {
      console.error("Error fetching candidate jobs:", error);
    }
  };

  // Function to add new jobs to the candidate's job list
  const addJobsToCandidate = async (jobIds: string[], jobData?: any[]) => {
    try {
      const jobApplications: CandidateJobApplication[] = [];
      
      for (const jobId of jobIds) {
        try {
          const response = await getJobById(jobId);
          if (response.success && response.data) {
            const job = response.data as any; // Type assertion since API response structure may vary
            
            // Create job application with actual job data from API
            const jobApplication: CandidateJobApplication = {
              _id: `app_${Date.now()}_${jobId}`,
              jobId: jobId, // Store the actual job ID for navigation
              jobTitle: job.jobTitle,
              clientName: job.client && typeof job.client === 'object' ? job.client.name : job.client,
              location: job.location || job.locations?.[0] || "",
              jobType: job.jobType,
              minimumSalary: job.minimumSalary?.toString() || "0",
              maximumSalary: job.maximumSalary?.toString() || "0",
              experience: job.experience || "",
              stage: job.stage || "",
            };
            
            jobApplications.push(jobApplication);
          }
        } catch (error) {
          console.error(`Error fetching job details for job ID ${jobId}:`, error);
          // Don't create fallback data - only show actual API data
        }
      }
      
      setCandidateJobs(prev => [...prev, ...jobApplications]);
      
      if (onJobsUpdated) {
        onJobsUpdated();
      }
    } catch (error) {
      console.error("Error adding jobs to candidate:", error);
    }
  };

  useEffect(() => {
    fetchCandidateJobs();
  }, [candidateId]);

  useImperativeHandle(ref, () => ({
    addJobsToCandidate,
  }));

  return (
    <>
      <div className="border-b py-2 px-4 w-full">
        <div className="flex items-center w-full">
          <div className="grid grid-cols-8 w-full text-sm font-medium text-gray-500">
            {["Job Title", "Client", "Location", "Job Type", "Minimum Salary", "Maximum Salary", "Experience", "Stage"].map((item, index) => (
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
              onClick={() => router.push(`/jobs/${job.jobId}`)}
            >
              <div className="flex items-center">
                <div className="grid grid-cols-8 w-full">
                  <div className="font-medium">{job.jobTitle}</div>
                  <div>{job.clientName}</div>
                  <div>{job.location}</div>
                  <div>{job.jobType}</div>
                  <div>{job.minimumSalary}</div>
                  <div>{job.maximumSalary}</div>
                  <div>{job.experience}</div>
                  <div>{job.stage}</div>
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
    </>
  );
});
