import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ClientPaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalClients: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  handlePageChange: (page: number) => void;
  clientsLength: number;
}

const ClientPaginationControls: React.FC<ClientPaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalClients,
  pageSize,
  setPageSize,
  handlePageChange,
  clientsLength,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">
          Showing {clientsLength > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalClients)} of {totalClients} clients
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              const newSize = parseInt(value);
              setPageSize(newSize);
              handlePageChange(1); // Reset to page 1 when changing page size
            }}
          >
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">All</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">per page</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          
        >
          <ArrowLeft size={16}/> Previous
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ClientPaginationControls; 