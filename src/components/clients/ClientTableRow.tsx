"use client";
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
    countryOfBusiness: string;
    clientStage: "Lead" | "Engaged" | "Signed";
    clientSubStage: ClientStageStatus;
    owner: string;
    team: string;
    createdAt: string;
    jobCount: number;
    incorporationDate: string;
  };
  onStageChange: (clientId: string, newStage: "Lead" | "Engaged" | "Signed") => void;
  onStatusChange: (clientId: string, newStatus: ClientStageStatus) => void;
  getYearDifference: (createdAt: string) => number;
  canModify?: boolean;
}

const ClientTableRow: React.FC<ClientTableRowProps> = ({
  client,
  onStageChange,
  onStatusChange,
  getYearDifference,
  canModify = false,
}) => {
  const router = useRouter();

  // Row-level clicks are now disabled, navigation only happens when clicking the name

  return (
    <>
      <TableCell className="text-sm px-4 py-2 w-[200px]">
        <span
          className="font-medium text-slate-900 hover:text-brand hover:underline cursor-pointer transition-colors block"
          onClick={() => router.push(`/clients/${client.id}`)}
        >
          {client.name}
        </span>
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[150px]">
        {client.industry}
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[150px]">
        {client.countryOfBusiness}
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[120px]">
        <ClientStageBadge
          id={client.id}
          stage={client.clientStage}
          onStageChange={onStageChange}
          disabled={!canModify}
        />
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[150px]">
        <ClientStageStatusBadge
          id={client.id}
          status={client.clientSubStage}
          stage={client.clientStage}
          onStatusChange={onStatusChange}
          disabled={!canModify}
        />
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[120px]">
        {client.incorporationDate
          ? `${getYearDifference(client.incorporationDate)} years`
          : "0 years"}
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[100px]">
        {client.jobCount}
      </TableCell>
    </>
  );
};

export default ClientTableRow;
