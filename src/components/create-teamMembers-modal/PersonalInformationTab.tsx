"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateTeamMemberData } from '@/types/teamMember';

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
  "Hiring Manager",
  "Team Lead",
  "Recruiters",
  "Head Enter"
];

export function PersonalInformationTab({ formData, setFormData, errors }: PersonalInformationTabProps) {
  const handleInputChange = (field: keyof CreateTeamMemberData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter full name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
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

        <div>
          <Label htmlFor="teamRole">Team Role *</Label>
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

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter location"
            className={errors.location ? 'border-red-500' : ''}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <Label htmlFor="experience">Experience *</Label>
          <Input
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="e.g., 5 years"
            className={errors.experience ? 'border-red-500' : ''}
          />
          {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
        </div>

        <div>
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

        <div>
          <Label htmlFor="manager">Manager</Label>
          <Input
            id="manager"
            value={formData.manager}
            onChange={(e) => handleInputChange('manager', e.target.value)}
            placeholder="Enter manager name"
          />
        </div>
      </div>
    </div>
  );
} 