"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const stages: (keyof typeof stageColors)[] = [
  'Lead',
  'Negotiation',
  'Engaged',
  'Signed'
]

const stageColors = {
  Lead: "bg-blue-100 text-blue-800",
  Negotiation: "bg-purple-100 text-purple-800",
  Engaged: "bg-yellow-100 text-gray-800",
  Signed: "bg-green-100 text-green-800",
} as const

interface ClientStageBadgeProps {
  id?: string
  stage: keyof typeof stageColors
  onStageChange?: (id: string, newStage: keyof typeof stageColors) => void
}

export function ClientStageBadge({ id, stage, onStageChange }: ClientStageBadgeProps) {
  if (!onStageChange) {

    return (
      <Badge variant="secondary" className={`${stageColors[stage]} border-none`}>
        {stage}
      </Badge>
    )
    
  }

  const handleClick = (id: string | undefined, option: keyof typeof stageColors) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation()
      if (id && onStageChange) {
        onStageChange(id, option)
      } else {
        console.error('Cannot change stage: id is undefined or onStageChange is not provided')
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-auto p-0 hover:bg-transparent"
        >
          <Badge 
            variant="secondary" 
            className={`${stageColors[stage]} border-none flex items-center gap-1`}
          >
            {stage}
            <ChevronDown className="h-3 w-3" />
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {stages.map((stageOption) => (
          <DropdownMenuItem
            key={stageOption}
            onClick={handleClick(id, stageOption)}
            data-testid={`stage-option-${stageOption}`}
            className="flex items-center gap-2"
          >
            <Badge 
              variant="secondary" 
              className={`${stageColors[stageOption]} border-none text-black`}
            >
              {stageOption}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}