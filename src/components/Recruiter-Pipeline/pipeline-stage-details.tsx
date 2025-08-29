"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
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
  FileX
} from "lucide-react";
import { pipelineStages } from "./dummy-data";

interface PipelineStageDetailsProps {
  candidate: any;
  selectedStage?: string;
  onStageSelect?: (stage: string) => void;
}

interface StageField {
  label: string;
  value: string | number | null;
  icon: React.ReactNode;
  color: string;
}

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
          label: "Sourcing Date",
          value: candidate.sourcingDate || mockData.sourcingDate,
          icon: <Calendar className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600"
        },
        {
          label: "Connection",
          value: candidate.connection || mockData.connection,
          icon: <Users className="h-4 w-4" />,
          color: "bg-green-50 text-green-600"
        },
        {
          label: "Referred By",
          value: candidate.referredBy || mockData.referredBy,
          icon: <User className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600"
        },
        {
          label: "Screening Rating",
          value: candidate.screeningRating || mockData.screeningRating,
          icon: <Star className="h-4 w-4" />,
          color: "bg-yellow-50 text-yellow-600"
        },
        {
          label: "Outreach Channel",
          value: candidate.outreachChannel || mockData.outreachChannel,
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-indigo-50 text-indigo-600"
        },
        {
          label: "Sourcing Due Date",
          value: candidate.sourcingDueDate || mockData.sourcingDueDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-red-50 text-red-600"
        },
        {
          label: "Follow-up Date & Time",
          value: candidate.followUpDateTime || mockData.followUpDateTime,
          icon: <Clock3 className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600"
        }
      ];

    case "Screening":
      return [
        {
          label: "Screening Date",
          value: candidate.screeningDate || "Not set",
          icon: <Calendar className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600"
        },
        {
          label: "AEMS Interview Date",
          value: candidate.aemsInterviewDate || mockData.aemsInterviewDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-green-50 text-green-600"
        },
        {
          label: "Screening Status",
          value: candidate.screeningStatus || mockData.screeningStatus,
          icon: (candidate.screeningStatus || mockData.screeningStatus) === "Complete" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: (candidate.screeningStatus || mockData.screeningStatus) === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
        },
        {
          label: "Screening Rating",
          value: candidate.screeningRating || mockData.screeningRating,
          icon: <Star className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600"
        },
        {
          label: "Follow-up Date",
          value: candidate.screeningFollowUpDate || mockData.screeningFollowUpDate,
          icon: <Clock3 className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600"
        },
        {
          label: "Screening Due Date",
          value: candidate.screeningDueDate || mockData.screeningDueDate,
          icon: <CalendarDays className="h-4 w-4" />,
          color: "bg-red-50 text-red-600"
        }
      ];

    case "Client Screening":
      return [
        {
          label: "Client Screening Date",
          value: candidate.clientScreeningDate || mockData.clientScreeningDate,
          icon: <Calendar className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600"
        },
        {
          label: "Client Feedback",
          value: candidate.clientFeedback || mockData.clientFeedback,
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-green-50 text-green-600"
        },
        {
          label: "Client Rating",
          value: candidate.clientRating || mockData.clientRating,
          icon: <Star className="h-4 w-4" />,
          color: "bg-yellow-50 text-yellow-600"
        }
      ];

    case "Interview":
      return [
        {
          label: "Interview Date",
          value: candidate.interviewDate || mockData.interviewDate,
          icon: <Calendar className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600"
        },
        {
          label: "Interview Status",
          value: candidate.interviewStatus || mockData.interviewStatus,
          icon: (candidate.interviewStatus || mockData.interviewStatus) === "Completed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: (candidate.interviewStatus || mockData.interviewStatus) === "Completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
        },
        {
          label: "Interview Round No",
          value: candidate.interviewRoundNo || mockData.interviewRoundNo,
          icon: <Target className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600"
        },
        {
          label: "No. of Interview Reschedules",
          value: candidate.interviewReschedules || mockData.interviewReschedules,
          icon: <Clock3 className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600"
        },
        {
          label: "Interview Meeting Link",
          value: candidate.interviewMeetingLink || mockData.interviewMeetingLink,
          icon: <Link className="h-4 w-4" />,
          color: "bg-indigo-50 text-indigo-600"
        }
      ];

    case "Verification":
      return [
        {
          label: "Documents",
          value: candidate.documents || mockData.documents,
          icon: (candidate.documents || mockData.documents) === "Complete" ? <FileCheck className="h-4 w-4" /> : <FileText className="h-4 w-4" />,
          color: (candidate.documents || mockData.documents) === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
        },
        {
          label: "Offer Letter",
          value: candidate.offerLetter || mockData.offerLetter,
          icon: (candidate.offerLetter || mockData.offerLetter) === "Sent" ? <FileCheck className="h-4 w-4" /> : <FileX className="h-4 w-4" />,
          color: (candidate.offerLetter || mockData.offerLetter) === "Sent" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        },
        {
          label: "Background Check",
          value: candidate.backgroundCheck || mockData.backgroundCheck,
          icon: (candidate.backgroundCheck || mockData.backgroundCheck) === "Complete" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: (candidate.backgroundCheck || mockData.backgroundCheck) === "Complete" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
        }
      ];

    case "Onboarding":
      return [
        {
          label: "Onboarding Start Date",
          value: candidate.onboardingStartDate || mockData.onboardingStartDate,
          icon: <Calendar className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600"
        },
        {
          label: "Onboarding Status",
          value: candidate.onboardingStatus || "In Progress",
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-50 text-green-600"
        },
        {
          label: "Training Completed",
          value: candidate.trainingCompleted || mockData.trainingCompleted,
          icon: (candidate.trainingCompleted || mockData.trainingCompleted) === "Yes" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
          color: (candidate.trainingCompleted || mockData.trainingCompleted) === "Yes" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
        }
      ];

    case "Hired":
      return [
        {
          label: "Hire Date",
          value: candidate.hireDate || mockData.hireDate,
          icon: <Calendar className="h-4 w-4" />,
          color: "bg-green-50 text-green-600"
        },
        {
          label: "Contract Type",
          value: candidate.contractType || mockData.contractType,
          icon: <FileText className="h-4 w-4" />,
          color: "bg-blue-50 text-blue-600"
        },
        {
          label: "Salary",
          value: candidate.finalSalary || mockData.finalSalary,
          icon: <DollarSign className="h-4 w-4" />,
          color: "bg-purple-50 text-purple-600"
        }
      ];

    case "Disqualified":
      return [
        {
          label: "Disqualification Date",
          value: candidate.disqualificationDate || mockData.disqualificationDate,
          icon: <Calendar className="h-4 w-4" />,
          color: "bg-red-50 text-red-600"
        },
        {
          label: "Reason",
          value: candidate.disqualificationReason || mockData.disqualificationReason,
          icon: <XCircle className="h-4 w-4" />,
          color: "bg-red-50 text-red-600"
        },
        {
          label: "Feedback",
          value: candidate.disqualificationFeedback || mockData.disqualificationFeedback,
          icon: <MessageSquare className="h-4 w-4" />,
          color: "bg-orange-50 text-orange-600"
        }
      ];

    default:
      return [];
  }
};

export function PipelineStageDetails({ 
  candidate, 
  selectedStage, 
  onStageSelect 
}: PipelineStageDetailsProps) {
  if (!candidate) return null;
  
  const currentStage = selectedStage || candidate.currentStage;
  const stageFields = getStageFields(currentStage, candidate);

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
        
        {/* Stage Navigation */}
        <div className="flex flex-wrap gap-2 mt-4">
          {pipelineStages.map((stage) => (
            <Button
              key={stage}
              variant={stage === currentStage ? "default" : "outline"}
              size="sm"
              onClick={() => onStageSelect?.(stage)}
              className={`text-xs font-medium transition-all duration-200 ${
                stage === currentStage 
                  ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm" 
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              {stage}
            </Button>
          ))}
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
                  <p className="text-sm font-medium text-gray-900 mb-1">{field.label}</p>
                  <p className="text-sm text-gray-600 break-words">
                    {typeof field.value === 'string' && field.value.startsWith('http') ? (
                      <a 
                        href={field.value} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                      >
                        View Link
                      </a>
                    ) : (
                      field.value
                    )}
                  </p>
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
