"use client";
import { Candidate, candidateService } from "@/services/candidateService";
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from "@/components/ui/table";
import { Loader } from "lucide-react";
import { CandidatesEmptyState } from "../../../components/candidates/empty-states";
// import Link from 'next/link'
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboardheader from "@/components/dashboard-header";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { CandidateStatusBadge } from "@/components/candidate-status-badge";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CandidatePaginationControls from "@/components/candidates/CandidatePaginationControls";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteConfirmationDialog } from "@/components/ui/confirmation-dialog";
import CandidateFilter, { CandidateStatus as FilterStatus } from "@/components/candidates/CandidateFilter";

const columsArr = [
  "Candidate Name",
  "Candidate Email",
  "Candidate Phone",
  "Location",
  "Status",
  "Experience",
  "Resume",
];

export default function CandidatesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  let finalPermissions = (user?.permissions && user.permissions.length > 0) ? user.permissions : (user?.defaultPermissions || []);
  if (!isAdmin && !finalPermissions.includes('TODAY_TASKS')) {
    finalPermissions = [...finalPermissions, 'TODAY_TASKS'];
  }
  const canViewCandidates = isAdmin || finalPermissions.includes('CANDIDATE_VIEW') || finalPermissions.includes('CANDIDATE');
  const canModifyCandidates = isAdmin || finalPermissions.includes('CANDIDATE_MODIFY');
  const canDeleteCandidates = isAdmin || finalPermissions.includes('CANDIDATE_DELETE');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading: initialLoading, isFetching, refetch } = useQuery({
    queryKey: ["candidates"],
    queryFn: () => candidateService.getCandidates(),
  });
  const candidates: Candidate[] = data?.candidates ?? [];
  const [open, setOpen] = useState(false);
  // const [selected, setSelected] = useState("candidate");

  // Pagination state (client-side, similar to clients page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(13);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<FilterStatus[]>([]);

  // Derive filtered + paged candidates and totals (client-side)
  const { pagedCandidates, totalCandidatesCalc, totalPagesCalc } = useMemo(() => {
    let result: Candidate[] = initialLoading ? [] : candidates;

    const nameQ = filterName.trim().toLowerCase();
    const emailQ = filterEmail.trim().toLowerCase();
    const expQ = filterExperience.trim().toLowerCase();
    const locQ = filterLocation.trim().toLowerCase();

    if (nameQ || emailQ || expQ || locQ || selectedStatuses.length > 0) {
      result = result.filter((c) => {
        const matchesName = nameQ === "" || (c.name || "").toLowerCase().includes(nameQ);
        const matchesEmail = emailQ === "" || (c.email || "").toLowerCase().includes(emailQ);
        const matchesExp = expQ === "" || (c.experience || "").toLowerCase().includes(expQ);
        const matchesLoc = locQ === "" || (c.location || "").toLowerCase().includes(locQ);
        const matchesStatus = selectedStatuses.length === 0 || (c.status ? selectedStatuses.includes(c.status as FilterStatus) : false);
        return matchesName && matchesEmail && matchesExp && matchesLoc && matchesStatus;
      });
    }
    const totalCandidatesCalc = result.length;
    const totalPagesCalcRaw = Math.ceil(totalCandidatesCalc / pageSize);
    const totalPagesCalc = totalPagesCalcRaw > 0 ? totalPagesCalcRaw : 1;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalCandidatesCalc);
    const pagedCandidates = result.slice(startIndex, endIndex);

    return { pagedCandidates, totalCandidatesCalc, totalPagesCalc };
  }, [candidates, currentPage, pageSize, initialLoading, filterName, filterEmail, filterExperience, filterLocation, selectedStatuses]);

  const toggleRowSelection = (candidateId: string) => {
    if (!canDeleteCandidates) return;
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
      } else {
        next.add(candidateId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!canDeleteCandidates) return;
    if (selectedRows.size === pagedCandidates.length) {
      setSelectedRows(new Set());
    } else {
      const newSelected = new Set<string>();
      pagedCandidates.forEach((c) => {
        if (c._id) newSelected.add(c._id);
      });
      setSelectedRows(newSelected);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0 || !canDeleteCandidates) return;
    setShowDeleteDialog(true);
  };

  const confirmDeleteSelected = async () => {
    if (selectedRows.size === 0 || !canDeleteCandidates) return;
    setIsDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedRows).map((candidateId) =>
          candidateService.deleteCandidate(candidateId).catch((error) => {
            console.error(`Error deleting candidate ${candidateId}:`, error);
            throw error;
          })
        )
      );
      await refetch();
      setSelectedRows(new Set());
      toast.success(`${selectedRows.size} candidate(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting candidates:', error);
      toast.error('Failed to delete selected candidates. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ candidateId, newStatus }: { candidateId: string; newStatus: string }) => {
      return candidateService.updateCandidate(candidateId, { status: newStatus });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      toast.success(`Candidate status updated to ${variables.newStatus}`);
    },
    onError: () => {
      toast.error("Failed to update candidate status");
    },
  });

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    if (!canModifyCandidates) return;
    await updateStatusMutation.mutateAsync({ candidateId, newStatus });
  };

  if (!canViewCandidates) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-muted-foreground">You do not have permission to view candidates.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {canModifyCandidates && (
        <CreateCandidateModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onCandidateCreated={async () => {
            await queryClient.invalidateQueries({ queryKey: ["candidates"] });
            setOpen(false);
          }}
        />
      )}

      {/* Header */}

      <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={setFilterOpen}
        initialLoading={isFetching}
        heading="Candidates"
        buttonText="Create Candidate"
        showCreateButton={canModifyCandidates}
        showFilterButton={true}
        isFilterActive={selectedStatuses.length > 0 || !!filterName.trim() || !!filterEmail.trim() || !!filterExperience.trim() || !!filterLocation.trim()}
        filterCount={(selectedStatuses.length > 0 ? 1 : 0) + (filterName.trim() ? 1 : 0) + (filterEmail.trim() ? 1 : 0) + (filterExperience.trim() ? 1 : 0) + (filterLocation.trim() ? 1 : 0)}
        selectedCount={selectedRows.size}
        onDelete={handleDeleteSelected}
        onRefresh={() => {
          refetch();
        }}
      />

      {/* Inline filters injected into header via rightContent below */}

      {/* Table + Pagination */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Scrollable area with sticky header */}
        <div className="flex-1 overflow-auto" style={{ maxHeight: "calc(100vh - 30px)" }}>
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 z-20 bg-white">
                <TableHead className="w-12 px-4">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedRows.size > 0 && selectedRows.size === pagedCandidates.length}
                      onCheckedChange={() => toggleSelectAll()}
                      className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-slate-100 data-[state=checked]:text-blue-600 data-[state=checked]:border-blue-600 focus-visible:ring-indigo-500"
                      disabled={!canDeleteCandidates}
                    />
                  </div>
                </TableHead>
                {columsArr.map((column) => (
                  <TableHead key={column} className="text-xs uppercase text-muted-foreground font-medium">{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-[calc(100vh-300px)]">
                    <div className="flex items-center justify-center gap-2 flex-col">
                      <Loader className="size-6 animate-spin" />
                      <div className="text-center">Loading candidates...</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-[calc(100vh-300px)] text-center">
                    <div className="py-24">
                      <CandidatesEmptyState />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pagedCandidates.map((candidate) => (
                  <TableRow
                    key={candidate._id}
                    className={`${candidate._id && selectedRows.has(candidate._id) ? 'bg-blue-50' : ''} cursor-pointer hover:bg-gray-100`}
                    onClick={(e) => {
                      // Don't navigate if clicking on the status badge
                      if (!(e.target as HTMLElement).closest(".candidate-status-badge")) {
                        router.push(`/candidates/${candidate._id}`);
                      }
                    }}
                  >
                    <TableCell className="w-12 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={candidate._id ? selectedRows.has(candidate._id) : false}
                          onCheckedChange={() => candidate._id && toggleRowSelection(candidate._id)}
                          className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-slate-100 data-[state=checked]:text-blue-600 data-[state=checked]:border-blue-600 focus-visible:ring-indigo-500"
                          disabled={!canDeleteCandidates}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{candidate.name || "N/A"}</TableCell>
                    <TableCell className="text-sm">{candidate.email || "N/A"}</TableCell>
                    <TableCell className="text-sm">{candidate.phone || "N/A"}</TableCell>
                    <TableCell className="text-sm">{candidate.location || "N/A"}</TableCell>
                    <TableCell className="text-sm">
                      <CandidateStatusBadge
                        id={candidate._id}
                        status={(candidate.status as any) || "Active"}
                        onStatusChange={handleStatusChange}
                      />
                    </TableCell>
                    <TableCell className="text-sm">{candidate.experience || "N/A"}</TableCell>
                    <TableCell className="text-sm">
                      {candidate.resume ? (
                        <a
                          href={candidate.resume.startsWith('http') ? candidate.resume : `${process.env.NEXT_PUBLIC_API_URL || ''}${candidate.resume.startsWith('/') ? '' : '/'}${candidate.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Resume
                        </a>                                                                                         
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 bg-white z-10 border-t">
          <CandidatePaginationControls
            currentPage={currentPage}
            totalPages={totalPagesCalc}
            totalCandidates={totalCandidatesCalc}
            pageSize={pageSize}
            setPageSize={setPageSize}
            handlePageChange={(page) => {
              if (page >= 1 && page <= totalPagesCalc) setCurrentPage(page);
            }}
            candidatesLength={totalCandidatesCalc}
          />
        </div>
      </div>

      {/* Content */}
      {/* {showSelectedOption()} */}

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteSelected}
        title="Delete Candidates"
        description={`Are you sure you want to delete ${selectedRows.size} selected candidate(s)? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        isDeleting={isDeleting}
      />

      <CandidateFilter
        open={filterOpen}
        onOpenChange={setFilterOpen}
        name={filterName}
        onNameChange={setFilterName}
        email={filterEmail}
        onEmailChange={setFilterEmail}
        experience={filterExperience}
        onExperienceChange={setFilterExperience}
        location={filterLocation}
        onLocationChange={setFilterLocation}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        onApply={() => setFilterOpen(false)}
        onClear={() => {
          setFilterName("");
          setFilterEmail("");
          setFilterExperience("");
          setFilterLocation("");
          setSelectedStatuses([]);
        }}
      />
    </div>
  );
}
