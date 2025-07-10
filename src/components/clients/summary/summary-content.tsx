"use client";

import { SectionHeader } from "./section-header";
import { DetailRow } from "./detail-row";
import { TeamMember } from "./team-member";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { FileUploadRow } from "./file-upload-row";
import { AddTeamMemberModal } from "../modals/add-team-member-modal";
import { AddContactModal } from "../modals/add-contact-modal";
import { EditDescriptionModal } from "../modals/edit-description-modal";
import { Plus, Pencil } from "lucide-react";
import { getClientById } from "@/services/clientService";
import { ContractSection } from "./contract-section";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SalesInfo } from "./sales/salesInfo";

interface SummaryContentProps {
  clientId: string;
}

interface ClientResponse {
  client?: ClientDetails;
  result?: ClientDetails;
  data?: ClientDetails;
  name?: string;
}

interface ClientDetails {
  clientPriority: string;
  clientSegment: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  address?: string;
  incorporationDate?: string;
  countryOfRegistration?: string;
  lineOfBusiness?: string;
  registrationNumber?: string;
  countryOfBusiness?: string;
  description?: string;
  salesLead?: string;
  referredBy?: string;
  linkedInProfile?: string;
  clientLinkedInPage?: string;
  linkedInPage?: string;
  gstTinDocument?: string;
  clientProfileImage?: string;
  profileImage?: string;
  crCopy?: string;
  vatCopy?: string;
  phoneNumber?: string;
  googleMapsLink?: string;
  position?: string;
  email?: string;
  primaryContacts?: PrimaryContact[];
  labelType?: {
    seniorLevel?: string;
    executives?: string;
    nonExecutives?: string;
    other?: string;
  };
  seniorLevel?: string;
  executives?: string;
  nonExecutives?: string;
  other?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  emails?: string[];
}

interface PrimaryContact {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  countryCode: string;
  position: string;
  linkedin: string;
}

interface TeamMemberType {
  name: string;
  role: string;
  email: string;
  isActive?: boolean;
}

interface ContactType {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  position: string;
}

export function SummaryContent({ clientId }: SummaryContentProps) {
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    clientPriority: "1",
    clientSegment: "A",
    name: "",
    emails: [],
  });
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([
    { name: "Shaswat singh", role: "Admin", email: "shaswat@example.com", isActive: true },
  ]);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError(""); // Clear previous errors

        const response: ClientResponse = await getClientById(clientId);

        // Handle different possible response structures
        let clientData: ClientDetails;

        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            clientData = response.data;
          } else if ('name' in response) {
            clientData = response as ClientDetails;
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

        // --- MAPPING PRIMARY CONTACTS ---
        const mappedContacts = (clientData.primaryContacts || []).map((c: any) => ({
          firstName: c.firstName || (c.name ? c.name.split(' ')[0] : ''),
          lastName: c.lastName || (c.name ? c.name.split(' ').slice(1).join(' ') : ''),
          gender: c.gender || '',
          email: c.email || '',
          phone: c.phone || '',
          countryCode: c.countryCode || '',
          position: c.position || c.designation || '',
          linkedin: c.linkedin || '',
        }));

        setClientDetails({
          clientPriority: clientData.clientPriority || "1",
          clientSegment: clientData.clientSegment || "A",
          name: clientData.name || "",
          website: clientData.website || "",
          industry: clientData.industry || "",
          location: clientData.location || "",
          address: clientData.address || "",
          incorporationDate: clientData.incorporationDate || "",
          countryOfRegistration: clientData.countryOfRegistration || "",
          registrationNumber: clientData.registrationNumber || "",
          countryOfBusiness: clientData.countryOfBusiness || "",
          description: clientData.description || "",
          salesLead: clientData.salesLead || "",
          referredBy: clientData.referredBy || "",
          linkedInProfile: clientData.linkedInProfile || "",
          clientLinkedInPage: clientData.linkedInPage || clientData.clientLinkedInPage || "",
          gstTinDocument: clientData.gstTinDocument || "",
          clientProfileImage: clientData.profileImage || clientData.clientProfileImage || "",
          crCopy: clientData.crCopy || "",
          vatCopy: clientData.vatCopy || "",
          phoneNumber: clientData.phoneNumber || "",
          googleMapsLink: clientData.googleMapsLink || "",
          primaryContacts: mappedContacts,
          labelType: clientData.labelType || {
            seniorLevel: clientData.seniorLevel || "",
            executives: clientData.executives || "",
            nonExecutives: clientData.nonExecutives || "",
            other: clientData.other || ""
          },
          contractStartDate: clientData.contractStartDate || "",
          contractEndDate: clientData.contractEndDate || "",
          emails: clientData.emails || [],
        });

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


  const updateClientDetails = async (fieldName: string, value: string | string[]) => {
    try {
      const response = await fetch(`https://aems-backend.onrender.com/api/clients/${clientId}`, {
        method: "PATCH",
        body: JSON.stringify({ [fieldName]: value }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update failed:", response.status, errorText);
        throw new Error(`Failed to update client details: ${response.status}`);
      }

      setClientDetails((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    } catch (error) {
      console.error("Error updating client details:", error);
      setError("Failed to update client details. Please try again.");
    }
  };

  const handleFileUpload = (field: keyof ClientDetails) => (file: File | null): void => {
    if (!file) return;
    (async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);      // The file itself
        formData.append("field", field);    // The field name (e.g., "vatCopy" or "crCopy")

        const response = await fetch(
          `https://aems-backend.onrender.com/api/clients/${clientId}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to upload ${field}: ${response.status}`);
        }

        const result = await response.json();
        const fileUrl = result.data?.filePath || file.name;

        setClientDetails((prev) => ({
          ...prev,
          [field]: fileUrl,
        }));

        await updateClientDetails(field, fileUrl);
      } catch (error) {
        console.error(`Error uploading ${field}:`, error);
        setClientDetails((prev) => ({
          ...prev,
          [field]: file?.name || '',
        }));
        setError(`Failed to upload ${field} to server. File name stored locally.`);
      }
    })();
  };

  const handleUpdateField = (field: keyof ClientDetails) => (value: string) => {
    updateClientDetails(field, value);
  };

  const handleAddTeamMember = (member: TeamMemberType) => {
    setTeamMembers((prev) => [...prev, { ...member, isActive: true }]);
  };

  const handleAddContact = (contact: PrimaryContact) => {
    setClientDetails((prev) => ({
      ...prev,
      primaryContacts: [...(prev.primaryContacts || []), contact],
    }));

    
  };

  const handleUpdateDescription = (description: string) => {
    setClientDetails((prev) => ({ ...prev, description }));
    updateClientDetails("description", description);
  };

  const handleUpdateContact = (index: number, field: keyof PrimaryContact, value: string) => {
    setClientDetails((prev) => ({
      ...prev,
      primaryContacts: prev.primaryContacts?.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  const handlePreviewFile = (fileName: string) => {
    if (fileName) {
      const fileUrl = fileName.startsWith("https") ? fileName : `https://aems-backend.onrender.com/${fileName}`;
      window.open(fileUrl, "_blank");
    } else {
      console.error("No file to preview");
    }
  };

  const handleDownloadFile = async (fileName: string) => {
    if (fileName) {
      const fileUrl = fileName.startsWith("https") ? fileName : `https://aems-backend.onrender.com/${fileName}`;
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Network response was not ok.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName.split('/').pop() || 'download');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        window.open(fileUrl, '_blank');
      }
    } else {
      console.error('No file to download');
    }
  };

  const handleUpdateEmails = (emailsString: string) => {
    const emailsArray = emailsString.split(',').map(e => e.trim()).filter(Boolean);
    updateClientDetails('emails', emailsArray);
    setClientDetails((prev) => ({ ...prev, emails: emailsArray }));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading client details...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const positionOptions = [
    { value: "HR", label: "HR" },
    { value: "Senior HR", label: "Senior HR" },
    { value: "Manager", label: "Manager" },
    { value: "Director", label: "Director" },
    { value: "Executive", label: "Executive" },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      <div className="space-y-6">
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h2 className="text-sm font-semibold">Details</h2>
          <div className="space-y-3 mt-4">
              
          <DetailRow
              label="Sales Lead (Internal)"
              value={clientDetails.salesLead}
              onUpdate={handleUpdateField("salesLead")}
            />
            <DetailRow
              label="Referred By (External)"
              value={clientDetails.referredBy}
              onUpdate={handleUpdateField("referredBy")}
            />

            <DetailRow
              label="Client Priority"
              value={clientDetails.clientPriority}
              onUpdate={handleUpdateField("clientPriority")}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5", label: "5" },
              ]}
            />
            <DetailRow
              label="Client Segment"
              value={clientDetails.clientSegment}
              onUpdate={handleUpdateField("clientSegment")}
              options={[
                { value: "A", label: "A" },
                { value: "B", label: "B" },
                { value: "C", label: "C" },
                { value: "D", label: "D" },
                { value: "E", label: "E" },
              ]}
            />
            <DetailRow
              label="Client Name"
              value={clientDetails.name}
              onUpdate={handleUpdateField("name")}
            />
            <DetailRow
              label="Client Phone Number"
              value={clientDetails.phoneNumber}
              onUpdate={handleUpdateField("phoneNumber")}
            />
            <DetailRow
              label="Client Email(s)"
              value={clientDetails.emails?.join(", ") || ""}
              onUpdate={handleUpdateEmails}
              alwaysShowEdit={true}
            />
            <div className="bg-white rounded-lg border shadow-sm p-2">
              <div className="flex items-center justify-between mb-1">
                <Label>Primary Contacts</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {clientDetails.primaryContacts?.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4"></div>
              ) : (
                <div className="space-y-3">
                  {clientDetails.primaryContacts?.map((contact, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <div key={index} className="p-3 rounded-md border space-y-1">
                        <div className="text-sm text-muted-foreground">
                          <span className="text-xs font-semibold text-gray-500 mr-1">Name:</span>
                          {`${contact.firstName} ${contact.lastName}`.trim() || "Unnamed Contact"}
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
                        {(contact.countryCode || contact.phone) && (
                          <div className="text-sm text-muted-foreground">
                            <span className="text-xs font-semibold text-gray-500 mr-1">Phone Number:</span>
                            {contact.countryCode ? `${contact.countryCode} ` : ""}{contact.phone || "No phone"}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          <span className="text-xs font-semibold text-gray-500 mr-1">LinkedIn:</span>
                          {contact.linkedin ? (
                            <a
                              href={contact.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
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
              )}
            </div>
            <DetailRow
              label="Client Industry"
              value={clientDetails.industry}
              onUpdate={handleUpdateField("industry")}
            />
            <DetailRow
              label="Client Website"
              value={clientDetails.website}
              onUpdate={handleUpdateField("website")}
            />
            <DetailRow
              label="Google Maps Link"
              value={clientDetails.googleMapsLink}
              onUpdate={handleUpdateField("googleMapsLink")}
            />
            <DetailRow
              label="Client Location"
              value={clientDetails.location}
              onUpdate={handleUpdateField("location")}
            />
            <DetailRow
              label="Client Address"
              value={clientDetails.address}
              onUpdate={handleUpdateField("address")}
            />
            {/* <DetailRow
              label="Registration Number"
              value={clientDetails.registrationNumber}
              onUpdate={handleUpdateField("registrationNumber")}
            /> */}
            <DetailRow
              label="Country of Business"
              value={clientDetails.countryOfBusiness}
              onUpdate={handleUpdateField("countryOfBusiness")}
            />
            <DetailRow
              label="LinkedIn Profile"
              value={clientDetails.linkedInProfile}
              onUpdate={handleUpdateField("linkedInProfile")}
              optional
            />
            {/* <DetailRow
              label="Client LinkedIn Page"
              value={clientDetails.clientLinkedInPage || clientDetails.linkedInPage}
              onUpdate={handleUpdateField(clientDetails.linkedInPage ? "linkedInPage" : "clientLinkedInPage")}
            /> */}
            <FileUploadRow
              id="vat-copy-upload"
              label="VAT Copy"
              className="border-b"
              onFileSelect={handleFileUpload("vatCopy")}
              docUrl={clientDetails.vatCopy}
              currentFileName={typeof clientDetails.vatCopy === "string" ? clientDetails.vatCopy.split("/").pop() || "" : ""}
              onPreview={() => handlePreviewFile(clientDetails.vatCopy || "")}
              onDownload={() => handleDownloadFile(clientDetails.vatCopy || "")}
            />
            <FileUploadRow
              id="cr-copy-upload"
              label="CR Copy"
              onFileSelect={handleFileUpload("crCopy")}
              docUrl={clientDetails.crCopy}
              currentFileName={typeof clientDetails.crCopy === "string" ? clientDetails.crCopy.split("/").pop() || "" : ""}
              onPreview={() => handlePreviewFile(clientDetails.crCopy || "")}
              onDownload={() => handleDownloadFile(clientDetails.crCopy || "")}
            />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <ContractSection 
          clientId={clientId} 
          clientData={{
          contractStartDate: clientDetails.contractStartDate,
          contractEndDate: clientDetails.contractEndDate,
          labelType: clientDetails.labelType
          }} 
        />
        <SalesInfo />
        
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Team</h2>
            <Button variant="outline" size="sm" onClick={() => setIsTeamModalOpen(true)}>
              + Add
            </Button>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              {teamMembers.length} team member{teamMembers.length !== 1 ? "s" : ""}
            </div>
            {teamMembers.map((member, index) => (
              <TeamMember key={index} name={member.name} role={member.role} isActive={member.isActive} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Description</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDescriptionModalOpen(true)}
            >
              {clientDetails.description ? (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
          <div className="space-y-3">
            {clientDetails.description ? (
              <p className="text-sm whitespace-pre-wrap">{clientDetails.description}</p>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">No description added yet</div>
            )}
          </div>
        </div>
        



      </div>
      <AddTeamMemberModal
        open={isTeamModalOpen}
        onOpenChange={setIsTeamModalOpen}
        onAdd={handleAddTeamMember}
      />
      <AddContactModal
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        onAdd={handleAddContact}
        positionOptions={positionOptions}
      />
      <EditDescriptionModal
        open={isDescriptionModalOpen}
        onOpenChange={setIsDescriptionModalOpen}
        currentDescription={clientDetails.description || ""}
        onSave={handleUpdateDescription}
      />
    </div>
  );
}