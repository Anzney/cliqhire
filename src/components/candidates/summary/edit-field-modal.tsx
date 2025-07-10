"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EditFieldModalProps {
  open: boolean;
  onClose: () => void;
  fieldName: string;
  currentValue?: string;
  onSave: (value: string) => void;
  isDate?: boolean;
  isNumber?: boolean;
  options?: { value: string; label: string }[];
}

export function EditFieldModal({
  open,
  onClose,
  fieldName,
  currentValue = "",
  isNumber,
  onSave,
  isDate,
  options
}: EditFieldModalProps) {
  const [value, setValue] = useState(currentValue);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    currentValue ? new Date(currentValue) : null
  );

  const handleSave = () => {
    if (isDate && selectedDate) {
      onSave(selectedDate.toISOString().split("T")[0]);
    } else {
      onSave(value);
    }
    onClose();
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {fieldName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="value">{fieldName}</Label>
            {isDate ? (
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="border p-2 rounded w-full"
                />
              </div>
            ) : options ? (
              <select
                className="w-full p-2 border rounded text-sm"
                value={value}
                onChange={e => setValue(e.target.value)}
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="value"
                type={isNumber ? "number" : "text"}
                value={value}
                onChange={e => setValue(e.target.value)}
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button onClick={handleSave} type="button">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
