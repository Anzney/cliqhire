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
import { FileUploadModal } from "../modals/file-upload-modal";
import { Plus, Pencil, ChevronsUpDown, X } from "lucide-react";
import { SalesInfo } from "./sales/salesInfo";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ContractOverview from "./contract-overview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getFileType ,ClientDetails ,PrimaryContact , TeamMemberType ,ContactType} from "./summaryType";
import { api } from "@/lib/axios-config";
import { useQueryClient } from "@tanstack/react-query";


export function SummaryContent({
  clientId,
  clientData,
  onTabSwitch,
  canModify = true,
}: {
  clientId: string;
  clientData?: any;
  onTabSwitch?: (tabValue: string) => void;
  canModify?: boolean;
}) {
  const queryClient = useQueryClient();

  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([
    { name: "Shaswat singh", role: "Admin", email: "shaswat@example.com", isActive: true },
  ]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const [previewFileName, setPreviewFileName] = useState("");
  // Removed unused error state

  // File upload modal states
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [currentUploadField, setCurrentUploadField] = useState<keyof ClientDetails | null>(null);
  const [currentUploadTitle, setCurrentUploadTitle] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const updateClientDetails = async (
    fieldName: string,
    value: string | string[] | PrimaryContact | { url: string; fileName: string },
  ) => {
    if (!canModify) return;
    try {
      const response = await api.patch(`/api/clients/${clientId}`, { [fieldName]: value });
      // Optimistically update React Query cache
      queryClient.setQueryData(["clientsData", clientId], (old: any) => ({
        ...(old || {}),
        [fieldName]: value,
      }));
      toast.success("Client details updated successfully");
    } catch (error) {
      toast.error("Failed to update client details");
    }
  };

  // Handler for opening file upload modal
  const handleOpenFileUploadModal = (field: keyof ClientDetails, title: string) => {
    if (!canModify) return;
    setCurrentUploadField(field);
    setCurrentUploadTitle(title);
    setIsFileUploadModalOpen(true);
  };

  // Handler for file upload through modal
  const handleFileUploadFromModal = async (file: File): Promise<void> => {
    if (!canModify) return;
    if (!currentUploadField || !file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("field", currentUploadField);

      const response = await api.post(`/api/clients/${clientId}/upload`, formData);
      const result = response.data;
      const fileUrl = result.data?.filePath || file.name;
      // Update cache and backend
      await updateClientDetails(currentUploadField, {
        url: fileUrl,
        fileName: file.name,
      });
    } catch (error) {
      console.error(`Error uploading ${currentUploadField}:`, error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Legacy handler (kept for backward compatibility if needed)
  const handleFileUpload =
    (field: keyof ClientDetails) =>
    (file: File | null): void => {
      if (!file) return;
      if (!canModify) return;
      (async () => {
        try {
          const formData = new FormData();
          formData.append("file", file); // The file itself
          formData.append("field", field); // The field name (e.g., "vatCopy" or "crCopy")

          const response = await api.post(`/api/clients/${clientId}/upload`, formData);
          const result = response.data;
          const fileUrl = result.data?.filePath || file.name;
          toast.success("File uploaded successfully");

          await updateClientDetails(field, fileUrl);
        } catch (error) {
          console.error(`Error uploading ${field}:`, error);
          toast.error("Failed to upload file");
        }
      })();
    };

  const handleUpdateField = (field: keyof ClientDetails) => (value: string) => {
    if (!canModify) return;
    updateClientDetails(field, value);
  };

  const handleAddTeamMember = (member: TeamMemberType) => {
    if (!canModify) return;
    setTeamMembers((prev) => [...prev, { ...member, isActive: true }]);
  };

  const handleAddContact = (contact: PrimaryContact) => {
    if (!canModify) return;
    const nextContacts = [...(clientData?.primaryContacts || []), contact];
    updateClientDetails("primaryContacts", nextContacts as unknown as PrimaryContact);
  };

  const handleUpdateDescription = (description: string) => {
    if (!canModify) return;
    updateClientDetails("description", description);
  };

  const handleUpdateContact = (index: number, field: keyof PrimaryContact, value: string) => {
    if (!canModify) return;
    const updated = (clientData?.primaryContacts || []).map((c: any, i: number) =>
      i === index ? { ...c, [field]: value } : c,
    );
    updateClientDetails("primaryContacts", updated as unknown as PrimaryContact);
  };

  const handlePreviewFile = (fileName: string, displayName?: string) => {
    if (!fileName) {
      console.error("No file to preview");
      return;
    }

    const fileUrl = fileName.startsWith("https")
      ? fileName
      : `${API_URL}/${fileName}`;

    const fileType = getFileType(fileName);

    if (fileType === "pdf") {
      // Show PDF in modal with iframe
      setPreviewFileUrl(fileUrl);
      setPreviewFileName(displayName || fileName);
      setIsPdfPreviewOpen(true);
    } else if (fileType === "docx") {
      // For DOCX files, try to use Google Docs viewer
      const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      setPreviewFileUrl(googleDocsUrl);
      setPreviewFileName(displayName || fileName);
      setIsPdfPreviewOpen(true);
    } else {
      // For images and other files, open in new tab (existing behavior)
      window.open(fileUrl, "_blank");
    }
  };

  const handleDownloadFile = async (fileName: string) => {
    if (fileName) {
      const fileUrl = fileName.startsWith("https")
        ? fileName
        : `${API_URL}/${fileName}`;
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
  };

  const positionOptions = [
    { value: "CEO", label: "CEO" },
  { value: "HR Head", label: "HR Head" },
  { value: "CHRO", label: "CHRO" },
  { value: "HR", label: "HR" },
  { value: "Manager", label: "Manager" },
  { value: "HR Manager", label: "HR Manager" },
  { value: "Director", label: "Director" },
  { value: "Executive", label: "Executive" },
  { value: "General Manager", label: "General Manager" },
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
                value={clientData?.salesLead}
                onUpdate={handleUpdateField("salesLead")}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Referred By (External)"
                value={clientData?.referredBy}
                onUpdate={handleUpdateField("referredBy")}
                disableInternalEdit={!canModify}
              />

              <DetailRow
                label="Client Priority"
                value={clientData?.clientPriority}
                onUpdate={handleUpdateField("clientPriority")}
                options={[
                  { value: "High", label: "High" },
                  { value: "Medium", label: "Medium" },
                  { value: "Low", label: "Low" },
                ]}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Client Segment"
                value={clientData?.clientSegment}
                onUpdate={handleUpdateField("clientSegment")}
                options={[
                  { value: "Silver", label: "Silver" },
                  { value: "Gold", label: "Gold" },
                  { value: "Premium", label: "Premium" },
                ]}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Client Name"
                value={clientData?.name}
                onUpdate={handleUpdateField("name")}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Client Phone Number"
                value={clientData?.phoneNumber}
                onUpdate={handleUpdateField("phoneNumber")}
                disableInternalEdit={!canModify}
              />
            </div>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              <DetailRow
                label="Client Email(s)"
                value={clientData?.emails?.join(", ") || ""}
                onUpdate={handleUpdateEmails}
                alwaysShowEdit={true}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Client Industry"
                value={clientData?.industry}
                onUpdate={handleUpdateField("industry")}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Client Website"
                value={clientData?.website}
                onUpdate={handleUpdateField("website")}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Google Maps Link"
                value={clientData?.googleMapsLink}
                onUpdate={handleUpdateField("googleMapsLink")}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Client Location"
                value={clientData?.location}
                onUpdate={handleUpdateField("location")}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Client Address"
                value={clientData?.address}
                onUpdate={handleUpdateField("address")}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="Country of Business"
                value={clientData?.countryOfBusiness}
                onUpdate={handleUpdateField("countryOfBusiness")}
                disableInternalEdit={!canModify}
              />
              <DetailRow
                label="LinkedIn Profile"
                value={clientData?.linkedInProfile}
                onUpdate={handleUpdateField("linkedInProfile")}
                optional
                disableInternalEdit={!canModify}
              />
              <FileUploadRow
                id="vat-copy-upload"
                label="VAT Copy"
                className="border-b"
                onFileSelect={canModify ? handleFileUpload("vatCopy") : () => {}}
                onUploadClick={canModify ? () => handleOpenFileUploadModal("vatCopy", "VAT Copy") : () => {}}
                docUrl={clientData?.vatCopy?.url}
                currentFileName={clientData?.vatCopy?.fileName}
                onPreview={() =>
                  handlePreviewFile(
                    clientData?.vatCopy?.url || "",
                    clientData?.vatCopy?.fileName,
                  )
                }
                onDownload={() => handleDownloadFile(clientData?.vatCopy?.url || "")}
              />
              <FileUploadRow
                id="cr-copy-upload"
                label="CR Copy"
                className="border-b"
                onFileSelect={canModify ? handleFileUpload("crCopy") : () => {}}
                onUploadClick={canModify ? () => handleOpenFileUploadModal("crCopy", "CR Copy") : () => {}}
                docUrl={clientData?.crCopy?.url}
                currentFileName={clientData?.crCopy?.fileName}
                onPreview={() =>
                  handlePreviewFile(
                    clientData?.crCopy?.url || "",
                    clientData?.crCopy?.fileName,
                  )
                }
                onDownload={() => handleDownloadFile(clientData?.crCopy?.url || "")}
              />
              <FileUploadRow
                id="gst-tin-document-upload"
                label="GST IN Doc"
                onFileSelect={canModify ? handleFileUpload("gstTinDocument") : () => {}}
                onUploadClick={canModify ? () =>
                  handleOpenFileUploadModal("gstTinDocument", "GST TIN Document") : () => {}}
                docUrl={clientData?.gstTinDocument?.url}
                currentFileName={clientData?.gstTinDocument?.fileName}
                onPreview={() =>
                  handlePreviewFile(
                    clientData?.gstTinDocument?.url || "",
                    clientData?.gstTinDocument?.fileName,
                  )
                }
                onDownload={() => handleDownloadFile(clientData?.gstTinDocument?.url || "")}
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

        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Description</h2>
            <Button variant="outline" size="sm" onClick={() => setIsDescriptionModalOpen(true)}>
              {clientData?.description ? (
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
            {clientData?.description ? (
              <p className="text-sm whitespace-pre-wrap">{clientData.description}</p>
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
        currentDescription={clientData?.description || ""}
        onSave={handleUpdateDescription}
      />

      {/* PDF Preview Modal */}
      <Dialog open={isPdfPreviewOpen} onOpenChange={setIsPdfPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw] h-[80vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center justify-between">
              <span>Document Preview: {previewFileName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPdfPreviewOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-4 pt-0">
            <iframe
              src={previewFileUrl}
              className="w-full h-full border rounded-lg"
              title="Document Preview"
              onError={() => {
                toast.error("Failed to load document preview");
                setIsPdfPreviewOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* File Upload Modal */}
      <FileUploadModal
        open={isFileUploadModalOpen}
        onOpenChange={setIsFileUploadModalOpen}
        onUpload={handleFileUploadFromModal}
        title={currentUploadTitle}
        acceptedFileTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.svg"
        maxSizeInMB={10}
      />
    </div>
  );
}
