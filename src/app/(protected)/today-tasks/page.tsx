"use client";

import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";

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
import { 
  dummyInterviews 
} from "@/components/today-tasks/dummyData";
import { taskService, AssignedJobApiResponse } from "@/services/taskService";


export default function TodayTasksPage() {
  const { completeTask, updateFollowUpStatus } = useAuth();
  
  // State management - using real API data
  const [assignedJobs, setAssignedJobs] = useState<AssignedJob[]>([]);
  const [assignedJobsLoading, setAssignedJobsLoading] = useState(true);
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([]);
  const [personalTasksLoading, setPersonalTasksLoading] = useState(true);

  // Fetch assigned jobs and personal tasks when component mounts
  useEffect(() => {
    fetchAssignedJobs();
    fetchPersonalTasks();
  }, []); // Empty dependency array ensures this runs only once

  const fetchAssignedJobs = async () => {
    try {
      setAssignedJobsLoading(true);
      const apiJobs: AssignedJobApiResponse[] = await taskService.getAssignedJobs();
      
      // Transform API data to match AssignedJob interface
      const transformedJobs: AssignedJob[] = apiJobs.map(job => ({
        id: job.id,
        jobTitle: job.position,
        clientName: job.clientName,
        candidatesCount: job.candidateCount,
        status: job.status === 'to-do' ? 'To-do' : job.status === 'inprogress' ? 'In Progress' : 'Completed',
        content: job.content,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        _id: job._id,
        position: job.position,
        jobId: job.jobId,
        clientId: job.clientId,
      }));
      
      setAssignedJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching assigned jobs:', error);
      setAssignedJobs([]);
    } finally {
      setAssignedJobsLoading(false);
    }
  };

  const fetchPersonalTasks = async () => {
    try {
      setPersonalTasksLoading(true);
      const apiTasks = await taskService.getPersonalTasks();
      
      // Transform API data to match PersonalTask interface
      const transformedTasks: PersonalTask[] = apiTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: 'medium', // Default priority since API doesn't provide it
        dueDate: task.dueDate,
        dueTime: undefined, // Not provided by API
        status: task.status, // Keep the original API status format
        category: task.category,
        createdAt: task.createdAt,
        followUpType: undefined, // Not provided by API
        followUpStatus: undefined, // Not provided by API
        relatedCandidate: undefined, // Not provided by API
        relatedJob: undefined, // Not provided by API
        relatedClient: undefined, // Not provided by API
      }));
      
      setPersonalTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching personal tasks:', error);
      setPersonalTasks([]);
    } finally {
      setPersonalTasksLoading(false);
    }
  };

  const [interviews, setInterviews] = useState<Interview[]>(dummyInterviews);
  


  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      setCompletedTasks(prev => new Set(prev).add(taskId));
      
      
      // Auto-remove completed tasks from personal tasks after a short delay
      setTimeout(() => {
        setCompletedTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }, 2000); // 2 second delay to show completion animation
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleUpdateFollowUpStatus = async (taskId: string, followUpStatus: "pending" | "in-progress" | "completed") => {
    try {
      await updateFollowUpStatus(taskId, followUpStatus);
      
      if (followUpStatus === 'completed') {
        setCompletedTasks(prev => new Set(prev).add(taskId));
      }
      
      // Auto-remove if marked as completed
      if (followUpStatus === 'completed') {
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
      // Refresh personal tasks after deletion
      await fetchPersonalTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
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

  

  // Handler functions
  const handleJobStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      // Map the UI status to API status format
      const apiStatus = newStatus === 'To-do' ? 'to-do' : 
                       newStatus === 'In Progress' ? 'inprogress' : 
                       'completed';

      await taskService.updateAssignedJobStatus(jobId, apiStatus);
      
      // Update local state to reflect the change
      setAssignedJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error('Error updating job status:', error);
      // You might want to show a toast notification here
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
      
      // Refresh personal tasks after creating a new one
      await fetchPersonalTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

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
        loading={assignedJobsLoading}
      />

      {/* Today's Interviews */}
      <Interviews 
        interviews={todayInterviews}
        onUpdateInterviewStatus={updateInterviewStatus}
      />

      

      {/* Personal Tasks */}
      <PersonalTasks
        personalTasks={personalTasks}
        completedTasks={completedTasks}
        searchQuery={searchQuery}
        loading={personalTasksLoading}
        onCompleteTask={handleCompleteTask}
        onUpdateFollowUpStatus={handleUpdateFollowUpStatus}
        onUpdateStatus={async (taskId: string, status: JobStatus) => {
          // Map UI status to API status format
          const apiStatus = status === 'To-do' ? 'to-do' : 
                           status === 'In Progress' ? 'inprogress' : 
                           'completed';
          
          try {
            await taskService.updatePersonalTaskStatus(taskId, apiStatus);
            // Refresh personal tasks after status update
            await fetchPersonalTasks();
          } catch (error) {
            console.error('Error updating task status:', error);
          }
        }}
        onDeleteTask={handleDeleteTask}
      />

    </div>
  );
}
