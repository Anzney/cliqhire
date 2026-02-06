import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  User,
  Calendar,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Eye,
  SquarePen
} from "lucide-react";
import { PersonalTask } from "./types";
import { FollowUpStatusDropdown } from "./FollowUpStatusDropdown";
import { StatusDropdown, JobStatus } from "./StatusDropdown";
import { ViewTaskDialog } from "./ViewTaskDialog";
import { AddTaskForm } from "./AddTaskForm";
import { taskService } from "@/services/taskService";

interface PersonalTasksProps {
  personalTasks: PersonalTask[];
  completedTasks: Set<string>;
  searchQuery: string;
  loading?: boolean;
  onCompleteTask: (taskId: string) => void;
  onUpdateFollowUpStatus: (taskId: string, followUpStatus: "pending" | "in-progress" | "completed") => void;
  onUpdateStatus: (taskId: string, status: JobStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask?: (taskId: string, taskData: { title: string; description: string; category: string; dueDate: string }) => void;
}

export function PersonalTasks({
  personalTasks,
  completedTasks,
  searchQuery,
  loading = false,
  onCompleteTask,
  onUpdateFollowUpStatus,
  onUpdateStatus,
  onDeleteTask,
  onEditTask
}: PersonalTasksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckboxDialogOpen, setIsCheckboxDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<PersonalTask | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<PersonalTask | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
      case 'to-do':
        return 'bg-gray-100 text-gray-700';
      case 'inprogress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const truncateTextWithEditIcon = (text: string, maxWords: number) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const convertStatus = (status: string | JobStatus, toApi: boolean = false) => {
    if (toApi) {
      // Convert JobStatus to API status
      switch (status as JobStatus) {
        case 'To-do':
          return 'to-do';
        case 'In Progress':
          return 'inprogress';
        case 'Completed':
          return 'completed';
        default:
          return 'to-do';
      }
    } else {
      // Convert API status to JobStatus
      switch (status as string) {
        case 'to-do':
          return 'To-do';
        case 'inprogress':
          return 'In Progress';
        case 'completed':
          return 'Completed';
        default:
          return 'To-do';
      }
    }
  };

  const filteredPersonalTasks = personalTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCheckboxChange = (taskId: string) => {
    setPendingTaskId(taskId);
    setIsCheckboxDialogOpen(true);
  };

  const handleConfirmCheckboxChange = () => {
    if (pendingTaskId) {
      onCompleteTask(pendingTaskId);
    }
    setIsCheckboxDialogOpen(false);
    setPendingTaskId(null);
  };

  const handleCancelCheckboxChange = () => {
    setIsCheckboxDialogOpen(false);
    setPendingTaskId(null);
  };

  const handleDeleteClick = (taskId: string) => {
    setPendingDeleteTaskId(taskId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteTaskId) {
      onDeleteTask(pendingDeleteTaskId);
    }
    setIsDeleteDialogOpen(false);
    setPendingDeleteTaskId(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setPendingDeleteTaskId(null);
  };

  const handleViewDetails = (task: PersonalTask) => {
    setSelectedTask(task);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedTask(null);
  };

  const handleEditTask = (task: PersonalTask) => {
    setTaskToEdit(task);
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setTaskToEdit(null);
  };

  const handleEditSubmit = async (taskData: { title: string; description: string; category: string; dueDate: string }) => {
    if (taskToEdit) {
      try {
        // Use the taskService for API calls
        await taskService.updatePersonalTask(taskToEdit.id, {
          title: taskData.title,
          description: taskData.description,
          category: taskData.category,
          dueDate: taskData.dueDate
        });

        // Call the parent component's onEditTask if provided
        if (onEditTask) {
          onEditTask(taskToEdit.id, taskData);
        }
      } catch (error) {
        console.error('Error updating task:', error);
        // You might want to show a toast notification here
      }
    }
    handleCloseEditForm();
  };

  const updateTaskStatus = async (taskId: string, newStatus: JobStatus) => {
    try {
      const apiStatus = convertStatus(newStatus, true) as 'to-do' | 'inprogress' | 'completed';

      // Use the taskService for API calls
      await taskService.updatePersonalTask(taskId, {
        status: apiStatus
      });

      // Call the parent component's onUpdateStatus if provided
      if (onUpdateStatus) {
        onUpdateStatus(taskId, newStatus);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      // You might want to show a toast notification here
    }
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Tasks
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {/* Status Filter - Only visible when open */}
                {isOpen && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filter:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="to-do">To-do</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <span>Total: <span className="font-semibold text-gray-900">{filteredPersonalTasks.length}</span></span>
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
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">

            {loading ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-gray-600">Loading personal tasks...</span>
                </div>
              </div>
            ) : filteredPersonalTasks.length > 0 ? (
              filteredPersonalTasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-3 hover:bg-gray-50 transition-all duration-300 ${completedTasks.has(task.id)
                    ? 'bg-green-50 border-green-200 opacity-75'
                    : ''
                    }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => handleCheckboxChange(task.id)}
                        disabled={task.status === 'completed'}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                    </div>

                    {/* Title - Flexible width */}
                    <div className="flex-1 min-w-0 max-w-md">
                      <h3
                        className={`font-medium text-sm truncate cursor-pointer hover:text-blue-600 hover:underline transition-colors ${task.status === 'completed'
                          ? 'line-through text-gray-500'
                          : 'text-gray-900'
                          }`}
                        onClick={() => handleViewDetails(task)}
                      >
                        {truncateText(task.title, 30)}
                      </h3>
                    </div>

                    {/* Description - Flexible width */}
                    <div className="flex-1 min-w-0 max-w-lg">
                      {task.description && (
                        <div className="group relative inline-block w-full">
                          <span
                            className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                            onClick={() => handleViewDetails(task)}
                          >
                            {truncateText(task.description, 50)}
                            {/* Edit icon that appears on hover */}
                            <button
                              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 rounded p-0.5 align-middle"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                              title="Edit description"
                            >
                              <SquarePen className="w-3 h-3 text-gray-500 hover:text-blue-600" />
                            </button>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="flex-shrink-0 w-28">
                      <span className="text-xs text-gray-500 capitalize">{task.category}</span>
                    </div>

                    {/* Due Date */}
                    <div className="flex-shrink-0 w-32">
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(task.dueDate)}</span>
                          {task.dueTime && <span className="text-xs">at {task.dueTime}</span>}
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0 w-28">
                      <StatusDropdown
                        currentStatus={convertStatus(task.status, false) as JobStatus}
                        onStatusChange={(newStatus) => updateTaskStatus(task.id, newStatus)}
                        jobTitle={task.title}
                      />
                    </div>

                    {/* Follow-up status dropdown for follow-up tasks */}
                    {task.category === 'follow-up' && task.followUpStatus && (
                      <div className="flex-shrink-0">
                        <FollowUpStatusDropdown
                          currentStatus={task.followUpStatus}
                          onStatusChange={(status) => onUpdateFollowUpStatus(task.id, status)}
                          taskTitle={task.title}
                        />
                      </div>
                    )}

                    {/* Options Menu */}
                    <div className="flex-shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(task)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTask(task)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(task.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Follow-up specific information */}
                  {task.category === 'follow-up' && task.relatedCandidate && (
                    <div className="mt-2 ml-8 p-2 bg-blue-50 rounded text-xs">
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
                    <div className="mt-2 ml-8 p-2 bg-green-100 border border-green-200 rounded text-xs text-green-700 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Task completed! Removing from list...</span>
                    </div>
                  )}
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
        </CollapsibleContent>
      </Collapsible>

      {/* Checkbox Confirmation Dialog */}
      <AlertDialog open={isCheckboxDialogOpen} onOpenChange={setIsCheckboxDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this task as completed? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelCheckboxChange}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCheckboxChange}>
              Complete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone and the task will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Task Details Dialog */}
      <ViewTaskDialog
        isOpen={isViewDialogOpen}
        onClose={handleCloseViewDialog}
        task={selectedTask}
      />

      {/* Edit Task Form Dialog */}
      {isEditFormOpen && taskToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
            <AddTaskForm
              onClose={handleCloseEditForm}
              onSubmit={handleEditSubmit}
              initialValues={{
                title: taskToEdit.title,
                description: taskToEdit.description || '',
                category: taskToEdit.category,
                dueDate: taskToEdit.dueDate || ''
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
