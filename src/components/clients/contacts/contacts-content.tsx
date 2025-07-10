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

interface ContactsContentProps {
  clientId: string;
}

interface ExtendedPrimaryContact extends PrimaryContact {
  firstName?: string;
  lastName?: string;
  gender?: string;
}

export function ContactsContent({ clientId }: ContactsContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [primaryContacts, setPrimaryContacts] = useState<ExtendedPrimaryContact[]>([]);
  const [clientPhoneNumber, setClientPhoneNumber] = useState<string>("");
  const [clientWebsite, setClientWebsite] = useState<string>("");
  const [clientEmails, setClientEmails] = useState<string[]>([]);
  const [clientLinkedIn, setClientLinkedIn] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isContactEditOpen, setIsContactEditOpen] = useState(false);
  const [deleteContactIndex, setDeleteContactIndex] = useState<number | null>(null);
  const [editPrimaryContactIndex, setEditPrimaryContactIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError("");

        const response: any = await getClientById(clientId);

        // Handle different possible response structures
        let clientData: any;

        if (response && typeof response === "object") {
          if ("data" in response && response.data) {
            clientData = response.data;
          } else if ("name" in response) {
            clientData = response;
          } else if (response.client) {
            clientData = response.client;
          } else if (response.result) {
            clientData = response.result;
          } else {
            throw new Error("Invalid response structure from API");
          }
        } else {
          throw new Error("No valid response received from API");
        }

        // Map primary contacts to include gender and split name into firstName/lastName
        const mappedContacts = (clientData.primaryContacts || []).map((c: any) => ({
          name: c.name || "",
          email: c.email || "",
          phone: c.phone || "",
          countryCode: c.countryCode || "",
          position: c.position || "",
          linkedin: c.linkedin || "",
          firstName: c.firstName || (c.name ? c.name.split(" ")[0] : ""),
          lastName: c.lastName || (c.name ? c.name.split(" ").slice(1).join(" ") : ""),
          gender: c.gender || "",
        }));

        setPrimaryContacts(mappedContacts || []);
        setClientPhoneNumber(clientData.phoneNumber || "");
        setClientWebsite(clientData.website || "");
        setClientEmails(clientData.emails || []);
        setClientLinkedIn(clientData.linkedInProfile || "");
        setLoading(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load client data";
        setError(`${errorMessage}. Please try again.`);
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientData();
    } else {
      setError("No client ID provided");
      setLoading(false);
    }
  }, [clientId]);

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

  const handlePhoneNumberUpdate = async (newPhoneNumber: string) => {
    setLoading(true);
    setError("");
    try {
      // Fetch the latest client data to avoid overwriting other fields
      const clientData: ClientResponse = await getClientById(clientId);
      // Prepare the update payload (omit _id, createdAt, updatedAt)
      const { _id, createdAt, updatedAt, ...updatePayload } = clientData;
      // Update only the phoneNumber field
      const updatedClient = await updateClient(clientId, {
        ...updatePayload,
        phoneNumber: newPhoneNumber,
      });
      console.log("Updated client response:", updatedClient);
      setClientPhoneNumber(
        updatedClient && updatedClient.phoneNumber ? updatedClient.phoneNumber : newPhoneNumber,
      );
      setIsContactEditOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update phone number";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleWebsiteUpdate = async (newWebsite: string) => {
    setLoading(true);
    setError("");
    try {
      const clientData: ClientResponse = await getClientById(clientId);
      const { _id, createdAt, updatedAt, ...updatePayload } = clientData;
      const updatedClient = await updateClient(clientId, {
        ...updatePayload,
        website: newWebsite,
      });
      setClientWebsite(updatedClient && updatedClient.website ? updatedClient.website : newWebsite);
      setIsContactEditOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update website";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailsUpdate = async (newEmails: string) => {
    setLoading(true);
    setError("");
    const emailsArray = newEmails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    try {
      const clientData: ClientResponse = await getClientById(clientId);
      const { _id, createdAt, updatedAt, ...updatePayload } = clientData;
      const updatedClient = await updateClient(clientId, {
        ...updatePayload,
        emails: emailsArray,
      });
      setClientEmails(updatedClient && updatedClient.emails ? updatedClient.emails : emailsArray);
      setIsContactEditOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update emails";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInUpdate = async (newLinkedIn: string) => {
    setLoading(true);
    setError("");
    try {
      const clientData: ClientResponse = await getClientById(clientId);
      const { _id, createdAt, updatedAt, ...updatePayload } = clientData;
      const updatedClient = await updateClient(clientId, {
        ...updatePayload,
        linkedInProfile: newLinkedIn,
      });
      setClientLinkedIn(
        updatedClient && updatedClient.linkedInProfile
          ? updatedClient.linkedInProfile
          : newLinkedIn,
      );
      setIsContactEditOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update LinkedIn profile";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting a primary contact
  const handleDeleteContact = (index: number) => {
    setPrimaryContacts((prev) => prev.filter((_, i) => i !== index));
    setDeleteContactIndex(null);
  };

  if (loading) {
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
                      const parsed = parsePhoneNumberFromString("+" + clientPhoneNumber);
                      if (parsed && parsed.isValid()) {
                        return (
                          <span className="text-sm text-muted-foreground mr-1">
                            {parsed.formatInternational()}
                          </span>
                        );
                      } else {
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
              onSave={async (values: {
                phoneNumber: string;
                website: string;
                emails: string[];
                linkedInProfile: string;
              }) => {
                setLoading(true);
                setError("");
                try {
                  const clientData: ClientResponse = await getClientById(clientId);
                  const { _id, createdAt, updatedAt, ...updatePayload } = clientData;
                  const updatedClient = await updateClient(clientId, {
                    ...updatePayload,
                    phoneNumber: values.phoneNumber,
                    website: values.website,
                    emails: values.emails,
                    linkedInProfile: values.linkedInProfile,
                  });
                  setClientPhoneNumber(updatedClient.phoneNumber || "");
                  setClientWebsite(updatedClient.website || "");
                  setClientEmails(updatedClient.emails || []);
                  setClientLinkedIn(updatedClient.linkedInProfile || "");
                  setIsContactEditOpen(false);
                } catch (err) {
                  const errorMessage =
                    err instanceof Error ? err.message : "Failed to update contact details";
                  setError(errorMessage);
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>
          {/* Primary Contacts on the right */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Primary Contacts</span>
                <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
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
                            onClick={() => setEditPrimaryContactIndex(index)}
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
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAdd={(contact) =>
            setPrimaryContacts((prev) => [
              {
                ...contact,
                ...(typeof contact.firstName === "string" && contact.firstName
                  ? { name: contact.firstName }
                  : {
                      name:
                        `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
                        "Unnamed Contact",
                    }),
              },
              ...prev,
            ])
          }
          countryCodes={countryCodes}
          positionOptions={positionOptions}
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
        {editPrimaryContactIndex !== null && (
          <EditPrimaryContactDialog
            open={editPrimaryContactIndex !== null}
            onOpenChange={() => setEditPrimaryContactIndex(null)}
            contact={primaryContacts[editPrimaryContactIndex]}
            onSave={async (updatedContact) => {
              setLoading(true);
              setError("");
              try {
                const clientData: ClientResponse = await getClientById(clientId);
                const { _id, createdAt, updatedAt, ...updatePayload } = clientData;
                const updatedPrimaryContacts = (primaryContacts || []).map((c, i) =>
                  i === editPrimaryContactIndex
                    ? {
                        ...updatedContact,
                        ...(typeof updatedContact.name === "string" && updatedContact.name
                          ? { name: updatedContact.name }
                          : {
                              name:
                                `${updatedContact.firstName || ""} ${updatedContact.lastName || ""}`.trim() ||
                                "Unnamed Contact",
                            }),
                      }
                    : c,
                );
                const updatedClient = await updateClient(clientId, {
                  ...updatePayload,
                  primaryContacts: updatedPrimaryContacts,
                });
                setPrimaryContacts(updatedClient.primaryContacts || updatedPrimaryContacts || []);
                setEditPrimaryContactIndex(null);
              } catch (err) {
                const errorMessage =
                  err instanceof Error ? err.message : "Failed to update primary contact";
                setError(errorMessage);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
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
        onAdd={(contact) =>
          setPrimaryContacts((prev) => [
            {
              ...contact,
              ...(typeof contact.firstName === "string" && contact.firstName
                ? { name: contact.firstName }
                : {
                    name:
                      `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
                      "Unnamed Contact",
                  }),
            },
            ...prev,
          ])
        }
        countryCodes={countryCodes}
        positionOptions={positionOptions}
      />
    </div>
  );
}
