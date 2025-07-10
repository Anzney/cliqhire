"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const invoices = [
  {
    id: "INV-001",
    client: "Acme Corp",
    amount: 5000.00,
    date: "2024-03-15",
    status: "Paid",
    dueDate: "2024-04-15"
  },
  {
    id: "INV-002",
    client: "TechStart Inc",
    amount: 3500.00,
    date: "2024-03-10",
    status: "Pending",
    dueDate: "2024-04-10"
  },
  {
    id: "INV-003",
    client: "Global Solutions",
    amount: 7500.00,
    date: "2024-03-05",
    status: "Overdue",
    dueDate: "2024-04-05"
  }
]

const statusColors = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-800"
}

export function InvoicesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.client}</TableCell>
            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
            <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge 
                variant="secondary" 
                className={statusColors[invoice.status as keyof typeof statusColors]}
              >
                {invoice.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}