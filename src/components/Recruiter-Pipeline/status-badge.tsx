"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// Define status types for each stage
export type SourcingStatus = "LinkedIn Connections Sent" | "LinkedIn Connections Accepted" | "CV Received";
export type ScreeningStatus = "AEMS Interview" | "Submission Pending" | "CV Submitted" ;
export type ClientScreeningStatus = "Client Shortlisted" | "Rejected by Client";
export type InterviewStatus = "Client Interviewed" | "Client Selected" | "Rejected by Client";
export type VerificationStatus = "Document Pending" | "Document Verified" | "Offer Letter Sent" | "Offer Accepted" | "Offer Rejected";

export type StatusType = SourcingStatus | ScreeningStatus | ClientScreeningStatus | InterviewStatus | VerificationStatus;

// Status options for each stage
const statusOptions: Record<string, StatusType[]> = {
  "Sourcing": ["LinkedIn Connections Sent", "LinkedIn Connections Accepted", "CV Received"],
  "Screening": ["AEMS Interview", "Submission Pending", "CV Submitted",],
  "Client Status": ["Client Shortlisted", "Rejected by Client"],
  "Interview": ["Client Interviewed", "Client Selected", "Rejected by Client"],
  "Verification": ["Document Pending", "Document Verified", "Offer Letter Sent", "Offer Accepted", "Offer Rejected"]
};

// Status colors
const statusColors: Record<StatusType, string> = {
  // Sourcing statuses
  "LinkedIn Connections Sent": "bg-blue-100 text-blue-800 border-blue-200",
  "LinkedIn Connections Accepted": "bg-green-100 text-green-800 border-green-200",
  "CV Received": "bg-purple-100 text-purple-800 border-purple-200",
  
  // Screening statuses
  "Submission Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "CV Submitted": "bg-green-100 text-green-800 border-green-200",
  "AEMS Interview": "bg-blue-100 text-blue-800 border-blue-200",
  
  // Client Status statuses
  "Client Shortlisted": "bg-green-100 text-green-800 border-green-200",
  "Rejected by Client": "bg-red-100 text-red-800 border-red-200",
  
  // Interview statuses
  "Client Interviewed": "bg-blue-100 text-blue-800 border-blue-200",
  "Client Selected": "bg-green-100 text-green-800 border-green-200",
  // "Rejected by Client": "bg-red-100 text-red-800 border-red-200",
  
  // Verification statuses
  "Document Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Document Verified": "bg-green-100 text-green-800 border-green-200",
  "Offer Letter Sent": "bg-blue-100 text-blue-800 border-blue-200",
  "Offer Accepted": "bg-green-100 text-green-800 border-green-200",
  "Offer Rejected": "bg-red-100 text-red-800 border-red-200"
};

interface StatusBadgeProps {
  status: StatusType | null;
  stage: string;
  onStatusChange?: (newStatus: StatusType) => void;
  isReadOnly?: boolean;
}

export function StatusBadge({ 
  status, 
  stage,
  onStatusChange, 
  isReadOnly = false 
}: StatusBadgeProps) {
  const availableStatuses = statusOptions[stage] || [];

  const handleClick = (statusOption: StatusType) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      if (onStatusChange) {
        onStatusChange(statusOption);
      }
    };
  };

  // If no status is set, show a placeholder
  if (!status) {
    if (isReadOnly) {
      return (
        <Badge 
          variant="secondary" 
          className="bg-gray-100 text-gray-500 border-gray-200"
        >
          Not set
        </Badge>
      );
    }

    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-auto p-0 hover:bg-transparent"
          >
            <Badge 
              variant="secondary" 
              className="bg-gray-100 text-gray-500 border-gray-200 flex items-center gap-1"
            >
              Set Status
              <ChevronDown className="h-3 w-3" />
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {availableStatuses.map((statusOption) => (
            <DropdownMenuItem
              key={statusOption}
              onClick={handleClick(statusOption)}
              className="flex items-center gap-2"
            >
              <Badge 
                variant="secondary" 
                className={`${statusColors[statusOption]} border-none`}
              >
                {statusOption}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If read-only, just show the badge without dropdown
  if (isReadOnly) {
    return (
      <Badge 
        variant="secondary" 
        className={`${statusColors[status]} border-none`}
      >
        {status}
      </Badge>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-auto p-0 hover:bg-transparent"
        >
          <Badge 
            variant="secondary" 
            className={`${statusColors[status]} border-none flex items-center gap-1`}
          >
            {status}
            <ChevronDown className="h-3 w-3" />
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {availableStatuses.map((statusOption) => (
          <DropdownMenuItem
            key={statusOption}
            onClick={handleClick(statusOption)}
            className="flex items-center gap-2"
          >
            <Badge 
              variant="secondary" 
              className={`${statusColors[statusOption]} border-none`}
            >
              {statusOption}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
