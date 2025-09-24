"use client";
import axios from "axios";
import { useState, useMemo} from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { CreateClientModal } from "@/components/create-client-modal/create-client-modal";
import {
  updateClientStage,
  updateClientStageStatus,
  ClientStageStatus,
} from "@/services/clientService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { differenceInYears } from "date-fns";
import Dashboardheader from "@/components/dashboard-header";
import Tableheader from "@/components/table-header";
import ClientTableRow from "@/components/clients/ClientTableRow";
import ClientPaginationControls from "@/components/clients/ClientPaginationControls";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const columsArr = [
  "Name",
  "Industry",
  "Location",
  "Stage",
  "Stage Status",
  "Client Age",
  "Job Count",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

interface Client {
  _id?: string;
  id: string;
  name: string;
  industry: string;
  countryOfBusiness: string;
  clientStage: "Lead" | "Engaged" | "Signed";
  clientSubStage: ClientStageStatus;
  owner: string;
  team: string;
  createdAt: string;
  jobCount: number;
  incorporationDate: string;
}

type SortField = "name" | "industry" | "countryOfBusiness" | "createdAt";
type SortOrder = "asc" | "desc";

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

interface Filters {
  name: string;
  industry: string;
  maxAge: string;
}

export default function ClientsPage() {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: "name", order: "asc" });
  const [filters, setFilters] = useState<Filters>({
    name: "",
    industry: "",
    maxAge: "",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChange, setPendingChange] = useState<{
    clientId: string;
    stage: Client["clientStage"];
  } | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    clientId: string;
    status: ClientStageStatus;
  } | null>(null);
  const [showStatusConfirmDialog, setShowStatusConfirmDialog] = useState(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // Default to 10 per page

  // Hoisted function declaration to avoid temporal dead zone issues
  async function fetchClients(page = 1, size = pageSize): Promise<Client[]> {
    const directResponse = await axios.get(`${API_URL}/api/clients`, {
      params: {
        // Don't pass page/limit to get all clients
        ...(filters.name && { search: filters.name }),
        ...(filters.industry && { industry: filters.industry }),
      },
    });
    const data = directResponse.data.data as any[];
    // Map legacy keys to the new interface keys to keep UI consistent
    return (data || []).map((c) => ({
      _id: c._id,
      id: c.id ?? c._id,
      name: c.name,
      industry: c.industry,
      countryOfBusiness: c.countryOfBusiness ?? c.location,
      clientStage: c.clientStage ?? c.stage,
      clientSubStage: c.clientSubStage ?? c.clientStageStatus,
      owner: c.owner,
      team: c.team,
      createdAt: c.createdAt,
      jobCount: c.jobCount,
      incorporationDate: c.incorporationDate,
    })) as Client[];
  }

   const { data: allClients = [], isLoading , refetch } = useQuery<Client[]>({
    queryKey: ['clients', filters],
    queryFn: () => fetchClients(),
  })

  

  // Note: handlePageChange moved below after we derive total pages



  function getYearDifference(createdAt: string) {
    const createdDate = new Date(createdAt);
    const today = new Date();
    return differenceInYears(today, createdDate);
  }

  const calculateAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
  };

  const handleStageChange = (clientId: string, newStage: Client["clientStage"]) => {
    setPendingChange({ clientId, stage: newStage });
    setTimeout(() => {
      setShowConfirmDialog(true);
    }, 0);
  };

  const handleStageStatusChange = (clientId: string, newStatus: ClientStageStatus) => {
    setPendingStatusChange({ clientId, status: newStatus });
    setTimeout(() => {
      setShowStatusConfirmDialog(true);
    }, 0);
  };

  const { pagedClients, totalClientsCalc, totalPagesCalc } = useMemo(() => {
    let result: Client[] = isLoading ? [] : (allClients ?? []);

    if (filters.name) {
      result = result.filter((client: Client) =>
        client.name.toLowerCase().includes(filters.name.toLowerCase()),
      );
    }
    if (filters.industry) {
      result = result.filter((client: Client) =>
        client.industry.toLowerCase().includes(filters.industry.toLowerCase()),
      );
    }
    if (filters.maxAge) {
      const maxAgeMonths = parseInt(filters.maxAge);
      if (!isNaN(maxAgeMonths)) {
        result = result.filter((client: Client) => calculateAge(client.createdAt) <= maxAgeMonths);
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.field] < b[sortConfig.field]) {
        return sortConfig.order === "asc" ? -1 : 1;
      }
      if (a[sortConfig.field] > b[sortConfig.field]) {
        return sortConfig.order === "asc" ? 1 : -1;
      }
      return 0;
    });

    const totalClientsCalc = result.length;
    const totalPagesCalcRaw = Math.ceil(totalClientsCalc / pageSize);
    const totalPagesCalc = totalPagesCalcRaw > 0 ? totalPagesCalcRaw : 1;

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalClientsCalc);
    const pagedClients = result.slice(startIndex, endIndex);

    return { pagedClients, totalClientsCalc, totalPagesCalc };
  }, [sortConfig, filters, allClients, currentPage, pageSize, isLoading]);

  // Handle page change (after totals derived)
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPagesCalc) {
      setCurrentPage(newPage);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    setError(null);
    try {
      await updateClientStageStatus(pendingStatusChange.clientId, pendingStatusChange.status);
      refetch();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setShowStatusConfirmDialog(false);
    }
  };

  const handleConfirmChange = async () => {
    if (!pendingChange) return;
    setError(null);
    try {
      const updatedClient = await updateClientStage(pendingChange.clientId, pendingChange.stage);
      setShowConfirmDialog(false);
      refetch();
    } catch (error: any) {
      console.error("Error updating client stage:", error);
      setError(error.message || "Failed to update client stage. Please try again.");
    }
  };

  const handleCancelChange = () => {
    setPendingChange(null);
    setShowConfirmDialog(false);
    setError(null);
  };

  return (
    <>
      {/* Confirmation Dialog for Stage Change */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmChange}
        onCancel={handleCancelChange}
        title="Confirm Stage Change"
        description="Are you sure you want to update the client stage?"
        confirmText="Confirm"
        cancelText="Cancel"
        loading={isLoading}
        error={error}
        confirmVariant="default"
      />

      {/* Confirmation Dialog for Stage Status Change */}
      <ConfirmDialog
        open={showStatusConfirmDialog}
        onOpenChange={setShowStatusConfirmDialog}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => {
          setShowStatusConfirmDialog(false);
          setError(null);
        }}
        title="Are you sure?"
        description="This will update the client's stage status."
        confirmText="Confirm"
        cancelText="Cancel"
        loading={isLoading}
        error={error}
        confirmVariant="default"
      />

      <div className="flex flex-col h-full">
        {/* Header */}
         <Dashboardheader
          setOpen={setOpen}
          setFilterOpen={setFilterOpen}
          initialLoading={isLoading}
          heading="Clients"
          buttonText="Create Client"
        />

        {/* Table */}

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto" style={{ maxHeight: "calc(100vh - 30px)" }}>
            <Table>
              <TableHeader>
                <Tableheader tableHeadArr={columsArr} className="sticky top-0 z-20 bg-white" />
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center h-[calc(100vh-300px)]">
                      <div className="flex items-center justify-center gap-2 flex-col">
                        <Loader className="size-6 animate-spin" />
                        <div className="text-center">Loading clients...</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : allClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-[calc(100vh-300px)] text-center">
                      <div className="py-24">
                        <div className="text-center">No clients found</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedClients.map((client: Client) => (
                    <ClientTableRow
                      key={client.id ?? client._id}
                      client={client}
                      onStageChange={handleStageChange}
                      onStatusChange={handleStageStatusChange}
                      getYearDifference={getYearDifference}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="sticky bottom-0 bg-white z-10 border-t">
            <ClientPaginationControls
              currentPage={currentPage}
              totalPages={totalPagesCalc}
              totalClients={totalClientsCalc}
              pageSize={pageSize}
              setPageSize={setPageSize}
              handlePageChange={handlePageChange}
              clientsLength={allClients?.length}
            />

          </div>
        </div>

        <CreateClientModal open={open} onOpenChange={setOpen} />
      </div>
      {/* Filters Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name-filter">Client Name</Label>
              <Input
                id="name-filter"
                placeholder="Enter client name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="industry-filter">Client Industry</Label>
              <Input
                id="industry-filter"
                placeholder="Enter client industry"
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="age-filter">Client Age (months)</Label>
              <Input
                id="age-filter"
                placeholder="Enter max age"
                value={filters.maxAge}
                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
