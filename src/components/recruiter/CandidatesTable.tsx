import React from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CandidateItem {
  id: string
  name: string
  email: string
  phone: string
  location: string
  currentStage: string
  status: string
  resume?: string
}

export default function CandidatesTable({ candidates }: { candidates: CandidateItem[] }) {
  const statusVariant = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("hired")) return "default"
    if (s.includes("active") || s.includes("screen")) return "secondary"
    if (s.includes("drop") || s.includes("reject")) return "destructive"
    return "outline"
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name || "—"}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{c.email || "—"}</span>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{c.phone || "—"}</span>
              </TableCell>
              <TableCell>{c.location || "—"}</TableCell>
              <TableCell>{c.currentStage || "—"}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(c.status) as any}>{c.status || "—"}</Badge>
              </TableCell>
              <TableCell>
                {c.resume ? (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    View
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">No resume</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}