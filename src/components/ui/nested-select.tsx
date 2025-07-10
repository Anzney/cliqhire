"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NestedSelectOption {
  value: string
  label: string
  children?: NestedSelectOption[]
}

interface NestedSelectProps {
  options: NestedSelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

// Custom hook for handling menu open state with delay
function useDelayedMenuState(initialState = false, delay = 200) {
  const [isOpen, setIsOpen] = React.useState(initialState);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const setOpen = React.useCallback((newState: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!newState) {
      // Delay closing the menu
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, delay);
    } else {
      // Open immediately
      setIsOpen(true);
    }
  }, [delay]);

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [isOpen, setOpen] as const;
}

const StableDropdownMenuSub: React.FC<{
  value: string;
  label: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}> = ({ value, label, children, onSelect }) => {
  const [isSubMenuOpen, setSubMenuOpen] = useDelayedMenuState();
  
  // This captures clicks directly on the parent menu item (not its submenu items)
  const handleParentClick = () => {
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <DropdownMenuSub open={isSubMenuOpen}>
      <DropdownMenuSubTrigger 
        className="flex items-center justify-between"
        onMouseEnter={() => setSubMenuOpen(true)}
        onMouseLeave={() => setSubMenuOpen(false)}
        onClick={(e) => {
          // Only select the parent if explicitly clicked
          e.stopPropagation();
          handleParentClick();
        }}
      >
        <span>{label}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent 
        className="min-w-[8rem]"
        onMouseEnter={() => setSubMenuOpen(true)}
        onMouseLeave={() => setSubMenuOpen(false)}
        sideOffset={2}
      >
        {children}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export function NestedSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
}: NestedSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || "");
  
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onValueChange?.(optionValue);
    setIsOpen(false); // Close dropdown after selection
  };

  const getSelectedLabel = (options: NestedSelectOption[], value: string): string => {
    for (const option of options) {
      if (option.value === value) {
        return option.label;
      }
      if (option.children) {
        const childLabel = getSelectedLabel(option.children, value);
        if (childLabel) return childLabel;
      }
    }
    return "";
  };

  const renderOptions = (options: NestedSelectOption[]): React.ReactNode => {
    return options.map((option) => {
      if (option.children && option.children.length > 0) {
        return (
          <StableDropdownMenuSub 
            key={option.value}
            value={option.value}
            label={option.label}
            onSelect={handleSelect}
          >
            {renderOptions(option.children)}
          </StableDropdownMenuSub>
        );
      }

      return (
        <DropdownMenuItem
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className="flex items-center justify-between"
        >
          <span>{option.label}</span>
          {selectedValue === option.value && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      );
    });
  };

  const selectedLabel = selectedValue ? getSelectedLabel(options, selectedValue) : "";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("justify-between font-normal", !selectedValue && "text-muted-foreground", className)}
        >
          {selectedLabel || placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[450px] p-0"
        sideOffset={4}
      >
        {renderOptions(options)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}