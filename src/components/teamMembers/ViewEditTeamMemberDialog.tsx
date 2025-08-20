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

  if (!teamMember) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Name */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Name</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("name")}>
                {editing.name ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.name ? (
              <Input className="mt-2" value={form.name} onChange={e => handleChange("name", e.target.value)} />
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">{form.name || "—"}</div>
            )}
          </div>

          {/* Email */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Email</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("email")}>
                {editing.email ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.email ? (
              <Input className="mt-2" type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} />
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">{form.email || "—"}</div>
            )}
          </div>

          {/* Phone */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Phone</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("phone")}>
                {editing.phone ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.phone ? (
              <Input className="mt-2" value={form.phone} onChange={e => handleChange("phone", e.target.value)} />
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">{form.phone || "—"}</div>
            )}
          </div>

          {/* Location */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Location</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("location")}>
                {editing.location ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.location ? (
              <Input className="mt-2" value={form.location} onChange={e => handleChange("location", e.target.value)} />
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">{form.location || "—"}</div>
            )}
          </div>

          {/* Experience */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Experience</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("experience")}>
                {editing.experience ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.experience ? (
              <Input className="mt-2" value={form.experience} onChange={e => handleChange("experience", e.target.value)} />
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">{form.experience || "—"}</div>
            )}
          </div>

          {/* Status */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Status</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("status")}>
                {editing.status ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.status ? (
              <Select value={form.status} onValueChange={value => handleChange("status", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">{form.status || "—"}</div>
            )}
          </div>

          {/* Team Role */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Team Role</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("teamRole")}>
                {editing.teamRole ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.teamRole ? (
              <Select value={form.teamRole || ""} onValueChange={value => handleChange("teamRole", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="HIRING_MANAGER">HIRING_MANAGER</SelectItem>
                  <SelectItem value="TEAM_LEAD">TEAM_LEAD</SelectItem>
                  <SelectItem value="RECRUITER">RECRUITER</SelectItem>
                  <SelectItem value="HEAD_HUNTER">HEAD_HUNTER</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">{form.teamRole || "—"}</div>
            )}
          </div>

          {/* Department */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Department</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("department")}>
                {editing.department ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.department ? (
              <Input className="mt-2" value={form.department} onChange={e => handleChange("department", e.target.value)} />
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">{form.department || "—"}</div>
            )}
          </div>

          {/* Specialization */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Specialization</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("specialization")}>
                {editing.specialization ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.specialization ? (
              <Input className="mt-2" value={form.specialization} onChange={e => handleChange("specialization", e.target.value)} />
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">{form.specialization || "—"}</div>
            )}
          </div>

          {/* Resume */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Resume</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("resume")}>
                {editing.resume ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.resume ? (
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  placeholder="Paste resume URL"
                  value={form.resume || ""}
                  onChange={e => handleChange("resume", e.target.value)}
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
                      handleChange("resume", resumeUrl);
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
                >
                  <Upload className="h-4 w-4 mr-2" /> {uploadingResume ? "Uploading..." : "Upload"}
                </Button>
              </div>
            ) : (
              <div className="mt-1 text-sm text-muted-foreground break-words">
                {form.resume ? (
                  <a href={form.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                    <LinkIcon className="h-4 w-4" /> View Resume
                  </a>
                ) : (
                  "—"
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Skills</Label>
              <Button variant="ghost" size="sm" onClick={() => toggleEdit("skills")}>
                {editing.skills ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </div>
            {editing.skills ? (
              <Textarea
                className="mt-2"
                placeholder="Comma-separated skills (e.g., React, Node.js, TypeScript)"
                value={(form.skills || []).join(", ")}
                onChange={e => handleChange("skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean) as any)}
              />
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {(form.skills && form.skills.length > 0) ? (
                  form.skills.map((skill, idx) => (
                    <Badge key={`${skill}-${idx}`} variant="secondary" className="text-xs">{skill}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            )}
          </div>

          {teamMember.teamMemberId && (
            <div className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Team Member ID</Label>
              </div>
              <div className="mt-1 text-sm text-muted-foreground break-words">{teamMember.teamMemberId}</div>
            </div>
          )}
          {teamMember.gender && (
            <div className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Gender</Label>
              </div>
              <div className="mt-1 text-sm text-muted-foreground break-words">{teamMember.gender}</div>
            </div>
          )}
          {teamMember.registrationStatus && (
            <div className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Registration Status</Label>
              </div>
              <div className="mt-1 text-sm text-muted-foreground break-words">{teamMember.registrationStatus}</div>
            </div>
          )}
          {teamMember.hireDate && (
            <div className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Hire Date</Label>
              </div>
              <div className="mt-1 text-sm text-muted-foreground break-words">{teamMember.hireDate}</div>
            </div>
          )}
          {teamMember.manager && (
            <div className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Manager</Label>
              </div>
              <div className="mt-1 text-sm text-muted-foreground break-words">{teamMember.manager}</div>
            </div>
          )}
          {typeof teamMember.performanceRating !== 'undefined' && (
            <div className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Performance Rating</Label>
              </div>
              <div className="mt-1 text-sm text-muted-foreground break-words">{String(teamMember.performanceRating)}</div>
            </div>
          )}
          {typeof teamMember.activeJobs !== 'undefined' && (
            <div className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Active Jobs</Label>
              </div>
              <div className="mt-1 text-sm text-muted-foreground break-words">{String(teamMember.activeJobs)}</div>
            </div>
          )}
          {typeof teamMember.completedPlacements !== 'undefined' && (
            <div className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Completed Placements</Label>
              </div>
              <div className="mt-1 text-sm text-muted-foreground break-words">{String(teamMember.completedPlacements)}</div>
            </div>
          )}
          
        </div>
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


