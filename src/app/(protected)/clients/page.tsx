"use client";
import axios from "axios";
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
import { useRouter, useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getJobCountsByClient } from "@/services/jobService";
import { Plus, RefreshCcw, SlidersHorizontal, MoreVertical } from "lucide-react";
import { CreateClientModal } from "@/components/create-client-modal/create-client-modal";
import {
  getClients,
  updateClientStage,
  updateClientStageStatus,
  ClientResponse,
  ClientStageStatus,
} from "@/services/clientService";
import { ClientStageBadge } from "@/components/client-stage-badge";
import { ClientStageStatusBadge } from "@/components/client-stage-status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { differenceInYears } from "date-fns";
import Dashboardheader from "@/components/dashboard-header";
import Tableheader from "@/components/table-header";
import ClientTableRow from "@/components/clients/ClientTableRow";
import ClientPaginationControls from "@/components/clients/ClientPaginationControls";

const columsArr = [
  "Name",
  "Industry",
  "Location",
  "Stage",
  "Stage Status",
  "Sales RM",
  "Client Team",
  "Client Age",
  "Job Count",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  stage: "Lead" | "Negotiation" | "Engaged" | "Signed";
  clientStageStatus: ClientStageStatus;
  owner: string;
  team: string;
  createdAt: string;
  jobCount: number;
  incorporationDate: string;
}

type SortField = "name" | "industry" | "location" | "createdAt";
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: "name", order: "asc" });
  const [filters, setFilters] = useState<Filters>({
    name: "",
    industry: "",
    maxAge: "",
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChange, setPendingChange] = useState<{
    clientId: string;
    stage: Client["stage"];
  } | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    clientId: string;
    status: ClientStageStatus;
  } | null>(null);
  const [showStatusConfirmDialog, setShowStatusConfirmDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10); // Default to 10 per page

  const fetchClients = async (page = 1, size = pageSize) => {
    setInitialLoading(true);
    try {
      // Fetch all clients from the API (no pagination in the API call)

      // First try with the service function
      try {
        // Fetch all clients by not providing page/limit to getClients
        const response = await getClients({
          ...(filters.name && { search: filters.name }),
          ...(filters.industry && { industry: filters.industry }),
        });

        if (response && response.clients && Array.isArray(response.clients)) {
          // Extract data from response
          const apiClients: ClientResponse[] = response.clients;
          const total = apiClients.length;

          // Map API clients to our format
          const mappedClients = apiClients.map((client: ClientResponse) => ({
            id: client._id,
            name: client.name || "Unnamed Client",
            industry: client.industry || "",
            location: client.location || "",
            stage: client.clientStage || "Lead",
            clientStageStatus: client.clientStageStatus || "Calls",
            owner: client.clientRm || "",
            team: client.clientTeam || "",
            createdAt: client.createdAt,
            incorporationDate: client.incorporationDate || "",
            jobCount: client.jobCount || 0, // Use jobCount from backend
          }));

          // Set clients state with all clients (pagination is handled client-side)
          setClients(mappedClients);

          // Reset to first page when fetching new data
          setCurrentPage(1);

          // Save to localStorage as backup
          if (typeof window !== "undefined") {
            localStorage.setItem("cliqhire_clients", JSON.stringify(mappedClients));
          }

          return; // Exit early since we successfully processed the data
        }
      } catch (serviceError) {
        console.error("Error using service function:", serviceError);
        // Continue to direct API call as fallback
      }

      // Fallback: Direct API call
      const directResponse = await axios.get(`${API_URL}/clients`, {
        params: {
          // Don't pass page/limit to get all clients
          ...(filters.name && { search: filters.name }),
          ...(filters.industry && { industry: filters.industry }),
        },
      });

      // Process the direct API response
      if (directResponse.data && directResponse.data.success) {
        const apiClients: ClientResponse[] = Array.isArray(directResponse.data.data)
          ? directResponse.data.data
          : directResponse.data.data && Array.isArray(directResponse.data.data.clients)
            ? directResponse.data.data.clients
            : [];

        // Map API clients to our format
        const mappedClients = apiClients.map((client: ClientResponse) => ({
          id: client._id,
          name: client.name || "Unnamed Client",
          industry: client.industry || "",
          location: client.location || "",
          stage: client.clientStage || "Lead",
          clientStageStatus: client.clientStageStatus || "Calls",
          owner: client.clientRm || "",
          team: client.clientTeam || "",
          createdAt: client.createdAt,
          incorporationDate: client.incorporationDate || "",
          jobCount: client.jobCount || 0, // Use jobCount from backend
        }));

        // Set clients state with all clients (pagination is handled client-side)
        setClients(mappedClients);

        // Reset to first page when fetching new data
        setCurrentPage(1);

        // Save to localStorage as backup
        if (typeof window !== "undefined") {
          localStorage.setItem("cliqhire_clients", JSON.stringify(mappedClients));
        }
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      // Fallback to empty clients list or local storage if available
      try {
        // Try to get clients from localStorage if available
        const storedClients =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("cliqhire_clients") || "[]")
            : [];

        if (storedClients.length > 0) {
          // Apply manual pagination to stored clients
          const total = storedClients.length;
          setTotalClients(total);

          const pages = Math.ceil(total / size);
          setTotalPages(pages);
          setCurrentPage(page);

          const startIndex = (page - 1) * size;
          const endIndex = Math.min(startIndex + size, total);
          const paginatedClients = storedClients.slice(startIndex, endIndex);

          setClients(paginatedClients);
        } else {
          // No clients in localStorage either
          setClients([]);
          setTotalClients(0);
          setTotalPages(1);
        }
      } catch (fallbackError) {
        console.error("Error with fallback clients:", fallbackError);
        setClients([]);
        setTotalClients(0);
        setTotalPages(1);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  // Handle page change

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // We don't need to fetch clients here since we're now handling pagination client-side
      // The filteredAndSortedClients will automatically update with the new page
    }
  };

  useEffect(() => {
    fetchClients(currentPage);
  }, []);

  // Refresh data when filters change
  useEffect(() => {
    // Only refetch if not the initial render
    if (!initialLoading) {
      fetchClients(1); // Reset to first page when filters change
    }
  }, [filters]);

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

  const handleStageChange = (clientId: string, newStage: Client["stage"]) => {
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

  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients];

    if (filters.name) {
      result = result.filter((client) =>
        client.name.toLowerCase().includes(filters.name.toLowerCase()),
      );
    }
    if (filters.industry) {
      result = result.filter((client) =>
        client.industry.toLowerCase().includes(filters.industry.toLowerCase()),
      );
    }
    if (filters.maxAge) {
      const maxAgeMonths = parseInt(filters.maxAge);
      if (!isNaN(maxAgeMonths)) {
        result = result.filter((client) => calculateAge(client.createdAt) <= maxAgeMonths);
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

    // Update total clients count based on filtered results
    setTotalClients(result.length);

    // Calculate total pages based on filtered results and current page size
    const totalFilteredPages = Math.ceil(result.length / pageSize);
    setTotalPages(totalFilteredPages > 0 ? totalFilteredPages : 1);

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, result.length);

    return result.slice(startIndex, endIndex);
  }, [sortConfig, filters, clients, currentPage, pageSize]);

  const [error, setError] = useState<string | null>(null);

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    setIsUpdating(true);
    setError(null);
    let isSuccess = false;

    try {
      await updateClientStageStatus(pendingStatusChange.clientId, pendingStatusChange.status);

      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === pendingStatusChange.clientId
            ? { ...client, clientStageStatus: pendingStatusChange.status }
            : client,
        ),
      );
      isSuccess = true;
    } catch (err: any) {
      console.error("Error updating client stage status:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
      setShowStatusConfirmDialog(false);
      if (isSuccess) {
        setPendingStatusChange(null);
      }
    }
  };

  const handleConfirmChange = async () => {
    if (!pendingChange) return;

    setIsUpdating(true);
    setError(null);
    let isSuccess = false;

    try {
      const updatedClient = await updateClientStage(pendingChange.clientId, pendingChange.stage);

      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === pendingChange.clientId
            ? { ...client, stage: updatedClient?.clientStage || pendingChange.stage }
            : client,
        ),
      );

      isSuccess = true;
      setShowConfirmDialog(false);
    } catch (error: any) {
      console.error("Error updating client stage:", error);
      setError(error.message || "Failed to update client stage. Please try again.");
    } finally {
      setIsUpdating(false);
      if (isSuccess) {
        setPendingChange(null);
      }
    }
  };

  const handleCancelChange = () => {
    setPendingChange(null);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Dialog
        open={showConfirmDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowConfirmDialog(false);
            setError(null);
            setPendingChange(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Stage Change</DialogTitle>
            <DialogDescription>
              {error ? (
                <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-md">{error}</div>
              ) : (
                "Are you sure you want to update the client stage?"
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelChange}
              disabled={isUpdating}
              className="mr-2"
            >
              {error ? "Close" : "Cancel"}
            </Button>
            {!error && (
              <Button
                onClick={handleConfirmChange}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Stage Status Change */}
      <Dialog open={showStatusConfirmDialog} onOpenChange={setShowStatusConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This will update the client&apos;s stage status.
            {error && <div className="text-red-600 mt-4 p-3 bg-red-50 rounded-md">{error}</div>}
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowStatusConfirmDialog(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleConfirmStatusChange} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col h-full">
        {/* Header */}

        <Dashboardheader
          setOpen={setOpen}
          setFilterOpen={setFilterOpen}
          initialLoading={initialLoading}
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
                {initialLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-[calc(100vh-240px)] text-center">
                      <div className="py-24">
                        <div className="text-center">Loading clients...</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-[calc(100vh-240px)] text-center">
                      <div className="py-24">
                        <div className="text-center">No clients found</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedClients.map((client) => (
                    <ClientTableRow
                      key={client.id}
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
              totalPages={totalPages}
              totalClients={totalClients}
              pageSize={pageSize}
              setPageSize={setPageSize}
              handlePageChange={handlePageChange}
              clientsLength={clients.length}
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
