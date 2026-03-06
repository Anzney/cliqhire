"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { CountrySelect } from "@/components/ui/country-select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface NationalitySelectorProps {
  open: boolean;
  onClose: () => void;
  currentValue?: string[];
  onSave: (value: string[]) => void;
}

export function NationalitySelector({
  open,
  onClose,
  currentValue = [],
  onSave,
}: NationalitySelectorProps) {
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>([]);

  // Initialize state when the dialog is opened
  useEffect(() => {
    if (open) {
      setSelectedNationalities(currentValue || []);
    }
  }, [open, currentValue]);

  const handleSave = () => {
    onSave(selectedNationalities);
    onClose();
  };

  const handleAdd = (nationality: string) => {
    if (nationality && !selectedNationalities.includes(nationality)) {
      setSelectedNationalities((prev) => [...prev, nationality]);
    }
  };

  const handleRemove = (nationality: string) => {
    setSelectedNationalities((prev) => prev.filter((n) => n !== nationality));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Nationalities</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <Label>Nationalities</Label>

            <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
              {selectedNationalities.length === 0 ? (
                <span className="text-sm text-muted-foreground p-1">No nationalities selected</span>
              ) : (
                selectedNationalities.map((nationality) => (
                  <Badge key={nationality} variant="secondary" className="flex items-center gap-1">
                    {nationality}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => handleRemove(nationality)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              )}
            </div>

            <CountrySelect
              value={""} // Pass empty to reset search after selection
              onChange={handleAdd}
              type="nationality"
              placeholder="Search to add nationalities..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
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
