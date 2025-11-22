"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface HeadhunterCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  resumeUrl?: string;
}

interface HeadhunterCandidatesTableProps {
  candidates: HeadhunterCandidate[];
  onViewResume?: (candidate: HeadhunterCandidate) => void;
  onAction?: (candidate: HeadhunterCandidate) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
}

export const HeadhunterCandidatesTable: React.FC<HeadhunterCandidatesTableProps> = ({
  candidates,
  onViewResume,
  onAction,
  selectedIds = new Set<string>(),
  onToggleSelect,
  onToggleSelectAll,
}) => {
  return (
    <div className="bg-white  shadow-sm h-[560px] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 z-20 bg-white">
          <TableRow className="bg-white">
            <TableHead className="w-12 px-4 sticky top-0 z-20 bg-white">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedIds.size > 0 && selectedIds.size === candidates.length}
                  onCheckedChange={() => onToggleSelectAll?.()}
                  className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-slate-100 data-[state=checked]:text-blue-600 data-[state=checked]:border-blue-600 focus-visible:ring-indigo-500"
                />
              </div>
            </TableHead>
            <TableHead className="text-xs uppercase text-muted-foreground font-medium sticky top-0 z-20 bg-white">Candidate Name</TableHead>
            <TableHead className="text-xs uppercase text-muted-foreground font-medium sticky top-0 z-20 bg-white">Email</TableHead>
            <TableHead className="text-xs uppercase text-muted-foreground font-medium sticky top-0 z-20 bg-white">Phone</TableHead>
            <TableHead className="text-xs uppercase text-muted-foreground font-medium sticky top-0 z-20 bg-white">Status</TableHead>
            <TableHead className="text-xs uppercase text-muted-foreground font-medium sticky top-0 z-20 bg-white">Resume</TableHead>
            <TableHead className="text-xs uppercase text-muted-foreground font-medium sticky top-0 z-20 bg-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                No candidates
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((c) => (
              <TableRow key={c.id} className={`${selectedIds.has(c.id) ? 'bg-blue-50' : ''}`}>
                <TableCell className="w-12 px-4">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedIds.has(c.id)}
                      onCheckedChange={() => onToggleSelect?.(c.id)}
                      className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-slate-100 data-[state=checked]:text-blue-600 data-[state=checked]:border-blue-600 focus-visible:ring-indigo-500"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium">{c.name}</TableCell>
                <TableCell className="text-sm">{c.email}</TableCell>
                <TableCell className="text-sm">{c.phone}</TableCell>
                <TableCell className="text-sm">{c.status}</TableCell>
                <TableCell>
                  {c.resumeUrl ? (
                    <span
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => onViewResume?.(c)}
                    >
                      Resume
                    </span>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onAction?.(c)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};