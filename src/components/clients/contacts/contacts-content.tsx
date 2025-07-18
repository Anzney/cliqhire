"use client";

import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AddContactModal } from "../modals/add-contact-modal";
import {
  getClientById,
  PrimaryContact,
  ClientResponse,
  updateClient,
  updatePrimaryContact, // <-- add this import
  addPrimaryContact, // <-- add this import
} from "@/services/clientService";
import { EditFieldModal } from "../summary/edit-field-modal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { EditPrimaryContactDialog } from "./EditPrimaryContactDialog";
import EditContactDetailsModal from "./EditContactDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ContactsContentProps {
  clientId: string ;
  clientData : any;
}

interface ExtendedPrimaryContact extends PrimaryContact {
  firstName?: string;
  lastName?: string;
  gender?: string;
}

export function ContactsContent({ clientId , clientData }: ContactsContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [primaryContacts, setPrimaryContacts] = useState<ExtendedPrimaryContact[]>([]);
  const [clientPhoneNumber, setClientPhoneNumber] = useState<string>("");
  const [clientWebsite, setClientWebsite] = useState<string>("");
  const [clientEmails, setClientEmails] = useState<string[]>([]);
  const [clientLinkedIn, setClientLinkedIn] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(true); // new state for initial load
  const [error, setError] = useState("");
  const [isContactEditOpen, setIsContactEditOpen] = useState(false);
  const [deleteContactIndex, setDeleteContactIndex] = useState<number | null>(null);
  const [editContactIndex, setEditContactIndex] = useState<number | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  

  useEffect(() => {
    if (clientData) {
      setInitialLoading(true);
      setError("");

      try {
        // Map primary contacts to always split name into firstName/lastName
        const mappedContacts = (clientData.primaryContacts || []).map((c: any) => {
          const name = c.name || "";
          const nameParts = name.trim().split(" ");
          return {
            ...c,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
          };
        });

        setPrimaryContacts(mappedContacts || []);
        setClientPhoneNumber(clientData.phoneNumber || "");
        setClientWebsite(clientData.website || "");
        setClientEmails(clientData.emails || []);
        setClientLinkedIn(clientData.linkedInProfile || "");
        setInitialLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to process client data";
        setError(`${errorMessage}. Please try again.`);
        setInitialLoading(false);
      }
    } else {
      setError("No client ID provided");
      setInitialLoading(false);
    }
  }, [clientId, clientData]);

  console.log(primaryContacts);

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

  const getCountryCodeLabel = (code: string) => {
    const country = countryCodes.find((option) => option.code === code);
    return country ? country.label : code;
  };

  // Reusable function for adding a contact
  const handleAddContact = async (contact: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    countryCode: string;
    position: string;
    linkedin: string;
  }) => {
    setError("");
    try {
      // Prepare the contact data for backend - map to PrimaryContact interface
      const contactData = {
        name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unnamed Contact",
        email: contact.email,
        phone: contact.phone,
        countryCode: contact.countryCode,
        position: contact.position,
        linkedin: contact.linkedin,
      };
      // Use the POST API to add a new primary contact
      await addPrimaryContact(clientId, contactData);
      // Fetch updated client data
      const updatedClient = await getClientById(clientId);
      setPrimaryContacts(updatedClient.primaryContacts || []);
      toast.success("Contact added successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add contact";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Reusable function for saving contact details
  const handleSaveContactDetails = async (values: {
    phoneNumber: string;
    website: string;
    emails: string[];
    linkedInProfile: string;
  }, closeModal: () => void) => {
    setError("");
    try {
      // const clientData: ClientResponse = await getClientById(clientId);
      const { _id, createdAt, updatedAt, ...updatePayload } = clientData;
      const updatedClient = await updateClient(clientId, {
        ...updatePayload,
        phoneNumber: values.phoneNumber,
        website: values.website,
        emails: values.emails,
        linkedInProfile: values.linkedInProfile,
      });
      // Update state with the response data, ensuring proper fallbacks
      setClientPhoneNumber(updatedClient?.phoneNumber || values.phoneNumber || "");
      setClientWebsite(updatedClient?.website || values.website || "");
      setClientEmails(updatedClient?.emails || values.emails || []);
      setClientLinkedIn(updatedClient?.linkedInProfile || values.linkedInProfile || "");
      closeModal();
      toast.success("Contact details updated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update contact details";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handler for deleting a primary contact
  const handleDeleteContact = async (index: number) => {
    setError("");
    try {
      // Get current client data
      // const clientData: ClientResponse = await getClientById(clientId);
      const { _id, createdAt, updatedAt, ...updatePayload } = clientData;

      // Remove the contact at the specified index
      const updatedPrimaryContacts = (clientData.primaryContacts || []).filter((_: any, i: number) => i !== index);

      // Update the client with the updated primary contacts
      const updatedClient = await updateClient(clientId, {
        ...updatePayload,
        primaryContacts: updatedPrimaryContacts,
      });

      // Update local state with the response from backend
      setPrimaryContacts(updatedClient?.primaryContacts || updatedPrimaryContacts || []);
      setDeleteContactIndex(null);
      toast.success("Contact deleted successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete contact";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Unified add/edit handler
  const handleAddOrEditContact = async (contact: any) => {
    setError("");
    try {
      const contactData = {
        name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unnamed Contact",
        email: contact.email,
        phone: contact.phone,
        countryCode: contact.countryCode,
        position: contact.position,
        linkedin: contact.linkedin,
        gender: contact.gender, // ensure gender is included
      };
      const { _id, createdAt, updatedAt, ...updatePayload } = clientData;
      let updatedPrimaryContacts;
      if (editContactIndex !== null) {
        // Edit mode
        const contactList = clientData.primaryContacts || [];
        const contactToEdit = contactList[editContactIndex];
        if (contactToEdit && contactToEdit._id) {
          // Only send changed fields for PATCH
          const patchData: any = {};
          if (contactData.name && contactData.name !== contactToEdit.name) patchData.name = contactData.name;
          if (contactData.email && contactData.email !== contactToEdit.email) patchData.email = contactData.email;
          if (contactData.phone && contactData.phone !== contactToEdit.phone) patchData.phone = contactData.phone;
          if (contactData.countryCode && contactData.countryCode !== contactToEdit.countryCode) patchData.countryCode = contactData.countryCode;
          if (contactData.position && contactData.position !== contactToEdit.position) patchData.position = contactData.position;
          if (contactData.linkedin && contactData.linkedin !== contactToEdit.linkedin) patchData.linkedin = contactData.linkedin;
          if (contactData.gender && contactData.gender !== contactToEdit.gender) patchData.gender = contactData.gender;

          // Only send if at least one field is changed
          if (Object.keys(patchData).length > 0) {
            await updatePrimaryContact(clientId, contactToEdit._id, patchData);
          }
          const updatedClient = await getClientById(clientId);
          setPrimaryContacts(updatedClient.primaryContacts || []);
        } else {
          // Fallback: update the whole client (legacy logic)
          updatedPrimaryContacts = contactList.map((c: any, i: number) =>
            i === editContactIndex ? contactData : c
          );
          const updatedClient = await updateClient(clientId, {
            ...updatePayload,
            primaryContacts: updatedPrimaryContacts,
          });
          setPrimaryContacts(updatedClient?.primaryContacts || updatedPrimaryContacts || []);
        }
      } else {
        // Add mode
        updatedPrimaryContacts = [contactData, ...(clientData.primaryContacts || [])];
        const updatedClient = await updateClient(clientId, {
          ...updatePayload,
          primaryContacts: updatedPrimaryContacts,
        });
        setPrimaryContacts(updatedClient?.primaryContacts || updatedPrimaryContacts || []);
      }
      setAddEditModalOpen(false);
      setEditContactIndex(null);
      toast.success(editContactIndex !== null ? "Contact updated successfully!" : "Contact added successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add/edit contact";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Prepare initial values for modal
  const initialContactValues =
    editContactIndex !== null && primaryContacts[editContactIndex]
      ? {
          firstName: primaryContacts[editContactIndex].firstName || "",
          lastName: primaryContacts[editContactIndex].lastName || "",
          gender: primaryContacts[editContactIndex].gender || "",
          email: primaryContacts[editContactIndex].email || "",
          phone: primaryContacts[editContactIndex].phone || "",
          countryCode: primaryContacts[editContactIndex].countryCode || "+966",
          position: primaryContacts[editContactIndex].position || "",
          linkedin: primaryContacts[editContactIndex].linkedin || "",
        }
      : {
          firstName: "",
          lastName: "",
          gender: "",
          email: "",
          phone: "",
          countryCode: "+966",
          position: "",
          linkedin: "",
        };

  if (initialLoading) {
    return <div className="p-8 text-center">Loading contacts...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // If there are primary contacts, show them
  if (primaryContacts.length > 0) {
    return (
      <div className="p-0">
        {/* <div className="mb-6">
          <h2 className="text-lg font-semibold">Contacts</h2>
        </div> */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Heading for contact details */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h2 className=" text-sm font-semibold mb-4">Client Contact Details</h2>
              <div className="flex mb-2">
                <div>
                  <div> 
                    <span className="text-xs font-semibold text-gray-500 mr-1">
                    Client Phone Number:
                  </span>
                  {clientPhoneNumber ? (
                    (() => {
                      try {
                        // Only parse if clientPhoneNumber is a valid string
                        if (clientPhoneNumber && typeof clientPhoneNumber === 'string' && clientPhoneNumber.trim()) {
                          const parsed = parsePhoneNumberFromString("+" + clientPhoneNumber);
                          if (parsed && parsed.isValid()) {
                            return (
                              <span className="text-sm text-muted-foreground mr-1">
                                {parsed.formatInternational()}
                              </span>
                            );
                          }
                        }
                        // Fallback to showing the raw phone number
                        return (
                          <span className="text-sm text-muted-foreground mr-1">
                            {clientPhoneNumber}
                          </span>
                        );
                      } catch (error) {
                        // If parsing fails, show the raw phone number
                        return (
                          <span className="text-sm text-muted-foreground mr-1">
                            {clientPhoneNumber}
                          </span>
                        );
                      }
                    })()
                  ) : (
                    <span className="text-sm text-muted-foreground mr-1">No phone number</span>
                  )}
                  </div>

                 <div>
                   <span className="text-xs font-semibold text-gray-500 mr-1">Client Website:</span>
                  {clientWebsite ? (
                    <a
                      href={clientWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground text-gray-500 hover:underline"
                    >
                      {clientWebsite}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">No website</span>
                  )}
                 </div>

                <div>
                   <span className="text-xs font-semibold text-gray-500 mr-1">Client Email(s):</span>
                {clientEmails && clientEmails.length > 0 ? (
                  <span className="text-sm text-muted-foreground">
                    {clientEmails.map((email, idx) => (
                      <span key={idx}>
                        <a
                          href={`mailto:${email}`}
                          className="text-sm text-muted-foreground text-gray-500 hover:underline"
                        >
                          {email}
                        </a>
                        {idx < clientEmails.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">No email</span>
                )}
                </div>

                 <div>
                   <span className="text-xs font-semibold text-gray-500 mr-1">
                  Client LinkedIn Profile:
                </span>
                {clientLinkedIn ? (
                  <a
                    href={clientLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground text-gray-500 hover:underline"
                  >
                    {clientLinkedIn}
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">No LinkedIn profile</span>
                )}
                 </div>


                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 ml-auto"
                  onClick={() => setIsContactEditOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
            <EditContactDetailsModal
              open={isContactEditOpen}
              onClose={() => setIsContactEditOpen(false)}
              clientId={clientId}
              initialValues={{
                phoneNumber: clientPhoneNumber,
                website: clientWebsite,
                emails: clientEmails,
                linkedInProfile: clientLinkedIn,
              }}
              onSave={async (values) => {
                await handleSaveContactDetails(values, () => setIsContactEditOpen(false));
              }}
            />
          </div>
          {/* Primary Contacts on the right */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Primary Contacts</span>
                <Button variant="outline" size="sm" onClick={() => { setEditContactIndex(null); setAddEditModalOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {(primaryContacts || []).length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No primary contacts
                </div>
              ) : (
                <div className="space-y-3">
                  {(primaryContacts || []).map((contact, index) => (
                    <div key={index} className="p-3 rounded-md border">
                      {/* Name row with right-aligned buttons */}
                      <div className="flex mb-1">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 mr-1">Name:</span>
                          <span className="text-sm text-muted-foreground">
                            {`${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
                              contact.name ||
                              "Unnamed Contact"}
                          </span>
                          {/* Gender */}
                          {contact.gender && (
                            <p className="text-sm text-muted-foreground">
                              <span className="text-xs font-semibold text-gray-500 mr-1">Gender:</span>
                              {contact.gender}
                            </p>
                          )}
                          {/* Position */}
                          {contact.position && (
                            <p className="text-sm text-muted-foreground">
                              <span className="text-xs font-semibold text-gray-500 mr-1">
                                Position:
                              </span>
                              {contact.position}
                            </p>
                          )}
                          {/* Email */}
                          {contact.email && (
                            <p className="text-sm text-muted-foreground">
                              <span className="text-xs font-semibold text-gray-500 mr-1">
                                Email:
                              </span>
                              {contact.email}
                            </p>
                          )}
                          {/* Phone Number */}
                          <div className="text-sm text-muted-foreground">
                            <span className="text-xs font-semibold text-gray-500 mr-1">
                              Phone Number:
                            </span>
                            {getCountryCodeLabel(contact.countryCode || "")}
                            <span className="mx-1">-</span>
                            {contact.phone || "No phone"}
                          </div>
                          {/* LinkedIn */}
                          <div className="text-sm text-muted-foreground">
                            <span className="text-xs font-semibold text-gray-500 mr-1">
                              LinkedIn:
                            </span>
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
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => { setEditContactIndex(index); setAddEditModalOpen(true); }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setDeleteContactIndex(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <AddContactModal
          open={addEditModalOpen}
          onOpenChange={(open) => {
            setAddEditModalOpen(open);
            if (!open) setEditContactIndex(null);
          }}
          onAdd={handleAddOrEditContact}
          countryCodes={countryCodes}
          positionOptions={positionOptions}
          initialValues={initialContactValues}
          isEdit={editContactIndex !== null}
        />
        {/* Delete confirmation (now using Shadcn Dialog) */}
        <Dialog open={deleteContactIndex !== null} onOpenChange={() => setDeleteContactIndex(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Contact</DialogTitle>
              <DialogDescription>Are you sure you want to delete this contact?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteContactIndex(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteContact(deleteContactIndex!)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // If no primary contacts, show the empty state
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-32 h-32 mb-6">
        <svg viewBox="0 0 200 200" className="w-full h-full text-blue-500">
          <circle cx="100" cy="100" r="40" fill="currentColor" fillOpacity="0.1" />
          <circle cx="150" cy="70" r="25" fill="currentColor" fillOpacity="0.1" />
          <path d="M90 90 L160 60" stroke="currentColor" strokeWidth="4" />
          <circle cx="60" cy="130" r="20" fill="currentColor" fillOpacity="0.1" />
          <path d="M90 110 L70 125" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">You have not created any contacts yet</h3>
      <p className="text-muted-foreground text-center max-w-lg mb-8">
        Creating Contacts will allow you to associate contacts with specific clients. These contacts
        do not have access to any information in your Manatal account, unless you invite them to
        collaborate as guests.
      </p>
      <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
        <Plus className="h-4 w-4" />
        Create contact
      </Button>

      <AddContactModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddContact}
        countryCodes={countryCodes}
        positionOptions={positionOptions}
      />
    </div>
  );
}
