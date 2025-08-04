import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { EditFieldModal } from "./edit-field-modal";
import { toast } from "sonner";

const detailsFields = [
  { key: "name", label: "Candidate Name" },
  { key: "location", label: "Location" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills", render: (val: string[] | undefined) => val && val.length ? val.join(", ") : undefined },
  { key: "resume", label: "Resume", render: (val: string | undefined) => val ? <a href={val} target="_blank" rel="noopener noreferrer" className="underline">View Resume</a> : undefined },
  { key: "status", label: "Status" },
  { key: "referredBy", label: "Referred By" },
  { key: "gender", label: "Gender" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "maritalStatus", label: "Marital Status" },
  { key: "country", label: "Country" },
  { key: "nationality", label: "Nationality" },
  { key: "universityName", label: "University Name" },
];

const contactFields = [
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email" },
  { key: "otherPhone", label: "Other Phone Number" },
  { key: "linkedin", label: "LinkedIn" },
];

interface CandidateSummaryProps {
  candidate: any;
  onCandidateUpdate?: (updatedCandidate: any) => void;
}

const CandidateSummary = ({ candidate, onCandidateUpdate }: CandidateSummaryProps) => {
  const [editField, setEditField] = useState<string | null>(null);
  const [localCandidate, setLocalCandidate] = useState(candidate);

  const handleSave = (fieldKey: string, newValue: any) => {
    const updatedCandidate = { ...localCandidate, [fieldKey]: newValue };
    setLocalCandidate(updatedCandidate);
    setEditField(null);
    
    // Notify parent component of the update
    if (onCandidateUpdate) {
      onCandidateUpdate(updatedCandidate);
    }
    
    // Show success toast message
    const allFields = [...detailsFields, ...contactFields];
    const fieldLabel = allFields.find(field => field.key === fieldKey)?.label || fieldKey;
    toast.success(`${fieldLabel} updated successfully`);
  };

  const renderField = (field: any, fieldArray: any[]) => {
    const rawValue = localCandidate?.[field.key];
    const value = field.render ? field.render(rawValue) : rawValue;
    const hasValue = rawValue !== undefined && rawValue !== null && rawValue !== '' && (!Array.isArray(rawValue) || rawValue.length > 0);
    
    return (
      <div key={field.key} className="relative border-b last:border-b-0">
        <div className="flex items-center py-2">
          <span className="text-sm text-muted-foreground w-1/3">
            {field.label}
          </span>
          <div className="flex items-center justify-between flex-1">
            <span className={`text-sm ${hasValue ? '' : 'text-muted-foreground'}`}>{hasValue ? value : 'No Details'}</span>
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

  return (
    <div className="flex gap-6">
      {/* Details Section */}
      <div className="bg-white rounded-xl shadow p-6 flex-1">
        <div className="font-medium text-lg mb-4">Details</div>
        {detailsFields.map((field) => renderField(field, detailsFields))}
      </div>
      
      {/* Contact Info Section */}
      <div className="bg-white rounded-xl shadow p-6 flex-1 h-fit">
        <div className="font-medium text-lg mb-4">Contact Info</div>
        {contactFields.map((field) => renderField(field, contactFields))}
      </div>
    </div>
  );
};

export default CandidateSummary;
