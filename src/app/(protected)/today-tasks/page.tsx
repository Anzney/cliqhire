"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// Import components
import { StatsOverview } from "@/components/today-tasks/StatsOverview";
import { AssignedJobs } from "@/components/today-tasks/AssignedJobs";
import { Interviews } from "@/components/today-tasks/Interviews";
import { PersonalTasks } from "@/components/today-tasks/PersonalTasks";
import { AddTaskForm } from "@/components/today-tasks/AddTaskForm";
import {
  AssignedJob,
  Interview,
  PersonalTask
} from "@/components/today-tasks/types";
import { JobStatus } from "@/components/today-tasks/StatusDropdown";
import { taskService } from "@/services/taskService";
import { useMyTasks } from "@/hooks/useMyTasks";

export default function TodayTasksPage() {
  const queryClient = useQueryClient();
  const { data: myTasksData, isLoading, error } = useMyTasks();

  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Derived state from query data
  const assignedJobs: AssignedJob[] = (myTasksData?.data.assignedJobs || []).map(job => ({
    id: job.id,
    jobTitle: job.position,
    clientName: job.clientName,
    candidatesCount: job.candidateCount,
    status: job.status === 'to-do' ? 'To-do' : job.status === 'inprogress' ? 'In Progress' : 'Completed',
    content: job.content,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    _id: job._id || job.id, // Fallback to id if _id is missing
    position: job.position,
    jobId: job.jobId,
    clientId: job.clientId,
  }));

  const personalTasks: PersonalTask[] = (myTasksData?.data.personalTasks || []).map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    priority: 'medium', // Default
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    status: task.status,
    category: task.category,
    createdAt: task.createdAt,
    followUpType: task.followUpType,
    followUpStatus: task.followUpStatus,
    relatedCandidate: task.relatedCandidate,
    relatedJob: task.relatedJob,
    relatedClient: task.relatedClient,
  }));

  const interviews: Interview[] = (myTasksData?.data.reminderTasks || []).map(task => ({
    id: task.id,
    candidateName: task.candidateName,
    candidateEmail: task.candidateEmail,
    candidatePhone: "", // Not provided
    jobTitle: task.jobTitle,
    clientName: task.clientName,
    interviewType: (task.interviewMeetingLinks && task.interviewMeetingLinks.length > 0) ? "video" : "in-person",
    scheduledTime: task.interviewDateTime,
    duration: 60, // Default duration
    status: "scheduled", // Default status map
    meetingLink: task.interviewMeetingLinks?.[0] || "",
    location: "",
    notes: ""
  }));

  // Handlers
  const handleCompleteTask = async (taskId: string) => {
    try {
      await taskService.completeTask(taskId);
      setCompletedTasks(prev => new Set(prev).add(taskId));

      // Auto-remove completed tasks from view
      setTimeout(() => {
        setCompletedTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
        queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      }, 2000);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleUpdateFollowUpStatus = async (taskId: string, followUpStatus: "pending" | "in-progress" | "completed") => {
    try {
      await taskService.updateFollowUpStatus(taskId, followUpStatus);
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });

      if (followUpStatus === 'completed') {
        setCompletedTasks(prev => new Set(prev).add(taskId));
        setTimeout(() => {
          setCompletedTasks(prev => {
            const newSet = new Set(prev);
            newSet.delete(taskId);
            return newSet;
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating follow-up status:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deletePersonalTask(taskId);
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateInterviewStatus = (interviewId: string, status: Interview['status']) => {
    // Since API doesn't seem to support updating interview status directly via a specific endpoint 
    // or the task service methods for interviews aren't explicitly clear on 'status' vs 'followUpStatus',
    // we might skip API call or implement if backend supports it. 
    // For now assuming optimistic local update only or log message.
    console.log("Update interview status TODO", interviewId, status);
    // If there's an endpoint for this, we'd call it here.
    // For now, no-op or we could try generic update if it was a task.
  };

  const handleJobStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      const apiStatus = newStatus === 'To-do' ? 'to-do' :
        newStatus === 'In Progress' ? 'inprogress' :
          'completed';

      await taskService.updateAssignedJobStatus(jobId, apiStatus);
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleAddTask = async (taskData: { title: string; description: string; category: string; dueDate: string }) => {
    try {
      await taskService.createPersonalTask({
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        category: taskData.category,
      });
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today&apos;s Tasks</h1>
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
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Personal Task</DialogTitle>
              </DialogHeader>
              <AddTaskForm
                onClose={() => setNewTaskOpen(false)}
                onSubmit={handleAddTask}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview
        assignedJobs={assignedJobs}
        todayInterviews={todayInterviews}
        personalTasks={personalTasks}
      />

      {/* Assigned Jobs - Full Width */}
      <AssignedJobs
        assignedJobs={assignedJobs}
        onStatusChange={handleJobStatusChange}
        loading={isLoading}
      />

      {/* Today's Interviews */}
      <Interviews
        interviews={todayInterviews}
        onUpdateInterviewStatus={updateInterviewStatus}
      />

      {/* Personal Tasks */}
      <PersonalTasks
        personalTasks={filteredPersonalTasks}
        completedTasks={completedTasks}
        searchQuery={searchQuery}
        loading={isLoading}
        onCompleteTask={handleCompleteTask}
        onUpdateFollowUpStatus={handleUpdateFollowUpStatus}
        onUpdateStatus={async (taskId: string, status: JobStatus) => {
          const apiStatus = status === 'To-do' ? 'to-do' :
            status === 'In Progress' ? 'inprogress' :
              'completed';

          try {
            await taskService.updatePersonalTaskStatus(taskId, apiStatus);
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
          } catch (error) {
            console.error('Error updating task status:', error);
          }
        }}
        onDeleteTask={handleDeleteTask}
      />

    </div>
  );
}
