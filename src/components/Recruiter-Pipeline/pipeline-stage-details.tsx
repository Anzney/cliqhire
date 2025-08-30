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
  CalendarIcon
} from "lucide-react";
import { pipelineStages } from "./dummy-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PipelineStageDetailsProps {
  candidate: any;
  selectedStage?: string;
  onStageSelect?: (stage: string) => void;
  onUpdateCandidate?: (updatedCandidate: any) => void;
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
  // Mock data for demonstration - in real app, this would come from the candidate object
  const mockData = {
    sourcingDate: "2024-01-15",
    connection: "LinkedIn",
    referredBy: "John Doe",
    screeningRating: "4.5/5",
    outreachChannel: "Email",
    sourcingDueDate: "2024-01-30",
    followUpDateTime: "2024-01-20 10:00 AM",
    screeningDate: "2024-01-18",
    aemsInterviewDate: "2024-01-25",
    screeningStatus: "Complete",
    screeningFollowUpDate: "2024-01-22",
    screeningDueDate: "2024-01-28",
    clientScreeningDate: "2024-02-01",
    clientFeedback: "Positive",
    clientRating: "4/5",
    interviewDate: "2024-02-05",
    interviewStatus: "Scheduled",
    interviewRoundNo: "1",
    interviewReschedules: "0",
    interviewMeetingLink: "https://meet.google.com/abc-defg-hij",
    documents: "Complete",
    offerLetter: "Sent",
    backgroundCheck: "Complete",
    onboardingStartDate: "2024-03-01",
    onboardingStatus: "In Progress",
    trainingCompleted: "Yes",
    hireDate: "2024-02-15",
    contractType: "Full-time",
    finalSalary: "$75,000",
    disqualificationDate: "2024-01-20",
    disqualificationReason: "Failed technical assessment",
    disqualificationFeedback: "Candidate did not meet technical requirements"
  };

  switch (stage) {
    case "Sourcing":
      return [
        {
          key: "sourcingDate",
          label: "Sourcing Date",
          value: candidate.sourcingDate || mockData.sourcingDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "date"
        },
        {
          key: "connection",
          label: "Connection",
          value: candidate.connection || mockData.connection,
          icon: <Users className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "select",
          options: ["LinkedIn", "Indeed", "Referral", "Direct", "Other"]
        },
        {
          key: "referredBy",
          label: "Referred By",
          value: candidate.referredBy || mockData.referredBy,
          icon: <User className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600",
          type: "text",
          placeholder: "Enter referrer name"
        },
        {
          key: "screeningRating",
          label: "Screening Rating",
          value: candidate.screeningRating || mockData.screeningRating,
          icon: <Star className="h-4 w-4" />,
          color: "bg-yellow-50 text-yellow-600",
          type: "rating",
          options: ["1/5", "2/5", "3/5", "4/5", "5/5"]
        },
        {
          key: "outreachChannel",
          label: "Outreach Channel",
          value: candidate.outreachChannel || mockData.outreachChannel,
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-indigo-50 text-indigo-600",
          type: "select",
          options: ["Email", "Phone", "LinkedIn Message", "WhatsApp", "Other"]
        },
        {
          key: "sourcingDueDate",
          label: "Sourcing Due Date",
          value: candidate.sourcingDueDate || mockData.sourcingDueDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-red-50 text-red-600",
          type: "date"
        },
        {
          key: "followUpDateTime",
          label: "Follow-up Date & Time",
          value: candidate.followUpDateTime || mockData.followUpDateTime,
          icon: <Clock3 className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600",
          type: "datetime"
        }
      ];

    case "Screening":
      return [
        {
          key: "screeningDate",
          label: "Screening Date",
          value: candidate.screeningDate || "Not set",
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "date"
        },
        {
          key: "aemsInterviewDate",
          label: "AEMS Interview Date",
          value: candidate.aemsInterviewDate || mockData.aemsInterviewDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "date"
        },
        {
          key: "screeningStatus",
          label: "Screening Status",
          value: candidate.screeningStatus || mockData.screeningStatus,
          icon: (candidate.screeningStatus || mockData.screeningStatus) === "Complete" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: (candidate.screeningStatus || mockData.screeningStatus) === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Pending", "Complete", "In Progress"]
        },
        {
          key: "screeningRating",
          label: "Screening Rating",
          value: candidate.screeningRating || mockData.screeningRating,
          icon: <Star className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600",
          type: "rating",
          options: ["1/5", "2/5", "3/5", "4/5", "5/5"]
        },
        {
          key: "screeningFollowUpDate",
          label: "Follow-up Date",
          value: candidate.screeningFollowUpDate || mockData.screeningFollowUpDate,
          icon: <Clock3 className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600",
          type: "date"
        },
        {
          key: "screeningDueDate",
          label: "Screening Due Date",
          value: candidate.screeningDueDate || mockData.screeningDueDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-red-50 text-red-600",
          type: "date"
        }
      ];

    case "Client Screening":
      return [
        {
          key: "clientScreeningDate",
          label: "Client Screening Date",
          value: candidate.clientScreeningDate || mockData.clientScreeningDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "date"
        },
        {
          key: "clientFeedback",
          label: "Client Feedback",
          value: candidate.clientFeedback || mockData.clientFeedback,
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "select",
          options: ["Positive", "Negative", "Neutral", "Pending"]
        },
        {
          key: "clientRating",
          label: "Client Rating",
          value: candidate.clientRating || mockData.clientRating,
          icon: <Star className="h-4 w-4" />,
          color: "bg-yellow-50 text-yellow-600",
          type: "rating",
          options: ["1/5", "2/5", "3/5", "4/5", "5/5"]
        }
      ];

    case "Interview":
      return [
        {
          key: "interviewDate",
          label: "Interview Date",
          value: candidate.interviewDate || mockData.interviewDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "date"
        },
        {
          key: "interviewStatus",
          label: "Interview Status",
          value: candidate.interviewStatus || mockData.interviewStatus,
          icon: (candidate.interviewStatus || mockData.interviewStatus) === "Completed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: (candidate.interviewStatus || mockData.interviewStatus) === "Completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Scheduled", "Completed", "Cancelled", "Rescheduled"]
        },
        {
          key: "interviewRoundNo",
          label: "Interview Round No",
          value: candidate.interviewRoundNo || mockData.interviewRoundNo,
          icon: <Target className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600",
          type: "select",
          options: ["1", "2", "3", "4", "5"]
        },
        {
          key: "interviewReschedules",
          label: "No. of Interview Reschedules",
          value: candidate.interviewReschedules || mockData.interviewReschedules,
          icon: <Clock3 className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600",
          type: "select",
          options: ["0", "1", "2", "3", "4", "5"]
        },
        {
          key: "interviewMeetingLink",
          label: "Interview Meeting Link",
          value: candidate.interviewMeetingLink || mockData.interviewMeetingLink,
          icon: <Link className="h-4 w-4" />,
          color: "bg-indigo-50 text-indigo-600",
          type: "url",
          placeholder: "https://meet.google.com/..."
        }
      ];

    case "Verification":
      return [
        {
          key: "documents",
          label: "Documents",
          value: candidate.documents || mockData.documents,
          icon: (candidate.documents || mockData.documents) === "Complete" ? <FileCheck className="h-4 w-4" /> : <FileText className="h-4 w-4" />,
          color: (candidate.documents || mockData.documents) === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Pending", "Complete", "In Progress"]
        },
        {
          key: "offerLetter",
          label: "Offer Letter",
          value: candidate.offerLetter || mockData.offerLetter,
          icon: (candidate.offerLetter || mockData.offerLetter) === "Sent" ? <FileCheck className="h-4 w-4" /> : <FileX className="h-4 w-4" />,
          color: (candidate.offerLetter || mockData.offerLetter) === "Sent" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600",
          type: "select",
          options: ["Not sent", "Sent", "Accepted", "Rejected"]
        },
        {
          key: "backgroundCheck",
          label: "Background Check",
          value: candidate.backgroundCheck || mockData.backgroundCheck,
          icon: (candidate.backgroundCheck || mockData.backgroundCheck) === "Complete" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: (candidate.backgroundCheck || mockData.backgroundCheck) === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Pending", "Complete", "Failed"]
        }
      ];

    case "Onboarding":
      return [
        {
          key: "onboardingStartDate",
          label: "Onboarding Start Date",
          value: candidate.onboardingStartDate || mockData.onboardingStartDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "date"
        },
        {
          key: "onboardingStatus",
          label: "Onboarding Status",
          value: candidate.onboardingStatus || "In Progress",
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "select",
          options: ["Not Started", "In Progress", "Complete"]
        },
        {
          key: "trainingCompleted",
          label: "Training Completed",
          value: candidate.trainingCompleted || mockData.trainingCompleted,
          icon: (candidate.trainingCompleted || mockData.trainingCompleted) === "Yes" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: (candidate.trainingCompleted || mockData.trainingCompleted) === "Yes" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600",
          type: "select",
          options: ["Yes", "No", "In Progress"]
        }
      ];

    case "Hired":
      return [
        {
          key: "hireDate",
          label: "Hire Date",
          value: candidate.hireDate || mockData.hireDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-green-50 text-green-600",
          type: "date"
        },
        {
          key: "contractType",
          label: "Contract Type",
          value: candidate.contractType || mockData.contractType,
          icon: <FileText className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600",
          type: "select",
          options: ["Full-time", "Part-time", "Contract", "Internship"]
        },
        {
          key: "finalSalary",
          label: "Salary",
          value: candidate.finalSalary || mockData.finalSalary,
          icon: <DollarSign className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600",
          type: "text",
          placeholder: "e.g., $75,000"
        }
      ];

    case "Disqualified":
      return [
        {
          key: "disqualificationDate",
          label: "Disqualification Date",
          value: candidate.disqualificationDate || mockData.disqualificationDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-red-50 text-red-600",
          type: "date"
        },
        {
          key: "disqualificationReason",
          label: "Reason",
          value: candidate.disqualificationReason || mockData.disqualificationReason,
          icon: <XCircle className="h-4 w-4" />,
          color: "bg-red-50 text-red-600",
          type: "textarea",
          placeholder: "Enter disqualification reason..."
        },
        {
          key: "disqualificationFeedback",
          label: "Feedback",
          value: candidate.disqualificationFeedback || mockData.disqualificationFeedback,
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
  onUpdateCandidate
}: PipelineStageDetailsProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  
  if (!candidate) return null;
  
  const currentStage = selectedStage || candidate.currentStage;
  const stageFields = getStageFields(currentStage, candidate);

  const handleEditField = (field: StageField) => {
    setEditingField(field.key);
    setEditValue(field.value?.toString() || "");
  };

  const handleSaveField = (fieldKey: string) => {
    const updatedCandidate = {
      ...candidate,
      [fieldKey]: editValue
    };
    onUpdateCandidate?.(updatedCandidate);
    setEditingField(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="h-5 w-5 text-blue-500 mr-2" />
            Stage Details: {currentStage}
          </CardTitle>
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
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
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
