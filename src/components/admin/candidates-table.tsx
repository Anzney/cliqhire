"use client"

import { MoreHorizontal, Mail, Phone, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface CandidatesTableProps {
  candidates?: any[]
  loading?: boolean
}

export function CandidatesTable({ candidates, loading }: CandidatesTableProps) {
  const router = useRouter()
  return (
    <Card className="border border-[hsl(var(--border))] shadow-sm rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]">
            <TableHead className="font-semibold text-[hsl(var(--muted-foreground))] h-12">Candidate</TableHead>
            <TableHead className="font-semibold text-[hsl(var(--muted-foreground))]">Expertise</TableHead>
            <TableHead className="font-semibold text-[hsl(var(--muted-foreground))]">Experience</TableHead>
            <TableHead className="font-semibold text-[hsl(var(--muted-foreground))]">Contact</TableHead>
            <TableHead className="text-right font-semibold text-[hsl(var(--muted-foreground))]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5} className="py-4"><Skeleton className="h-8 w-full" /></TableCell>
              </TableRow>
            ))
          ) : (
            candidates?.map((candidate) => (
              <TableRow key={candidate._id} className="hover:bg-[hsl(var(--muted))] border-[hsl(var(--border))] transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                     <Avatar className="h-8 w-8 rounded-md border border-[hsl(var(--border))]">
                        <AvatarFallback className="bg-[hsl(var(--primary))] text-white text-xs font-semibold">{candidate.name?.[0] || 'C'}</AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col">
                        <span className="font-semibold text-[hsl(var(--foreground))]">{candidate.name}</span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {candidate.currentLocation || "Location N/A"}
                        </span>
                     </div>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex flex-col items-start gap-1">
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">{candidate.educationDegree || "N/A"}</span>
                      <Badge variant="secondary" className="font-normal text-[10px] px-1.5 py-0 h-4">
                        {candidate.functionalArea || "General"}
                      </Badge>
                   </div>
                </TableCell>
                <TableCell>
                   <span className="text-sm font-medium text-[hsl(var(--foreground))]">{candidate.experience || 0} Years</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]" 
                        title={candidate.email}
                        onClick={() => candidate.email && (window.location.href = `mailto:${candidate.email}`)}
                     >
                        <Mail className="w-3.5 h-3.5" />
                     </Button>
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]" 
                        title={candidate.phone}
                        onClick={() => candidate.phone && (window.location.href = `tel:${candidate.phone}`)}
                     >
                        <Phone className="w-3.5 h-3.5" />
                     </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => router.push(`/candidates/${candidate._id}`)}>View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert("Note feature to be implemented")}>Add Note</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert("Interview scheduler to be implemented")}>Schedule Interview</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
