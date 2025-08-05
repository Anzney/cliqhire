import { CollapsibleSection } from "@/components/clients/summary/collapsible-section";
import { DetailRow } from "@/components/clients/summary/detail-row";

interface CandidateTeamInfoSectionProps {
  candidateDetails: any;
  handleUpdateField: (field: string) => (value: string) => void;
}

export function CandidateTeamInfoSection({ candidateDetails, handleUpdateField }: CandidateTeamInfoSectionProps) {
  return (
    <CollapsibleSection title="Candidate Team Info">
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
        <DetailRow
          label="Recruitment Manager"
          value={candidateDetails.recruitmentManager}
          onUpdate={(val: string) => handleUpdateField("recruitmentManager")(val)}
        />
        <DetailRow
          label="Recruiter"
          value={candidateDetails.recruiter}
          onUpdate={(val: string) => handleUpdateField("recruiter")(val)}
        />
        <DetailRow
          label="Team Lead"
          value={candidateDetails.teamLead}
          onUpdate={(val: string) => handleUpdateField("teamLead")(val)}
        />
      </div>
    </CollapsibleSection>
  );
} 