import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, Pencil, Users } from "lucide-react"
import { getJobById } from "@/services/jobService"
import { getClientById } from "@/services/clientService"
import { AddContactModal } from "@/components/clients/modals/add-contact-modal"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface ClientTeamProps {
  jobId: string;
}

export function ClientTeam({ jobId }: ClientTeamProps) {
  const [primaryContacts, setPrimaryContacts] = useState<any[]>([])
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
  const [selectedContacts, setSelectedContacts] = useState<any[]>([])
  const [showPrimaryContactsDialog, setShowPrimaryContactsDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addContactOpen, setAddContactOpen] = useState(false)
  // New state for newly added contacts (main state)
  const [newContacts, setNewContacts] = useState<any[]>([])
  // For editing
  const [editContact, setEditContact] = useState<any | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Temporary dialog state
  const [dialogSelectedContactIds, setDialogSelectedContactIds] = useState<string[]>([]);
  const [dialogNewContacts, setDialogNewContacts] = useState<any[]>([]);

  // Use the same options as in ContactsContent
  const countryCodes = [
    { code: "+966", label: "+966 (Saudi Arabia)" },
    { code: "+1", label: "+1 (USA)" },
    { code: "+91", label: "+91 (India)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+86", label: "+86 (China)" },
    { code: "+81", label: "+81 (Japan)" },
  ];
  const positionOptions = [
    { value: "HR", label: "HR" },
    { value: "Senior HR", label: "Senior HR" },
    { value: "Manager", label: "Manager" },
    { value: "Director", label: "Director" },
    { value: "Executive", label: "Executive" },
  ];

  // Add getCountryCodeLabel helper (copy from ContactsContent)
  const getCountryCodeLabel = (code: string) => {
    const country = countryCodes.find((option) => option.code === code);
    return country ? country.label : code;
  };

  // Add new contact to local state (for demo, append to primaryContacts)
  const handleAddContact = (contact: any) => {
    if (editContact) {
      // Update existing contact
      setNewContacts((prev) => prev.map((c) => c._id === editContact._id ? { ...c, ...contact, name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim() } : c))
      setEditContact(null)
    } else {
      // Add new contact
      setNewContacts((prev) => [
        ...prev,
        {
          ...contact,
          _id: Math.random().toString(36).substr(2, 9), // temp id
          name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
        },
      ])
    }
  }

  useEffect(() => {
    const fetchPrimaryContact = async () => {
      setError(null)
      try {
        const jobRes = await getJobById(jobId)
        let job = jobRes.data
        if (Array.isArray(job)) job = job[0]
        if (!job || typeof job !== 'object') throw new Error("Invalid job data")
        const clientId = (job as any)?.client?._id || (job as any)?.client
        if (!clientId) throw new Error("No clientId found for this job")
        const client = await getClientById(clientId)
        const contacts = client.primaryContacts || []
        setPrimaryContacts(contacts)
        // Remove default selection of all contacts:
        setSelectedContactIds([])
        setSelectedContacts([])
      } catch (err: any) {
        setError(err.message || "Failed to load primary contacts")
      } 
    }
    if (jobId) fetchPrimaryContact()
  }, [jobId])

  // Update selectedContacts whenever selectedContactIds or primaryContacts changes
  useEffect(() => {
    setSelectedContacts(
      primaryContacts.filter((c) => selectedContactIds.includes(c._id))
    )
  }, [selectedContactIds, primaryContacts])

  const contactOptions = primaryContacts.map((c) => ({
    label: c.name, // Only show name
    value: c._id,
  }))

  // Helper to check if a contact is new
  const isNewContact = (contact: any) => dialogNewContacts.some((nc) => nc._id === contact._id);

  return (
    <div className="bg-white rounded-lg border px-4 py-4 h-[60vh] flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Client Team</h2>
        <Button variant="default" size="sm" className="gap-1" onClick={() => {
          // When opening dialog, initialize dialog state from main state
          setDialogSelectedContactIds(selectedContactIds);
          setDialogNewContacts([]);
          setShowPrimaryContactsDialog(true)
        }}>
          <Plus className="w-4 h-4" />
          Primary Contacts
        </Button>
      </div>
      <div className="flex-1 overflow-auto mt-2">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {/* Show empty state if no contacts */}
        {(() => {
          // Only use primaryContacts after Save
          const selected = primaryContacts.filter(c => selectedContactIds.includes(c._id));
          if (selected.length === 0 && !error) {
            return (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                <Users className="w-10 h-10 mb-2" />
                <span className="text-base font-medium">Add primary contact related to this job.</span>
              </div>
            );
          }
          return (
            <div className="space-y-2">
              <Label className="mb-2 block text-sm">Team involved from client Side to handle this job</Label>
              {selected.map((contact: any) => (
                <div key={contact._id} className="p-3 rounded-md border bg-gray-50">
                  <div className="flex flex-col gap-1">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 mr-1">Name:</span>
                      <span className="text-sm text-muted-foreground">
                        {contact.firstName || contact.lastName ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim() : contact.name || 'Unnamed Contact'}
                      </span>
                    </div>
                    {contact.gender && (
                      <div className="text-sm text-muted-foreground">
                        <span className="text-xs font-semibold text-gray-500 mr-1">Gender:</span>
                        {contact.gender}
                      </div>
                    )}
                    {contact.position && (
                      <div className="text-sm text-muted-foreground">
                        <span className="text-xs font-semibold text-gray-500 mr-1">Position:</span>
                        {contact.position}
                      </div>
                    )}
                    {contact.email && (
                      <div className="text-sm text-muted-foreground">
                        <span className="text-xs font-semibold text-gray-500 mr-1">Email:</span>
                        {contact.email}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      <span className="text-xs font-semibold text-gray-500 mr-1">Phone Number:</span>
                      {getCountryCodeLabel(contact.countryCode || "")}
                      <span className="mx-1">-</span>
                      {contact.phone || "No phone"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="text-xs font-semibold text-gray-500 mr-1">LinkedIn:</span>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
      <Dialog open={showPrimaryContactsDialog} onOpenChange={setShowPrimaryContactsDialog}>
        <DialogContent className="max-w-3xl min-h-[400px] flex flex-col !pt-0 h-[500px] mt-2">
          <div className="flex-1 overflow-auto !m-0 !p-0">
            <div className="text-lg font-bold !mb-0 !mt-4 !pb-0 !pt-0">Primary Contacts</div>
            <Label className="!mb-0 !mt-0 !pb-0 !pt-0">Select Primary Contact for this Job</Label>
            {/* Selection UI */}
            <Command className="w-full flex-col overflow-visible !mt-0 !mb-0 !pt-0 !pb-0 !h-auto">
              <div className="rounded-md border border-input w-full box-border flex flex-nowrap items-center px-3 py-2 text-sm">
                {/* Show badges for selected primary contacts only */}
                {primaryContacts.filter(c => dialogSelectedContactIds.includes(c._id)).map((contact: any) => (
                  <Badge
                    key={contact._id}
                    variant="secondary"
                    className="select-none"
                  >
                    {contact.name}
                    <X
                      className="size-3 text-muted-foreground hover:text-foreground ml-2 cursor-pointer"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => setDialogSelectedContactIds(ids => ids.filter(id => id !== contact._id))}
                    />
                  </Badge>
                ))}
                <CommandPrimitive.Input
                  placeholder="Select contacts..."
                  className="flex-1 min-w-0 bg-transparent outline-none border-none border-transparent rounded-none m-0 p-0 placeholder:text-muted-foreground"
                  onFocus={() => setDropdownOpen(true)}
                  onBlur={() => setDropdownOpen(false)}
                />
              </div>
              {dropdownOpen && (
                <div className="relative mt-2">
                  <CommandList>
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none pr-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"> {/* Increased pr-8 and added custom scrollbar classes */}
                      <CommandGroup className="h-full overflow-auto">
                        {primaryContacts.map((contact: any) => {
                          const isSelected = dialogSelectedContactIds.includes(contact._id);
                          return (
                            <CommandItem
                              key={contact._id}
                              onMouseDown={e => e.preventDefault()}
                              onSelect={() => {
                                setDialogSelectedContactIds(ids =>
                                  isSelected
                                    ? ids.filter(id => id !== contact._id)
                                    : [...ids, contact._id]
                                );
                              }}
                              className={"cursor-pointer flex justify-between items-center"}
                            >
                              <span>{contact.name}</span>
                              {isSelected && (
                                <span className="ml-2 text-green-600">✔</span>
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
              const selectedPrimaryContacts = primaryContacts.filter(pc => dialogSelectedContactIds.includes(pc._id));
              const allContacts = [...selectedPrimaryContacts, ...dialogNewContacts.filter(nc => !selectedPrimaryContacts.some(pc => pc._id === nc._id))];
              if (allContacts.length === 0) return null;
              return (
                <div className="mt-0">
                  <h3 className="text-sm font-semibold !mb-0">Contacts</h3>
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
                            <div className="mb-1 text-xs text-gray-500 font-semibold">New Contact</div>
                          )}
                          <div className="p-3 rounded-md border mb-2 bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 flex flex-col gap-1">
                                <div>
                                  <span className="text-xs font-semibold text-gray-500 mr-1">Name:</span>
                                  <span className="text-sm text-muted-foreground">
                                    {contact.firstName || contact.lastName ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim() : contact.name || 'Unnamed Contact'}
                                  </span>
                                </div>
                                {contact.gender && (
                                  <div className="text-sm text-muted-foreground">
                                    <span className="text-xs font-semibold text-gray-500 mr-1">Gender:</span>
                                    {contact.gender}
                                  </div>
                                )}
                                {contact.position && (
                                  <div className="text-sm text-muted-foreground">
                                    <span className="text-xs font-semibold text-gray-500 mr-1">Position:</span>
                                    {contact.position}
                                  </div>
                                )}
                                {contact.email && (
                                  <div className="text-sm text-muted-foreground">
                                    <span className="text-xs font-semibold text-gray-500 mr-1">Email:</span>
                                    {contact.email}
                                  </div>
                                )}
                                <div className="text-sm text-muted-foreground">
                                  <span className="text-xs font-semibold text-gray-500 mr-1">Phone Number:</span>
                                  {getCountryCodeLabel(contact.countryCode || "")}
                                  <span className="mx-1">-</span>
                                  {contact.phone || "No phone"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  <span className="text-xs font-semibold text-gray-500 mr-1">LinkedIn:</span>
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
                                </div>
                              </div>
                              {/* For new contacts, show Edit button */}
                              {isNew && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-2 flex items-center gap-1 border border-gray-300 shadow-none"
                                  onClick={() => { setEditContact(contact); setAddContactOpen(true); }}
                                  type="button"
                                >
                                  <Pencil className="w-4 h-4 text-black" />
                                  <span className="text-xs text-black font-medium">Edit</span>
                                </Button>
                              )}
                              {/* For selected primary contacts, show red cross button for removal */}
                              {!isNew && isSelected && (
                                <button
                                  className="ml-2 p-1 rounded hover:bg-gray-100 z-10"
                                  title="Remove"
                                  onClick={() => setDialogSelectedContactIds(ids => ids.filter(id => id !== contact._id))}
                                  type="button"
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </button>
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
          <div className="flex items-center justify-between mt-4 border-t pt-4 bg-white">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setAddContactOpen(true)}>
              <Plus className="w-4 h-4" />
              Add New Contact
            </Button>
            <Button variant="default" size="sm" onClick={() => {
              // Merge dialog new contacts into main primaryContacts (avoid duplicates by _id)
              setPrimaryContacts(prev => {
                const ids = new Set(prev.map(c => c._id));
                return [...prev, ...dialogNewContacts.filter(nc => !ids.has(nc._id))];
              });
              // Update selectedContactIds to dialog selection (including new contacts)
              setSelectedContactIds(dialogSelectedContactIds);
              setNewContacts([]); // clear main newContacts (not used anymore)
              setEditContact(null);
              setShowPrimaryContactsDialog(false);
            }}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AddContactModal
        open={addContactOpen}
        onOpenChange={(open) => {
          setAddContactOpen(open)
          if (!open) setEditContact(null)
        }}
        onAdd={(contact: any) => {
          if (editContact) {
            // Update existing contact in dialogNewContacts
            setDialogNewContacts((prev) => prev.map((c) => c._id === editContact._id ? { ...c, ...contact, name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim() } : c))
            setEditContact(null)
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
            ])
            // Automatically select the new contact
            setDialogSelectedContactIds(ids => [...ids, newId]);
          }
        }}
        countryCodes={countryCodes}
        positionOptions={positionOptions}
        // Pass initial values for edit
        initialValues={editContact || undefined}
      />
    </div>
  )
} 