"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusOption } from "./StatusBadge"

interface StatusChangeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    status: StatusOption | null
    onConfirm: (data: { status: StatusOption; rejectionReason?: string; comments?: string }) => void
}

const REJECTION_REASONS = [
    "Skills mismatch",
    "Culture mismatch",
    "Salary expectations",
    "Better offer",
    "Not interested",
    "Other"
]

export function StatusChangeDialog({
    open,
    onOpenChange,
    status,
    onConfirm,
}: StatusChangeDialogProps) {
    const [rejectionReason, setRejectionReason] = useState<string>("")
    const [comments, setComments] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    // Reset state when dialog opens/closes or status changes
    useEffect(() => {
        if (open) {
            setRejectionReason("")
            setComments("")
            setError(null)
        }
    }, [open, status])

    const handleConfirm = () => {
        if (status === "Rejected" && !rejectionReason) {
            setError("Please select a rejection reason")
            return
        }

        if (status) {
            onConfirm({
                status,
                rejectionReason: status === "Rejected" ? rejectionReason : undefined,
                comments
            })
        }
    }

    if (!status) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Change Status to {status}</DialogTitle>
                    <DialogDescription>
                        Please provide details for this status change.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {status === "Rejected" && (
                        <div className="grid gap-2">
                            <Label htmlFor="reason" className="text-left">
                                Rejection Reason <span className="text-red-500">*</span>
                            </Label>
                            <Select value={rejectionReason} onValueChange={(val) => {
                                setRejectionReason(val)
                                setError(null)
                            }}>
                                <SelectTrigger id="reason" className={error ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {REJECTION_REASONS.map((reason) => (
                                        <SelectItem key={reason} value={reason}>
                                            {reason}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="comments" className="text-left">
                            {status === "Rejected" ? "Additional Comments" : "Comments"}
                        </Label>
                        <Textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Type your comments here..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
