"use client"

import { TabsTrigger } from "@/components/ui/tabs"
import { LucideProps } from "lucide-react"
import { ComponentType } from "react"

interface JobTabTriggerProps {
  value: string
  icon: ComponentType<LucideProps>
  label: string
  count?: number
}

export function JobTabTrigger({ value, icon: Icon, label, count }: JobTabTriggerProps) {
  return (
    <TabsTrigger 
      value={value}
      className="data-[state=active]:bg-background relative h-12 rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-3 font-semibold text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground"
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
      {count !== undefined && (
        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
          {count}
        </span>
      )}
    </TabsTrigger>
  )
}