"use client";

import { SectionHeader } from "./section-header";
import { DetailRow } from "./detail-row";
import { TeamMember } from "./team-member";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FileUploadRow } from "./file-upload-row";
import { AddTeamMemberModal } from "../modals/add-team-member-modal";
import { AddContactModal } from "../modals/add-contact-modal";
import { EditDescriptionModal } from "../modals/edit-description-modal";
import { Plus, Pencil, ChevronsUpDown } from "lucide-react";
import { ContractSection } from "../contract/contract-section";
import { Label } from "@/components/ui/label";
import { SalesInfo } from "./sales/salesInfo";
import { CollapsibleSection } from "./collapsible-section";
import { toast } from "sonner";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ContractOverview from "./contract-overview";
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
  clientProfileImage?: string;
  profileImage?: string;
  crCopy?: {
    url: string;
    fileName: string;
  };
  vatCopy?: {
    url: string;
    fileName: string;
  };
  gstTinDocument?: {
    url: string;
    fileName: string;
  };
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

export function SummaryContent({
  clientId,
  clientData,
  onTabSwitch,
}: {
  clientId: string;
  clientData: any;
  onTabSwitch?: (tabValue: string) => void;
}) {
  const [clientDetails, setClientDetails] = useState<ClientDetails>(() => {
    // Initialize with clientData and map primary contacts
    const mappedContacts = (clientData?.primaryContacts || []).map((c: any) => ({
      firstName: c.firstName || (c.name ? c.name.split(" ")[0] : ""),
      lastName: c.lastName || (c.name ? c.name.split(" ").slice(1).join(" ") : ""),
      gender: c.gender || "",
      email: c.email || "",
      phone: c.phone || "",
      countryCode: c.countryCode || "",
      position: c.position || c.designation || "",
      linkedin: c.linkedin || "",
    }));

    return {
      ...clientData,
      primaryContacts: mappedContacts,
    };
  });

  console.log(clientData);

  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([
    { name: "Shaswat singh", role: "Admin", email: "shaswat@example.com", isActive: true },
  ]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [error, setError] = useState("");

  const updateClientDetails = async (
    fieldName: string,
    value: string | string[] | PrimaryContact,
  ) => {
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
        toast.error("Failed to update client details");
      }

      setClientDetails((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
      toast.success("Client details updated successfully");
    } catch (error) {
      toast.error("Failed to update client details");
    }
  };

  const handleFileUpload =
    (field: keyof ClientDetails) =>
    (file: File | null): void => {
      if (!file) return;
      (async () => {
        try {
          const formData = new FormData();
          formData.append("file", file); // The file itself
          formData.append("field", field); // The field name (e.g., "vatCopy" or "crCopy")

          const response = await fetch(
            `https://aems-backend.onrender.com/api/clients/${clientId}/upload`,
            {
              method: "POST",
              body: formData,
            },
          );

          if (!response.ok) {
            toast.error("Failed to upload file");
          }

          const result = await response.json();
          const fileUrl = result.data?.filePath || file.name;

          setClientDetails((prev) => ({
            ...prev,
            [field]: fileUrl,
          }));
          toast.success("File uploaded successfully");

          await updateClientDetails(field, fileUrl);
        } catch (error) {
          console.error(`Error uploading ${field}:`, error);
          setClientDetails((prev) => ({
            ...prev,
            [field]: file?.name || "",
          }));
          setError(`Failed to upload ${field} to server. File name stored locally.`);
          toast.error("Failed to upload file");
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
    updateClientDetails("primaryContacts", contact);
  };

  const handleUpdateDescription = (description: string) => {
    setClientDetails((prev) => ({ ...prev, description }));
    updateClientDetails("description", description);
  };

  const handleUpdateContact = (index: number, field: keyof PrimaryContact, value: string) => {
    setClientDetails((prev) => ({
      ...prev,
      primaryContacts: prev.primaryContacts?.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact,
      ),
    }));
  };

  const handlePreviewFile = (fileName: string) => {
    if (fileName) {
      const fileUrl = fileName.startsWith("https")
        ? fileName
        : `https://aems-backend.onrender.com/${fileName}`;
      window.open(fileUrl, "_blank");
    } else {
      console.error("No file to preview");
    }
  };

  const handleDownloadFile = async (fileName: string) => {
    if (fileName) {
      const fileUrl = fileName.startsWith("https")
        ? fileName
        : `https://aems-backend.onrender.com/${fileName}`;
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("Network response was not ok.");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName.split("/").pop() || "download");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        window.open(fileUrl, "_blank");
      }
    } else {
      console.error("No file to download");
    }
  };

  const handleUpdateEmails = (emailsString: string) => {
    const emailsArray = emailsString
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    updateClientDetails("emails", emailsArray);
    setClientDetails((prev) => ({ ...prev, emails: emailsArray }));
  };

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
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Details</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-3">
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
            </div>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              <DetailRow
                label="Client Email(s)"
                value={clientDetails.emails?.join(", ") || ""}
                onUpdate={handleUpdateEmails}
                alwaysShowEdit={true}
              />
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
              <FileUploadRow
                id="vat-copy-upload"
                label="VAT Copy"
                className="border-b"
                onFileSelect={handleFileUpload("vatCopy")}
                docUrl={clientDetails?.vatCopy?.url}
                currentFileName={clientDetails?.vatCopy?.fileName}
                onPreview={() => handlePreviewFile(clientDetails?.vatCopy?.url || "")}
                onDownload={() => handleDownloadFile(clientDetails?.vatCopy?.url || "")}
              />
              <FileUploadRow
                id="cr-copy-upload"
                label="CR Copy"
                className="border-b"
                onFileSelect={handleFileUpload("crCopy")}
                docUrl={clientDetails?.crCopy?.url}
                currentFileName={clientDetails?.crCopy?.fileName}
                onPreview={() => handlePreviewFile(clientDetails?.crCopy?.url || "")}
                onDownload={() => handleDownloadFile(clientDetails?.crCopy?.url || "")}
              />
              <FileUploadRow
                id="gst-tin-document-upload"
                label="GST IN Doc"
                onFileSelect={handleFileUpload("gstTinDocument")}
                docUrl={clientDetails?.gstTinDocument?.url}
                currentFileName={clientDetails?.gstTinDocument?.fileName}
                onPreview={() => handlePreviewFile(clientDetails?.gstTinDocument?.url || "")}
                onDownload={() => handleDownloadFile(clientDetails?.gstTinDocument?.url || "")}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className="space-y-6">
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Contract Overview</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <ContractOverview
              lineOfBusiness={clientData.lineOfBusiness}
              onViewDetails={() => onTabSwitch?.("Contract")}
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Company Related Information</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <SalesInfo />
          </CollapsibleContent>
        </Collapsible>

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
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                isActive={member.isActive}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Description</h2>
            <Button variant="outline" size="sm" onClick={() => setIsDescriptionModalOpen(true)}>
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
              <div className="text-sm text-muted-foreground text-center py-4">
                No description added yet
              </div>
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
