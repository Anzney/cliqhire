import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { DetailRow } from "@/components/clients/summary/detail-row";

interface CandidateTeamInfoSectionProps {
  candidateDetails: any;
  handleUpdateField: (field: string) => (value: string) => void;
}

export function CandidateTeamInfoSection({ candidateDetails, handleUpdateField }: CandidateTeamInfoSectionProps) {
  return (
    <Collapsible className="rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-semibold">Candidate Team Info</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs p-1">
            Show Complete Details
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-3">
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
      </CollapsibleContent>
    </Collapsible>
  );
} 