import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  FileText, 
  Tag, 
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle
} from "lucide-react";
import { PersonalTask } from "./types";

interface ViewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: PersonalTask | null;
}

export function ViewTaskDialog({ isOpen, onClose, task }: ViewTaskDialogProps) {
  if (!task) return null;

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'in-progress':
        return <PlayCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Task Details
          </DialogTitle>
          <DialogDescription>
            View complete information about this task
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            {task.description && (
              <p className="text-gray-600 leading-relaxed">{task.description}</p>
            )}
          </div>

          {/* Status and Category */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <Badge className={`${getStatusColor(task.status)} flex items-center gap-1`}>
                {getStatusIcon(task.status)}
                {task.status === 'pending' ? 'To-do' : 
                 task.status === 'in-progress' ? 'In Progress' : 
                 task.status === 'completed' ? 'Completed' : task.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 capitalize">{task.category}</span>
            </div>
          </div>

          {/* Due Date and Time */}
          {task.dueDate && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Due Date:</span>
                <span className="text-sm text-gray-600">{formatDate(task.dueDate)}</span>
              </div>
              {task.dueTime && (
                <div className="flex items-center gap-2 ml-6">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Due Time:</span>
                  <span className="text-sm text-gray-600">{formatTime(task.dueTime)}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
