"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClientInformationTab } from "./ClientInformationTab";
import { ContactDetailsTab } from "./ContactDetailsTab";
import { ContractInformationTab } from "./ContractInformationTab";
import { DocumentsTab } from "@/components/create-client-modal/DocumentsTab";
import { ContactModal } from "@/components/create-client-modal/ContactModal";
import {
  PrimaryContact,
  LocationSuggestion,
} from "@/components/create-client-modal/type";;
import axios from "axios";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { 
  clientContactInfoInitialstate, 
  clientGeneralInfoInitialState, 
  clientSubStages, 
  primaryContactInitialState 
} from "./constants";
import { ClientContractInfo, ClientContactInfo, ClientGeneralInfo } from "./type";
import { createClient } from "./api";
import { useRouter } from "next/navigation";

export function CreateClientModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const [clientGeneralInfo, setClientGeneralInfo] = useState<ClientGeneralInfo>(clientGeneralInfoInitialState)

  const [clientContactInfo, setClientContactInfo] = useState<ClientContactInfo>(clientContactInfoInitialstate)

  const [clientContractInfo, setClientContractInfo] = useState<ClientContractInfo>({
    lineOfBusiness: [],
    contractForms: {},
  })
  
  const [primaryContact, setPrimaryContact] = useState<PrimaryContact>(primaryContactInitialState);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    general?: string;
    name?: string;
    phoneNumber?: string;
    address?: string;
    primaryContacts?: string;
    website?: string;
    linkedInProfile?: string;
    googleMapsLink?: string;
    primaryContactEmails?: string;
  }>({});
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({
    profileImage: null,
    crCopy: null,
    vatCopy: null,
    gstTinDocument: null,
  });

  // Location suggestions
  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (!clientContactInfo.location || clientContactInfo.location.length < 3) {
        setLocationSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            clientContactInfo.location,
          )}`,
        );
        setLocationSuggestions(response.data);
        setShowLocationSuggestions(true);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    };
    const debounceTimer = setTimeout(fetchLocationSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [clientContactInfo.location]);

  // URL validation
  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileChange =
    (field: keyof typeof uploadedFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          setErrors({ general: `File ${file.name} is too large. Maximum size is 5MB.` });
          return;
        }
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
          setErrors({
            general: `Invalid file type for ${file.name}. Allowed types are: JPEG, PNG, PDF`,
          });
          return;
        }
        setUploadedFiles((prev) => ({
          ...prev,
          [field]: file,
        }));
        setErrors({});
      }
    };

  const handlePreview = (file: File | string | null) => {
    if (!file) {
      setErrors({ general: "No file uploaded to preview." });
      return;
    }

    if (typeof file === "string") {
      const fileUrl = file.startsWith("http") ? file : `https://aems-backend.onrender.com/${file}`;
      window.open(fileUrl, "_blank");
    } else if (file instanceof File) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, "_blank");
    } else {
      setErrors({ general: "Unsupported file type for preview." });
    }
  };

  const handleDownload = (file: File | null) => {
    if (!file) {
      setErrors({ general: "No file uploaded to download." });
      return;
    }
    const fileUrl = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(fileUrl);
  };

  const handleAddContact = (contact: PrimaryContact) => {
    if (!contact.firstName || contact.firstName.trim() === "") {
      setErrors({ general: "Contact first name is required" });
      return;
    }
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setErrors({ general: `Invalid contact email: ${contact.email}` });
      return;
    }
    if (!contact.phone) {
      setErrors({ general: "Contact phone number is required" });
      return;
    }
    if (contact.linkedin && !validateUrl(contact.linkedin)) {
      setErrors({ general: "Invalid LinkedIn URL" });
      return;
    }

    setClientContactInfo((prev) => ({
      ...prev,
       primaryContacts: [
        ...prev.primaryContacts,
        { ...contact, name: `${contact.firstName} ${contact.lastName}`.trim() },
      ],
    }));
    setPrimaryContact({
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      phone: "",
      countryCode: "+966",
      designation: "",
      linkedin: "",
      isPrimary: true,
    });
    setIsContactModalOpen(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    // Client General Info
    if(clientSubStages.includes(clientGeneralInfo.clientSubStage!)){
      formData.append("clientStage", "Engaged");
      formData.append("clientSubStage", clientGeneralInfo.clientSubStage!); 
    } else {
      formData.append("clientStage", clientGeneralInfo.clientStage ?? "");
      formData.append("clientSubStage", "");
    }
    formData.append("salesLead", clientGeneralInfo.salesLead ?? "");
    formData.append("referredBy", clientGeneralInfo.referredBy ?? "");
    formData.append("clientPriority", clientGeneralInfo.clientPriority?.toString() ?? "");
    formData.append("clientSegment", clientGeneralInfo.clientSegment ?? "");
    formData.append("clientSource", clientGeneralInfo.clientSource ?? "");
    formData.append("industry", clientGeneralInfo.industry ?? "");
    // Client Contact Info
    formData.append("name", clientContactInfo.name.trim() || "");
    formData.append("emails", JSON.stringify(clientContactInfo.emails));
    formData.append("website", clientContactInfo.website.trim() || "");
    formData.append("phoneNumber", clientContactInfo.phoneNumber.trim() || "");
    formData.append("address", clientContactInfo.address.trim() || "");
    formData.append("countryOfBusiness", clientContactInfo.countryOfBusiness.trim() || "");
    formData.append("linkedInProfile", clientContactInfo.linkedInProfile.trim() || "");
    formData.append("location", clientContactInfo.location.trim() || "");
    formData.append("googleMapsLink", clientContactInfo.googleMapsLink.trim() || "");
    formData.append("primaryContacts", JSON.stringify(clientContactInfo.primaryContacts));

    // Client Contract Info
    formData.append("lineOfBusiness", JSON.stringify(clientContractInfo.lineOfBusiness) || "");

    Object.entries(clientContractInfo.contractForms).forEach(([key, value]) => {
      // console.log(key, value);
      if(key === "HR Consulting") {
        const { technicalProposalDocument, financialProposalDocument, ...rest } = value as any;
        formData.append("consultingContractHRC", JSON.stringify(rest));
        formData.append("techProposalDocHRC", technicalProposalDocument ?? "");
        formData.append("finProposalDocHRC", financialProposalDocument ?? "");
      } else if(key === "Mgt Consulting") {
        const { technicalProposalDocument, financialProposalDocument, ...rest } = value as any;
        formData.append("consultingContractMGTC", JSON.stringify(rest));
        formData.append("techProposalDocMGTC", technicalProposalDocument ?? "");
        formData.append("finProposalDocMGTC", financialProposalDocument ?? "");
      } else if (key === "Recruitment") {
        const { contractDocument, ...rest } = value as any;
        formData.append("businessContractRQT", JSON.stringify(rest));
        formData.append("contractDocumentRQT", contractDocument ?? "");
      } else if (key === "HR Managed Services") {
        const { contractDocument, ...rest } = value as any;
        formData.append("businessContractDetailsHMS", JSON.stringify(rest));
        formData.append("contractDocumentHMS", contractDocument ?? "");
      } else if (key === "IT & Technology") {
        const { contractDocument, ...rest } = value as any;
        formData.append("businessContractIT", JSON.stringify(rest));
        formData.append("contractDocumentIT", contractDocument ?? "");
      } else if (key === "Outsourcing") {
        const { contractDocument, ...rest } = value as any;
        formData.append("outsourcingContract", JSON.stringify(rest));
        formData.append("contractDocumentOutsourcing", contractDocument ?? "");
      }
    })
    
    // Documents
    formData.append("profileImage", uploadedFiles.profileImage ?? "");
    formData.append("crCopy", uploadedFiles.crCopy ?? "");
    formData.append("vatCopy", uploadedFiles.vatCopy ?? "");
    formData.append("gstTinDocument", uploadedFiles.gstTinDocument ?? "");

    try {
      const result = await createClient(formData);
      if (result && result.success && result.data && result.data.data && result.data.data._id) {
        router.push(`/clients/${result.data.data._id}`);
        return;
      }
      setClientContactInfo(clientContactInfoInitialstate);
      setClientGeneralInfo(clientGeneralInfoInitialState);
      setClientContractInfo({
        lineOfBusiness: [],
        contractForms: {},
      });
      setPrimaryContact(primaryContactInitialState);
      setLoading(false);
    } catch (error) {
      console.error("Error creating client:", error);
    }
  }
  
  const handleNext = () => {
    const newTab = Math.min(currentTab + 1, 3);
    setCurrentTab(newTab);
  };

  const handlePrevious = () => {
    setCurrentTab((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-4 sm:p-6 md:p-8 flex flex-col">
        <div className="sticky top-0 z-20 bg-white pb-2">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Create Client</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Fill in the client details below. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap border-b mt-1">
            {[
              "Client General Info",
              "Client Contact Info",
              "Contract Information",
              "Documents",
            ].map((tab, index) => (
              <button
                key={tab}
                className={`flex-1 px-2 py-2 text-center text-xs sm:text-sm md:text-base ${currentTab === index ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setCurrentTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-[400px] overflow-y-auto pb-10">
          <div className="pr-2">
            <form onSubmit={handleSubmit}>
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                  <div className="font-semibold mb-1">
                    Please check form and fill the missing field.
                  </div>
                </div>
              )}
              {currentTab === 0 && (
                <ClientInformationTab
                  formData={clientGeneralInfo}
                  setFormData={setClientGeneralInfo}
                />
              )}
              {currentTab === 1 && (
                <ContactDetailsTab
                  formData={clientContactInfo}
                  setFormData={setClientContactInfo}
                  setIsContactModalOpen={setIsContactModalOpen}
                  errors={errors}
                />
              )}
              {currentTab === 2 && (
                <ContractInformationTab
                  formData={clientContractInfo}
                  setFormData={setClientContractInfo}
                />
              )}
              {currentTab === 3 && (
                <DocumentsTab
                  uploadedFiles={uploadedFiles}
                  handleFileChange={handleFileChange}
                  handlePreview={handlePreview}
                  handleDownload={handleDownload}
                />
              )}

              {/* Move DialogFooter and buttons inside the form */}
              <div className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-white z-50 border-t p-4 rounded-b-xl shadow-lg">
                <DialogFooter>
                  <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
                    <div>
                      {currentTab > 0 && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handlePrevious}
                          disabled={loading}
                          className="w-full sm:w-auto"
                        >
                          <ArrowLeftIcon className="size-5" />
                          Previous
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      {currentTab < 3 ? (
                        
                          <Button
                            type="button"
                            onClick={handleNext}
                            disabled={loading}
                            className="w-full sm:w-auto"
                          >
                            Next
                            <ArrowRightIcon className="size-5" />
                          </Button>
                        
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? "Creating..." : "Create Client"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </DialogFooter>
              </div>
            </form>
          </div>
        </div>

        {isContactModalOpen && (
          <ContactModal
            isOpen={isContactModalOpen}
            onOpenChange={setIsContactModalOpen}
            newContact={primaryContact}
            setNewContact={setPrimaryContact}
            handleAddContact={handleAddContact}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
