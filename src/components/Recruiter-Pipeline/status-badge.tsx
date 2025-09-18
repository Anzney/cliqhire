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
export type SourcingStatus = "Connections Sent" | "Connections Accepted" | "CV Received" | "Disqualified";
export type ScreeningStatus = "AEMS Interview" | "Submission Pending" | "CV Submitted" | "Disqualified";
export type ClientScreeningStatus = "Client Shortlisted" | "Disqualified";
export type InterviewStatus = "Client Interviewed" | "Client Selected" | "Disqualified";
export type VerificationStatus = "Document Pending" | "Document Verified" | "Offer Letter Sent" | "Offer Accepted" | "Offer Rejected" | "Disqualified";

export type StatusType = SourcingStatus | ScreeningStatus | ClientScreeningStatus | InterviewStatus | VerificationStatus;

// Status options for each stage
const statusOptions: Record<string, StatusType[]> = {
  "Sourcing": ["Connections Sent", "Connections Accepted", "CV Received", "Disqualified"],
  "Screening": ["AEMS Interview", "Submission Pending", "CV Submitted", "Disqualified"],
  "Client Review": ["Client Shortlisted", "Disqualified"],
  "Interview": ["Client Interviewed", "Client Selected", "Disqualified"],
  "Verification": ["Document Pending", "Document Verified", "Offer Letter Sent", "Offer Accepted", "Offer Rejected", "Disqualified"]
};

// Status colors
const statusColors: Record<StatusType, string> = {
  // Sourcing statuses
  "Connections Sent": "bg-blue-100 text-blue-800 border-blue-200",
  "Connections Accepted": "bg-green-100 text-green-800 border-green-200",
  "CV Received": "bg-purple-100 text-purple-800 border-purple-200",
  
  // Screening statuses
  "Submission Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "CV Submitted": "bg-green-100 text-green-800 border-green-200",
  "AEMS Interview": "bg-blue-100 text-blue-800 border-blue-200",
  
  // Client Review statuses
  "Client Shortlisted": "bg-green-100 text-green-800 border-green-200",
  
  // Interview statuses
  "Client Interviewed": "bg-blue-100 text-blue-800 border-blue-200",
  "Client Selected": "bg-green-100 text-green-800 border-green-200",
  
  // Verification statuses
  "Document Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Document Verified": "bg-green-100 text-green-800 border-green-200",
  "Offer Letter Sent": "bg-blue-100 text-blue-800 border-blue-200",
  "Offer Accepted": "bg-green-100 text-green-800 border-green-200",
  "Offer Rejected": "bg-red-100 text-red-800 border-red-200",
  
  // Disqualified status (available for all stages except Hired and Onboarding)
  "Disqualified": "bg-red-100 text-red-800 border-red-200"
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
                {statusOption === "Client Shortlisted" ? "Shortlisted" : statusOption}
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
        {status === "Client Shortlisted" ? "Shortlisted" : status}
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
            {status === "Client Shortlisted" ? "Shortlisted" : status}
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
              {statusOption === "Client Shortlisted" ? "Shortlisted" : statusOption}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
