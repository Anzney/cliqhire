"use client"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, List, SlidersHorizontal, RefreshCcw, MoreVertical } from 'lucide-react'
import { JobsEmptyState } from "./empty-state"
import { useState, useEffect } from "react"
// import { CreateJobModal } from "@/components/jobs/create-job-modal"
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
import { CreateJobRequirementForm } from "@/components/new-jobs/create-jobs-form";
import ClientPaginationControls from "@/components/clients/ClientPaginationControls";

const columsArr =[
  "Position Name",
  "Job Type",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobs`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        console.log("API jobs data:", data.data);
        
        if (data.success && Array.isArray(data.data)) {
         
          setJobs(data.data);
          setTotalJobs(data.length);
          setTotalPages(Math.ceil(data.length / pageSize) || 1);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadClients = async () => {
      try {
        const response = await fetch(`${API_URL}/api/clients/names`);
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
  }, [pageSize]);

  useEffect(() => {
    setTotalPages(Math.ceil(jobs.length / pageSize) || 1);
    setTotalJobs(jobs.length);
    if (currentPage > Math.ceil(jobs.length / pageSize)) {
      setCurrentPage(1);
    }
  }, [jobs, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Paginate jobs
  const paginatedJobs = jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  console.log(jobs);
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
      const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
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

  console.log(paginatedJobs);
  // const refreshJobs = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${API_URL}/api/jobs`);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch jobs");
  //     }
  //     const data = await response.json();
      
  //     if (data.success && Array.isArray(data.data)) {
  //       const convertedJobs = data.data.map((job: ApiJob) => ({
  //         id: job._id,
  //         positionName: job.jobTitle,
  //         department: job.department,
  //         client: job.client,
  //         location: job.location,
  //         headcount: job.headcount.toString(),
  //         stage: job.stage,
  //         minSalary: job.minimumSalary,
  //         maxSalary: job.maximumSalary,
  //         jobType: job.jobType || 'Full Time',
  //         experience: job.experience || 'Not specified',
  //         jobOwner: job.jobOwner || 'Unassigned'
  //       }));
  //       setJobs(convertedJobs);
  //       setTotalJobs(convertedJobs.length);
  //       setTotalPages(Math.ceil(convertedJobs.length / pageSize) || 1);
  //     }
  //   } catch (error) {
  //     console.error("Error refreshing jobs:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto" style={{ maxHeight: "calc(100vh - 30px)" }}>
            <Table>
              <TableHeader>
                <Tableheader tableHeadArr={columsArr} className="sticky top-0 z-20 bg-white" />
              </TableHeader>
              <TableBody>
                {paginatedJobs.length > 0 ? (
                  paginatedJobs.map((job) => (
                    <TableRow
                      key={job._id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/jobs/${job._id}`)}
                    >
                      <TableCell className="text-sm font-medium">{job.jobTitle}</TableCell>
                      <TableCell className="text-sm capitalize">{job.jobType}</TableCell>
                      <TableCell className="text-sm">{job.location}</TableCell>
                      <TableCell className="text-sm">{job.headcount}</TableCell>
                      <TableCell className="text-sm">
                        <JobStageBadge 
                          stage={job.stage} 
                          onStageChange={(newStage) => handleStageChange(job._id, newStage)} 
                        />
                      </TableCell>
                      <TableCell className="text-sm">{job.minimumSalary}</TableCell>
                      <TableCell className="text-sm">{job.maximumSalary}</TableCell>
                      <TableCell className="text-sm">{job.client}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-[calc(100vh-240px)] text-center">
                      <div className="py-24">
                        <div className="text-center">No jobs found</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="sticky bottom-0 bg-white z-10 border-t">
            <ClientPaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalClients={totalJobs}
              pageSize={pageSize}
              setPageSize={setPageSize}
              handlePageChange={handlePageChange}
              clientsLength={paginatedJobs.length}
            />
          </div>
        </div>
      </div>
      
      {/* <CreateJobModal 
        open={open} 
        onOpenChange={setOpen}
        clientId={clientList[0]?._id || ""}
        clientName={clientList[0]?.name || ""}
        refreshJobs={refreshJobs}
        onJobCreated = {()=>console.log("")}
      /> */}
      
      <ConfirmStageChangeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmStageChange}
      />
      <CreateJobRequirementForm open={open} onOpenChange={setOpen} />
    </>
  )
}
