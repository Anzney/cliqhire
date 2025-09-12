import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AddTaskFormData } from "./types";

interface AddTaskFormProps {
  onClose: () => void;
  onSubmit?: (taskData: AddTaskFormData) => void;
}

export function AddTaskForm({ onClose, onSubmit }: AddTaskFormProps) {
  const [formData, setFormData] = useState<AddTaskFormData>({
    title: '',
    description: '',
    priority: 'medium', // Keep for type compatibility, but won't be used
    category: 'other',
    dueDate: '',
    dueTime: '',
    // Follow-up specific fields
    followUpType: 'other',
    relatedCandidate: '',
    relatedJob: '',
    relatedClient: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({ 
        ...prev, 
        dueDate: format(date, 'yyyy-MM-dd') 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        dueDate: '' 
      }));
    }
    setIsDatePickerOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Default behavior - just log and close
      console.log('New task:', formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description..."
          rows={3}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value: 'follow-up' | 'admin' | 'research' | 'meeting' | 'other') => 
          setFormData(prev => ({ ...prev, category: value }))
        }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="follow-up">Follow-up</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Due Date (Optional)</Label>
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Task
        </Button>
      </div>
    </form>
  );
}
