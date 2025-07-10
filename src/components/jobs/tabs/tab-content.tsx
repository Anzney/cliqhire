"use client"

import { TabsContent } from "@/components/ui/tabs"
import { ReactNode } from "react"

interface JobTabContentProps {
  value: string
  children: ReactNode
}

export function JobTabContent({ value, children }: JobTabContentProps) {
  return (
    <TabsContent value={value} className="border-none p-0 ">
      {children}
    </TabsContent>
  )
}