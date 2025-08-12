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
import { PrimaryContact, LocationSuggestion } from "@/components/create-client-modal/type";
import axios from "axios";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import {
  clientContactInfoInitialstate,
  clientGeneralInfoInitialState,
  clientSubStages,
  primaryContactInitialState,
} from "./constants";
import { ClientContractInfo, ClientContactInfo, ClientGeneralInfo } from "./type";
import { createClient } from "./api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientFormSchema, CreateClientFormData } from "./schema";
import { Form } from "@/components/ui/form";

export function CreateClientModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const form = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientFormSchema),
    defaultValues: {
      clientGeneralInfo: clientGeneralInfoInitialState,
      clientContactInfo: clientContactInfoInitialstate,
      clientContractInfo: {
        lineOfBusiness: [],
        contractForms: {},
      },
      uploadedFiles: {
        profileImage: null,
        crCopy: null,
        vatCopy: null,
        gstTinDocument: null,
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [primaryContact, setPrimaryContact] = useState<PrimaryContact>(primaryContactInitialState);

  // Watch form values for location suggestions
  const watchedContactInfo = form.watch("clientContactInfo");

  // Location suggestions
  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (!watchedContactInfo.location || watchedContactInfo.location.length < 3) {
        setLocationSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            watchedContactInfo.location,
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
  }, [watchedContactInfo.location]);

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
    (field: keyof CreateClientFormData["uploadedFiles"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
          return;
        }
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
          toast.error(`Invalid file type for ${file.name}. Allowed types are: JPEG, PNG, PDF`);
          return;
        }
        form.setValue(`uploadedFiles.${field}`, file);
      }
    };

  const handlePreview = (file: File | string | null) => {
    if (!file) {
      toast.error("No file uploaded to preview.");
      return;
    }

    if (typeof file === "string") {
      const fileUrl = file.startsWith("http") ? file : `https://aems-backend.onrender.com/${file}`;
      window.open(fileUrl, "_blank");
    } else if (file instanceof File) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, "_blank");
    } else {
      toast.error("Unsupported file type for preview.");
    }
  };

  const handleDownload = (file: File | null) => {
    if (!file) {
      toast.error("No file uploaded to download.");
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
      toast.error("Contact first name is required");
      return;
    }
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      toast.error(`Invalid contact email: ${contact.email}`);
      return;
    }
    if (!contact.phone) {
      toast.error("Contact phone number is required");
      return;
    }
    if (contact.linkedin && !validateUrl(contact.linkedin)) {
      toast.error("Invalid LinkedIn URL");
      return;
    }

    const currentContacts = form.getValues("clientContactInfo.primaryContacts");
    form.setValue("clientContactInfo.primaryContacts", [...currentContacts, contact]);

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
  };

  const validateCurrentTab = async (): Promise<boolean> => {
    const formData = form.getValues();

    try {
      switch (currentTab) {
        case 0: // Client General Info
          await createClientFormSchema.shape.clientGeneralInfo.parseAsync(
            formData.clientGeneralInfo,
          );
          break;
        case 1: // Client Contact Info
          await createClientFormSchema.shape.clientContactInfo.parseAsync(
            formData.clientContactInfo,
          );
          break;
        case 2: // Contract Information
          await createClientFormSchema.shape.clientContractInfo.parseAsync(
            formData.clientContractInfo,
          );
          // Additional validation for contract forms
          const selectedBusinesses = formData.clientContractInfo.lineOfBusiness;
          const filledForms = Object.keys(formData.clientContractInfo.contractForms);
          const missingForms = selectedBusinesses.filter(
            (business) => !filledForms.includes(business),
          );

          if (missingForms.length > 0) {
            toast.error(`Please fill contract forms for: ${missingForms.join(", ")}`);
            return false;
          }
          break;
        case 3: // Documents (optional)
          break;
      }
      return true;
    } catch (error: any) {
      if (error.errors) {
        const errorMessage = error.errors[0]?.message || "Please fill all required fields";
        toast.error(errorMessage);
      }
      return false;
    }
  };

  const handleSubmit = async (formData: CreateClientFormData) => {
    setLoading(true);
    const submissionFormData = new FormData();

    // Client General Info
    const { clientGeneralInfo } = formData;
    if (clientSubStages.includes(clientGeneralInfo.clientSubStage!)) {
      submissionFormData.append("clientStage", "Engaged");
      submissionFormData.append("clientSubStage", clientGeneralInfo.clientSubStage!);
    } else {
      submissionFormData.append("clientStage", clientGeneralInfo.clientStage ?? "");
      submissionFormData.append("clientSubStage", "");
    }
    submissionFormData.append("salesLead", clientGeneralInfo.salesLead ?? "");
    submissionFormData.append("referredBy", clientGeneralInfo.referredBy ?? "");
    submissionFormData.append("clientPriority", clientGeneralInfo.clientPriority?.toString() ?? "");
    submissionFormData.append("clientSegment", clientGeneralInfo.clientSegment ?? "");
    submissionFormData.append("clientSource", clientGeneralInfo.clientSource ?? "");
    submissionFormData.append("industry", clientGeneralInfo.industry ?? "");

    // Client Contact Info
    const { clientContactInfo } = formData;
    submissionFormData.append("name", clientContactInfo.name.trim() || "");
    submissionFormData.append("emails", JSON.stringify(clientContactInfo.emails));
    submissionFormData.append("website", clientContactInfo.website.trim() || "");
    submissionFormData.append("phoneNumber", clientContactInfo.phoneNumber.trim() || "");
    submissionFormData.append("address", clientContactInfo.address.trim() || "");
    submissionFormData.append(
      "countryOfBusiness",
      clientContactInfo.countryOfBusiness?.trim() || "",
    );
    submissionFormData.append("linkedInProfile", clientContactInfo.linkedInProfile.trim() || "");
    submissionFormData.append("googleMapsLink", clientContactInfo.googleMapsLink.trim() || "");
    submissionFormData.append("primaryContacts", JSON.stringify(clientContactInfo.primaryContacts));

    // Client Contract Info
    const { clientContractInfo } = formData;
    submissionFormData.append(
      "lineOfBusiness",
      JSON.stringify(clientContractInfo.lineOfBusiness) || "",
    );

    // Group all contracts under a single 'contracts' object
    const contracts: Record<string, any> = {};

    Object.entries(clientContractInfo.contractForms).forEach(([key, value]) => {
      const formData = value as any;

      if (key === "HR Consulting") {
        const { technicalProposalDocument, financialProposalDocument, ...rest } = formData;
        contracts.consultingContractHRC = rest;
      } else if (key === "Mgt Consulting") {
        const { technicalProposalDocument, financialProposalDocument, ...rest } = formData;
        contracts.consultingContractMGTC = rest;
      } else if (key === "Recruitment") {
        const { contractDocument, ...rest } = formData;
        contracts.businessContractRQT = rest;
      } else if (key === "HR Managed Services") {
        const { contractDocument, ...rest } = formData;
        contracts.businessContractHMS = rest;
      } else if (key === "IT & Technology") {
        const { contractDocument, ...rest } = formData;
        contracts.businessContractIT = rest;
      } else if (key === "Outsourcing") {
        const { contractDocument, ...rest } = formData;
        contracts.outsourcingContract = rest;
      }
    });

    // Send all contracts as a single JSON object (without documents)
    submissionFormData.append("contracts", JSON.stringify(contracts));

    // Now take all the documents from the contracts
    Object.entries(clientContractInfo.contractForms).forEach(([key, value]) => {
      const formData = value as any;
      if(key === "HR Consulting"){
        if(formData.technicalProposalDocument){
          submissionFormData.append("techProposalDocHRC", formData.technicalProposalDocument);
        }
        if(formData.financialProposalDocument){
          submissionFormData.append("finProposalDocHRC", formData.financialProposalDocument);
        }
      }
      if(key === "Mgt Consulting"){
        if(formData.technicalProposalDocument){
          submissionFormData.append("techProposalDocMGTC", formData.technicalProposalDocument);
        }
        if(formData.financialProposalDocument){
          submissionFormData.append("finProposalDocMGTC", formData.financialProposalDocument);
        }
      }
      if(key === "Recruitment"){
        if(formData.contractDocument){
          submissionFormData.append("businessContractRQTDocument", formData.contractDocument);
        }
      }
      if(key === "HR Managed Services"){
        if(formData.contractDocument){
          submissionFormData.append("businessContractHMSDocument", formData.contractDocument);
        }
      }
      if(key === "IT & Technology"){
        if(formData.contractDocument){
          submissionFormData.append("businessContractITDocument", formData.contractDocument);
        }
      }
      if(key === "Outsourcing"){
        if(formData.contractDocument){
          submissionFormData.append("outsourcingContractDocument", formData.contractDocument);
        }
      }
    })

    // Client Documents (uploaded to Cloudinary)
    const { uploadedFiles } = formData;
    if (uploadedFiles.profileImage) {
      submissionFormData.append("profileImage", uploadedFiles.profileImage);
    }
    if (uploadedFiles.crCopy) {
      submissionFormData.append("crCopy", uploadedFiles.crCopy);
    }
    if (uploadedFiles.vatCopy) {
      submissionFormData.append("vatCopy", uploadedFiles.vatCopy);
    }
    if (uploadedFiles.gstTinDocument) {
      submissionFormData.append("gstTinDocument", uploadedFiles.gstTinDocument);
    }

    try {
      const result = await createClient(submissionFormData);
      if (result.data.data._id) {
        router.push(`/clients/${result.data.data._id}`);
        return;
      }
      form.reset();
      setLoading(false);
      toast.success("Client created successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Error creating client");
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentTab();
    if (isValid) {
      const newTab = Math.min(currentTab + 1, 3);
      setCurrentTab(newTab);
    }
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                {currentTab === 0 && <ClientInformationTab form={form} />}
                {currentTab === 1 && (
                  <ContactDetailsTab form={form} setIsContactModalOpen={setIsContactModalOpen} />
                )}
                {currentTab === 2 && <ContractInformationTab form={form} />}
                {currentTab === 3 && (
                  <DocumentsTab
                    uploadedFiles={form.watch("uploadedFiles")}
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
            </Form>
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
