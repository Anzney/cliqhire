"use client";
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

interface TabContentProps {
  value: string;
}

const headerArr = [
  "Candidate Name",
  "Job Position", 
  "Client Name",
  "Hiring Manager",
  "Action",
];

export const TabContent: React.FC<TabContentProps> = ({ value }) => {
  return (
    <TabsContent value={value} className="p-0 mt-0">
      <div className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              {headerArr.map((header, index) => (
                <TableHead key={index} className="text-sm font-medium">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={headerArr.length} className="h-[calc(100vh-240px)] text-center">
                <div className="py-24">
                  <div className="text-center">No candidates found in this stage</div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
};
