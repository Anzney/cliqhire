"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const statusColors: Record<string, string> = {
  'Active': "bg-green-100 text-green-800",
  'Working': "bg-blue-100 text-blue-800",
  'On Hold': "bg-orange-100 text-orange-800",
  'Inactive': "bg-gray-100 text-gray-800",
};

const statuses: string[] = [
  'Active',
  'Working',
  'On Hold',
];

interface TeamStatusBadgeProps {
  status: string;
  onStatusChange?: (newStatus: string) => void;
}

export function TeamStatusBadge({ status, onStatusChange }: TeamStatusBadgeProps) {
  const handleClick = (statusOption: string) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      if (onStatusChange) {
        onStatusChange(statusOption);
      } else {
        console.error("Cannot change status: onStatusChange is not provided");
      }
    };
  };

  // If no onStatusChange is provided, just show the badge without dropdown
  if (!onStatusChange) {
    return (
      <Badge 
        variant="secondary" 
        className={`${statusColors[status] || statusColors['Inactive']} border-none`}
      >
        {status || "Inactive"}
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
            className={`${statusColors[status] || statusColors['Inactive']} border-none flex items-center gap-1`}
          >
            {status || "Inactive"}
            <ChevronDown className="h-3 w-3" />
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {statuses.map((statusOption) => (
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
