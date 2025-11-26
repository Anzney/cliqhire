"use client";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export type StatusOption = "Pending" | "Accepted" | "Rejected"

const statusColors: Record<StatusOption, string> = {
  'Pending': "bg-yellow-100 text-yellow-800",
  'Accepted': "bg-green-100 text-green-800",
  'Rejected': "bg-red-100 text-red-800",
}

const statuses: StatusOption[] = [
  'Pending',
  'Accepted',
  'Rejected'
]

interface StatusBadgeProps {
  value: StatusOption
  onChange?: (newStatus: StatusOption) => void
  disabled?: boolean
  className?: string
}

export function StatusBadge({ value, onChange, disabled, className }: StatusBadgeProps) {

  const handleClick = (statusOption: StatusOption) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      if (onChange) {
        onChange(statusOption);
      }
    };
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="ghost"
          className={`h-auto p-0 hover:bg-transparent ${className || ""}`}
        >
          <Badge
            variant="secondary"
            className={`${statusColors[value]} border-none flex items-center gap-1`}
          >
            {value}
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
  )
}
