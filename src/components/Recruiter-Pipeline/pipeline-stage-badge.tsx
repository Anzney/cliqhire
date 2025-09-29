"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { pipelineStages, getStageColor } from "./dummy-data";

export type PipelineStage = typeof pipelineStages[number];

interface PipelineStageBadgeProps {
  stage: PipelineStage;
  onStageChange?: (newStage: PipelineStage) => void;
  isReadOnly?: boolean;
}

export function PipelineStageBadge({ 
  stage, 
  onStageChange, 
  isReadOnly = false 
}: PipelineStageBadgeProps) {
  const handleClick = (stageOption: PipelineStage) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      if (onStageChange) {
        onStageChange(stageOption);
      }
    };
  };

  // If read-only, just show the badge without dropdown
  if (isReadOnly) {
    return (
      <Badge 
        variant="secondary" 
        className={`${getStageColor(stage)} border-none`}
      >
        {stage}
      </Badge>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-auto p-0 hover:bg-transparent"
        >
          <Badge 
            variant="secondary" 
            className={`${getStageColor(stage)} border-none flex items-center gap-1`}
          >
            {stage}
            <ChevronDown className="h-3 w-3" />
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {pipelineStages.map((stageOption) => (
          <DropdownMenuItem
            key={stageOption}
            onClick={handleClick(stageOption)}
            className="flex items-center gap-2"
          >
            <Badge 
              variant="secondary" 
              className={`${getStageColor(stageOption)} border-none`}
            >
              {stageOption}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
