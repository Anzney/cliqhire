import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle, 
  User, 
  Calendar,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { PersonalTask } from "./types";

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Tasks
          </CardTitle>
          <div className="flex items-center gap-2">
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
                  onClick={() => onCompleteTask(task.id)}
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
                        onClick={() => onUpdateFollowUpStatus(task.id, 'pending')}
                        className="text-xs px-2 py-1 h-7"
                      >
                        Pending
                      </Button>
                      <Button
                        size="sm"
                        variant={task.followUpStatus === 'in-progress' ? 'default' : 'outline'}
                        onClick={() => onUpdateFollowUpStatus(task.id, 'in-progress')}
                        className="text-xs px-2 py-1 h-7"
                      >
                        In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant={task.followUpStatus === 'completed' ? 'default' : 'outline'}
                        onClick={() => onUpdateFollowUpStatus(task.id, 'completed')}
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
    </Card>
  );
}
