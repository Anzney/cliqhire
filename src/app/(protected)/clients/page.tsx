"use client";
import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import { Table, TableHead, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { CreateClientModal } from "@/components/create-client-modal/create-client-modal";
import {
  updateClientStage,
  updateClientStageStatus,
  ClientStageStatus,
  deleteClient,
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
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/confirmation-dialog";
import ClientsFilter from "@/components/clients/ClientsFilter";
import { Checkbox } from "@/components/ui/checkbox";

const columnsArr = [
  "", // Empty header for the checkbox column
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
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  let finalPermissions = (user?.permissions && user.permissions.length > 0) ? user.permissions : (user?.defaultPermissions || []);
  if (!isAdmin && !finalPermissions.includes('TODAY_TASKS')) {
    finalPermissions = [...finalPermissions, 'TODAY_TASKS'];
  }
  const canViewClients = isAdmin || finalPermissions.includes('CLIENTS_VIEW') || finalPermissions.includes('CLIENTS');
  const canModifyClients = isAdmin || finalPermissions.includes('CLIENTS_MODIFY');
  const canDeleteClients = isAdmin || finalPermissions.includes('CLIENTS_DELETE');
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStages, setFilterStages] = useState<Client["clientStage"][]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: "name", order: "asc" });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Toggle row selection
  const toggleRowSelection = (clientId: string) => {
    if (!canDeleteClients) return; // Prevent selection if user can't delete
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(clientId)) {
        newSelected.delete(clientId);
      } else {
        newSelected.add(clientId);
      }
      return newSelected;
    });
  };

  // Toggle all rows selection
  const toggleSelectAll = () => {
    if (!canDeleteClients) return; // Prevent selection if user can't delete
    if (selectedRows.size === pagedClients.length) {
      setSelectedRows(new Set());
    } else {
      const newSelectedRows = new Set(selectedRows);
      pagedClients.forEach((client: Client) => {
        newSelectedRows.add(client.id);
      });
      setSelectedRows(newSelectedRows);
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0 || !canDeleteClients) return;
    setShowDeleteDialog(true);
  };

  const confirmDeleteSelected = async () => {
    if (selectedRows.size === 0 || !canDeleteClients) return;
    
    setIsDeleting(true);
    try {
      // Delete all selected clients in parallel
      await Promise.all(
        Array.from(selectedRows).map((clientId) =>
          deleteClient(clientId).catch(error => {
            console.error(`Error deleting client ${clientId}:`, error);
            throw error; // Re-throw to trigger the catch block
          })
        )
      );
      
      // Refresh the client list after successful deletion
      await refetch();
      
      // Clear the selection
      setSelectedRows(new Set());
      
      // Show success message
      toast.success(`${selectedRows.size} client(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting clients:', error);
      toast.error('Failed to delete selected clients. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSort = (field: string) => {
    if (field !== 'name') return; // Only allow sorting by name
    
    setSortConfig(prevConfig => {
      // If clicking the same column, toggle the order
      if (prevConfig.field === field) {
        return {
          field,
          order: prevConfig.order === 'asc' ? 'desc' : 'asc'
        };
      }
      // If clicking a different column, set to ascending by default
      return {
        field,
        order: 'asc'
      };
    });
    
    setCurrentPage(1); // Reset to first page when sorting changes
  };
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
  const [pageSize, setPageSize] = useState<number>(12); // Default to 10 per page

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

   const { data: allClients = [], isLoading, isRefetching, refetch } = useQuery<Client[]>({
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
    if (!canModifyClients) return;
    setPendingChange({ clientId, stage: newStage });
    setTimeout(() => {
      setShowConfirmDialog(true);
    }, 0);
  };

  const handleStageStatusChange = (clientId: string, newStatus: ClientStageStatus) => {
    if (!canModifyClients) return;
    setPendingStatusChange({ clientId, status: newStatus });
    setTimeout(() => {
      setShowStatusConfirmDialog(true);
    }, 0);
  };

  const { pagedClients, totalClientsCalc, totalPagesCalc } = useMemo(() => {
    let result: Client[] = isLoading ? [] : (allClients ?? []);

    // Apply new sheet filters
    const nameQ = filterName.trim().toLowerCase();
    const indQ = filterIndustry.trim().toLowerCase();
    const locQ = filterLocation.trim().toLowerCase();
    const stagesQ = filterStages;

    if (nameQ) {
      result = result.filter((client: Client) => client.name.toLowerCase().includes(nameQ));
    }
    if (indQ) {
      result = result.filter((client: Client) => client.industry.toLowerCase().includes(indQ));
    }
    if (locQ) {
      result = result.filter((client: Client) => (client.countryOfBusiness || "").toLowerCase().includes(locQ));
    }
    if (stagesQ.length > 0) {
      result = result.filter((client: Client) => stagesQ.includes(client.clientStage));
    }

    // Keep existing maxAge text filter if used
    if (filters.maxAge) {
      const maxAgeMonths = parseInt(filters.maxAge);
      if (!isNaN(maxAgeMonths)) {
        result = result.filter((client: Client) => calculateAge(client.createdAt) <= maxAgeMonths);
      }
    }

    // Apply sorting only if sortConfig is for name
    if (sortConfig.field === 'name') {
      result.sort((a, b) => {
        const aValue = a.name.toLowerCase();
        const bValue = b.name.toLowerCase();
        
        if (aValue < bValue) {
          return sortConfig.order === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    const totalClientsCalc = result.length;
    const totalPagesCalcRaw = Math.ceil(totalClientsCalc / pageSize);
    const totalPagesCalc = totalPagesCalcRaw > 0 ? totalPagesCalcRaw : 1;

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalClientsCalc);
    const pagedClients = result.slice(startIndex, endIndex);

    return { pagedClients, totalClientsCalc, totalPagesCalc };
  }, [
    sortConfig,
    filters, // includes maxAge
    allClients,
    currentPage,
    pageSize,
    isLoading,
    filterName,
    filterIndustry,
    filterLocation,
    filterStages,
  ]);

  // Reset to first page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterName, filterIndustry, filterLocation, filterStages, filters.maxAge]);

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

  if (!canViewClients) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-muted-foreground">You do not have permission to view clients.</div>
      </div>
    );
  }

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
          initialLoading={isLoading || isRefetching}
          heading="Clients"
          buttonText="Create Client"
          showCreateButton={canModifyClients}
          onRefresh={() => refetch()}
          selectedCount={selectedRows.size}
          onDelete={handleDeleteSelected}
          isFilterActive={Boolean(filterName || filterIndustry || filterLocation || filterStages.length > 0)}
          filterCount={(filterName ? 1 : 0) + (filterIndustry ? 1 : 0) + (filterLocation ? 1 : 0) + (filterStages.length > 0 ? 1 : 0)}
        />

        {/* Table */}

        <div className="flex-1 flex flex-col min-h-0 border-t">
          <div className="flex-1 overflow-auto" style={{ maxHeight: "calc(100vh - 30px)" }}>
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 z-20 bg-white">
                  <TableHead className="w-12 px-4">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={selectedRows.size > 0 && selectedRows.size === pagedClients.length}
                        onCheckedChange={()=>toggleSelectAll()}
                       className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-slate-100 data-[state=checked]:text-blue-600 data-[state=checked]:border-blue-600 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[200px]">Name</TableHead>
                  <TableHead className="min-w-[150px]">Industry</TableHead>
                  <TableHead className="min-w-[150px]">Location</TableHead>
                  <TableHead className="min-w-[120px]">Stage</TableHead>
                  <TableHead className="min-w-[150px]">Stage Status</TableHead>
                  <TableHead className="min-w-[120px]">Client Age</TableHead>
                  <TableHead className="min-w-[100px]">Job Count</TableHead>
                </TableRow>
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
                    <TableRow 
                      key={client.id ?? client._id}
                      className={`hover:bg-muted/50 cursor-pointer ${selectedRows.has(client.id) ? 'bg-blue-50' : ''}`}
                    >
                      <TableCell className="px-4 py-2 w-12">
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={selectedRows.has(client.id)}
                            onCheckedChange={() => toggleRowSelection(client.id)}
                            className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-slate-100 data-[state=checked]:text-blue-600 data-[state=checked]:border-blue-600 focus-visible:ring-indigo-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableCell>
                      <ClientTableRow
                        key={client.id}
                        client={client}
                        onStageChange={handleStageChange}
                        onStatusChange={handleStageStatusChange}
                        getYearDifference={getYearDifference}
                        canModify={canModifyClients}
                      />
                    </TableRow>
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

        {canModifyClients && <CreateClientModal open={open} onOpenChange={setOpen} />}
        
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDeleteSelected}
          title={`Delete ${selectedRows.size} client(s)?`}
          description={`Are you sure you want to delete ${selectedRows.size} selected client(s)? This action cannot be undone.`}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          isDeleting={isDeleting}
        />

        <ClientsFilter
          open={filterOpen}
          onOpenChange={setFilterOpen}
          name={filterName}
          onNameChange={setFilterName}
          industry={filterIndustry}
          onIndustryChange={setFilterIndustry}
          location={filterLocation}
          onLocationChange={setFilterLocation}
          selectedStages={filterStages as any}
          onStagesChange={setFilterStages as any}
          onApply={() => setFilterOpen(false)}
          onClear={() => {
            setFilterName("");
            setFilterIndustry("");
            setFilterLocation("");
            setFilterStages([]);
          }}
        />
      </div>
    </>
  );
}
