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
  const [hour, setHour] = React.useState<string>("09");
  const [minute, setMinute] = React.useState<string>("00");
  const [interviewMode, setInterviewMode] = React.useState<"online" | "offline">("online");
  const [meetingLink, setMeetingLink] = React.useState<string>(initialMeetingLink);
  const [submitting, setSubmitting] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);

  const isValid = true;

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
        // Initialize 24-hour selectors
        const [hh, mm] = t.split(":");
        setHour((hh || "00").padStart(2, "0"));
        setMinute((mm || "00").padStart(2, "0"));
      }
    } else {
      setDate(undefined);
      setTime("00:00");
      setHour("09");
      setMinute("00");
    }
  }, [initialDateTime, isOpen]);

  React.useEffect(() => {
    setMeetingLink(initialMeetingLink || "");
    // If an initial meeting link is provided, default to online; otherwise keep current selection
    if (initialMeetingLink && initialMeetingLink.trim().length > 0) {
      setInterviewMode("online");
    }
  }, [initialMeetingLink, isOpen]);

  const handleConfirm = async () => {
    // Compose 24-hour HH:mm
    const hh = (hour || "00").padStart(2, "0");
    const mm = (minute || "00").padStart(2, "0");

    let composite = "";
    if (date) {
      const datePart = format(date, "yyyy-MM-dd");
      composite = `${datePart}T${hh}:${mm}`;
    }
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
            <label className="text-sm font-medium">Interview Type</label>
            <Select value={interviewMode} onValueChange={(v) => setInterviewMode(v as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online Interview</SelectItem>
                <SelectItem value="offline">Offline Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Interview Date</label>
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
            <label className="text-sm font-medium">Interview Time</label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Clock className="mr-2 h-4 w-4" />
                  {`${hour}:${minute}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-3" align="start">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Hour</div>
                    <Select value={hour} onValueChange={setHour}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
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
                        {['00', '15', '30', '45'].map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {interviewMode === "online" && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Meeting Link</label>
              <Input
                type="url"
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Saving..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
