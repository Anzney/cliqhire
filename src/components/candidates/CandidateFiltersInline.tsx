import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CandidateFilterState } from "@/components/candidates/CandidateFilters";

interface CandidateFiltersInlineProps {
  filters: CandidateFilterState;
  onChange: (next: CandidateFilterState) => void;
}

const CandidateFiltersInline: React.FC<CandidateFiltersInlineProps> = ({ filters, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        className="h-8 w-[160px]"
        placeholder="Name"
        value={filters.name}
        onChange={(e) => onChange({ ...filters, name: e.target.value })}
      />
      <Input
        className="h-8 w-[200px]"
        placeholder="Email"
        value={filters.email}
        onChange={(e) => onChange({ ...filters, email: e.target.value })}
      />
      <Select
        value={filters.status === "" ? "all" : filters.status}
        onValueChange={(val) => onChange({ ...filters, status: val === "all" ? "" : val })}
      >
        <SelectTrigger className="h-8 w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
          <SelectItem value="Shortlisted">Shortlisted</SelectItem>
          <SelectItem value="Interviewing">Interviewing</SelectItem>
          <SelectItem value="Offer">Offer</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
          <SelectItem value="Withdrawn">Withdrawn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CandidateFiltersInline;
