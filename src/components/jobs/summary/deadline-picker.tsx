"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DeadlinePickerProps {
  open: boolean;
  onClose: () => void;
  currentValue?: Date | undefined | string;
  onSave: (value: Date | null) => void;
}

export function DeadlinePicker({ open, onClose, currentValue = "", onSave }: DeadlinePickerProps) {
  // Helper function to safely parse dates
  const parseDateSafely = (dateString: string | Date | undefined): Date | undefined => {
    if (!dateString || (typeof dateString === "string" && dateString.trim() === "")) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() =>
    parseDateSafely(currentValue),
  );

  const handleSave = () => {
    if (selectedDate) {
      onSave(selectedDate);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Deadline</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Deadline (By Client)</Label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!selectedDate}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
