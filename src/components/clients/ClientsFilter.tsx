"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type ClientStage = "Lead" | "Engaged" | "Signed";

export interface ClientsFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  industry: string;
  onIndustryChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  selectedStages: ClientStage[];
  onStagesChange: (stages: ClientStage[]) => void;
  availableStages?: ClientStage[];
  onApply?: () => void;
  onClear?: () => void;
}

export default function ClientsFilter({
  open,
  onOpenChange,
  name,
  onNameChange,
  industry,
  onIndustryChange,
  location,
  onLocationChange,
  selectedStages,
  onStagesChange,
  availableStages = ["Lead", "Engaged", "Signed"],
  onApply,
  onClear,
}: ClientsFilterProps) {
  const toggleStage = (stage: ClientStage) => {
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
            <Label htmlFor="client-name">Name</Label>
            <Input
              id="client-name"
              placeholder="Search by name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-industry">Industry</Label>
            <Input
              id="client-industry"
              placeholder="Search by industry"
              value={industry}
              onChange={(e) => onIndustryChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-location">Location</Label>
            <Input
              id="client-location"
              placeholder="Search by location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <Label>Stage</Label>
            <div className="grid grid-cols-1 gap-3">
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


