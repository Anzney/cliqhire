import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, X } from "lucide-react";
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from "lexical";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolbarPluginProps {
  disabled?: boolean;
}

export function ToolbarPlugin({ disabled = false }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  return (
    <div className="flex gap-2 border-b pb-1 mb-2">
      <Button type="button" size="icon" variant="outline" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        disabled={disabled}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button type="button" size="icon" variant="outline" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        disabled={disabled}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button type="button" size="icon" variant="outline" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        disabled={disabled}>
        <Underline className="w-4 h-4" />
      </Button>
      <Button type="button" size="icon" variant="outline" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        disabled={disabled}>
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button type="button" size="icon" variant="outline" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        disabled={disabled}>
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button type="button" size="icon" variant="outline" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        disabled={disabled}>
        <AlignRight className="w-4 h-4" />
      </Button>
      <Button type="button" size="icon" variant="outline" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        disabled={disabled}>
        <List className="w-4 h-4" />
      </Button>
      <Button type="button" size="icon" variant="outline" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        disabled={disabled}>
        <ListOrdered className="w-4 h-4" />
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="outline" onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}
              disabled={disabled}>
              <X className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove List</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 