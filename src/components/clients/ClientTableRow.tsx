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
  
  const handleRowClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.client-stage-badge') && 
        !(e.target as HTMLElement).closest('.client-stage-status-badge')) {
      router.push(`/clients/${client.id}`);
    }
  };

  const handleCellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!(e.target as HTMLElement).closest('.client-stage-badge') && 
        !(e.target as HTMLElement).closest('.client-stage-status-badge')) {
      router.push(`/clients/${client.id}`);
    }
  };

  return (
    <>
      <TableCell className="text-sm font-medium px-4 py-2 w-[200px]" onClick={handleCellClick}>
        {client.name}
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[150px]" onClick={handleCellClick}>
        {client.industry}
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[150px]" onClick={handleCellClick}>
        {client.countryOfBusiness}
      </TableCell>
      <TableCell 
        className="text-sm px-4 py-2 w-[120px]"
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest(".client-stage-badge")) {
            router.push(`/clients/${client.id}`);
          }
        }}
      >
        <ClientStageBadge 
          id={client.id} 
          stage={client.clientStage} 
          onStageChange={onStageChange}
          disabled={!canModify}
        />
      </TableCell>
      <TableCell 
        className="text-sm px-4 py-2 w-[150px]"
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest(".client-stage-status-badge")) {
            router.push(`/clients/${client.id}`);
          }
        }}
      >
        <ClientStageStatusBadge
          id={client.id}
          status={client.clientSubStage}
          stage={client.clientStage}
          onStatusChange={onStatusChange}
          disabled={!canModify}
        />
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[120px]" onClick={handleCellClick}>
        {client.incorporationDate
          ? `${getYearDifference(client.incorporationDate)} years`
          : "0 years"}
      </TableCell>
      <TableCell className="text-sm px-4 py-2 w-[100px]" onClick={handleCellClick}>
        {client.jobCount}
      </TableCell>
    </>
  );
};

export default ClientTableRow;
