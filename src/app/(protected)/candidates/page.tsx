"use client";
import { Candidate, candidateService } from "@/services/candidateService";
import { Table, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Loader } from "lucide-react";
import { CandidatesEmptyState } from "../../../components/candidates/empty-states";
// import Link from 'next/link'
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboardheader from "@/components/dashboard-header";
import Tableheader from "@/components/table-header";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { CandidateStatusBadge } from "@/components/candidate-status-badge";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CandidatePaginationControls from "@/components/candidates/CandidatePaginationControls";
import CandidateFiltersInline from "@/components/candidates/CandidateFiltersInline";
import { CandidateFilterState } from "@/components/candidates/CandidateFilters";
import { useAuth } from "@/contexts/AuthContext";

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
  const [filters, setFilters] = useState<CandidateFilterState>({ name: "", email: "", status: "" });
  // const [selected, setSelected] = useState("candidate");

  // Pagination state (client-side, similar to clients page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Derive filtered + paged candidates and totals (client-side)
  const { pagedCandidates, totalCandidatesCalc, totalPagesCalc } = useMemo(() => {
    let result: Candidate[] = initialLoading ? [] : candidates;
    // Apply filters
    if (filters.name) {
      const q = filters.name.toLowerCase();
      result = result.filter((c) => (c.name || "").toLowerCase().includes(q));
    }
    if (filters.email) {
      const q = filters.email.toLowerCase();
      result = result.filter((c) => (c.email || "").toLowerCase().includes(q));
    }
    if (filters.status) {
      result = result.filter((c) => (c.status || "").toLowerCase() === filters.status.toLowerCase());
    }
    const totalCandidatesCalc = result.length;
    const totalPagesCalcRaw = Math.ceil(totalCandidatesCalc / pageSize);
    const totalPagesCalc = totalPagesCalcRaw > 0 ? totalPagesCalcRaw : 1;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalCandidatesCalc);
    const pagedCandidates = result.slice(startIndex, endIndex);

    return { pagedCandidates, totalCandidatesCalc, totalPagesCalc };
  }, [candidates, currentPage, pageSize, initialLoading, filters]);

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
        setFilterOpen={() => {}}
        initialLoading={isFetching}
        heading="Candidates"
        buttonText="Create Candidate"
        showCreateButton={canModifyCandidates}
        showFilterButton={false}
        rightContent={<CandidateFiltersInline filters={filters} onChange={setFilters} />}
        onRefresh={() => {
          // Ensure we reset to first page optionally if desired in future
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
              <Tableheader tableHeadArr={columsArr} className="sticky top-0 z-20 bg-white" />
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
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={(e) => {
                      // Don't navigate if clicking on the status badge
                      if (!(e.target as HTMLElement).closest(".candidate-status-badge")) {
                        router.push(`/candidates/${candidate._id}`);
                      }
                    }}
                  >
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
                          href={candidate.resume}
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
    </div>
  );
}
