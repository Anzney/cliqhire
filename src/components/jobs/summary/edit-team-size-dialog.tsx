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

interface EditTeamSizeDialogProps {
  open: boolean;
  onClose: () => void;
  currentValue: string | number;
  onSave: (value: string) => void;
}

export function EditTeamSizeDialog({
  open,
  onClose,
  currentValue,
  onSave,
}: EditTeamSizeDialogProps) {
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");

  // Parse current value when dialog opens
  useEffect(() => {
    if (open) {
      const stringValue = currentValue.toString();
      const match = stringValue.match(/(\d+)\s*-\s*(\d+)/);
      if (match) {
        setMinSize(match[1]);
        setMaxSize(match[2]);
      } else {
        // Try to find just numbers if pattern doesn't match exactly
        const numbers = stringValue.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          setMinSize(numbers[0]);
          setMaxSize(numbers[1]);
        } else if (numbers && numbers.length === 1) {
          setMinSize(numbers[0]);
          setMaxSize("");
        } else {
          setMinSize("");
          setMaxSize("");
        }
      }
    }
  }, [currentValue, open]);

  const handleSave = () => {
    if (!minSize && !maxSize) {
      onSave("");
      onClose();
      return;
    }
    
    // Ensure min is not greater than max if both are present
    let finalMin = minSize;
    let finalMax = maxSize;

    if (minSize && maxSize && parseInt(minSize) > parseInt(maxSize)) {
       // Swap
       finalMin = maxSize;
       finalMax = minSize;
    }

    const formattedValue = `${finalMin || "0"} - ${finalMax || "0"}`;
    onSave(formattedValue);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team Size</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-size">Minimum Size</Label>
              <Input
                id="min-size"
                type="number"
                min="0"
                placeholder="Min"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-size">Maximum Size</Label>
              <Input
                id="max-size"
                type="number"
                min="0"
                placeholder="Max"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
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
