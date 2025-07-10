"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SectionHeaderProps {
  title: string
  showAddButton?: boolean
  onAdd?: () => void
}

export function SectionHeader({ title, showAddButton, onAdd }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 bg-muted/30 px-4 py-2 rounded-sm">
      <h2 className="text-sm font-semibold">{title}</h2>
      {showAddButton && (
        <Button size="sm" variant="ghost" onClick={onAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}