"use client";

import React, { useEffect, useState } from "react";
import { TeamMember, TeamMemberStatus } from "@/types/teamMember";
import { updateTeamMember, uploadResume } from "@/services/teamMembersService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserCog, Pencil, Check, Upload, Link as LinkIcon } from "lucide-react";


interface ViewEditTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMember: TeamMember | null;
  onUpdated?: (updated: TeamMember) => void;
}

type EditableForm = {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  status: TeamMemberStatus;
  department?: string;
  specialization?: string;
  teamRole?: string;
  skills: string[];
  resume?: string;
};

export function ViewEditTeamMemberDialog({ open, onOpenChange, teamMember, onUpdated }: ViewEditTeamMemberDialogProps) {
  const [form, setForm] = useState<EditableForm>({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    status: "Active",
    department: "",
    specialization: "",
    teamRole: "",
    skills: [],
    resume: "",
  });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [uploadingResume, setUploadingResume] = useState(false);
  const [editAll, setEditAll] = useState(false);
  const [initialForm, setInitialForm] = useState<EditableForm | null>(null);

  useEffect(() => {
    if (open && teamMember) {
      const next: EditableForm = {
        name: teamMember.name || "",
        email: teamMember.email || "",
        phone: teamMember.phone || "",
        location: teamMember.location || "",
        experience: teamMember.experience || "",
        status: teamMember.status || "Active",
        department: teamMember.department || "",
        specialization: teamMember.specialization || "",
        teamRole: teamMember.teamRole || teamMember.role || "",
        skills: Array.isArray(teamMember.skills) ? teamMember.skills : [],
        resume: teamMember.resume || "",
      };
      setForm(next);
      setInitialForm(next);
      setEditing({});
      setEditAll(false);
    }
  }, [open, teamMember]);

  const handleChange = (key: keyof EditableForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleEdit = (key: keyof EditableForm, toState?: boolean) => {
    setEditing(prev => ({ ...prev, [key]: typeof toState === 'boolean' ? toState : !prev[key] }));
  };

  const setAllEditing = (toState: boolean) => {
    const keys: (keyof EditableForm)[] = [
      "name","email","phone","location","experience","status","teamRole","department","specialization","resume","skills"
    ];
    const next: Record<string, boolean> = {};
    keys.forEach(k => { next[k] = toState; });
    setEditing(next);
  };

  const isDirty = (): boolean => {
    if (!initialForm) return false;
    try {
      return JSON.stringify(form) !== JSON.stringify(initialForm);
    } catch {
      return true;
    }
  };

  const handleReset = () => {
    if (initialForm) setForm(initialForm);
    setEditing({});
    setEditAll(false);
  };

  const handleSave = async () => {
    if (!teamMember?._id) return;
    try {
      setSaving(true);
      const payload = {
        _id: teamMember._id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        experience: form.experience,
        status: form.status,
        department: form.department,
        specialization: form.specialization,
        teamRole: form.teamRole || undefined,
        skills: form.skills,
        resume: form.resume,
      };
      const updated = await updateTeamMember(payload);
      onUpdated?.(updated);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (key: keyof EditableForm, label: string, value: any, type: 'text' | 'select' | 'textarea' | 'resume' = 'text', options?: { value: string; label: string }[]) => {
    const isEditing = editing[key] || editAll;
    
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm font-medium text-gray-700 min-w-0">{label}:</span>
          {isEditing ? (
            <div className="flex-1">
              {type === 'text' && (
                <Input 
                  value={value || ""} 
                  onChange={e => handleChange(key, e.target.value)}
                  className="h-8"
                />
              )}
              {type === 'select' && options && (
                <Select value={value || ""} onValueChange={value => handleChange(key, value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {type === 'textarea' && (
                <Textarea
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={Array.isArray(value) ? value.join(", ") : value || ""}
                  onChange={e => {
                    if (Array.isArray(value)) {
                      handleChange(key, e.target.value.split(",").map(s => s.trim()).filter(Boolean) as any);
                    } else {
                      handleChange(key, e.target.value);
                    }
                  }}
                  className="min-h-[60px]"
                />
              )}
              {type === 'resume' && (
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Paste resume URL"
                    value={value || ""}
                    onChange={e => handleChange(key, e.target.value)}
                    className="h-8"
                  />
                  <input
                    id="resume-file-input"
                    type="file"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !teamMember?._id) return;
                      try {
                        setUploadingResume(true);
                        const { resumeUrl } = await uploadResume(teamMember._id, file);
                        handleChange(key, resumeUrl);
                      } finally {
                        setUploadingResume(false);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={uploadingResume}
                    onClick={() => document.getElementById("resume-file-input")?.click()}
                    className="h-8"
                  >
                    <Upload className="h-4 w-4 mr-2" /> {uploadingResume ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-600 flex-1 break-words">
              {type === 'resume' && value ? (
                <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                  <LinkIcon className="h-4 w-4" /> View Resume
                </a>
              ) : type === 'textarea' && Array.isArray(value) && value.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {value.map((item, idx) => (
                    <Badge key={`${item}-${idx}`} variant="secondary" className="text-xs">{item}</Badge>
                  ))}
                </div>
              ) : (
                value || "—"
              )}
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => toggleEdit(key)}
          className="ml-2 h-8 w-8 p-0"
        >
          {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>
    );
  };

  if (!teamMember) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={teamMember?.avatar || ""} alt={teamMember?.name || "User"} />
                <AvatarFallback>{(teamMember?.name || "").substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  {teamMember?.name}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  {teamMember?.email && (
                    <a href={`mailto:${teamMember.email}`} className="hover:underline">{teamMember.email}</a>
                  )}
                  {form.teamRole && (
                    <Badge variant="secondary" className="text-xs">{form.teamRole}</Badge>
                  )}
                  <Badge className="text-xs" variant={form.status === 'Active' ? 'default' : 'outline'}>
                    {form.status}
                  </Badge>
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={editAll ? "secondary" : "outline"} size="sm" onClick={() => { setEditAll(!editAll); setAllEditing(!editAll); }}>
                {editAll ? "Stop Editing" : "Edit All"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset} disabled={!isDirty()}>Reset</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {/* Row 1: Name, Email, Phone */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {renderField("name", "Name", form.name)}
            {renderField("email", "Email", form.email)}
            {renderField("phone", "Phone", form.phone)}
          </div>

          {/* Row 2: Location, Experience, Status */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {renderField("location", "Location", form.location)}
            {renderField("experience", "Experience", form.experience)}
            {renderField("status", "Status", form.status, "select", [
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
              { value: "On Leave", label: "On Leave" },
              { value: "Terminated", label: "Terminated" }
            ])}
          </div>

          {/* Row 3: Team Role, Department, Resume */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {renderField("teamRole", "Team Role", form.teamRole, "select", [
              { value: "ADMIN", label: "ADMIN" },
              { value: "HIRING_MANAGER", label: "HIRING_MANAGER" },
              { value: "TEAM_LEAD", label: "TEAM_LEAD" },
              { value: "RECRUITER", label: "RECRUITER" },
              { value: "HEAD_HUNTER", label: "HEAD_HUNTER" }
            ])}
            {renderField("department", "Department", form.department)}
            {renderField("resume", "Resume", form.resume, "resume")}
          </div>

          {/* Specialization - Full Width */}
          <div className="mb-4">
            {renderField("specialization", "Specialization", form.specialization)}
          </div>

          {/* Skills - Full Width */}
          <div className="mb-4">
            {renderField("skills", "Skills", form.skills, "textarea")}
          </div>

          {/* Read-only fields */}
          {teamMember.teamMemberId && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Team Member ID:</span>
                <span className="text-sm text-gray-600">{teamMember.teamMemberId}</span>
              </div>
            </div>
          )}
          {teamMember.gender && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Gender:</span>
                <span className="text-sm text-gray-600">{teamMember.gender}</span>
              </div>
            </div>
          )}
          {teamMember.registrationStatus && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Registration Status:</span>
                <span className="text-sm text-gray-600">{teamMember.registrationStatus}</span>
              </div>
            </div>
          )}
          {teamMember.hireDate && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Hire Date:</span>
                <span className="text-sm text-gray-600">{teamMember.hireDate}</span>
              </div>
            </div>
          )}
          {teamMember.manager && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Manager:</span>
                <span className="text-sm text-gray-600">{teamMember.manager}</span>
              </div>
            </div>
          )}
          {typeof teamMember.performanceRating !== 'undefined' && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Performance Rating:</span>
                <span className="text-sm text-gray-600">{String(teamMember.performanceRating)}</span>
              </div>
            </div>
          )}
          {typeof teamMember.activeJobs !== 'undefined' && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active Jobs:</span>
                <span className="text-sm text-gray-600">{String(teamMember.activeJobs)}</span>
              </div>
            </div>
          )}
          {typeof teamMember.completedPlacements !== 'undefined' && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Completed Placements:</span>
                <span className="text-sm text-gray-600">{String(teamMember.completedPlacements)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Close</Button>
          <Button onClick={handleSave} disabled={saving || !isDirty()}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewEditTeamMemberDialog;


