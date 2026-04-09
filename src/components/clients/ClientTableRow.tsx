"use client";
import { TableRow, TableCell } from "@/components/ui/table";
import { ClientStageBadge } from "@/components/client-stage-badge";
import { ClientStageStatusBadge } from "@/components/client-stage-status-badge";
import { useRouter } from "next/navigation";
import { ClientStageStatus } from "@/services/clientService";
import React from "react";

export interface ClientTableRowProps {
  client: {
    clientId?: string;
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
    createdBy?: string;
    clientAge?: {
      years: number;
      months: number;
      days: number;
    };
  };
  onStageChange: (clientId: string, newStage: "Lead" | "Engaged" | "Signed") => void;
  onStatusChange: (clientId: string, newStatus: ClientStageStatus) => void;
  canModify?: boolean;
}

const formatClientAge = (age?: { years: number; months: number; days: number }) => {
  if (!age) return "0d";
  const { years, months, days } = age;
  
  if (years > 0) {
    return `${years}y${months > 0 ? ` ${months}m` : ''}`;
  } else if (months > 0) {
    return `${months}m${days > 0 ? ` ${days}d` : ''}`;
  } else {
    return `${days}d`;
  }
};

const ClientTableRow: React.FC<ClientTableRowProps> = ({
  client,
  onStageChange,
  onStatusChange,
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
          {client.clientId}
        </span>
      </TableCell>
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
        {formatClientAge(client.clientAge)}
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[100px]">
        {client.jobCount}
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[150px]">
        {client.createdBy || "N/A"}
      </TableCell>
    </>
  );
};

export default ClientTableRow;
