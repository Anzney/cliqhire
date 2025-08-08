"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface NationalitySelectorProps {
  open: boolean;
  onClose: () => void;
  currentValue?: string[];
  onSave: (value: string[]) => void;
}

const NATIONALITY_OPTIONS = [
  "British",
  "Egyptian",
  "Expat",
  "Indian",
  "other",
  "Open",
  "Pakistani",
  "Saudi",
  "Arabic",
  "European",
];

export function NationalitySelector({
  open,
  onClose,
  currentValue = [],
  onSave,
}: NationalitySelectorProps) {
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>(currentValue || []);

  const handleSave = () => {
    onSave(selectedNationalities);
    onClose();
  };

  const handleNationalityChange = (nationality: string, checked: boolean) => {
    if (checked) {
      setSelectedNationalities((prev) => [...prev, nationality]);
    } else {
      setSelectedNationalities((prev) => prev.filter((n) => n !== nationality));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Nationalities</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nationality (Multiple Selection)</Label>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {NATIONALITY_OPTIONS.map((nationality) => (
                <div key={nationality} className="flex items-center space-x-2">
                  <Checkbox
                    id={nationality}
                    checked={selectedNationalities.includes(nationality)}
                    onCheckedChange={(checked) =>
                      handleNationalityChange(nationality, checked as boolean)
                    }
                  />
                  <Label htmlFor={nationality} className="text-sm font-normal">
                    {nationality}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
