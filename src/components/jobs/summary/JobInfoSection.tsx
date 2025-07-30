import { CollapsibleSection } from "@/components/clients/summary/collapsible-section";
import { DetailRow } from "@/components/clients/summary/detail-row";

interface JobInfoSectionProps {
  jobDetails: any;
  handleFieldEdit: (field: string, value: any, options?: any) => void;
}

export function JobInfoSection({ jobDetails, handleFieldEdit }: JobInfoSectionProps) {
  return (
    <CollapsibleSection title="Job Team Info">
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
        <DetailRow
          label="Recruitment Manager"
          value={jobDetails.recruitmentManager}
          onUpdate={(val: string) => handleFieldEdit("recruitmentManager", jobDetails.recruitmentManager)}
        />
        <DetailRow
          label="Recruiter"
          value={jobDetails.recruiter}
          onUpdate={(val: string) => handleFieldEdit("recruiter", jobDetails.recruiter)}
        />
        <DetailRow
          label="Team Lead"
          value={jobDetails.teamLead}
          onUpdate={(val: string) => handleFieldEdit("teamLead", jobDetails.teamLead)}
        />
      </div>
    </CollapsibleSection>
  );
} 