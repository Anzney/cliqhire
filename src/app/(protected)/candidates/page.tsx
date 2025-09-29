"use client";
import { Candidate, candidateService } from "@/services/candidateService";
import { Table, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Loader } from "lucide-react";
import { CandidatesEmptyState } from "../../../components/candidates/empty-states";
// import Link from 'next/link'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Dashboardheader from "@/components/dashboard-header";
import Tableheader from "@/components/table-header";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { CandidateStatusBadge } from "@/components/candidate-status-badge";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading: initialLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: () => candidateService.getCandidates(),
  });
  const candidates: Candidate[] = data?.candidates ?? [];
  const [open, setOpen] = useState(false);
  // const [selected, setSelected] = useState("candidate");

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
    await updateStatusMutation.mutateAsync({ candidateId, newStatus });
  };

  return (
    <div className="flex flex-col h-full">
      <CreateCandidateModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCandidateCreated={async () => {
          // Refetch the list after creating a candidate
          await queryClient.invalidateQueries({ queryKey: ["candidates"] });
          setOpen(false);
        }}
      />

      {/* Header */}

      <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={() => {}}
        initialLoading={false}
        heading="Candidates"
        buttonText="Create Candidate"
      />

      <div className="flex-1">
        {initialLoading ? (
          <Table>
            <TableHeader>
              <Tableheader tableHeadArr={columsArr} />
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="text-center h-[calc(100vh-300px)]">
                  <div className="flex items-center justify-center gap-2 flex-col">
                    <Loader className="size-6 animate-spin" />
                    <div className="text-center">Loading candidates...</div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : candidates.length === 0 ? (
          <CandidatesEmptyState />
        ) : (
          <Table>
            <TableHeader>
              <Tableheader tableHeadArr={columsArr} />
            </TableHeader>
            <TableBody>
              {candidates.map((candidate, idx) => (
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
              ))}
            </TableBody>
          </Table>
        )}
        {/* Pagination Controls */}
        {/* <div className="flex items-center justify-between p-4 border-t">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {clients.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalClients)} of {totalClients} clients
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Show</span>
                        <select 
                          className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm" 
                          value={pageSize}
                          onChange={(e) => {
                            const newSize = parseInt(e.target.value);
                            setPageSize(newSize);
                            // Reset to page 1 when changing page size
                            setCurrentPage(1);
                            // Fetch clients with the new page size
                            fetchClients(1, newSize);
                          }}
                            // Fetch clients with the new page size
                            fetchClients(1, newSize);
                          }}
                        >
                          <option value="1000">All</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value="200">200</option>
                        </select>
                        <span className="text-sm">per page</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || initialLoading}
                      >
                        Previous
                      </Button>
                      <div className="text-sm">
                        Page {currentPage} of {totalPages}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || initialLoading}
                      >
                        Next
                      </Button>
                    </div>
                  </div> */}
      </div>

      {/* Content */}
      {/* {showSelectedOption()} */}
    </div>
  );
}
