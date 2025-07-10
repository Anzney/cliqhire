import { TableRow, TableCell } from "@/components/ui/table";
import { ClientStageBadge } from "@/components/client-stage-badge";
import { ClientStageStatusBadge } from "@/components/client-stage-status-badge";
import { useRouter } from "next/navigation";
import { ClientStageStatus } from "@/services/clientService";
import React from "react";

export interface ClientTableRowProps {
  client: {
    id: string;
    name: string;
    industry: string;
    location: string;
    stage: "Lead" | "Negotiation" | "Engaged" | "Signed";
    clientStageStatus: ClientStageStatus;
    owner: string;
    team: string;
    createdAt: string;
    jobCount: number;
    incorporationDate: string;
  };
  onStageChange: (clientId: string, newStage: "Lead" | "Negotiation" | "Engaged" | "Signed") => void;
  onStatusChange: (clientId: string, newStatus: ClientStageStatus) => void;
  getYearDifference: (createdAt: string) => number;
}

export const ClientTableRow: React.FC<ClientTableRowProps> = ({
  client,
  onStageChange,
  onStatusChange,
  getYearDifference,
}) => {
  const router = useRouter();
  return (
    <TableRow
      key={client.id}
      className="hover:bg-muted/50 cursor-pointer"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest(".client-stage-badge")) {
          router.push(`/clients/${client.id}`);
        }
      }}
    >
      <TableCell className="text-sm font-medium">{client.name}</TableCell>
      <TableCell className="text-sm">{client.industry}</TableCell>
      <TableCell className="text-sm">{client.location}</TableCell>
      <TableCell className="text-sm">
        <ClientStageBadge
          id={client.id}
          stage={client.stage}
          onStageChange={onStageChange}
        />
      </TableCell>
      <TableCell className="text-sm">
        <ClientStageStatusBadge
          id={client.id}
          status={client.clientStageStatus}
          stage={client.stage}
          onStatusChange={onStatusChange}
        />
      </TableCell>
      <TableCell className="text-sm">{client.owner}</TableCell>
      <TableCell className="text-sm">{client.team}</TableCell>
      <TableCell className="text-sm">
        {client.incorporationDate
          ? `${getYearDifference(client.incorporationDate)} years`
          : "0 years"}
      </TableCell>
      <TableCell className="text-sm">{client.jobCount}</TableCell>
    </TableRow>
  );
};

export default ClientTableRow; 