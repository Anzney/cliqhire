import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface CandidatePaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalCandidates: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  handlePageChange: (page: number) => void;
  candidatesLength: number;
}

const CandidatePaginationControls: React.FC<CandidatePaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalCandidates,
  pageSize,
  setPageSize,
  handlePageChange,
  candidatesLength,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">
          Showing {candidatesLength > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {""}
          {Math.min(currentPage * pageSize, totalCandidates)} of {totalCandidates} candidates
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
              {["1000", "10", "25", "50", "100", "200"].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
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
          <ArrowLeft size={16} /> Previous
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

export default CandidatePaginationControls;
