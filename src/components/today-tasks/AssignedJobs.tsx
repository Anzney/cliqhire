import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Briefcase,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AssignedJob } from "./types";

interface AssignedJobsProps {
  assignedJobs: AssignedJob[];
}

export function AssignedJobs({ assignedJobs }: AssignedJobsProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Calculate job counts
  const totalJobs = assignedJobs.length;
  const activeJobs = assignedJobs.filter(job => job.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Assigned Jobs
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Total Job Count: <span className="font-semibold text-gray-900">{totalJobs}</span></span>
                <span>Total Active Job: <span className="font-semibold text-green-600">{activeJobs}</span></span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>AEMS Deadline</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableBody>
                    {assignedJobs.map((job) => (
                      <TableRow key={job.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {job.jobTitle}
                        </TableCell>
                        <TableCell>
                          {job.clientName}
                        </TableCell>
                        <TableCell>
                          {job.location}
                        </TableCell>
                        <TableCell>
                          {job.candidatesCount}
                        </TableCell>
                        <TableCell>
                          {formatDate(job.deadline)}
                        </TableCell>
                        <TableCell>
                          {job.aemsDeadline ? formatDate(job.aemsDeadline) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
