"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateTeamMemberData, TeamMemberStatus } from '@/types/teamMember';

interface PersonalInformationTabProps {
  formData: CreateTeamMemberData;
  setFormData: React.Dispatch<React.SetStateAction<CreateTeamMemberData>>;
  errors: Record<string, string>;
}

const departmentOptions = [
  "Technical Recruiting",
  "Executive Search",
  "Talent Acquisition",
  "HR",
  "Sales",
  "Marketing",
  "Operations"
];

const teamRoleOptions = [
  "ADMIN",
  "HIRING_MANAGER",
  "TEAM_LEAD",
  "RECRUITER",
  "HEAD_HUNTER",
  "SALES_TEAM"
];

const statusOptions: { value: TeamMemberStatus; label: string }[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "On Leave", label: "On Leave" },
  { value: "Terminated", label: "Terminated" },
];

export function PersonalInformationTab({ formData, setFormData, errors }: PersonalInformationTabProps) {
  const handleInputChange = (field: keyof CreateTeamMemberData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='ml-2'>
          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter full name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className='mr-2'>
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className='ml-2'>
          <Label htmlFor="teamRole">Team Role <span className="text-red-500">*</span></Label>
          <Select value={formData.teamRole} onValueChange={(value) => handleInputChange('teamRole', value)}>
            <SelectTrigger className={errors.teamRole ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select team role" />
            </SelectTrigger>
            <SelectContent>
              {teamRoleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teamRole && <p className="text-red-500 text-sm mt-1">{errors.teamRole}</p>}
        </div>

        <div className='mr-2'>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className='ml-2'>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: TeamMemberStatus) => handleInputChange('status', value)}>
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

        <div className='mr-2'>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter location"
          />
        </div>

        <div className='ml-2'>
          <Label htmlFor="experience">Experience</Label>
          <Input
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="e.g., 5 years"
          />
        </div>

        <div className='mr-2'>
          <Label htmlFor="department">Department</Label>
          <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 