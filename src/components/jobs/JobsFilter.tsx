"use client";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { X } from "lucide-react";

type JobStage = "Open" | "Hired" | "On Hold" | "Closed" | "Active" | "Onboarding";

export interface JobsFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  positionName: string;
  onPositionNameChange: (value: string) => void;
  jobOwner: string;
  onJobOwnerChange: (value: string) => void;
  selectedStages: JobStage[];
  onStagesChange: (stages: JobStage[]) => void;
  availableStages?: JobStage[];
  jobOwners?: string[];
  onApply?: () => void;
  onClear?: () => void;
}

export function JobsFilter({
  open,
  onOpenChange,
  positionName,
  onPositionNameChange,
  jobOwner,
  onJobOwnerChange,
  selectedStages,
  onStagesChange,
  availableStages = ["Open", "Hired", "On Hold", "Closed", "Active", "Onboarding"],
  jobOwners = [],
  onApply,
  onClear,
}: JobsFilterProps) {
  const ownerOptions = useMemo(() => Array.from(new Set(jobOwners)).filter(Boolean), [jobOwners]);
  const [ownerPopoverOpen, setOwnerPopoverOpen] = useState(false);
  const ownerInputRef = useRef<HTMLInputElement | null>(null);

  const toggleStage = (stage: JobStage) => {
    if (selectedStages.includes(stage)) {
      onStagesChange(selectedStages.filter((s) => s !== stage));
    } else {
      onStagesChange([...selectedStages, stage]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[190px] sm:w-[210px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <Label htmlFor="positionName">Position Name</Label>
            <Input
              id="positionName"
              placeholder="Search by position name"
              value={positionName}
              onChange={(e) => onPositionNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Job Owner</Label>
            <div className="relative">
              <Input
                ref={ownerInputRef as any}
                placeholder="Type to search or enter owner"
                value={jobOwner}
                onChange={(e) => {
                  onJobOwnerChange(e.target.value);
                  if (!ownerPopoverOpen) setOwnerPopoverOpen(true);
                }}
                onFocus={() => setOwnerPopoverOpen(true)}
              />
              {!!jobOwner && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => onJobOwnerChange("")}
                  aria-label="Clear owner"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Popover open={ownerPopoverOpen} onOpenChange={setOwnerPopoverOpen}>
                <PopoverTrigger asChild>
                  {/* Hidden trigger: we manage open state via input focus/typing */}
                  <span className="hidden" />
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[260px]" align="start">
                  <Command>
                    <CommandInput placeholder="Search owners..." value={jobOwner} onValueChange={onJobOwnerChange} />
                    <CommandEmpty>No owners found.</CommandEmpty>
                    <CommandGroup>
                      {ownerOptions
                        .filter((o) => o.toLowerCase().includes((jobOwner || "").toLowerCase()))
                        .slice(0, 20)
                        .map((owner) => (
                          <CommandItem
                            key={owner}
                            value={owner}
                            onSelect={() => {
                              onJobOwnerChange(owner);
                              setOwnerPopoverOpen(false);
                              ownerInputRef.current?.blur();
                            }}
                          >
                            {owner}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Job Stage</Label>
            <div className="grid grid-cols-2 gap-3">
              {availableStages.map((stage) => (
                <label key={stage} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedStages.includes(stage)}
                    onCheckedChange={() => toggleStage(stage)}
                  />
                  <span>{stage}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClear}>Clear</Button>
          <Button onClick={onApply}>Apply</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default JobsFilter;


