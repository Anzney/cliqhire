"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
}

export const HeadhunterCandidatesTable: React.FC<HeadhunterCandidatesTableProps> = ({
  candidates,
  onViewResume,
  onAction,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Action</TableHead>
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
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewResume?.(c)}
                    disabled={!c.resumeUrl}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAction?.(c)}
                  >
                    View
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