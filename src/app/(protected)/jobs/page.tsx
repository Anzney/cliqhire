"use client"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, List, SlidersHorizontal, RefreshCcw, MoreVertical } from 'lucide-react'
import { JobsEmptyState } from "./empty-state"
import { useState, useEffect } from "react"
import { CreateJobModal } from "@/components/jobs/create-job-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { JobStageBadge } from "@/components/jobs/job-stage-badge"
import { Job, JobStage } from "@/types/job"
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
import Dashboardheader from "@/components/dashboard-header"
import Tableheader from "@/components/table-header"

const columsArr =[
  "Position Name",
  "Job Department",
  "Job location",
  "Headcount",
  "Job Stage",
  "Minimum salary",
  "Maximum salary",
  "Job Owner"
]

function ConfirmStageChangeDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
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
  )
}

type Client = { 
  _id: string
  name: string 
}

type ApiJob = {
  _id: string
  jobTitle: string
  department: string
  client: string
  jobPosition?: string
  location: string
  headcount: number
  stage: JobStage
  minimumSalary: number
  maximumSalary: number
  jobType?: string
  experience?: string
  salaryRange?: {
    min: number
    max: number
  }
  jobOwner?: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{
    jobId: string;
    newStage: JobStage;
  } | null>(null);
  const [clientList, setClientList] = useState<Client[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch("https://aems-backend.onrender.com/api/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const convertedJobs = data.data.map((job: ApiJob) => ({
            id: job._id,
            positionName: job.jobTitle,
            department: job.department,
            client: job.client,
            location: job.location,
            headcount: job.headcount.toString(),
            stage: job.stage,
            minSalary: job.minimumSalary ?? job.salaryRange?.min ?? 0,
          maxSalary: job.maximumSalary ?? job.salaryRange?.max ?? 0,
            jobType: job.jobType || 'Full Time',
            experience: job.experience || 'Not specified',
            jobOwner: job.jobOwner || 'Unassigned'
          }));
          setJobs(convertedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadClients = async () => {
      try {
        const response = await fetch("https://aems-backend.onrender.com/api/clients/names");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClientList(data.data); // Update to data.data
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    loadClients();
    loadJobs();
  }, []);

  const getClientName = (clientId: string) => {
    const client = clientList.find((client) => client._id === clientId);
    return client ? client.name : 'Unknown';
  };

  const handleStageChange = (jobId: string, newStage: JobStage) => {
    setPendingStageChange({ jobId, newStage });
    setConfirmOpen(true);
  };

  const confirmStageChange = async () => {
    if (!pendingStageChange) return;
    
    const { jobId, newStage } = pendingStageChange;
    
    try {
      // Update local state immediately for better UX
      setJobs(prev => prev.map(job => 
        job._id === jobId ? { ...job, stage: newStage } : job
      ));

      // Make API call to update the stage
      const response = await fetch(`https://aems-backend.onrender.com/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job stage');
      }
    } catch (error) {
      console.error('Error updating job stage:', error);
      // Revert the local state if the API call fails
      setJobs(prev => prev.map(job => 
        job._id === jobId ? { ...job, stage: job.stage } : job
      ));
    } finally {
      setPendingStageChange(null);
      setConfirmOpen(false);
    }
  };

  const refreshJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://aems-backend.onrender.com/api/jobs");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const convertedJobs = data.data.map((job: ApiJob) => ({
          id: job._id,
          positionName: job.jobTitle,
          department: job.department,
          client: job.client,
          location: job.location,
          headcount: job.headcount.toString(),
          stage: job.stage,
          minSalary: job.minimumSalary,
          maxSalary: job.maximumSalary,
          jobType: job.jobType || 'Full Time',
          experience: job.experience || 'Not specified',
          jobOwner: job.jobOwner || 'Unassigned'
        }));
        setJobs(convertedJobs);
      }
    } catch (error) {
      console.error("Error refreshing jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              Jobs
            </h1>
            {/* <div className="ml-auto flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <LayoutGrid className="h-4 w-4 mr-2" />
                BOARD
              </Button>
              <Button variant="default" size="sm">
                <List className="h-4 w-4 mr-2" />
                LIST
              </Button>
            </div> */}
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job Requirement
          </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
        </div>

        <div className="flex-1">
          <Table>
            <TableHeader>
                  <Tableheader
                    tableHeadArr={columsArr} 
                  />                                                                                                  
              </TableHeader>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <Dashboardheader
          setOpen={setOpen}
          setFilterOpen={setFilterOpen}
          initialLoading={loading}
          heading="Jobs"
          buttonText="Create Job Requirement"
        />

        {/* Content */}
        {jobs.length > 0 ? (
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
               
                  <Tableheader
                    tableHeadArr={columsArr} 
                  />
               
              </TableHeader>
              <TableBody>
                {jobs.map((job: Job) => (
                  <TableRow 
                    key={job._id} 
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => router.push(`/jobs/${job._id}`)}
                  >
                    <TableCell className="text-sm font-medium">{job.positionName}</TableCell>
                    <TableCell className="text-sm">{job.department}</TableCell>
                    <TableCell className="text-sm">{job.location}</TableCell>
                    <TableCell className="text-sm">{job.headcount}</TableCell>
                    <TableCell className="text-sm">
                      <JobStageBadge 
                        stage={job.stage} 
                        onStageChange={(newStage) => handleStageChange(job._id, newStage)}
                      />
                    </TableCell>
                    <TableCell className="text-sm">{(job.minSalary)}</TableCell>
                    <TableCell className="text-sm">{(job.maxSalary)}</TableCell>
                    <TableCell className="text-sm">{getClientName(job.client)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <JobsEmptyState />
          </div>
        )}
      </div>
      
      <CreateJobModal 
        open={open} 
        onOpenChange={setOpen}
        clientId={clientList[0]?._id || ""}
        clientName={clientList[0]?.name || ""}
        refreshJobs={refreshJobs}
        onJobCreated = {()=>console.log("")}
      />
      
      <ConfirmStageChangeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmStageChange}
      />
    </>
  )
}
