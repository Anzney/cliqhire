"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Plus, Upload } from 'lucide-react';
import { CreateRecruiterData, RecruiterStatus } from '@/types/recruiter';

interface SkillsAndStatusTabProps {
  formData: CreateRecruiterData;
  setFormData: React.Dispatch<React.SetStateAction<CreateRecruiterData>>;
  errors: Record<string, string>;
}

const statusOptions: { value: RecruiterStatus; label: string }[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "On Leave", label: "On Leave" },
  { value: "Terminated", label: "Terminated" },
];

const commonSkills = [
  "Technical Recruiting",
  "Executive Search",
  "ATS Management",
  "LinkedIn Recruiter",
  "Candidate Sourcing",
  "Interview Coordination",
  "Talent Assessment",
  "Client Relationship Management",
  "Negotiation",
  "Market Research"
];

export function SkillsAndStatusTab({ formData, setFormData, errors }: SkillsAndStatusTabProps) {
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: keyof CreateRecruiterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      if (errors.skills) {
        // Clear skills error when adding a skill
        const newErrors = { ...errors };
        delete newErrors.skills;
        // Note: You'll need to pass setErrors as a prop if you want to clear errors here
      }
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleCommonSkillAdd = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
        alert('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      // For now, we'll just store the file name as a string
      // In a real implementation, you'd handle file upload
      setFormData(prev => ({ ...prev, resume: file.name }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Status */}
      <div>
        <Label htmlFor="status">Status *</Label>
        <Select value={formData.status} onValueChange={(value: RecruiterStatus) => handleInputChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <div>
          <Label>Skills *</Label>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
            />
            <Button type="button" onClick={handleSkillAdd} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
        </div>

        {/* Common Skills */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Common Skills:</p>
          <div className="flex flex-wrap gap-1">
            {commonSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleCommonSkillAdd(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Selected Skills */}
        {formData.skills.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Selected Skills:</p>
            <div className="flex flex-wrap gap-1">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => handleSkillRemove(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resume Upload */}
      <div className="space-y-2">
        <Label htmlFor="resume">Resume (Optional)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('resume')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {formData.resume ? formData.resume : 'Upload Resume'}
          </Button>
          {formData.resume && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFormData(prev => ({ ...prev, resume: undefined }))}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Accepted formats: PDF, DOC, DOCX (Max 5MB)
        </p>
      </div>
    </div>
  );
} 