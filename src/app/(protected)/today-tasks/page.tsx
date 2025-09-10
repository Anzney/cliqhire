"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Phone,
  Video,
  MapPin,
  Briefcase,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Task Types and Interfaces
interface AssignedJob {
  id: string;
  jobTitle: string;
  clientName: string;
  location: string;
  priority: "high" | "medium" | "low";
  deadline: string;
  candidatesCount: number;
  status: "active" | "paused" | "completed";
  recruiter: string;
}

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  clientName: string;
  interviewType: "phone" | "video" | "in-person";
  scheduledTime: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  meetingLink?: string;
  location?: string;
  notes?: string;
}

interface PersonalTask {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  dueTime?: string;
  status: "pending" | "in-progress" | "completed";
  category: "follow-up" | "admin" | "research" | "meeting" | "other";
  createdAt: string;
  // Follow-up specific fields
  followUpType?: "cv-received" | "candidate-response" | "client-feedback" | "interview-scheduled" | "offer-sent" | "other";
  followUpStatus?: "pending" | "in-progress" | "completed";
  relatedCandidate?: string;
  relatedJob?: string;
  relatedClient?: string;
}

export default function TodayTasksPage() {
  // State management
  const [assignedJobs] = useState<AssignedJob[]>([
    {
      id: "1",
      jobTitle: "Senior Software Engineer",
      clientName: "TechCorp Solutions",
      location: "San Francisco, CA",
      priority: "high",
      deadline: "2024-01-15",
      candidatesCount: 8,
      status: "active",
      recruiter: "John Smith"
    },
    {
      id: "2", 
      jobTitle: "Product Manager",
      clientName: "InnovateLabs",
      location: "New York, NY",
      priority: "medium",
      deadline: "2024-01-20",
      candidatesCount: 5,
      status: "active",
      recruiter: "Sarah Johnson"
    },
    {
      id: "3",
      jobTitle: "UX Designer",
      clientName: "DesignStudio Pro",
      location: "Austin, TX",
      priority: "low",
      deadline: "2024-01-25",
      candidatesCount: 12,
      status: "paused",
      recruiter: "Mike Chen"
    }
  ]);

  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: "1",
      candidateName: "Alice Johnson",
      candidateEmail: "alice.johnson@email.com",
      candidatePhone: "+1 (555) 123-4567",
      jobTitle: "Senior Software Engineer",
      clientName: "TechCorp Solutions",
      interviewType: "video",
      scheduledTime: "2024-01-10T10:00:00",
      duration: 60,
      status: "scheduled",
      meetingLink: "https://meet.zoom.us/j/123456789",
      notes: "Technical interview focusing on React and Node.js"
    },
    {
      id: "2",
      candidateName: "Bob Smith",
      candidateEmail: "bob.smith@email.com", 
      candidatePhone: "+1 (555) 987-6543",
      jobTitle: "Product Manager",
      clientName: "InnovateLabs",
      interviewType: "phone",
      scheduledTime: "2024-01-10T14:30:00",
      duration: 45,
      status: "scheduled",
      notes: "Initial screening call"
    },
    {
      id: "3",
      candidateName: "Carol Davis",
      candidateEmail: "carol.davis@email.com",
      candidatePhone: "+1 (555) 456-7890",
      jobTitle: "UX Designer", 
      clientName: "DesignStudio Pro",
      interviewType: "in-person",
      scheduledTime: "2024-01-10T16:00:00",
      duration: 90,
      status: "scheduled",
      location: "DesignStudio Pro Office, Austin TX",
      notes: "Portfolio review and design challenge"
    }
  ]);

  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([
    {
      id: "1",
      title: "Check CV status for John Smith",
      description: "Follow up on CV submission for Senior Developer position at TechCorp",
      priority: "high",
      dueDate: "2024-01-10",
      dueTime: "10:00",
      status: "pending",
      category: "follow-up",
      followUpType: "cv-received",
      followUpStatus: "pending",
      relatedCandidate: "John Smith",
      relatedJob: "Senior Developer",
      relatedClient: "TechCorp",
      createdAt: "2024-01-09"
    },
    {
      id: "2",
      title: "Update job descriptions",
      description: "Review and update 5 job descriptions based on client feedback",
      priority: "high",
      dueDate: "2024-01-10",
      dueTime: "12:00",
      status: "in-progress",
      category: "admin",
      createdAt: "2024-01-08"
    },
    {
      id: "3",
      title: "Follow up on candidate response",
      description: "Check if Sarah Johnson has responded to our interview invitation",
      priority: "medium",
      dueDate: "2024-01-10",
      dueTime: "14:00",
      status: "pending",
      category: "follow-up",
      followUpType: "candidate-response",
      followUpStatus: "pending",
      relatedCandidate: "Sarah Johnson",
      relatedJob: "Product Manager",
      relatedClient: "InnovateLabs",
      createdAt: "2024-01-09"
    },
    {
      id: "4",
      title: "Research new sourcing channels",
      description: "Explore LinkedIn Recruiter alternatives and new job boards",
      priority: "low",
      dueDate: "2024-01-12",
      status: "pending",
      category: "research",
      createdAt: "2024-01-07"
    }
  ]);

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const completeTask = (taskId: string) => {
    setCompletedTasks(prev => new Set(prev).add(taskId));
    setPersonalTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' as const }
          : task
      )
    );
    
    // Auto-remove completed tasks after a short delay
    setTimeout(() => {
      setPersonalTasks(prev => prev.filter(task => task.id !== taskId));
      setCompletedTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }, 2000); // 2 second delay to show completion animation
  };

  const updateFollowUpStatus = (taskId: string, followUpStatus: "pending" | "in-progress" | "completed") => {
    if (followUpStatus === 'completed') {
      setCompletedTasks(prev => new Set(prev).add(taskId));
    }
    
    setPersonalTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, followUpStatus, status: followUpStatus === 'completed' ? 'completed' as const : task.status }
          : task
      )
    );
    
    // Auto-remove if marked as completed
    if (followUpStatus === 'completed') {
      setTimeout(() => {
        setPersonalTasks(prev => prev.filter(task => task.id !== taskId));
        setCompletedTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }, 2000);
    }
  };

  const deleteTask = (taskId: string) => {
    setPersonalTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const updateInterviewStatus = (interviewId: string, status: Interview['status']) => {
    setInterviews(prev =>
      prev.map(interview =>
        interview.id === interviewId
          ? { ...interview, status }
          : interview
      )
    );
  };

  // Filter functions
  const filteredPersonalTasks = personalTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const todayInterviews = interviews.filter(interview => {
    const interviewDate = new Date(interview.scheduledTime).toDateString();
    const today = new Date().toDateString();
    return interviewDate === today;
  });

  const upcomingInterviews = interviews.filter(interview => {
    const interviewDate = new Date(interview.scheduledTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return interviewDate > today && interviewDate <= tomorrow;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today's Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your assigned jobs, interviews, and personal tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Personal Task</DialogTitle>
              </DialogHeader>
              <AddTaskForm onClose={() => setNewTaskOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{assignedJobs.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{todayInterviews.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {personalTasks.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {personalTasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Assigned Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedJobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {job.jobTitle}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          {job.clientName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          {job.candidatesCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {formatDate(job.deadline)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Today's Interviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Interviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayInterviews.length > 0 ? (
              todayInterviews.map((interview) => (
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
                      onClick={() => updateInterviewStatus(interview.id, 'completed')}
                      disabled={interview.status === 'completed'}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateInterviewStatus(interview.id, 'rescheduled')}
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
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
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
      )}

      {/* Personal Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Tasks
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredPersonalTasks.length > 0 ? (
            filteredPersonalTasks.map((task) => (
              <div 
                key={task.id} 
                className={`border rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 ${
                  completedTasks.has(task.id) 
                    ? 'bg-green-50 border-green-200 opacity-75 transform scale-98' 
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => completeTask(task.id)}
                    className="mt-1 p-1 hover:bg-gray-200 rounded transition-colors"
                    disabled={task.status === 'completed'}
                  >
                    <CheckCircle 
                      className={`w-5 h-5 ${
                        task.status === 'completed' 
                          ? 'text-green-600' 
                          : 'text-gray-400 hover:text-green-600'
                      }`} 
                    />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${
                        task.status === 'completed' 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="capitalize">{task.category}</span>
                      {task.followUpType && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{task.followUpType.replace('-', ' ')}</span>
                        </>
                      )}
                      {task.dueDate && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(task.dueDate)}</span>
                            {task.dueTime && <span>at {task.dueTime}</span>}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Follow-up specific information */}
                    {task.category === 'follow-up' && task.relatedCandidate && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <div className="flex items-center gap-2 text-blue-700">
                          <User className="w-3 h-3" />
                          <span><strong>Candidate:</strong> {task.relatedCandidate}</span>
                          {task.relatedJob && <span>• <strong>Job:</strong> {task.relatedJob}</span>}
                          {task.relatedClient && <span>• <strong>Client:</strong> {task.relatedClient}</span>}
                        </div>
                      </div>
                    )}
                    
                    {/* Completion message */}
                    {completedTasks.has(task.id) && (
                      <div className="mt-2 p-2 bg-green-100 border border-green-200 rounded text-xs text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        <span>Task completed! Removing from list...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Follow-up status buttons for follow-up tasks */}
                    {task.category === 'follow-up' && task.followUpStatus && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={task.followUpStatus === 'pending' ? 'default' : 'outline'}
                          onClick={() => updateFollowUpStatus(task.id, 'pending')}
                          className="text-xs px-2 py-1 h-7"
                        >
                          Pending
                        </Button>
                        <Button
                          size="sm"
                          variant={task.followUpStatus === 'in-progress' ? 'default' : 'outline'}
                          onClick={() => updateFollowUpStatus(task.id, 'in-progress')}
                          className="text-xs px-2 py-1 h-7"
                        >
                          In Progress
                        </Button>
                        <Button
                          size="sm"
                          variant={task.followUpStatus === 'completed' ? 'default' : 'outline'}
                          onClick={() => updateFollowUpStatus(task.id, 'completed')}
                          className="text-xs px-2 py-1 h-7"
                        >
                          Completed
                        </Button>
                      </div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-medium">No personal tasks found</p>
              <p className="text-sm">
                {searchQuery ? 'Try adjusting your search criteria' : 'Add a new task to get started'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add Task Form Component
function AddTaskForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'other' as 'follow-up' | 'admin' | 'research' | 'meeting' | 'other',
    dueDate: '',
    dueTime: '',
    // Follow-up specific fields
    followUpType: 'other' as 'cv-received' | 'candidate-response' | 'client-feedback' | 'interview-scheduled' | 'offer-sent' | 'other',
    relatedCandidate: '',
    relatedJob: '',
    relatedClient: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the task to your backend
    console.log('New task:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description..."
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => 
            setFormData(prev => ({ ...prev, priority: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value: 'follow-up' | 'admin' | 'research' | 'meeting' | 'other') => 
            setFormData(prev => ({ ...prev, category: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Follow-up specific fields */}
      {formData.category === 'follow-up' && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900">Follow-up Details</h4>
          
          <div>
            <Label htmlFor="followUpType">Follow-up Type</Label>
            <Select value={formData.followUpType} onValueChange={(value: 'cv-received' | 'candidate-response' | 'client-feedback' | 'interview-scheduled' | 'offer-sent' | 'other') => 
              setFormData(prev => ({ ...prev, followUpType: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cv-received">CV Received</SelectItem>
                <SelectItem value="candidate-response">Candidate Response</SelectItem>
                <SelectItem value="client-feedback">Client Feedback</SelectItem>
                <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="offer-sent">Offer Sent</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="relatedCandidate">Related Candidate (Optional)</Label>
              <Input
                id="relatedCandidate"
                value={formData.relatedCandidate}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedCandidate: e.target.value }))}
                placeholder="Candidate name..."
              />
            </div>
            
            <div>
              <Label htmlFor="relatedJob">Related Job (Optional)</Label>
              <Input
                id="relatedJob"
                value={formData.relatedJob}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedJob: e.target.value }))}
                placeholder="Job title..."
              />
            </div>
            
            <div>
              <Label htmlFor="relatedClient">Related Client (Optional)</Label>
              <Input
                id="relatedClient"
                value={formData.relatedClient}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedClient: e.target.value }))}
                placeholder="Client name..."
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate">Due Date (Optional)</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          />
        </div>
        
        <div>
          <Label htmlFor="dueTime">Due Time (Optional)</Label>
          <Input
            id="dueTime"
            type="time"
            value={formData.dueTime}
            onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Task
        </Button>
      </div>
    </form>
  );
}
