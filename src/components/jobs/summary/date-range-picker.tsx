"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  open: boolean;
  onClose: () => void;
  currentValue?: string;
  initialTotalCVs?: number;
  onSave: (startDate: Date | undefined, endDate: Date | undefined, totalCVs: number | undefined) => void;
}

export function DateRangePicker({
  open,
  onClose,
  currentValue = "",
  initialTotalCVs,
  onSave,
}: DateRangePickerProps) {
  // Helper function to safely parse dates
  const parseDateSafely = (dateString: string): Date | undefined => {
    if (!dateString || dateString.trim() === "") return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    if (!currentValue || !currentValue.includes(" to ")) return undefined;
    const startDateStr = currentValue.split(" to ")[0];
    return parseDateSafely(startDateStr);
  });

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    if (!currentValue || !currentValue.includes(" to ")) return undefined;
    const endDateStr = currentValue.split(" to ")[1];
    return parseDateSafely(endDateStr);
  });

  const [totalCVs, setTotalCVs] = useState<string>(initialTotalCVs ? initialTotalCVs.toString() : "");

  // Update states when open/props change
  useEffect(() => {
    if (open) {
      if (currentValue && currentValue.includes(" to ")) {
        const [start, end] = currentValue.split(" to ");
        setStartDate(parseDateSafely(start));
        setEndDate(parseDateSafely(end));
      }
      setTotalCVs(initialTotalCVs ? initialTotalCVs.toString() : "");
    }
  }, [open, currentValue, initialTotalCVs]);

  const handleSave = () => {
    if (startDate && endDate) {
      const cvs = totalCVs ? parseInt(totalCVs) : undefined;
      onSave(startDate, endDate, cvs);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover modal={true} >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                    disabled={!startDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => date < new Date() || (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCVs">Total No. of CVs</Label>
              <Input
                id="totalCVs"
                type="number"
                min="0"
                placeholder="Enter total number of CVs"
                value={totalCVs}
                onChange={(e) => setTotalCVs(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!startDate || !endDate}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
