import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  CheckCircle, 
  User, 
  Calendar,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Eye
} from "lucide-react";
import { PersonalTask } from "./types";
import { FollowUpStatusDropdown } from "./FollowUpStatusDropdown";
import { StatusDropdown, JobStatus } from "./StatusDropdown";
import { ViewTaskDialog } from "./ViewTaskDialog";

interface PersonalTasksProps {
  personalTasks: PersonalTask[];
  completedTasks: Set<string>;
  searchQuery: string;
  loading?: boolean;
  onCompleteTask: (taskId: string) => void;
  onUpdateFollowUpStatus: (taskId: string, followUpStatus: "pending" | "in-progress" | "completed") => void;
  onUpdateStatus: (taskId: string, status: JobStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export function PersonalTasks({ 
  personalTasks, 
  completedTasks, 
  searchQuery,
  loading = false,
  onCompleteTask,
  onUpdateFollowUpStatus,
  onUpdateStatus,
  onDeleteTask
}: PersonalTasksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckboxDialogOpen, setIsCheckboxDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<PersonalTask | null>(null);
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
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'in-progress':
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

  const truncateText = (text: string, maxWords: number) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const convertToJobStatus = (status: string): JobStatus => {
    switch (status) {
      case 'pending':
        return 'To-do';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'To-do';
    }
  };

  const convertFromJobStatus = (jobStatus: JobStatus): string => {
    switch (jobStatus) {
      case 'To-do':
        return 'pending';
      case 'In Progress':
        return 'in-progress';
      case 'Completed':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const filteredPersonalTasks = personalTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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
          <CardContent className="space-y-4">
            
            {loading ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-gray-600">Loading personal tasks...</span>
                </div>
              </div>
            ) : filteredPersonalTasks.length > 0 ? (
          <TooltipProvider>
            {filteredPersonalTasks.map((task) => (
              <div 
                key={task.id} 
                className={`border rounded-lg p-3 hover:bg-gray-50 transition-all duration-300 ${
                  completedTasks.has(task.id) 
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
                  
                  {/* Title with tooltip - Flexible width */}
                  <div className="flex-1 min-w-0 max-w-md">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h3 className={`font-medium text-sm truncate cursor-help ${
                          task.status === 'completed' 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-900'
                        }`}>
                          {truncateText(task.title, 8)}
                        </h3>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{task.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  {/* Description with tooltip - Flexible width */}
                  <div className="flex-1 min-w-0 max-w-lg">
                    {task.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-gray-600 truncate cursor-help">
                            {truncateText(task.description, 12)}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{task.description}</p>
                        </TooltipContent>
                      </Tooltip>
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
                      currentStatus={convertToJobStatus(task.status)}
                      onStatusChange={(newStatus) => onUpdateStatus(task.id, newStatus)}
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
                        <DropdownMenuItem>
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
            ))}
          </TooltipProvider>
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
    </Card>
  );
}
