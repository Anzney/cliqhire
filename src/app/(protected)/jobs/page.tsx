"use client";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, RefreshCcw, MoreVertical, Loader } from "lucide-react";
import { useState } from "react";
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
import ClientPaginationControls from "@/components/clients/ClientPaginationControls";
import { getJobs, updateJobStage } from "@/services/jobService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{
    jobId: string;
    newStage: JobStage;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: jobsData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["jobs", currentPage, pageSize],
    queryFn: () => getJobs(),
    placeholderData: (prev) => prev, // keep previous page data while fetching
  });
  // Support both PaginatedJobResponse { jobs, total, pages } and JobResponse { data, count }
  const jobs = (jobsData as any)?.jobs ?? (jobsData as any)?.data ?? [];
  const totalJobs = (jobsData as any)?.total ?? (jobsData as any)?.count ?? jobs.length;
  const totalPages = (jobsData as any)?.pages ?? (totalJobs ? Math.max(1, Math.ceil(totalJobs / pageSize)) : 1);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job Requirement
          </Button>
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
          initialLoading={isLoading || isFetching}
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
                      <TableCell className="text-sm">{job.minimumSalary}</TableCell>
                      <TableCell className="text-sm">{job.maximumSalary}</TableCell>
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
            <ClientPaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalClients={totalJobs}
              pageSize={pageSize}
              setPageSize={setPageSize}
              handlePageChange={handlePageChange}
              clientsLength={jobs.length}
            />
          </div>
        </div>
      </div>


      <ConfirmStageChangeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmStageChange}
      />
      <CreateJobRequirementForm open={open} onOpenChange={setOpen} />
    </>
  );
}
