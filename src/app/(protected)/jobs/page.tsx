"use client";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, RefreshCcw, MoreVertical, Loader, X } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { CreateJobModal } from "@/components/jobs/create-job-modal"
import {  
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { JobStageBadge } from "@/components/jobs/job-stage-badge";
import { JobStage } from "@/types/job";
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
import Dashboardheader from "@/components/dashboard-header";
import Tableheader from "@/components/table-header";
import { CreateJobRequirementForm } from "@/components/new-jobs/create-jobs-form";
import { JobPaginationControls } from "@/components/jobs/JobPaginationControls";
import { getJobs, updateJobStage } from "@/services/jobService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const columsArr = [
  "Position Name",
  "Job Type",
  "Job location",
  "Headcount",
  "Job Stage",
  "Minimum salary",
  "Maximum salary",
  "Job Owner",
];

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

export default function JobsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  let finalPermissions = (user?.permissions && user.permissions.length > 0) ? user.permissions : (user?.defaultPermissions || []);
  if (!isAdmin && !finalPermissions.includes('TODAY_TASKS')) {
    finalPermissions = [...finalPermissions, 'TODAY_TASKS'];
  }
  const canViewJobs = isAdmin || finalPermissions.includes('JOBS_VIEW') || finalPermissions.includes('JOBS');
  const canModifyJobs = isAdmin || finalPermissions.includes('JOBS_MODIFY');
  const canDeleteJobs = isAdmin || finalPermissions.includes('JOBS_DELETE');
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStages, setSelectedStages] = useState<JobStage[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{
    jobId: string;
    newStage: JobStage;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(13);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: jobsData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => getJobs(),
    placeholderData: (prev) => prev, // keep previous page data while fetching
  });
  
  // Get all jobs and handle different response formats
  let allJobs = Array.isArray(jobsData?.data) ? jobsData.data : 
               (jobsData as any)?.jobs ?? 
               (Array.isArray(jobsData) ? jobsData : []);

  console.log('All Jobs:', allJobs); // Debug log
  console.log('Selected Stages:', selectedStages); // Debug log

  // Filter jobs by selected stages if any
  if (selectedStages.length > 0) {
    allJobs = allJobs.filter((job: any) => {
      const jobStage = job.stage || job.jobStatus; // Try both possible field names
      console.log('Job:', job._id, 'Stage:', jobStage); // Debug log
      return selectedStages.includes(jobStage);
    });
  }
  
  // Calculate pagination
  const totalJobs = allJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalJobs / pageSize));
  
  // Get current page jobs
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const jobs = allJobs.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Ensure we always pass a valid JobStage to components expecting it
  const toJobStage = (stage?: string): JobStage => {
    const validStages: JobStage[] = [
      "Open",
      "Hired",
      "On Hold",
      "Closed",
      "Active",
      "Onboarding",
    ];
    return validStages.includes(stage as JobStage) ? (stage as JobStage) : "Open";
  };

  const handleStageChange = (jobId: string, newStage: JobStage) => {
    if (!canModifyJobs) return;
    setPendingStageChange({ jobId, newStage });
    setConfirmOpen(true);
  };

  const confirmStageChange = async () => {
    if (!pendingStageChange) return;

    const { jobId, newStage } = pendingStageChange;

    try {
      const response = await updateJobStage(jobId, newStage);

      if (!response.success) {
        throw new Error("Failed to update job stage");
      }
      // Refresh jobs list
      await queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (error) {
      console.error("Error updating job stage:", error);
    } finally {
      setPendingStageChange(null);
      setConfirmOpen(false);
    }
  };

  if (!canViewJobs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-muted-foreground">You do not have permission to view jobs.</div>
      </div>
    );
  }

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-2xl font-semibold flex items-center gap-2">Jobs</h1>
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          {canModifyJobs && (
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job Requirement
          </Button>
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
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
              <Tableheader tableHeadArr={columsArr} />
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="h-[calc(100vh-240px)] text-center">
                  <div className="py-24 flex flex-col items-center gap-2">
                    <Loader className="size-6 animate-spin" />
                    <div className="text-center">Loading Jobs...</div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-2xl font-bold">Jobs</h1>
            <div className="flex items-center space-x-2">
              {selectedStages.length > 0 && (
                <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-md">
                  <span className="text-sm text-muted-foreground">
                    {selectedStages.length} filter{selectedStages.length !== 1 ? 's' : ''} applied
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedStages([])}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Clear filters</span>
                  </Button>
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter
                    {selectedStages.length > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                        {selectedStages.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Filter by Stage</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-2 p-2">
                    {['Open', 'Hired', 'On Hold', 'Closed', 'Active', 'Onboarding'].map((stage) => (
                      <div key={stage} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`stage-${stage}`} 
                          checked={selectedStages.includes(stage as JobStage)}
                          onCheckedChange={(checked) => {
                            setCurrentPage(1);
                            if (checked) {
                              setSelectedStages([...selectedStages, stage as JobStage]);
                            } else {
                              setSelectedStages(selectedStages.filter(s => s !== stage));
                            }
                          }}
                        />
                        <Label htmlFor={`stage-${stage}`} className="text-sm font-normal">
                          {stage}
                        </Label>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {canModifyJobs && (
                <Button onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Requirement
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto" style={{ maxHeight: "calc(100vh - 30px)" }}>
            <Table>
              <TableHeader>
                <Tableheader tableHeadArr={columsArr} className="sticky top-0 z-20 bg-white" />
              </TableHeader>
              <TableBody>
                {jobs.length > 0 ? (
                  jobs.map((job:any) => (
                    <TableRow
                      key={job._id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/jobs/${job._id}`)}
                    >
                      <TableCell className="text-sm font-medium">{job.jobTitle}</TableCell>
                      <TableCell className="text-sm capitalize">{job.jobType}</TableCell>
                      <TableCell className="text-sm">{Array.isArray(job.location) ? job.location.join(", ") : job.location ?? ""}</TableCell>
                      <TableCell className="text-sm">{job.headcount}</TableCell>
                      <TableCell className="text-sm"
                       onClick={(e)=>e.stopPropagation()}
                      >
                        <JobStageBadge
                          stage={toJobStage(job.stage)}
                          onStageChange={(newStage) => handleStageChange(job._id, newStage)}
                        />
                      </TableCell>
                      <TableCell className="text-sm">{job.salaryCurrency+" "+ job.minimumSalary}</TableCell>
                      <TableCell className="text-sm">{job.salaryCurrency+" "+ job.maximumSalary}</TableCell>
                      <TableCell className="text-sm">
                        {job.client}
                      </TableCell>
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
            <JobPaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalJobs={totalJobs}
              pageSize={pageSize}
              setPageSize={setPageSize}
              handlePageChange={handlePageChange}
              jobsLength={jobs.length}
            />
          </div>
        </div>
      </div>


      <ConfirmStageChangeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmStageChange}
      />
      {canModifyJobs && <CreateJobRequirementForm open={open} onOpenChange={setOpen} />}
    </>
  );
}
