import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, Video, MapPin, Calendar } from "lucide-react";
import { Interview } from "./types";

interface UpcomingInterviewsProps {
  upcomingInterviews: Interview[];
}

export function UpcomingInterviews({ upcomingInterviews }: UpcomingInterviewsProps) {
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

  if (upcomingInterviews.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Upcoming Interviews (Next 24 Hours)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingInterviews.map((interview) => (
            <div key={interview.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
                <Badge className={getStatusColor(interview.status)}>
                  {interview.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{interview.jobTitle}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(interview.scheduledTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getInterviewTypeIcon(interview.interviewType)}
                  <span className="capitalize">{interview.interviewType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
