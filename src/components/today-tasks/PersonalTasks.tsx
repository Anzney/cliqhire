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
  ChevronRight
} from "lucide-react";
import { PersonalTask } from "./types";
import { FollowUpStatusDropdown } from "./FollowUpStatusDropdown";

interface PersonalTasksProps {
  personalTasks: PersonalTask[];
  completedTasks: Set<string>;
  filterPriority: string;
  searchQuery: string;
  onSetFilterPriority: (priority: string) => void;
  onCompleteTask: (taskId: string) => void;
  onUpdateFollowUpStatus: (taskId: string, followUpStatus: "pending" | "in-progress" | "completed") => void;
  onDeleteTask: (taskId: string) => void;
}

export function PersonalTasks({ 
  personalTasks, 
  completedTasks, 
  filterPriority, 
  searchQuery,
  onSetFilterPriority,
  onCompleteTask,
  onUpdateFollowUpStatus,
  onDeleteTask
}: PersonalTasksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckboxDialogOpen, setIsCheckboxDialogOpen] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
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

  const filteredPersonalTasks = personalTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
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
            <div className="flex items-center justify-end mb-4">
              <Select value={filterPriority} onValueChange={onSetFilterPriority}>
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
                <div className="mt-1">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => handleCheckboxChange(task.id)}
                    disabled={task.status === 'completed'}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                </div>
                
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
                  {/* Follow-up status dropdown for follow-up tasks */}
                  {task.category === 'follow-up' && task.followUpStatus && (
                    <FollowUpStatusDropdown
                      currentStatus={task.followUpStatus}
                      onStatusChange={(status) => onUpdateFollowUpStatus(task.id, status)}
                      taskTitle={task.title}
                    />
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
                        onClick={() => onDeleteTask(task.id)}
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
    </Card>
  );
}
