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
import { ConfirmFieldUpdateDialog } from "@/components/ui/ConfirmFieldUpdateDialog";
import { toast } from "sonner";


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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [initialForm, setInitialForm] = useState<EditableForm | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    fieldName: string;
    fieldKey: keyof EditableForm;
    oldValue: string | string[];
    newValue: string | string[];
  }>({
    open: false,
    fieldName: "",
    fieldKey: "name",
    oldValue: "",
    newValue: "",
  });

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
        teamRole: teamMember.teamRole || "",
        skills: Array.isArray(teamMember.skills) ? teamMember.skills : [],
        resume: teamMember.resume || "",
      };
      setForm(next);
      setInitialForm(next);
      setEditing({});
    }
  }, [open, teamMember]);

  const handleChange = (key: keyof EditableForm, value: string | string[]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleEdit = (key: keyof EditableForm, toState?: boolean) => {
    const newState = typeof toState === 'boolean' ? toState : !editing[key];
    
    if (editing[key] && !newState) {
      // User is clicking the check mark to save changes
      const oldValue = initialForm?.[key] ?? (Array.isArray(form[key]) ? [] : "");
      const newValue = form[key] as string | string[];
      
      // Check if there are actual changes or if there's a resume file selected
      const hasChanges = JSON.stringify(oldValue) !== JSON.stringify(newValue);
      const hasResumeFile = key === 'resume' && resumeFile;
      
      if (hasChanges || hasResumeFile) {
        setConfirmDialog({
          open: true,
          fieldName: getFieldLabel(key),
          fieldKey: key,
          oldValue,
          newValue: hasResumeFile ? `File: ${resumeFile.name}` : newValue,
        });
        return;
      }
    }
    
    setEditing(prev => ({ ...prev, [key]: newState }));
  };

  const getFieldLabel = (key: keyof EditableForm): string => {
    const labels: Record<keyof EditableForm, string> = {
      name: "Name",
      email: "Email",
      phone: "Phone",
      location: "Location",
      experience: "Experience",
      status: "Status",
      department: "Department",
      specialization: "Specialization",
      teamRole: "Team Role",
      skills: "Skills",
      resume: "Resume",
    };
    return labels[key];
  };







  const handleConfirmUpdate = async () => {
    if (!teamMember?._id) return;
    
    try {
      setSaving(true);
      
      let updated: TeamMember;
      
      // Handle resume file upload separately
      if (confirmDialog.fieldKey === 'resume' && resumeFile) {
        const { resumeUrl } = await uploadResume(teamMember._id, resumeFile);
        updated = await updateTeamMember({
          _id: teamMember._id,
          resume: resumeUrl
        });
        setResumeFile(null); // Clear the file after successful upload
      } else {
        // Prepare the payload with only the field being updated
        const fieldValue = confirmDialog.fieldKey === 'skills' 
          ? (confirmDialog.newValue as string[]).filter(skill => skill.trim() !== "")
          : confirmDialog.newValue;
        
        const payload = {
          _id: teamMember._id,
          [confirmDialog.fieldKey]: fieldValue,
        };
        
        updated = await updateTeamMember(payload);
      }
      
      // Update the form and initial form with the new value
      setForm(prev => ({ ...prev, [confirmDialog.fieldKey]: confirmDialog.newValue }));
      setInitialForm(prev => prev ? { ...prev, [confirmDialog.fieldKey]: confirmDialog.newValue } : null);
      
      // Call the onUpdated callback
      onUpdated?.(updated);
      
      // Show success toast immediately
      toast.success(`${confirmDialog.fieldName} updated successfully`);
      
      // Close the confirmation dialog and stop editing
      setConfirmDialog(prev => ({ ...prev, open: false }));
      setEditing(prev => ({ ...prev, [confirmDialog.fieldKey]: false }));
    } catch (error: any) {
      console.error('Error updating team member:', error);
      
      // Show error toast with specific message
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team member';
      toast.error(errorMessage);
      
      // Reset the form value to the original value on error
      setForm(prev => ({ ...prev, [confirmDialog.fieldKey]: confirmDialog.oldValue }));
      
      // Close the confirmation dialog on error as well
      setConfirmDialog(prev => ({ ...prev, open: false }));
      setEditing(prev => ({ ...prev, [confirmDialog.fieldKey]: false }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelUpdate = () => {
    // Reset the form value to the original value
    setForm(prev => ({ ...prev, [confirmDialog.fieldKey]: confirmDialog.oldValue }));
    
    // Clear resume file if canceling resume update
    if (confirmDialog.fieldKey === 'resume') {
      setResumeFile(null);
    }
    
    // Close the confirmation dialog and stop editing
    setConfirmDialog(prev => ({ ...prev, open: false }));
    setEditing(prev => ({ ...prev, [confirmDialog.fieldKey]: false }));
  };

  const renderField = (key: keyof EditableForm, label: string, value: any, type: 'text' | 'select' | 'textarea' | 'resume' = 'text', options?: { value: string; label: string }[]) => {
    const isEditing = editing[key];
    
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
                    value={key === 'skills' && Array.isArray(value) ? value.join("\n") : (Array.isArray(value) ? value.join(", ") : value || "")}
                    onChange={e => {
                      if (key === 'skills') {
                        // For skills, split by newlines but don't filter empty lines to allow Enter key to work
                        const skillsArray = e.target.value.split("\n").map(s => s.trim());
                        handleChange(key, skillsArray);
                      } else if (Array.isArray(value)) {
                        handleChange(key, e.target.value.split(",").map(s => s.trim()).filter(Boolean));
                      } else {
                        handleChange(key, e.target.value);
                      }
                    }}
                    className="min-h-[60px]"
                    rows={3}
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setResumeFile(file);
                        // Set a temporary value to show the file is selected
                        handleChange(key, `File: ${file.name}`);
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
                    <Upload className="h-4 w-4 mr-2" /> 
                    {uploadingResume ? "Uploading..." : resumeFile ? "Change File" : "Upload"}
                  </Button>
                  {resumeFile && (
                    <div className="text-xs text-green-600">
                      File selected: {resumeFile.name}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-600 flex-1 break-words">
              {type === 'resume' && value ? (
                value.startsWith('File:') ? (
                  <span className="text-green-600">{value}</span>
                ) : (
                  <a 
                    href={value} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <LinkIcon className="h-4 w-4" /> 
                    View Resume
                  </a>
                )
              ) : type === 'textarea' && Array.isArray(value) && value.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {value.filter(item => item.trim() !== "").map((item, idx) => (
                    <Badge key={`${item}-${idx}`} variant="secondary" className="text-xs">{item}</Badge>
                  ))}
                </div>
              ) : type === 'textarea' && Array.isArray(value) && value.length === 0 ? (
                "—"
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

          {/* Row 3: Team Role, Department */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {renderField("teamRole", "Team Role", form.teamRole, "select", [
              { value: "ADMIN", label: "ADMIN" },
              { value: "HIRING_MANAGER", label: "HIRING_MANAGER" },
              { value: "TEAM_LEAD", label: "TEAM_LEAD" },
              { value: "RECRUITER", label: "RECRUITER" },
              { value: "HEAD_HUNTER", label: "HEAD_HUNTER" }
            ])}
            {renderField("department", "Department", form.department, "select", [
              { value: "Technical Recruiting", label: "Technical Recruiting" },
              { value: "Executive Search", label: "Executive Search" },
              { value: "Talent Acquisition", label: "Talent Acquisition" },
              { value: "HR", label: "HR" },
              { value: "Sales", label: "Sales" },
              { value: "Marketing", label: "Marketing" },
              { value: "Operations", label: "Operations" }
            ])}
          </div>

          {/* Resume - Full Width */}
          <div className="mb-4">
            {renderField("resume", "Resume", form.resume, "resume")}
          </div>

          {/* Specialization - Full Width */}
          <div className="mb-4">
            {renderField("specialization", "Specialization", form.specialization, "textarea")}
          </div>

          {/* Skills - Full Width */}
          <div className="mb-4">
            {renderField("skills", "Skills", form.skills, "textarea")}
          </div>

          {/* Read-only fields */}
        </div>

        <ConfirmFieldUpdateDialog
          open={confirmDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              // If dialog is being closed, also stop editing
              setEditing(prev => ({ ...prev, [confirmDialog.fieldKey]: false }));
            }
            setConfirmDialog(prev => ({ ...prev, open }));
          }}
          fieldName={confirmDialog.fieldName}
          oldValue={confirmDialog.oldValue}
          newValue={confirmDialog.newValue}
          onConfirm={handleConfirmUpdate}
          onCancel={handleCancelUpdate}
          isLoading={saving}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ViewEditTeamMemberDialog;


