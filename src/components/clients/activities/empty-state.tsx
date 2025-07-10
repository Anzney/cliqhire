"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface EmptyStateProps {
  message: string
  onAdd?: () => void
}

export function EmptyState({ message, onAdd }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
      <span>{message}</span>
      <Button variant="outline" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  )
}