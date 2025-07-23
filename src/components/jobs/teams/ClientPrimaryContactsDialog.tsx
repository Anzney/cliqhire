import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Pencil, Check, Ghost } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface ClientPrimaryContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  primaryContacts: any[];
  onSave: (updatedContacts: any[], selectedContactIds: string[]) => void;
  countryCodes: { code: string; label: string }[];
  positionOptions: { value: string; label: string }[];
  AddContactModal: React.ComponentType<any>;
}

export function ClientPrimaryContactsDialog({
  open,
  onOpenChange,
  primaryContacts,
  onSave,
  countryCodes,
  positionOptions,
  AddContactModal,
}: ClientPrimaryContactsDialogProps) {
  const [dialogSelectedContactIds, setDialogSelectedContactIds] = useState<string[]>([]);
  const [dialogNewContacts, setDialogNewContacts] = useState<any[]>([]);
  const [editContact, setEditContact] = useState<any | null>(null);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (open) {
      setDialogSelectedContactIds([]);
      setDialogNewContacts([]);
      setEditContact(null);
    }
  }, [open]);

  const getCountryCodeLabel = (code: string) => {
    const country = countryCodes.find((option) => option.code === code);
    return country ? country.label : code;
  };

  // Helper to check if a contact is new
  const isNewContact = (contact: any) => dialogNewContacts.some((nc) => nc._id === contact._id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl min-h-[400px] flex flex-col !pt-0 h-[500px] mt-2" showCloseButton={false}>
        <TooltipProvider>
          {/* Fixed header inside dialog */}
          <div className="flex items-center justify-between text-lg font-bold !mb-0 !mt-4 !pb-0 !pt-0 sticky top-0 bg-white z-30">
            Primary Contacts
            <button
              className="ml-2 p-1 rounded hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              type="button"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {/* Scrollable content area for selection and contacts */}
          <div className="flex-1 overflow-auto !m-0 !p-0" style={{ minHeight: 0 }}>
            <Label className="!mb-0 mt-4 !pb-0 !pt-0">Select Primary Contact for this Job</Label>
            {/* Selection UI */}
            <Command className="w-full flex-col overflow-visible mt-2 !mb-0 !pt-0 !pb-0 !h-auto">
              {/* Sticky badges+input bar */}
              <div
                className="rounded-md border border-input w-full box-border flex flex-nowrap items-center px-3 py-2 text-sm bg-white z-20 sticky top-16 gap-x-2"
                style={{ top: 64 }}
              >
                {/* Show badges for selected primary contacts only */}
                {primaryContacts
                  .filter((c) => dialogSelectedContactIds.includes(c._id))
                  .map((contact: any) => (
                    <Badge key={contact._id} variant="secondary" className="select-none flex items-center gap-1 pr-1">
                      {contact.name}
                      <button
                        type="button"
                        className="ml-1 p-0.5 rounded hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDialogSelectedContactIds((ids) => ids.filter((id) => id !== contact._id));
                        }}
                        aria-label="Remove contact"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </Badge>
                  ))}
                <CommandPrimitive.Input
                  placeholder="Select contacts..."
                  className="flex-1 min-w-0 bg-transparent outline-none border-none border-transparent rounded-none m-0 p-0 placeholder:text-muted-foreground"
                  onFocus={() => setDropdownOpen(true)}
                  onBlur={() => setDropdownOpen(false)}
                />
              </div>
              {/* Scrollable dropdown below sticky bar */}
              {dropdownOpen && (
                <div className="relative w-full" style={{ maxHeight: 240 }}>
                  <CommandList>
                    <div className="absolute top-0 left-0 z-10 w-full rounded-md border bg-white text-popover-foreground shadow-md outline-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-60 overflow-y-auto">
                      <CommandGroup className="h-full w-full">
                        {primaryContacts.map((contact: any) => {
                          const isSelected = dialogSelectedContactIds.includes(contact._id);
                          return (
                            <CommandItem
                              key={contact._id}
                              onMouseDown={(e) => e.preventDefault()}
                              onSelect={() => {
                                setDialogSelectedContactIds((ids) =>
                                  isSelected
                                    ? ids.filter((id) => id !== contact._id)
                                    : [...ids, contact._id],
                                );
                              }}
                              className={`w-full cursor-pointer flex items-center bg-white ${isSelected ? "text-black" : ""}`}
                            >
                              <span className="truncate flex-1">{contact.name}</span>
                              {isSelected && (
                                <Check className="size-5 text-green-500"/>
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </div>
                  </CommandList>
                </div>
              )}
            </Command>
            {/* Unified contact list (primary + new) */}
            {(() => {
              // Only show selected primary contacts and all new contacts
              const selectedPrimaryContacts = primaryContacts.filter((pc) =>
                dialogSelectedContactIds.includes(pc._id),
              );
              const allContacts = [
                ...selectedPrimaryContacts,
                ...dialogNewContacts.filter(
                  (nc) => !selectedPrimaryContacts.some((pc) => pc._id === nc._id),
                ),
              ];
              if (allContacts.length === 0) return null;
              return (
                <div className="mt-3">
                  <h3 className="text-sm font-semibold mb-2">Contacts</h3>
                  {(() => {
                    let newContactLabelShown = false;
                    return allContacts.map((contact: any, idx: number) => {
                      const isSelected = dialogSelectedContactIds.includes(contact._id);
                      const isNew = isNewContact(contact);
                      const showNewContactLabel = isNew && !newContactLabelShown;
                      if (showNewContactLabel) newContactLabelShown = true;
                      return (
                        <React.Fragment key={contact._id}>
                          {showNewContactLabel && (
                            <div className="mb-2">
                              <h3 className="text-sm font-semibold">New Contact</h3>
                            </div>
                          )}
                          <div className="p-3 rounded-md border mb-2 bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 flex  gap-8">
                                <div>
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 mr-1">
                                      Name:
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {contact.firstName || contact.lastName
                                        ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
                                        : contact.name || "Unnamed Contact"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 mr-1">
                                      Position:
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {contact.position || "—"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 mr-1">
                                      Email:
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {contact.email || "—"}
                                    </span>
                                  </div>
                                </div>
                                {/* Row 2: Phone | Position */}
                                <div>
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 mr-1">
                                      Gender:
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {contact.gender || "—"}
                                    </span>
                                  </div>

                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 mr-1">
                                      LinkedIn:
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {contact.linkedin ? (
                                        <a
                                          href={contact.linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-gray-500 hover:underline"
                                        >
                                          {contact.linkedin}
                                        </a>
                                      ) : (
                                        "No LinkedIn"
                                      )}
                                    </span>
                                  </div>

                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 mr-1">
                                      Phone Number:
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {getCountryCodeLabel(contact.countryCode || "")}
                                      <span className="mx-1">-</span>
                                      {contact.phone || "No phone"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* For new contacts, show Edit button */}
                              {isNew && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="ml-2 flex items-center gap-1 border border-gray-300 shadow-none"
                                      onClick={() => {
                                        setEditContact(contact);
                                        setAddContactOpen(true);
                                      }}
                                      type="button"
                                    >
                                      <Pencil className="w-4 h-4 text-black" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit</TooltipContent>
                                </Tooltip>
                              )}
                              {/* For selected primary contacts, show red cross button for removal */}
                              {!isNew && isSelected && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() =>
                                        setDialogSelectedContactIds((ids) =>
                                          ids.filter((id) => id !== contact._id),
                                        )
                                      }
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                    >
                                      <X className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Remove</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    });
                  })()}
                </div>
              );
            })()}
          </div>
          {/* Fixed footer inside dialog */}
          <div className="flex items-center justify-between mt-4 border-t pt-4 bg-white">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setAddContactOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add New Contact
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                // Merge dialog new contacts into main primaryContacts (avoid duplicates by _id)
                const ids = new Set(primaryContacts.map((c) => c._id));
                const updatedContacts = [
                  ...primaryContacts,
                  ...dialogNewContacts.filter((nc) => !ids.has(nc._id)),
                ];
                onSave(updatedContacts, dialogSelectedContactIds);
                setEditContact(null);
                onOpenChange(false);
              }}
            >
              Save
            </Button>
          </div>
        </TooltipProvider>
      </DialogContent>
      <AddContactModal
        open={addContactOpen}
        onOpenChange={(open: boolean) => {
          setAddContactOpen(open);
          if (!open) setEditContact(null);
        }}
        onAdd={(contact: any) => {
          if (editContact) {
            // Update existing contact in dialogNewContacts
            setDialogNewContacts((prev) =>
              prev.map((c) =>
                c._id === editContact._id
                  ? {
                      ...c,
                      ...contact,
                      name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
                    }
                  : c,
              ),
            );
            setEditContact(null);
          } else {
            // Add new contact to dialogNewContacts
            const newId = Math.random().toString(36).substr(2, 9);
            setDialogNewContacts((prev) => [
              ...prev,
              {
                ...contact,
                _id: newId, // temp id
                name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
              },
            ]);
            // Automatically select the new contact
            setDialogSelectedContactIds((ids) => [...ids, newId]);
          }
        }}
        countryCodes={countryCodes}
        positionOptions={positionOptions}
        initialValues={editContact || undefined}
      />
    </Dialog>
  );
} 