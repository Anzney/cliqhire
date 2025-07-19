import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, Pencil } from "lucide-react"
import { getJobById } from "@/services/jobService"
import { getClientById } from "@/services/clientService"
import { MultiSelector, MultiSelectorItem } from "@/components/ui/multi-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AddContactModal } from "@/components/clients/modals/add-contact-modal"

interface ClientTeamProps {
  jobId: string;
}

export function ClientTeam({ jobId }: ClientTeamProps) {
  const [primaryContacts, setPrimaryContacts] = useState<any[]>([])
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
  const [selectedContacts, setSelectedContacts] = useState<any[]>([])
  const [showSelect, setShowSelect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addContactOpen, setAddContactOpen] = useState(false)
  // New state for newly added contacts
  const [newContacts, setNewContacts] = useState<any[]>([])
  // For editing
  const [editContact, setEditContact] = useState<any | null>(null)

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

  return (
    <div className="bg-white rounded-lg border px-4 py-4 h-[60vh] flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Client Team</h2>
        <Popover open={showSelect} onOpenChange={setShowSelect}>
          <PopoverTrigger asChild>
            <Button variant="default" size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Primary Contacts
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72">
            {primaryContacts.length > 0 ? (
              <MultiSelector
                values={selectedContactIds}
                onValuesChange={setSelectedContactIds}
              >
                {primaryContacts.map((c) => (
                  <MultiSelectorItem key={c._id} value={c._id}>
                    {c.name}
                  </MultiSelectorItem>
                ))}
              </MultiSelector>
            ) : (
              <div className="text-sm text-gray-500">No primary contacts found.</div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 overflow-auto mt-2">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {selectedContactIds.length > 0 && (
          <div className="mt-4">
            {selectedContacts
              .map((contact) => (
                <div key={contact._id} className="p-2 border rounded mb-2 relative bg-white">
                  <button
                    className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 z-10"
                    title="Remove"
                    onClick={() => setSelectedContactIds(ids => ids.filter(id => id !== contact._id))}
                    type="button"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                  <div>
                    <div><b>Name:</b> {contact.name}</div>
                    <div><b>Email:</b> {contact.email}</div>
                    {contact.phone && <div><b>Phone:</b> {contact.phone}</div>}
                    {contact.position && <div><b>Position:</b> {contact.position}</div>}
                    {contact.linkedin && <div><b>LinkedIn:</b> <a href={contact.linkedin} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{contact.linkedin}</a></div>}
                    {contact.countryCode && <div><b>Country Code:</b> {contact.countryCode}</div>}
                    {contact.gender && <div><b>Gender:</b> {contact.gender}</div>}
                  </div>
                </div>
              ))}
          </div>
        )}
        {/* New Contact Section */}
        {newContacts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">New Contact</h3>
            {newContacts.map((contact) => (
              <div key={contact._id} className="p-2 border rounded mb-2 relative bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-8 flex items-center gap-1 border border-gray-300 shadow-none"
                  onClick={() => { setEditContact(contact); setAddContactOpen(true); }}
                  type="button"
                >
                  <Pencil className="w-4 h-4 text-black" />
                  <span className="text-xs text-black font-medium">Edit</span>
                </Button>
                <div>
                  <div><b>Name:</b> {contact.name}</div>
                  <div><b>Email:</b> {contact.email}</div>
                  {contact.phone && <div><b>Phone:</b> {contact.phone}</div>}
                  {contact.position && <div><b>Position:</b> {contact.position}</div>}
                  {contact.linkedin && <div><b>LinkedIn:</b> <a href={contact.linkedin} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{contact.linkedin}</a></div>}
                  {contact.countryCode && <div><b>Country Code:</b> {contact.countryCode}</div>}
                  {contact.gender && <div><b>Gender:</b> {contact.gender}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer always at the bottom */}
      <div className="flex items-center justify-between mt-4 border-t pt-4">
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setAddContactOpen(true)}>
          <Plus className="w-4 h-4" />
          Add New Contact
        </Button>
        <Button variant="default" size="sm">
          Save
        </Button>
      </div>
      <AddContactModal
        open={addContactOpen}
        onOpenChange={(open) => {
          setAddContactOpen(open)
          if (!open) setEditContact(null)
        }}
        onAdd={handleAddContact}
        countryCodes={countryCodes}
        positionOptions={positionOptions}
        // Pass initial values for edit
        initialValues={editContact || undefined}
      />
    </div>
  )
} 