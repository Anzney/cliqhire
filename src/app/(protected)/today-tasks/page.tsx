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
import { UpcomingInterviews } from "@/components/today-tasks/UpcomingInterviews";
import { PersonalTasks } from "@/components/today-tasks/PersonalTasks";
import { CompletedTasks } from "@/components/today-tasks/CompletedTasks";
import { AddTaskForm } from "@/components/today-tasks/AddTaskForm";
import { 
  AssignedJob, 
  Interview, 
  PersonalTask, 
  AddTaskFormData 
} from "@/components/today-tasks/types";
import { 
  dummyAssignedJobs, 
  dummyInterviews, 
  dummyUpcomingInterviews,
  dummyPersonalTasks 
} from "@/components/today-tasks/dummyData";


export default function TodayTasksPage() {
  const { tasks, createTask, updateTask, deleteTask, completeTask, updateFollowUpStatus, fetchTasks } = useAuth();
  
  // Fetch tasks when component mounts (only once)
  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array ensures this runs only once
  
  // State management - using real API data
  const [assignedJobs] = useState<AssignedJob[]>(dummyAssignedJobs);

  const [interviews, setInterviews] = useState<Interview[]>(dummyInterviews);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>(dummyUpcomingInterviews);

  // Convert API tasks to PersonalTask format
  const personalTasks: PersonalTask[] = (tasks || []).map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
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

  const [completedTasksList, setCompletedTasksList] = useState<PersonalTask[]>([]);

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      setCompletedTasks(prev => new Set(prev).add(taskId));
      
      // Find the task and move it to completed list
      const taskToComplete = personalTasks.find(task => task.id === taskId);
      if (taskToComplete) {
        const completedTask = { ...taskToComplete, status: 'completed' as const };
        setCompletedTasksList(prev => [...prev, completedTask]);
      }
      
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
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };



  const restoreTask = (taskId: string) => {
    const taskToRestore = completedTasksList.find(task => task.id === taskId);
    if (taskToRestore) {
      const restoredTask = { ...taskToRestore, status: 'pending' as const };
      // Note: In a real app, you would call updateTask API here
      setCompletedTasksList(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const deleteCompletedTask = (taskId: string) => {
    setCompletedTasksList(prev => prev.filter(task => task.id !== taskId));
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

  const updateUpcomingInterviewStatus = (interviewId: string, status: Interview['status']) => {
    setUpcomingInterviews(prev =>
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

  // upcomingInterviews is now managed as separate state with dummyUpcomingInterviews

  // Handler functions
  const handleAddTask = async (taskData: AddTaskFormData) => {
    try {
      await createTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
        category: taskData.category,
        followUpType: taskData.category === 'follow-up' ? taskData.followUpType : undefined,
        relatedCandidate: taskData.relatedCandidate,
        relatedJob: taskData.relatedJob,
        relatedClient: taskData.relatedClient,
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

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
      <AssignedJobs assignedJobs={assignedJobs} />

      {/* Today's Interviews */}
      <Interviews 
        interviews={todayInterviews}
        onUpdateInterviewStatus={updateInterviewStatus}
      />

      {/* Upcoming Interviews */}
      <UpcomingInterviews 
        upcomingInterviews={upcomingInterviews}
        onUpdateInterviewStatus={updateUpcomingInterviewStatus}
      />

      {/* Personal Tasks */}
      <PersonalTasks
        personalTasks={personalTasks}
        completedTasks={completedTasks}
        filterPriority={filterPriority}
        searchQuery={searchQuery}
        onSetFilterPriority={setFilterPriority}
        onCompleteTask={handleCompleteTask}
        onUpdateFollowUpStatus={handleUpdateFollowUpStatus}
        onDeleteTask={handleDeleteTask}
      />

      {/* Completed Tasks */}
      <CompletedTasks
        completedTasks={completedTasksList}
        filterPriority={filterPriority}
        searchQuery={searchQuery}
        onSetFilterPriority={setFilterPriority}
        onRestoreTask={restoreTask}
        onDeleteTask={deleteCompletedTask}
      />
    </div>
  );
}
