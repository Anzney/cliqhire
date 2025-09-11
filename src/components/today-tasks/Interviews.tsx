import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Phone,
  Video,
  MapPin,
  CheckCircle
} from "lucide-react";
import { Interview } from "./types";

interface InterviewsProps {
  interviews: Interview[];
  onUpdateInterviewStatus: (interviewId: string, status: Interview['status']) => void;
}

export function Interviews({ interviews, onUpdateInterviewStatus }: InterviewsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Interviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div key={interview.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
                  <p className="text-sm text-gray-600">{interview.jobTitle} at {interview.clientName}</p>
                </div>
                <Badge className={getStatusColor(interview.status)}>
                  {interview.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(interview.scheduledTime)} ({interview.duration} min)</span>
                </div>
                <div className="flex items-center gap-2">
                  {getInterviewTypeIcon(interview.interviewType)}
                  <span className="capitalize">{interview.interviewType} interview</span>
                </div>
                {interview.meetingLink && (
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <a 
                      href={interview.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
                {interview.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{interview.location}</span>
                  </div>
                )}
                {interview.notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <strong>Notes:</strong> {interview.notes}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onUpdateInterviewStatus(interview.id, 'completed')}
                  disabled={interview.status === 'completed'}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onUpdateInterviewStatus(interview.id, 'rescheduled')}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Reschedule
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">No interviews scheduled for today</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
