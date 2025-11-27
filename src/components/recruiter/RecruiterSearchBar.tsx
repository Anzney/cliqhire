"use client"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type RecruiterSearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RecruiterSearchBar({ value, onChange, placeholder }: RecruiterSearchBarProps) {
  return (
    <div className="relative w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search jobs, clients, or candidates"}
        className="pl-9"
      />
    </div>
  )
}

