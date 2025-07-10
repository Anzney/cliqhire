"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '@/styles/phone-input-override.css';

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
  const [value, setValue] = useState(currentValue)
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    currentValue ? new Date(currentValue) : null
  )

  const handleSave = () => {
    if (isDate && selectedDate) {
      onSave(selectedDate.getFullYear().toString())
    } else {
      onSave(value)
    }
    onClose()
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {fieldName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="value">{fieldName}</Label>
            {fieldName === "Client Phone Number" ? (
              <PhoneInput
                country={"sa"}
                value={value || "966"}
                onChange={val => setValue(val || "")}
                inputClass="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                inputProps={{ id: 'value', required: true }}
                enableSearch={true}
              />
            ) : isDate ? (
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  showYearPicker
                  dateFormat="yyyy"
                  yearItemNumber={12}
                  className="w-full p-2 border rounded-md"
                  placeholderText="Select Year"
                />
              </div>
            ) : options ? (
              <select
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${fieldName.toLowerCase()}`}
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}