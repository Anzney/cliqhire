import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { EditFieldModal } from "./edit-field-modal";

const fields = [
  { key: "name", label: "Candidate Name" },
  { key: "email", label: "Candidate Email" },
  { key: "phone", label: "Candidate Phone" },
  { key: "location", label: "Location" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills", render: (val: string[] | undefined) => val && val.length ? val.join(", ") : undefined },
  { key: "resume", label: "Resume", render: (val: string | undefined) => val ? <a href={val} target="_blank" rel="noopener noreferrer" className="underline">View Resume</a> : undefined },
  { key: "status", label: "Status" },
];

const CandidateSummary = ({ candidate }: { candidate: any }) => {
  const [editField, setEditField] = useState<string | null>(null);
  const [localCandidate, setLocalCandidate] = useState(candidate);

  const handleSave = (fieldKey: string, newValue: any) => {
    setLocalCandidate((prev: any) => ({ ...prev, [fieldKey]: newValue }));
    setEditField(null);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl">
      <div className="font-medium text-lg mb-4">Details</div>
      {fields.map((field, idx) => {
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
                  {hasValue ? (
                    <>
                      <Pencil className="h-4 w-4 mr-2" />Edit
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />Add
                    </>
                  )}
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
      })}
    </div>
  );
};

export default CandidateSummary;
