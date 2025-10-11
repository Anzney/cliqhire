"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface TagsInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  name?: string;
}

export function TagsInput({ value, onChange, placeholder, name }: TagsInputProps) {
  const [input, setInput] = React.useState("");

  function addTag(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 rounded-md border border-neutral-300 p-2 dark:border-neutral-700">
        {value.map((tag) => (
          <Badge key={tag} className="flex items-center gap-1">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`} className="ml-1 opacity-70 hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
        <Input
          name={name}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="border-0 focus-visible:ring-0 flex-1 min-w-[120px] p-0 h-7"
        />
      </div>
    </div>
  );
}
