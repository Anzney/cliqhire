"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface EditDescriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDescription: string
  onSave: (description: string) => void
}

export function EditDescriptionModal({ 
  open, 
  onOpenChange, 
  currentDescription, 
  onSave 
}: EditDescriptionModalProps) {
  const [description, setDescription] = useState(currentDescription)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(description)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Description</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Client Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter client description"
                className="min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Description</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}