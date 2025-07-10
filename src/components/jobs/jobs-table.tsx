"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Job } from "@/types/job"
import { Checkbox } from "@/components/ui/checkbox"
import { JobStageBadge } from "./job-stage-badge"
import { useEffect, useState } from "react"

interface JobsTableProps {
  jobs: Job[]
  clientId?: string
  clientName?: string
}

export function JobsTable({ jobs, clientId, clientName }: JobsTableProps) {
  const [localJobs, setLocalJobs] = useState(jobs)
  const [jobId, setJobId] = useState<string>()
  const [newStage, setNewStage] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingChange, setPendingChange] = useState<{ jobId: string; stage: Job['stage'] } | null>(null)

  // Filter jobs if clientId is provided
  const filteredJobs = clientId 
    ? localJobs.filter(job => job.client === clientId)
    : localJobs

  const handleStageChange = (jobId: string, newStage: Job['stage']) => {
    setPendingChange({ jobId, stage: newStage })
    setShowConfirmDialog(true)
  }

  const handleConfirmChange = async () => {
    if (!pendingChange) return

    setJobId(pendingChange.jobId)
    setNewStage(pendingChange.stage)
    setLocalJobs(prev => prev.map(job => 
      job._id === pendingChange.jobId ? { ...job, stage: pendingChange.stage } : job
    ))
    setShowConfirmDialog(false)
  }

  const handleCancelChange = () => {
    setPendingChange(null)
    setShowConfirmDialog(false)
  }

  useEffect(() => {
    const updateJobStage = async () => {
      if (!jobId || !newStage) return;
  
      try {
        setIsLoading(true);
  
        const response = await fetch(`https://aems-backend.onrender.com/api/jobs/${jobId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: newStage }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update job stage');
        }

      } catch (error) {
        // Revert the local state if the API call fails
        setLocalJobs(prev => prev.map(job => 
          job._id === jobId ? { ...job, stage: job.stage } : job
        ))
      } finally {
        setIsLoading(false);
      }
    };
  
    updateJobStage();
  }, [jobId, newStage]);

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
              <TableCell className="font-medium">{job.positionName}</TableCell>
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