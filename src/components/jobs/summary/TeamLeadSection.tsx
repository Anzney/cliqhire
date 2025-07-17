import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface TeamLeadSectionProps {
  name: string;
  onEdit?: () => void;
}

export const TeamLeadSection: React.FC<TeamLeadSectionProps> = ({ name, onEdit }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Team Lead</h2>
      <div className="bg-white rounded border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm text-muted-foreground">Team Lead</h3>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-black"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Name:</span>
          <span className="font-medium">{name || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}; 