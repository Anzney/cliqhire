"use client";

import * as React from "react";
import { Check, MapPin, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocationSuggestions } from "@/hooks/useLocationSuggestions";

interface LocationInputProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  multiSelect?: boolean;
}

export function LocationInput({
  value,
  onChange,
  placeholder = "Search location...",
  className,
  disabled = false,
  multiSelect = false,
}: LocationInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  
  const values = Array.isArray(value) ? value : value ? [value] : [];

  const { data: suggestions, isLoading } = useLocationSuggestions(inputValue);

  const handleSelect = (currentLabel: string) => {
    if (multiSelect) {
      const newValue = values.includes(currentLabel)
        ? values.filter((v) => v !== currentLabel)
        : [...values, currentLabel];
      onChange(newValue);
    } else {
      onChange(currentLabel);
      setOpen(false);
    }
    setInputValue("");
  };

  const removeValue = (valToRemove: string) => {
    if (multiSelect && Array.isArray(value)) {
      onChange(value.filter((v) => v !== valToRemove));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {multiSelect && values.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {values.map((val) => (
            <div
              key={val}
              className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium border border-primary/20"
            >
              <span>{val}</span>
              <button
                type="button"
                onClick={() => removeValue(val)}
                className="hover:text-primary/70 transition-colors"
              >
                <Check className="h-3 w-3 rotate-45" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal hover:bg-slate-50 transition-colors border-slate-200 min-h-10 h-auto py-2 px-3",
              !value && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate">
                {!multiSelect && value ? value : placeholder}
                {multiSelect && values.length > 0 && `${values.length} selected`}
                {multiSelect && values.length === 0 && placeholder}
              </span>
            </div>
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Type a city name..." 
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center py-6 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Searching cities...
                </div>
              )}
              
              {!isLoading && inputValue.length < 2 && (
                <div className="py-6 text-center text-sm text-slate-500">
                  Please enter at least 2 characters to search
                </div>
              )}

              {!isLoading && inputValue.length >= 2 && suggestions?.length === 0 && (
                <CommandEmpty>No city found.</CommandEmpty>
              )}
              
              <CommandGroup>
                {suggestions?.map((suggestion) => (
                  <CommandItem
                    key={suggestion.label}
                    value={suggestion.label}
                    onSelect={() => handleSelect(suggestion.label)}
                    className="flex items-center justify-between py-3 cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{suggestion.city}</span>
                      <span className="text-xs text-slate-500">{suggestion.country}</span>
                    </div>
                    {values.includes(suggestion.label) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

