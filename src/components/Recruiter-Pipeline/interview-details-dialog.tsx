"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface InterviewDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dateTime: string, meetingLink: string) => void;
  candidateName?: string;
  initialDateTime?: string;
  initialMeetingLink?: string;
}

export function InterviewDetailsDialog({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  initialDateTime = "",
  initialMeetingLink = "",
}: InterviewDetailsDialogProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState<string>("00:00");
  const [hour12, setHour12] = React.useState<string>("09");
  const [minute, setMinute] = React.useState<string>("00");
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM");
  const [meetingLink, setMeetingLink] = React.useState<string>(initialMeetingLink);
  const [submitting, setSubmitting] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);

  const isValid = Boolean(date) && Boolean(hour12) && Boolean(minute) && Boolean(period) && meetingLink.trim().length > 0;

  React.useEffect(() => {
    // Parse initialDateTime formatted like 'yyyy-MM-ddTHH:mm'
    if (initialDateTime) {
      const [d, t] = initialDateTime.split("T");
      if (d) {
        const parsed = new Date(d);
        if (!isNaN(parsed.getTime())) setDate(parsed);
      }
      if (t) {
        setTime(t);
        // Initialize 12-hour selectors
        const [hh, mm] = t.split(":");
        let h = parseInt(hh || "0", 10);
        const isPM = h >= 12;
        const h12 = h % 12 === 0 ? 12 : h % 12;
        setHour12(h12.toString().padStart(2, "0"));
        setMinute((mm || "00").padStart(2, "0"));
        setPeriod(isPM ? "PM" : "AM");
      }
    } else {
      setDate(undefined);
      setTime("00:00");
      setHour12("09");
      setMinute("00");
      setPeriod("AM");
    }
  }, [initialDateTime, isOpen]);

  React.useEffect(() => {
    setMeetingLink(initialMeetingLink || "");
  }, [initialMeetingLink, isOpen]);

  const handleConfirm = async () => {
    if (!isValid) return; // require all fields
    // Compose 24-hour HH:mm from 12-hour selections
    const h = parseInt(hour12, 10) % 12 + (period === "PM" ? 12 : 0);
    const hh = h.toString().padStart(2, "0");
    const mm = (minute || "00").padStart(2, "0");
    if (!date) return; // Type narrowing: ensure date is defined before formatting
    const datePart = format(date, "yyyy-MM-dd");
    const composite = `${datePart}T${hh}:${mm}`;
    setSubmitting(true);
    try {
      onConfirm(composite, meetingLink);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Interview Details</DialogTitle>
          <DialogDescription>
            Please provide Interview Date & Time and the meeting link{candidateName ? ` for ${candidateName}` : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Interview Date <span className="text-red-500">*</span></label>
            <Popover modal={true} open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    if (d) {
                      setDate(d);
                      setDateOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Interview Time <span className="text-red-500">*</span></label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Clock className="mr-2 h-4 w-4" />
                  {`${hour12}:${minute} ${period}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-3" align="start">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Hour</div>
                    <Select value={hour12} onValueChange={setHour12}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {Array.from({ length: 12 }, (_, i) => (i + 1)).map((h) => (
                          <SelectItem key={h} value={h.toString().padStart(2, "0")}>{h.toString().padStart(2, "0")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Minute</div>
                    <Select value={minute} onValueChange={setMinute}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['00','15','30','45'].map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">AM/PM</div>
                    <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Meeting Link <span className="text-red-500">*</span></label>
            <Input
              type="url"
              placeholder="https://meet.google.com/..."
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!isValid || submitting}>
            {submitting ? "Saving..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
