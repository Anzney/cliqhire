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

// Import components
import { StatsOverview } from "@/components/today-tasks/StatsOverview";
import { AssignedJobs } from "@/components/today-tasks/AssignedJobs";
import { Interviews } from "@/components/today-tasks/Interviews";
import { UpcomingInterviews } from "@/components/today-tasks/UpcomingInterviews";
import { PersonalTasks } from "@/components/today-tasks/PersonalTasks";
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
  dummyPersonalTasks 
} from "@/components/today-tasks/dummyData";


export default function TodayTasksPage() {
  // State management - using dummy data
  const [assignedJobs] = useState<AssignedJob[]>(dummyAssignedJobs);

  const [interviews, setInterviews] = useState<Interview[]>(dummyInterviews);

  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>(dummyPersonalTasks);

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Handler functions
  const handleAddTask = (taskData: AddTaskFormData) => {
    const newTask: PersonalTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      status: 'pending',
      category: taskData.category,
      createdAt: new Date().toISOString().split('T')[0],
      followUpType: taskData.category === 'follow-up' ? taskData.followUpType : undefined,
      followUpStatus: taskData.category === 'follow-up' ? 'pending' : undefined,
      relatedCandidate: taskData.relatedCandidate,
      relatedJob: taskData.relatedJob,
      relatedClient: taskData.relatedClient,
    };
    setPersonalTasks(prev => [...prev, newTask]);
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
      <UpcomingInterviews upcomingInterviews={upcomingInterviews} />

      {/* Personal Tasks */}
      <PersonalTasks
        personalTasks={personalTasks}
        completedTasks={completedTasks}
        filterPriority={filterPriority}
        searchQuery={searchQuery}
        onSetFilterPriority={setFilterPriority}
        onCompleteTask={completeTask}
        onUpdateFollowUpStatus={updateFollowUpStatus}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}
