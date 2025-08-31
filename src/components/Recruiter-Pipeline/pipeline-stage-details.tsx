"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Link, 
  FileText, 
  CheckCircle,
  XCircle,
  Users,
  MessageSquare,
  Target,
  Award,
  Building,
  GraduationCap,
  Languages,
  Briefcase,
  DollarSign,
  Globe,
  Clock3,
  CalendarDays,
  FileCheck,
  FileX,
  Edit3,
  Save,
  X,
  CalendarIcon,
  Loader2
} from "lucide-react";
import { pipelineStages } from "./dummy-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RecruiterPipelineService } from "@/services/recruiterPipelineService";
import { toast } from "sonner";

interface PipelineStageDetailsProps {
  candidate: any;
  selectedStage?: string;
  onStageSelect?: (stage: string) => void;
  onUpdateCandidate?: (updatedCandidate: any) => void;
  pipelineId?: string;
}

interface StageField {
  key: string;
  label: string;
  value: string | number | null;
  icon: React.ReactNode;
  color: string;
  type: 'text' | 'date' | 'datetime' | 'select' | 'textarea' | 'url' | 'rating';
  options?: string[];
  placeholder?: string;
}

// Helper function to parse date string to Date object
const parseDateString = (dateString: string): Date | undefined => {
  if (!dateString || dateString === "Not set") return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
};

// Helper function to format date for display
const formatDateForDisplay = (dateString: string): string => {
  if (!dateString || dateString === "Not set") return "Not set";
  const date = parseDateString(dateString);
  return date ? format(date, "PPP") : "Not set";
};

// Helper function to format datetime for input (YYYY-MM-DDTHH:mm)
const formatDateTimeForInput = (dateTimeString: string): string => {
  if (!dateTimeString || dateTimeString === "Not set") return "";
  const date = parseDateString(dateTimeString);
  return date ? format(date, "yyyy-MM-dd'T'HH:mm") : "";
};

const getStageFields = (stage: string, candidate: any): StageField[] => {
  // Helper function to get stage-specific data
  const getStageData = (stageName: string) => {
    const stageKey = stageName.toLowerCase().replace(/\s+/g, '');
    const stageData = candidate[stageKey] || {};
    return stageData;
  };

  // Helper function to format date from API response
  const formatApiDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd");
    } catch {
      return "Not set";
    }
  };

  // Helper function to format datetime from API response
  const formatApiDateTime = (dateTimeString: string | null | undefined): string => {
    if (!dateTimeString) return "Not set";
    try {
      const date = new Date(dateTimeString);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "Not set";
    }
  };

  switch (stage) {
    case "Sourcing":
      const sourcingData = getStageData("Sourcing");
      return [
        {
          key: "sourcingDate",
          label: "Sourcing Date",
          value: formatApiDate(sourcingData.sourcingDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "date"
        },
        {
          key: "connection",
          label: "Connection",
          value: sourcingData.connection || "Not set",
          icon: <Users className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "select",
          options: ["LinkedIn", "Indeed", "Referral", "Direct", "Other"]
        },
        {
          key: "referredBy",
          label: "Referred By",
          value: sourcingData.referredBy || "Not set",
          icon: <User className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600",
          type: "text",
          placeholder: "Enter referrer name"
        },
        {
          key: "source",
          label: "Source",
          value: sourcingData.source || "Not set",
          icon: <Target className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600",
          type: "text",
          placeholder: "Enter source"
        },
        {
          key: "sourcingRating",
          label: "Sourcing Rating",
          value: sourcingData.sourcingRating?.toString() || "Not set",
          icon: <Star className="h-4 w-4" />,
          color: "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["1", "2", "3", "4", "5"]
        },
        {
          key: "outreachChannel",
          label: "Outreach Channel",
          value: sourcingData.outreachChannel || "Not set",
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-indigo-50 text-indigo-600",
          type: "select",
          options: ["Email", "Phone", "LinkedIn Message", "WhatsApp", "Other"]
        },
        {
          key: "sourcingDueDate",
          label: "Sourcing Due Date",
          value: formatApiDate(sourcingData.sourcingDueDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-red-50 text-red-600",
          type: "date"
        },
        {
          key: "followUpDateTime",
          label: "Follow-up Date & Time",
          value: formatApiDateTime(sourcingData.followUpDateTime),
          icon: <Clock3 className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600",
          type: "datetime"
        },
        {
          key: "notes",
          label: "Notes",
          value: sourcingData.notes || "Not set",
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-gray-50 text-gray-600",
          type: "textarea",
          placeholder: "Enter sourcing notes..."
        },
        {
          key: "status",
          label: "Status",
          value: sourcingData.status || "Not set",
          icon: sourcingData.status === "Completed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: sourcingData.status === "Completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Pending", "In Progress", "Completed"]
        }
      ];

    case "Screening":
      const screeningData = getStageData("Screening");
      return [
        {
          key: "screeningDate",
          label: "Screening Date",
          value: formatApiDate(screeningData.screeningDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "date"
        },
        {
          key: "aemsInterviewDate",
          label: "AEMS Interview Date",
          value: formatApiDateTime(screeningData.aemsInterviewDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "datetime"
        },
        {
          key: "screeningStatus",
          label: "Screening Status",
          value: screeningData.screeningStatus || "Not set",
          icon: screeningData.screeningStatus === "Complete" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: screeningData.screeningStatus === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Pending", "In Progress", "Complete"]
        },
        {
          key: "screeningRating",
          label: "Screening Rating",
          value: screeningData.screeningRating?.toString() || "Not set",
          icon: <Star className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600",
          type: "select",
          options: ["1", "2", "3", "4", "5"]
        },
        {
          key: "screeningFollowUpDate",
          label: "Follow-up Date",
          value: formatApiDate(screeningData.screeningFollowUpDate),
          icon: <Clock3 className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600",
          type: "date"
        },
        {
          key: "screeningDueDate",
          label: "Screening Due Date",
          value: formatApiDate(screeningData.screeningDueDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-red-50 text-red-600",
          type: "date"
        },
        {
          key: "screeningNotes",
          label: "Screening Notes",
          value: screeningData.screeningNotes || "Not set",
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-gray-50 text-gray-600",
          type: "textarea",
          placeholder: "Enter screening notes..."
        },
        {
          key: "technicalAssessment",
          label: "Technical Assessment",
          value: screeningData.technicalAssessment || "Not set",
          icon: <Target className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "text",
          placeholder: "Enter technical assessment"
        },
        {
          key: "softSkillsAssessment",
          label: "Soft Skills Assessment",
          value: screeningData.softSkillsAssessment || "Not set",
          icon: <User className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "text",
          placeholder: "Enter soft skills assessment"
        },
        {
          key: "overallRating",
          label: "Overall Rating",
          value: screeningData.overallRating?.toString() || "Not set",
          icon: <Star className="h-4 w-4" />,
          color: "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["1", "2", "3", "4", "5"]
        },
        {
          key: "feedback",
          label: "Feedback",
          value: screeningData.feedback || "Not set",
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600",
          type: "textarea",
          placeholder: "Enter feedback..."
        }
      ];

    case "Client Screening":
      const clientScreeningData = getStageData("Client Screening");
      return [
        {
          key: "clientScreeningDate",
          label: "Client Screening Date",
          value: formatApiDate(clientScreeningData.clientScreeningDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "date"
        },
        {
          key: "clientFeedback",
          label: "Client Feedback",
          value: clientScreeningData.clientFeedback || "Not set",
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "select",
          options: ["Pending", "In Progress", "Complete"]
        },
        {
          key: "clientRating",
          label: "Client Rating",
          value: clientScreeningData.clientRating?.toString() || "Not set",
          icon: <Star className="h-4 w-4" />,
          color: "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["1", "2", "3", "4", "5"]
        }
      ];

    case "Interview":
      const interviewData = getStageData("Interview");
      return [
        {
          key: "interviewDate",
          label: "Interview Date",
          value: formatApiDateTime(interviewData.interviewDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "datetime"
        },
        {
          key: "interviewStatus",
          label: "Interview Status",
          value: interviewData.interviewStatus || "Not set",
          icon: interviewData.interviewStatus === "Completed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: interviewData.interviewStatus === "Completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Scheduled", "Completed", "Cancelled", "Rescheduled"]
        },
        {
          key: "interviewRoundNo",
          label: "Interview Round No",
          value: interviewData.interviewRoundNo?.toString() || "Not set",
          icon: <Target className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600",
          type: "select",
          options: ["1", "2", "3", "4", "5"]
        },
        {
          key: "interviewReschedules",
          label: "No. of Interview Reschedules",
          value: interviewData.interviewReschedules?.toString() || "Not set",
          icon: <Clock3 className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600",
          type: "select",
          options: ["0", "1", "2", "3", "4", "5"]
        },
        {
          key: "interviewMeetingLink",
          label: "Interview Meeting Link",
          value: interviewData.interviewMeetingLink || "Not set",
          icon: <Link className="h-4 w-4" />,
          color: "bg-indigo-50 text-indigo-600",
          type: "url",
          placeholder: "https://meet.google.com/..."
        }
      ];

    case "Verification":
      const verificationData = getStageData("Verification");
      return [
        {
          key: "documents",
          label: "Documents",
          value: verificationData.documents || "Not set",
          icon: verificationData.documents === "Complete" ? <FileCheck className="h-4 w-4" /> : <FileText className="h-4 w-4" />,
          color: verificationData.documents === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Pending", "Complete", "In Progress"]
        },
        {
          key: "offerLetter",
          label: "Offer Letter",
          value: verificationData.offerLetter || "Not set",
          icon: verificationData.offerLetter === "Sent" ? <FileCheck className="h-4 w-4" /> : <FileX className="h-4 w-4" />,
          color: verificationData.offerLetter === "Sent" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600",
          type: "select",
          options: ["Not sent", "Sent", "Accepted", "Rejected"]
        },
        {
          key: "backgroundCheck",
          label: "Background Check",
          value: verificationData.backgroundCheck || "Not set",
          icon: verificationData.backgroundCheck === "Complete" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: verificationData.backgroundCheck === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Pending", "Complete", "Failed"]
        }
      ];

    case "Onboarding":
      const onboardingData = getStageData("Onboarding");
      return [
        {
          key: "onboardingStartDate",
          label: "Onboarding Start Date",
          value: formatApiDate(onboardingData.onboardingStartDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "date"
        },
        {
          key: "onboardingStatus",
          label: "Onboarding Status",
          value: onboardingData.onboardingStatus || "Not set",
          icon: onboardingData.onboardingStatus === "Complete" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: onboardingData.onboardingStatus === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Not Started", "In Progress", "Complete"]
        },
        {
          key: "trainingCompleted",
          label: "Training Completed",
          value: onboardingData.trainingCompleted || "Not set",
          icon: onboardingData.trainingCompleted === "Yes" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: onboardingData.trainingCompleted === "Yes" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Yes", "No", "In Progress"]
        }
      ];

    case "Hired":
      const hiredData = getStageData("Hired");
      return [
        {
          key: "hireDate",
          label: "Hire Date",
          value: formatApiDate(hiredData.hireDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "date"
        },
        {
          key: "contractType",
          label: "Contract Type",
          value: hiredData.contractType || "Not set",
          icon: <FileText className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "select",
          options: ["Full-time", "Part-time", "Contract", "Internship"]
        },
        {
          key: "finalSalary",
          label: "Salary",
          value: hiredData.finalSalary || "Not set",
          icon: <DollarSign className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600",
          type: "text",
          placeholder: "e.g., $75,000"
        }
      ];

    case "Disqualified":
      const disqualifiedData = getStageData("Disqualified");
      return [
        {
          key: "disqualificationDate",
          label: "Disqualification Date",
          value: formatApiDate(disqualifiedData.disqualificationDate),
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-red-50 text-red-600",
          type: "date"
        },
        {
          key: "disqualificationReason",
          label: "Reason",
          value: disqualifiedData.disqualificationReason || "Not set",
          icon: <XCircle className="h-4 w-4" />,
          color: "bg-red-50 text-red-600",
          type: "textarea",
          placeholder: "Enter disqualification reason..."
        },
        {
          key: "disqualificationFeedback",
          label: "Feedback",
          value: disqualifiedData.disqualificationFeedback || "Not set",
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600",
          type: "textarea",
          placeholder: "Enter detailed feedback..."
        }
      ];

    default:
      return [];
  }
};

// Date Picker Component
const DatePickerField = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void; 
}) => {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateString(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
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
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"));
            }
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

// DateTime Picker Component
const DateTimePickerField = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void; 
}) => {
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const selectedDate = parseDateString(value);
  const datePart = value.split('T')[0] || "";
  const timePart = value.split('T')[1] || "00:00";

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const newDatePart = format(date, "yyyy-MM-dd");
      onChange(`${newDatePart}T${timePart}`);
    }
    setDateOpen(false);
  };

  const handleTimeChange = (newTime: string) => {
    onChange(`${datePart}T${newTime}`);
  };

  return (
    <div className="space-y-2">
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
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
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Popover open={timeOpen} onOpenChange={setTimeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <Clock className="mr-2 h-4 w-4" />
            {timePart || "Pick a time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 24 }, (_, hour) => 
                Array.from({ length: 4 }, (_, minute) => {
                  const time = `${hour.toString().padStart(2, '0')}:${(minute * 15).toString().padStart(2, '0')}`;
                  return (
                    <Button
                      key={time}
                      variant={timePart === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        handleTimeChange(time);
                        setTimeOpen(false);
                      }}
                      className="text-xs"
                    >
                      {time}
                    </Button>
                  );
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const renderFieldInput = (
  field: StageField,
  value: string,
  onChange: (value: string) => void
) => {
  switch (field.type) {
    case "text":
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full"
        />
      );

    case "date":
      return <DatePickerField value={value} onChange={onChange} />;

    case "datetime":
      return <DateTimePickerField value={value} onChange={onChange} />;

    case "url":
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full"
        />
      );

    case "select":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "rating":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "textarea":
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full min-h-[80px]"
        />
      );

    default:
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full"
        />
      );
  }
};

export function PipelineStageDetails({ 
  candidate, 
  selectedStage, 
  onStageSelect,
  onUpdateCandidate,
  pipelineId
}: PipelineStageDetailsProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  if (!candidate) return null;
  
  // Use the currentStage from the API response, fallback to selectedStage or default
  const currentStage = candidate.currentStage || selectedStage || "Sourcing";
  

  
  const stageFields = getStageFields(currentStage, candidate);

  const handleEditField = (field: StageField) => {
    setEditingField(field.key);
    setEditValue(field.value?.toString() || "");
  };

  const handleSaveField = async (fieldKey: string) => {
    // Check if API integration is available
    const hasApiIntegration = pipelineId && candidate.id;
    
    if (!hasApiIntegration) {
      // Update locally only when API integration is not available
      console.warn("API integration not available - updating locally only");
      
      // Update local state - update the nested stage data
      const stageKey = currentStage.toLowerCase().replace(/\s+/g, '');
      const updatedCandidate = {
        ...candidate,
        [stageKey]: {
          ...candidate[stageKey],
          [fieldKey]: editValue
        }
      };
      onUpdateCandidate?.(updatedCandidate);
      
      toast.success("Field updated locally (API integration not available)");
      setEditingField(null);
      setEditValue("");
      return;
    }

    setIsUpdating(true);
    
    try {
      const currentStage = candidate.currentStage || selectedStage || "Sourcing";
      
      // Get existing stage data to preserve other fields
      const stageKey = currentStage.toLowerCase().replace(/\s+/g, '');
      const existingStageData = candidate[stageKey] || {};
      
      // Prepare the update data - only update the specific field, preserve others
      const updateData = {
        fields: {
          ...existingStageData, // Preserve all existing fields
          [fieldKey]: editValue // Update only the specific field
        },
        notes: `Updated ${fieldKey} to: ${editValue}`
      };

      // Call the API to update the field
      const response = await RecruiterPipelineService.updateStageFields(
        pipelineId,
        candidate.id,
        currentStage,
        updateData
      );

      if (response.success) {
        // Update local state - update the nested stage data
        const stageKey = currentStage.toLowerCase().replace(/\s+/g, '');
        const updatedCandidate = {
          ...candidate,
          [stageKey]: {
            ...candidate[stageKey],
            [fieldKey]: editValue
          }
        };
        onUpdateCandidate?.(updatedCandidate);
        
        toast.success("Field updated successfully");
        setEditingField(null);
        setEditValue("");
      } else {
        toast.error(response.error || "Failed to update field");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error("An error occurred while updating the field");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  // Check if API integration is available
  const hasApiIntegration = pipelineId && candidate.id;

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="h-5 w-5 text-blue-500 mr-2" />
              Stage Details: {currentStage}
            </CardTitle>
            {!hasApiIntegration && (
              <Badge variant="secondary" className="text-xs">
                Local Mode
              </Badge>
            )}
          </div>
          <Badge 
            variant="outline" 
            className={`${getStageColor(currentStage)} font-medium`}
          >
            {currentStage}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>

        
        {stageFields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stageFields.map((field, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow duration-200">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${field.color} shadow-sm`}>
                  {field.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{field.label}</p>
                    {editingField === field.key ? (
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveField(field.key)}
                          disabled={isUpdating}
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Save className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditField(field)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {editingField === field.key ? (
                    <div className="mt-2">
                      {renderFieldInput(field, editValue, setEditValue)}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 break-words">
                      {field.type === 'date' ? (
                        formatDateForDisplay(field.value?.toString() || "")
                      ) : typeof field.value === 'string' && field.value.startsWith('http') ? (
                        <a 
                          href={field.value} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                        >
                          View Link
                        </a>
                      ) : (
                        field.value || "Not set"
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No details available for this stage</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to get stage color (moved from dummy-data.ts)
const getStageColor = (stage: string) => {
  const colors = {
    "Sourcing": "bg-purple-100 text-purple-800 border-purple-200",
    "Screening": "bg-orange-100 text-orange-800 border-orange-200",
    "Client Screening": "bg-green-100 text-green-800 border-green-200",
    "Interview": "bg-blue-100 text-blue-800 border-blue-200",
    "Verification": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Onboarding": "bg-green-100 text-green-800 border-green-200",
    "Hired": "bg-red-100 text-red-800 border-red-200",
    "Disqualified": "bg-red-100 text-red-800 border-red-200"
  };
  return colors[stage as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};
