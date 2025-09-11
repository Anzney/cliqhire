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
import { AddTaskFormData } from "./types";

interface AddTaskFormProps {
  onClose: () => void;
  onSubmit?: (taskData: AddTaskFormData) => void;
}

export function AddTaskForm({ onClose, onSubmit }: AddTaskFormProps) {
  const [formData, setFormData] = useState<AddTaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
    dueDate: '',
    dueTime: '',
    // Follow-up specific fields
    followUpType: 'other',
    relatedCandidate: '',
    relatedJob: '',
    relatedClient: ''
  });

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
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description..."
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => 
            setFormData(prev => ({ ...prev, priority: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
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
      </div>
      
      {/* Follow-up specific fields */}
      {formData.category === 'follow-up' && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900">Follow-up Details</h4>
          
          <div>
            <Label htmlFor="followUpType">Follow-up Type</Label>
            <Select value={formData.followUpType} onValueChange={(value: 'cv-received' | 'candidate-response' | 'client-feedback' | 'interview-scheduled' | 'offer-sent' | 'other') => 
              setFormData(prev => ({ ...prev, followUpType: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cv-received">CV Received</SelectItem>
                <SelectItem value="candidate-response">Candidate Response</SelectItem>
                <SelectItem value="client-feedback">Client Feedback</SelectItem>
                <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="offer-sent">Offer Sent</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="relatedCandidate">Related Candidate (Optional)</Label>
              <Input
                id="relatedCandidate"
                value={formData.relatedCandidate}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedCandidate: e.target.value }))}
                placeholder="Candidate name..."
              />
            </div>
            
            <div>
              <Label htmlFor="relatedJob">Related Job (Optional)</Label>
              <Input
                id="relatedJob"
                value={formData.relatedJob}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedJob: e.target.value }))}
                placeholder="Job title..."
              />
            </div>
            
            <div>
              <Label htmlFor="relatedClient">Related Client (Optional)</Label>
              <Input
                id="relatedClient"
                value={formData.relatedClient}
                onChange={(e) => setFormData(prev => ({ ...prev, relatedClient: e.target.value }))}
                placeholder="Client name..."
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate">Due Date (Optional)</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          />
        </div>
        
        <div>
          <Label htmlFor="dueTime">Due Time (Optional)</Label>
          <Input
            id="dueTime"
            type="time"
            value={formData.dueTime}
            onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
          />
        </div>
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
