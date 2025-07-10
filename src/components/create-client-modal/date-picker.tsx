import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

type DatePickerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: Date;
  setValue: (value: Date) => void;
}

const DatePicker = (
  {
    open,
    setOpen,
    value,
    setValue,
  }: DatePickerProps
) => {
  const handleSelectDate = (date: Date) => {
    setValue(date);
    setOpen(false);
  }
  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          id="date-picker"
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value
            ? format(value, "PPP")
            : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value}
          onSelect={(date) => handleSelectDate(date!)}
          fromDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker