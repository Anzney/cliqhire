"use client";
import React from "react";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const SourcingHeader: React.FC = () => {
  const headerColumns = [
    "Job Position",
    "Client Name", 
    "Candidate Name",
    "Hiring Manager",
    "Team Lead",
    "No. of Recruiters",
    "Status",
    "Rating",
    "Action"
  ];

  return (
    <TableHeader>
      <TableRow>
        {headerColumns.map((header, index) => (
          <TableHead key={index} className="text-sm font-medium">
            {header}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
