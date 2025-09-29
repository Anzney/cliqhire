import React, { useState } from "react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  CheckCircle, 
  User, 
  Calendar,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { PersonalTask } from "./types";

interface CompletedTasksProps {
  completedTasks: PersonalTask[];
  filterPriority: string;
  searchQuery: string;
  onSetFilterPriority: (priority: string) => void;
  onRestoreTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function CompletedTasks({ 
  completedTasks, 
  filterPriority, 
  searchQuery,
  onSetFilterPriority,
  onRestoreTask,
  onDeleteTask
}: CompletedTasksProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredCompletedTasks = completedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Completed Tasks
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Total: <span className="font-semibold text-green-600">{filteredCompletedTasks.length}</span></span>
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
            {filteredCompletedTasks.length > 0 ? (
              filteredCompletedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 bg-green-50 border-green-200 opacity-90"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium line-through text-gray-500">
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700">
                          completed
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-500 mb-2 line-through">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
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
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs opacity-75">
                          <div className="flex items-center gap-2 text-blue-600">
                            <User className="w-3 h-3" />
                            <span><strong>Candidate:</strong> {task.relatedCandidate}</span>
                            {task.relatedJob && <span>• <strong>Job:</strong> {task.relatedJob}</span>}
                            {task.relatedClient && <span>• <strong>Client:</strong> {task.relatedClient}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onRestoreTask(task.id)}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restore Task
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteTask(task.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Permanently
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
            <p className="text-lg font-medium">No completed tasks found</p>
            <p className="text-sm">
              {searchQuery ? 'Try adjusting your search criteria' : 'Complete some tasks to see them here'}
            </p>
          </div>
        )}
      </CardContent>
    </CollapsibleContent>
  </Collapsible>
</Card>
);
}
