import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, ChevronsUpDown } from "lucide-react";
import { EditFieldModal } from "./edit-field-modal";
import { DateOfBirthDialog, MaritalStatusDialog, GenderDialog, StatusDialog } from "./personal-info-edit-dialog";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CandidateTeamInfoSection } from "./CandidateTeamInfoSection";
import SalaryRange from "./salary-range";
import { ResumeUploadDialog } from "./resume-upload-dialog";

const detailsFields = [
  { key: "name", label: "Candidate Name" },
  { key: "location", label: "Location" },
  { key: "experience", label: "Experience" },
  { key: "totalRelevantExperience", label: "Total Relevant Years of Experience" },
  { key: "noticePeriod", label: "Notice Period" },
  { key: "skills", label: "Skills", render: (val: string[] | undefined) => val && val.length ? val.join(", ") : undefined },
  { 
    key: "resume", 
    label: "Resume", 
    render: (val: string | undefined) => val ? <a href={val} target="_blank" rel="noopener noreferrer" className="underline">View Resume</a> : undefined,
    isUpload: true 
  },
  { key: "status", label: "Status" },
  { key: "referredBy", label: "Referred By" },
  { key: "gender", label: "Gender" },
  { key: "dateOfBirth", label: "Date of Birth", render: (val: string | undefined) => {
    if (!val) return undefined;
    try {
      const date = new Date(val);
      if (isNaN(date.getTime())) return val; // Return original value if invalid date
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return val; // Return original value if parsing fails
    }
  }},
  { key: "maritalStatus", label: "Marital Status" },
  { key: "country", label: "Country" },
  { key: "nationality", label: "Nationality" },
  { key: "universityName", label: "University Name" },
  { key: "educationDegree", label: "Education Degree/Certificate", isTextarea: true },
  { key: "primaryLanguage", label: "Primary Language" },
  { key: "willingToRelocate", label: "Are you willing to relocate?" },
];

// Split details fields into default visible and collapsible sections
const defaultDetailsFields = detailsFields.slice(0, 7); // Up to "Referred By"
const collapsibleDetailsFields = detailsFields.slice(7); // From "Gender" onwards

const contactFields = [
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email" },
  { key: "otherPhone", label: "Other Phone Number" },
  { 
    key: "linkedin", 
    label: "LinkedIn",
    render: (val: string | undefined) => {
      if (!val) return undefined;
      const isValidUrl = val.startsWith('http://') || val.startsWith('https://');
      if (isValidUrl) {
        return (
          <a 
            href={val} 
            target="_blank" 
            rel="noopener noreferrer"
            className="cursor-pointer hover:underline"
            style={{ textDecoration: 'none' }}
          >
            {val}
          </a>
        );
      }
      return val;
    }
  },
];

const previousCompanyFields = [
  { key: "previousCompanyName", label: "Previous Company Name" },
  { key: "currentJobTitle", label: "Current Job Title" },
  { key: "reportingTo", label: "Reporting To" },
  { key: "totalStaffReporting", label: "Total Number of Staff Reporting to You" },
];

const skillFields = [
  { key: "softSkill", label: "Soft Skill", isArray: true, isTextarea: true },
  { key: "technicalSkill", label: "Technical Skill", isArray: true, isTextarea: true },
];

interface CandidateSummaryProps {
  candidate: any;
  onCandidateUpdate?: (updatedCandidate: any, fieldKey?: string) => void;
}

const CandidateSummary = ({ candidate, onCandidateUpdate }: CandidateSummaryProps) => {
  const [editField, setEditField] = useState<string | null>(null);
  const [localCandidate, setLocalCandidate] = useState(candidate);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDateOfBirthDialog, setShowDateOfBirthDialog] = useState(false);
  const [showMaritalStatusDialog, setShowMaritalStatusDialog] = useState(false);
  const [showGenderDialog, setShowGenderDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const handleSave = (fieldKey: string, newValue: any) => {
    // LinkedIn validation
    if (fieldKey === "linkedin" && newValue && newValue.trim()) {
      const trimmedValue = newValue.trim();
      if (!trimmedValue.startsWith('http://') && !trimmedValue.startsWith('https://')) {
        toast.error("LinkedIn URL must start with 'http://' or 'https://'");
        return;
      }
    }

    const updatedCandidate = { ...localCandidate, [fieldKey]: newValue };
    setLocalCandidate(updatedCandidate);
    setEditField(null);
    
    // Notify parent component of the update
    if (onCandidateUpdate) {
      onCandidateUpdate(updatedCandidate, fieldKey);
    }
  };

  const handleResumeUpload = (resumeUrl: string) => {
    handleSave("resume", resumeUrl);
    setShowUploadDialog(false);
  };

  const handleDateOfBirthSave = (value: string) => {
    handleSave("dateOfBirth", value);
    setShowDateOfBirthDialog(false);
  };

  const handleMaritalStatusSave = (value: string) => {
    handleSave("maritalStatus", value);
    setShowMaritalStatusDialog(false);
  };

  const handleGenderSave = (value: string) => {
    handleSave("gender", value);
    setShowGenderDialog(false);
  };

  const handleStatusSave = (value: string) => {
    handleSave("status", value);
    setShowStatusDialog(false);
  };

  const renderField = (field: any, fieldArray: any[]) => {
    const rawValue = localCandidate?.[field.key];
    const value = field.render ? field.render(rawValue) : rawValue;
    const hasValue = rawValue !== undefined && rawValue !== null && rawValue !== '' && (!Array.isArray(rawValue) || rawValue.length > 0);
    
    // Special handling for upload fields (like Resume)
    if (field.isUpload) {
      return (
        <div key={field.key} className="relative border-b last:border-b-0">
          <div className="flex items-center py-2">
            <span className="text-sm text-muted-foreground w-1/3">
              {field.label}
            </span>
            <div className="flex items-center justify-between flex-1">
              <span className={`text-sm ${hasValue ? '' : 'text-muted-foreground'}`}>
                {hasValue ? value : 'No Details'}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex items-center ml-2"
                onClick={() => setShowUploadDialog(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />Edit
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    // Special handling for personal information fields
    if (field.key === 'dateOfBirth') {
      return (
        <div key={field.key} className="relative border-b last:border-b-0">
          <div className="flex items-center py-2">
            <span className="text-sm text-muted-foreground w-1/3">
              {field.label}
            </span>
            <div className="flex items-center justify-between flex-1">
              <span className={`text-sm ${hasValue ? '' : 'text-muted-foreground'}`}>
                {hasValue ? value : 'No Details'}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex items-center ml-2"
                onClick={() => setShowDateOfBirthDialog(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />Edit
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (field.key === 'maritalStatus') {
      return (
        <div key={field.key} className="relative border-b last:border-b-0">
          <div className="flex items-center py-2">
            <span className="text-sm text-muted-foreground w-1/3">
              {field.label}
            </span>
            <div className="flex items-center justify-between flex-1">
              <span className={`text-sm ${hasValue ? '' : 'text-muted-foreground'}`}>
                {hasValue ? value : 'No Details'}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex items-center ml-2"
                onClick={() => setShowMaritalStatusDialog(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />Edit
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (field.key === 'gender') {
      return (
        <div key={field.key} className="relative border-b last:border-b-0">
          <div className="flex items-center py-2">
            <span className="text-sm text-muted-foreground w-1/3">
              {field.label}
            </span>
            <div className="flex items-center justify-between flex-1">
              <span className={`text-sm ${hasValue ? '' : 'text-muted-foreground'}`}>
                {hasValue ? value : 'No Details'}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex items-center ml-2"
                onClick={() => setShowGenderDialog(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />Edit
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (field.key === 'status') {
      return (
        <div key={field.key} className="relative border-b last:border-b-0">
          <div className="flex items-center py-2">
            <span className="text-sm text-muted-foreground w-1/3">
              {field.label}
            </span>
            <div className="flex items-center justify-between flex-1">
              <span className={`text-sm ${hasValue ? '' : 'text-muted-foreground'}`}>
                {hasValue ? value : 'No Details'}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex items-center ml-2"
                onClick={() => setShowStatusDialog(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />Edit
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    // If it's a textarea field, render it differently
    if (field.isTextarea) {
      return (
        <div key={field.key} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {field.label}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 flex items-center"
              onClick={() => setEditField(field.key)}
            >
              <Pencil className="h-4 w-4 mr-2" />Edit
            </Button>
          </div>
          <Textarea
            value={hasValue ? rawValue : ''}
            placeholder="No Details"
            className="min-h-[80px] resize-none"
            readOnly
          />
          <EditFieldModal
            open={editField === field.key}
            onClose={() => setEditField(null)}
            fieldName={field.label}
            currentValue={typeof rawValue === 'string' ? rawValue : ''}
            onSave={(val: string) => handleSave(field.key, val)}
            isTextarea={true}
          />
        </div>
      );
    }
    
    return (
      <div key={field.key} className="relative border-b last:border-b-0">
        <div className="flex items-center py-2">
          <span className="text-sm text-muted-foreground w-1/3">
            {field.label}
          </span>
          <div className="flex items-center justify-between flex-1">
            <span className={`text-sm ${hasValue ? '' : 'text-muted-foreground'}`}>
              {hasValue ? value : 'No Details'}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 flex items-center ml-2"
              onClick={() => setEditField(field.key)}
            >
              <Pencil className="h-4 w-4 mr-2" />Edit
            </Button>
            <EditFieldModal
              open={editField === field.key}
              onClose={() => setEditField(null)}
              fieldName={field.label}
              currentValue={typeof rawValue === 'string' ? rawValue : Array.isArray(rawValue) ? rawValue.join(', ') : ''}
              onSave={(val: string) => handleSave(field.key, val)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSkillField = (field: any) => {
    const rawValue = localCandidate?.[field.key];
    const hasValue = rawValue !== undefined && rawValue !== null && 
      (Array.isArray(rawValue) ? rawValue.length > 0 : rawValue !== '');
    
    // Display value: if array, join with commas; if string, use as is
    const displayValue = Array.isArray(rawValue) ? rawValue.join(', ') : rawValue;
    
    return (
      <div key={field.key} className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {field.label}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex items-center"
            onClick={() => setEditField(field.key)}
          >
            <Pencil className="h-4 w-4 mr-2" />Edit
          </Button>
        </div>
        <Textarea
          value={hasValue ? displayValue : ''}
          placeholder="No Details"
          className="min-h-[80px] resize-none"
          readOnly
        />
        <EditFieldModal
          open={editField === field.key}
          onClose={() => setEditField(null)}
          fieldName={field.label}
          currentValue={displayValue || ''}
          onSave={(val: string) => {
            // Convert comma-separated string back to array
            const arrayValue = val.trim() ? val.split(',').map(item => item.trim()).filter(item => item) : [];
            handleSave(field.key, arrayValue);
          }}
          isTextarea={true}
        />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      <div className="space-y-6">
        {/* Details Section */}
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Details</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          {/* Default visible fields */}
          <div className="px-4 pb-4">
            <div className="space-y-3">
              {defaultDetailsFields.map((field) => renderField(field, defaultDetailsFields))}
            </div>
          </div>
          {/* Collapsible additional fields */}
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              {collapsibleDetailsFields.map((field) => renderField(field, collapsibleDetailsFields))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <div className="space-y-6">
        {/* Contact Info Section */}
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Contact Info</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              {contactFields.map((field) => renderField(field, contactFields))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Salary Range Section */}
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Salary Range</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <SalaryRange
              candidate={localCandidate}
              onCandidateUpdate={onCandidateUpdate}
            />
          </CollapsibleContent>
        </Collapsible>
        
        {/* Previous Company Info Section */}
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Previous Company Info</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              {previousCompanyFields.map((field) => renderField(field, previousCompanyFields))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Skill Section */}
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Skill</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              {skillFields.map((field) => renderSkillField(field))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Candidate Team Info Section */}
        {/* <CandidateTeamInfoSection
          candidateDetails={localCandidate}
          handleUpdateField={(fieldKey) => (value) => handleSave(fieldKey, value)}
        /> */}
      </div>

      {/* Resume Upload Dialog */}
      <ResumeUploadDialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onResumeUploaded={handleResumeUpload}
        candidateId={localCandidate?._id}
      />

      {/* Date of Birth Dialog */}
      <DateOfBirthDialog
        open={showDateOfBirthDialog}
        onClose={() => setShowDateOfBirthDialog(false)}
        currentValue={localCandidate?.dateOfBirth}
        onSave={handleDateOfBirthSave}
      />

      {/* Marital Status Dialog */}
      <MaritalStatusDialog
        open={showMaritalStatusDialog}
        onClose={() => setShowMaritalStatusDialog(false)}
        currentValue={localCandidate?.maritalStatus}
        onSave={handleMaritalStatusSave}
      />

      {/* Gender Dialog */}
      <GenderDialog
        open={showGenderDialog}
        onClose={() => setShowGenderDialog(false)}
        currentValue={localCandidate?.gender}
        onSave={handleGenderSave}
      />

      {/* Status Dialog */}
      <StatusDialog
        open={showStatusDialog}
        onClose={() => setShowStatusDialog(false)}
        currentValue={localCandidate?.status}
        onSave={handleStatusSave}
      />
    </div>
  );
};

export default CandidateSummary;
