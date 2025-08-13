"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { CreateTeamMemberData } from '@/types/teamMember';

interface SkillsAndStatusTabProps {
  formData: CreateTeamMemberData;
  setFormData: React.Dispatch<React.SetStateAction<CreateTeamMemberData>>;
  errors: Record<string, string>;
}

export function SkillsAndStatusTab({ formData, setFormData, errors }: SkillsAndStatusTabProps) {
  const [skillsInput, setSkillsInput] = useState('');

  const handleInputChange = (field: keyof CreateTeamMemberData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (value: string) => {
    setSkillsInput(value);
    
    // Convert comma-separated or newline-separated string to array of strings
    const skillsArray = value
      .split(/[,\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    setFormData(prev => ({ ...prev, skills: skillsArray }));
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

  // Initialize skillsInput when component mounts or formData changes
  React.useEffect(() => {
    if (formData.skills.length > 0 && skillsInput === '') {
      setSkillsInput(formData.skills.join(', '));
    }
  }, [formData.skills]);

  return (
    <div className="space-y-6">
      {/* Specialization */}
      <div>
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          id="specialization"
          value={formData.specialization}
          onChange={(e) => handleInputChange('specialization', e.target.value)}
          placeholder="e.g., Technical Recruiting"
        />
      </div>

      {/* Skills as textarea */}
      <div>
        <Label htmlFor="skills">Skills</Label>
        <Textarea
          id="skills"
          value={skillsInput}
          onChange={(e) => handleSkillsChange(e.target.value)}
          placeholder="Enter skills separated by commas or press Enter for new lines (e.g., Technical Recruiting, ATS Management, LinkedIn Recruiter)"
          className="min-h-[120px]"
        />
      </div>

      {/* Resume Upload */}
      <div className="space-y-2">
        <Label htmlFor="resume">Resume</Label>
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