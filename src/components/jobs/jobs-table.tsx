"use client"

import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { JobStageBadge } from './job-stage-badge'
import { Job, JobStage } from '@/types/job'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { api } from "@/lib/axios-config";
import { initializeAuth } from "@/lib/axios-config";

interface JobsTableProps {
  jobs: Job[]
  clientName?: string
  onJobsUpdate?: (updatedJobs: Job[]) => void
}

export function JobsTable({ jobs, clientName, onJobsUpdate }: JobsTableProps) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs)
  const [localJobs, setLocalJobs] = useState<Job[]>(jobs)
  const [pendingChange, setPendingChange] = useState<{ jobId: string; newStage: JobStage } | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setFilteredJobs(jobs)
    setLocalJobs(jobs)
  }, [jobs])

  const handleStageChange = (jobId: string, newStage: JobStage) => {
    setPendingChange({ jobId, newStage })
    setShowConfirmDialog(true)
  }

  const handleConfirmChange = async () => {
    if (!pendingChange) return

    const { jobId, newStage } = pendingChange

    // Optimistically update the UI
    setLocalJobs(prev => prev.map(job => 
      job._id === jobId ? { ...job, stage: newStage } : job
    ))
    setFilteredJobs(prev => prev.map(job => 
      job._id === jobId ? { ...job, stage: newStage } : job
    ))

    // Update the parent component
    onJobsUpdate?.(localJobs.map(job => 
      job._id === jobId ? { ...job, stage: newStage } : job
    ))

    setPendingChange(null)
    setShowConfirmDialog(false)
  }

  const handleCancelChange = () => {
    setPendingChange(null)
    setShowConfirmDialog(false)
  }

  useEffect(() => {
    const updateJobStage = async () => {
      if (!pendingChange) return;
  
      try {
        setIsLoading(true);
        
        // Ensure authentication is initialized
        await initializeAuth();
  
        const response = await api.patch(`/api/jobs/${pendingChange.jobId}`, {
          stage: pendingChange.newStage
        });
  
        if (response.data.status !== "success") {
          throw new Error('Failed to update job stage');
        }

      } catch (error) {
        console.error('Error updating job stage:', error);
        // Revert the local state if the API call fails
        setLocalJobs(prev => prev.map(job => 
          job._id === pendingChange.jobId ? { ...job, stage: job.stage } : job
        ))
        setFilteredJobs(prev => prev.map(job => 
          job._id === pendingChange.jobId ? { ...job, stage: job.stage } : job
        ))
      } finally {
        setIsLoading(false);
      }
    };
  
    if (pendingChange) {
      updateJobStage();
    }
  }, [pendingChange]);

  if(isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Stage Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the job stage? This action will be saved immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelChange}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>Position Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Headcount</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Minimum Salary</TableHead>
            <TableHead>Maximum Salary</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job._id} className="hover:bg-muted/50 cursor-pointer">
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{job.jobTitle}</TableCell>
              <TableCell>{clientName}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.headcount}</TableCell>
              <TableCell>
                <JobStageBadge 
                  stage={job.stage} 
                  onStageChange={(newStage) => handleStageChange(job._id, newStage)}
                />
              </TableCell>
              <TableCell>{job.minSalary}</TableCell>
              <TableCell>{job.maxSalary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}