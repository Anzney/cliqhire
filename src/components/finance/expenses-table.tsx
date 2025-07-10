"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const expenses = [
  {
    id: "EXP-001",
    category: "Office Supplies",
    amount: 250.00,
    date: "2024-03-15",
    status: "Approved",
    submittedBy: "John Doe"
  },
  {
    id: "EXP-002",
    category: "Travel",
    amount: 1200.00,
    date: "2024-03-12",
    status: "Pending",
    submittedBy: "Jane Smith"
  },
  {
    id: "EXP-003",
    category: "Software Subscription",
    amount: 499.99,
    date: "2024-03-10",
    status: "Approved",
    submittedBy: "Mike Johnson"
  }
]

const statusColors = {
  Approved: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800"
}

export function ExpensesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Expense ID</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.id}</TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>${expense.amount.toFixed(2)}</TableCell>
            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
            <TableCell>{expense.submittedBy}</TableCell>
            <TableCell>
              <Badge 
                variant="secondary" 
                className={statusColors[expense.status as keyof typeof statusColors]}
              >
                {expense.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}