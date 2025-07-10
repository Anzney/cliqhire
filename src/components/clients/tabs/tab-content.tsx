"use client"

import { TabsContent } from "@/components/ui/tabs"
import { ReactNode } from "react"

interface ClientTabContentProps {
  value: string
  children: ReactNode
}

export function ClientTabContent({ value, children }: ClientTabContentProps) {
  return (
    <TabsContent value={value} className="border-none p-0 ">
      {children}
    </TabsContent>
  )
}