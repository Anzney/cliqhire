import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface EditExperienceDialogProps {
  open: boolean;
  onClose: () => void;
  currentValue: string;
  onSave: (value: string) => void;
}

export function EditExperienceDialog({
  open,
  onClose,
  currentValue,
  onSave,
}: EditExperienceDialogProps) {
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  // Parse current value when dialog opens
  useEffect(() => {
    if (open) {
      const match = currentValue.match(/(\d+)\s*-\s*(\d+)/);
      if (match) {
        setMinYear(match[1]);
        setMaxYear(match[2]);
      } else {
        // Try to find just numbers if pattern doesn't match exactly
        const numbers = currentValue.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          setMinYear(numbers[0]);
          setMaxYear(numbers[1]);
        } else if (numbers && numbers.length === 1) {
          setMinYear(numbers[0]);
          setMaxYear("");
        } else {
          setMinYear("");
          setMaxYear("");
        }
      }
    }
  }, [currentValue, open]);

  const handleSave = () => {
    if (!minYear && !maxYear) {
      onSave("");
      onClose();
      return;
    }
    
    // Ensure min is not greater than max if both are present
    let finalMin = minYear;
    let finalMax = maxYear;

    if (minYear && maxYear && parseInt(minYear) > parseInt(maxYear)) {
       // Swap or just use min as max? Let's just swap for convenience
       finalMin = maxYear;
       finalMax = minYear;
    }

    const formattedValue = `${finalMin || "0"} - ${finalMax || "0"} Years`;
    onSave(formattedValue);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Experience Range</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-year">Minimum Year</Label>
              <Input
                id="min-year"
                type="number"
                min="0"
                placeholder="Min"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-year">Maximum Year</Label>
              <Input
                id="max-year"
                type="number"
                min="0"
                placeholder="Max"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
