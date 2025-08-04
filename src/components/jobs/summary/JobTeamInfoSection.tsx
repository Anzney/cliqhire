import { CollapsibleSection } from "@/components/clients/summary/collapsible-section";
import { DetailRow } from "@/components/clients/summary/detail-row";

interface JobInfoSectionProps {
  jobDetails: any;
  handleUpdateField: (field: string) => (value: string) => void;
}

export function JobTeamInfoSection({ jobDetails, handleUpdateField }: JobInfoSectionProps) {
  return (
    <CollapsibleSection title="Job Team Info">
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
        <DetailRow
          label="Recruitment Manager"
          value={jobDetails.recruitmentManager}
          onUpdate={(val: string) => handleUpdateField("recruitmentManager")}
        />
        <DetailRow
          label="Recruiter"
          value={jobDetails.recruiter}
          onUpdate={(val: string) => handleUpdateField("recruiter")}
        />
        <DetailRow
          label="Team Lead"
          value={jobDetails.teamLead}
          onUpdate={(val: string) => handleUpdateField("teamLead")}
        />
      </div>
    </CollapsibleSection>
  );
} 