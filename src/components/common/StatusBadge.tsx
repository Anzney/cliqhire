"use client"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Check } from "lucide-react"

export type StatusOption = "Pending" | "Accepted" | "Rejected"

type StatusBadgeProps = {
  value: StatusOption
  onChange?: (next: StatusOption) => void
  disabled?: boolean
  className?: string
}

const styles: Record<StatusOption, string> = {
  Pending: "text-yellow-600",
  Accepted: "text-green-600",
  Rejected: "text-red-600",
}

export function StatusBadge({ value, onChange, disabled, className }: StatusBadgeProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Badge variant="outline" className={`bg-gray-100 ${styles[value]} capitalize ${className || ""}`}>{value}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {(["Pending", "Accepted", "Rejected"] as StatusOption[]).map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange?.(opt)}
            className="flex items-center justify-between"
          >
            <span className="capitalize">{opt}</span>
            {value === opt && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

