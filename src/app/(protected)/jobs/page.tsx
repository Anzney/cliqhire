"use client";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, RefreshCcw, MoreVertical, Loader, X } from "lucide-react";
import { toast } from "sonner";
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
  TableHead,
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
import { getJobs, updateJobStage, deleteJobById } from "@/services/jobService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { DeleteConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import JobsFilter from "@/components/jobs/JobsFilter";

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
  const [filterPositionName, setFilterPositionName] = useState("");
  const [filterJobOwner, setFilterJobOwner] = useState("");
  const [selectedStages, setSelectedStages] = useState<JobStage[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{
    jobId: string;
    newStage: JobStage;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(13);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Build owner options from unfiltered jobs
  const allOwnerOptions: string[] = Array.from(
    new Set((Array.isArray(allJobs) ? allJobs : []).map((j: any) => j.client).filter(Boolean))
  );

  // Apply filters
  if (selectedStages.length > 0 || filterPositionName || filterJobOwner) {
    const position = filterPositionName.trim().toLowerCase();
    const owner = filterJobOwner.trim().toLowerCase();
    allJobs = allJobs.filter((job: any) => {
      const jobStage = (job.stage || job.jobStatus) as JobStage | undefined;
      const matchesStage = selectedStages.length === 0 || (jobStage ? selectedStages.includes(jobStage) : false);
      const title = (job.jobTitle || "").toLowerCase();
      const matchesTitle = position === "" || title.includes(position);
      const jobOwnerVal = (job.client || "").toLowerCase();
      const matchesOwner = owner === "" || jobOwnerVal.includes(owner);
      return matchesStage && matchesTitle && matchesOwner;
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

  // Toggle row selection
  const toggleRowSelection = (jobId: string) => {
    if (!canDeleteJobs) return; // Prevent selection if user can't delete
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(jobId)) {
        newSelected.delete(jobId);
      } else {
        newSelected.add(jobId);
      }
      return newSelected;
    });
  };

  // Toggle all rows selection
  const toggleSelectAll = () => {
    if (!canDeleteJobs) return; // Prevent selection if user can't delete
    if (selectedRows.size === jobs.length) {
      setSelectedRows(new Set());
    } else {
      const newSelectedRows = new Set<string>();
      jobs.forEach((job: any) => {
        newSelectedRows.add(job._id);
      });
      setSelectedRows(newSelectedRows);
    }
  };

  const handleDeleteSelected = async () => {
    console.log('handleDeleteSelected called');
    console.log('selectedRows size:', selectedRows.size, 'canDeleteJobs:', canDeleteJobs);
    if (selectedRows.size === 0 || !canDeleteJobs) {
      console.log('Not showing dialog - no rows selected or no delete permission');
      return;
    }
    console.log('Setting showDeleteDialog to true');
    setShowDeleteDialog(true);
  };

  const confirmDeleteSelected = async () => {
    if (selectedRows.size === 0 || !canDeleteJobs) return;
    
    setIsDeleting(true);
    try {
      // Delete all selected jobs in parallel
      await Promise.all(
        Array.from(selectedRows).map((jobId) =>
          deleteJobById(jobId).catch(error => {
            console.error(`Error deleting job ${jobId}:`, error);
            throw error;
          })
        )
      );
      
      // Refresh the job list after successful deletion
      await refetch();
      
      // Clear the selection
      setSelectedRows(new Set());
      
      // Show success message
      toast.success(`${selectedRows.size} job(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting jobs:', error);
      toast.error('Failed to delete selected jobs. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
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
       <Dashboardheader 
          setOpen={setOpen}
          setFilterOpen={setFilterOpen}
          initialLoading={isLoading}
          onRefresh={() => refetch()}
          onDelete={handleDeleteSelected}
          heading="Jobs"
          buttonText="Add Job"
          selectedCount={selectedRows.size}
          showCreateButton={canModifyJobs}
          isFilterActive={selectedStages.length > 0 || !!filterPositionName.trim() || !!filterJobOwner.trim()}
          filterCount={
            (selectedStages.length > 0 ? 1 : 0) +
            (filterPositionName.trim() ? 1 : 0) +
            (filterJobOwner.trim() ? 1 : 0)
          }
       />
        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 ">
          <div className="flex-1 overflow-auto" style={{ maxHeight: "calc(100vh - 30px)" }}>
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 z-20 bg-white">
                  <TableHead className="w-12 px-4">
                    <div className="flex items-center justify-center">
                      <Input
                        type="checkbox"
                        checked={selectedRows.size > 0 && selectedRows.size === jobs.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        disabled={!canDeleteJobs}
                      />
                    </div>
                  </TableHead>
                  {columsArr.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length > 0 ? (
                  jobs.map((job:any) => (
                    <TableRow 
                      key={job._id} 
                      className={`${selectedRows.has(job._id) ? 'bg-blue-50' : ''} hover:bg-muted/50 cursor-pointer`}
                      onClick={() => router.push(`/jobs/${job._id}`)}
                    >
                      <TableCell className="w-12 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center">
                          <Input
                            type="checkbox"
                            checked={selectedRows.has(job._id)}
                            onChange={() => toggleRowSelection(job._id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            disabled={!canDeleteJobs}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableCell>
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

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
        }}
        onConfirm={() => {
          confirmDeleteSelected();
        }}
        title="Delete Jobs"
        description={`Are you sure you want to delete ${selectedRows.size} selected job(s)? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        isDeleting={isDeleting}
      />
      <JobsFilter
        open={filterOpen}
        onOpenChange={setFilterOpen}
        positionName={filterPositionName}
        onPositionNameChange={setFilterPositionName}
        jobOwner={filterJobOwner}
        onJobOwnerChange={setFilterJobOwner}
        selectedStages={selectedStages}
        onStagesChange={setSelectedStages}
        jobOwners={allOwnerOptions}
        onApply={() => setFilterOpen(false)}
        onClear={() => {
          setFilterPositionName("");
          setFilterJobOwner("");
          setSelectedStages([]);
        }}
      />
      {canModifyJobs && <CreateJobRequirementForm open={open} onOpenChange={setOpen} />}
    </>
  );
}
