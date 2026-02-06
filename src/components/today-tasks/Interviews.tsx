import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Calendar,
  Clock,
  Video,
  ChevronDown,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { Interview } from "./types";

interface InterviewsProps {
  interviews: Interview[];
  onUpdateInterviewStatus: (interviewId: string, status: Interview['status']) => void;
}

export function Interviews({ interviews, onUpdateInterviewStatus }: InterviewsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isToday = (dateTime: string) => {
    const today = new Date();
    const interviewDate = new Date(dateTime);
    return today.toDateString() === interviewDate.toDateString();
  };

  // Filter interviews for today
  const todaysInterviews = interviews.filter(interview => isToday(interview.scheduledTime));

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

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTime: string) => {
    const d = new Date(dateTime);
    const day = d.getDate();
    const mon = d.toLocaleString('en-US', { month: 'short' });
    return `${day} ${mon}`;
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today Interviews
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Total: <span className="font-semibold text-gray-900">{todaysInterviews.length}</span></span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            {todaysInterviews.length > 0 ? (
              <div className="rounded-md border">
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Job & Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Meeting</TableHead>
                        <TableHead>Status</TableHead>
                        {/* <TableHead>Actions</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todaysInterviews.map((interview) => (
                        <TableRow key={interview.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <div className="font-semibold text-gray-900">{interview.candidateName}</div>
                              <div className="text-sm text-gray-600">{interview.candidateEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{interview.jobTitle}</div>
                              <div className="text-sm text-gray-600">{interview.clientName}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{formatDate(interview.scheduledTime)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{formatTime(interview.scheduledTime)}</div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            {interview.meetingLink ? (
                              <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                              >
                                <Video className="w-4 h-4" />
                                Join Meeting
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(interview.status)}>
                              {interview.status}
                            </Badge>
                          </TableCell>
                          {/* <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger className="hover:bg-gray-100 p-1 rounded">
                                <MoreHorizontal className="w-4 h-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => onUpdateInterviewStatus(interview.id, 'completed')}>
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onUpdateInterviewStatus(interview.id, 'rescheduled')}>
                                  Reschedule
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium">No interviews scheduled for today</p>
                <p className="text-sm">You are all caught up!</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
