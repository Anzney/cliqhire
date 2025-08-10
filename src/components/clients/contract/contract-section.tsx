"use client";

import { useState } from "react";
import { ChevronRight, FileText, Calendar, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import BusinessForm from "@/components/contract-forms/business-form";
import ConsultingForm from "@/components/contract-forms/consulting-form";
import OutsourcingForm from "@/components/contract-forms/outsourcing-form";
import { ContractInformationTab } from "@/components/contract-forms/new-contract-modal";
import { deleteContract, updateContract, addContract } from "@/services/clientContractService";
import { toast } from "sonner";
import { ClientContractInfo } from "@/components/create-client-modal/type";

interface ContractSectionProps {
  clientId: string;
  clientData?: any;
}

// Mapping between line of business and contract object keys
const CONTRACT_MAPPING = {
  Recruitment: "businessContractRQT",
  "HR Managed Services": "businessContractHMS",
  "IT & Technology": "businessContractIT",
  "Mgt Consulting": "consultingContractMGTC",
  "HR Consulting": "consultingContractHRC",
  Outsourcing: "outsourcingContract",
};

// Mapping between level type names from backend and object keys
const LEVEL_TYPE_MAPPING: { [key: string]: string } = {
  "Non-Executives": "nonExecutives",
  Executives: "executives",
  "Senior Level": "seniorLevel",
  Other: "other",
};

// Helper function to get form type based on business type
const getFormType = (businessType: string) => {
  if (["Recruitment", "HR Managed Services", "IT & Technology"].includes(businessType)) {
    return "business";
  }
  if (["Mgt Consulting", "HR Consulting"].includes(businessType)) {
    return "consulting";
  }
  if (businessType === "Outsourcing") {
    return "outsourcing";
  }
  return "business"; // default
};

export function ContractSection({ clientId, clientData }: ContractSectionProps) {
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Contract Dialog state
  const [addContractDialogOpen, setAddContractDialogOpen] = useState(false);
  const [addContractFormData, setAddContractFormData] = useState<ClientContractInfo>({
    lineOfBusiness: [],
    contractForms: {},
  });
  const [isAddingContract, setIsAddingContract] = useState(false);

  // Function to map contract data to form data structure
  const mapContractDataToFormData = (contractData: any, businessType: string) => {
    const formType = getFormType(businessType);

    if (formType === "business") {
      return {
        contractStartDate: contractData?.contractStartDate
          ? new Date(contractData.contractStartDate)
          : null,
        contractEndDate: contractData?.contractEndDate
          ? new Date(contractData.contractEndDate)
          : null,
        contractType: contractData?.ContractType || contractData?.contractType || "",
        fixedPercentage: contractData?.fixedPercentage || 0,
        advanceMoneyCurrency: contractData?.advanceMoneyCurrency || "SAR",
        advanceMoneyAmount: contractData?.advanceMoneyAmount || 0,
        fixedPercentageAdvanceNotes: contractData?.fixedPercentageAdvanceNotes || "",
        contractDocument: contractData?.contractDocument || null,
        fixWithoutAdvanceValue: contractData?.fixedPercentageWithoutAdvance || 0,
        fixWithoutAdvanceNotes: contractData?.fixedPercentageWithoutAdvanceNotes || "",
        levelBasedHiring: contractData?.levelBasedHiring || {
          levelTypes: [],
          seniorLevel: { percentage: 0, notes: "" },
          executives: { percentage: 0, notes: "" },
          nonExecutives: { percentage: 0, notes: "" },
          other: { percentage: 0, notes: "" },
        },
        levelBasedAdvanceHiring: contractData?.levelBasedAdvanceHiring || {
          levelTypes: [],
          seniorLevel: { percentage: 0, notes: "", amount: 0, currency: "SAR" },
          executives: { percentage: 0, notes: "", amount: 0, currency: "SAR" },
          nonExecutives: { percentage: 0, notes: "", amount: 0, currency: "SAR" },
          other: { percentage: 0, notes: "", amount: 0, currency: "SAR" },
        },
      };
    }

    if (formType === "consulting") {
      // Map documents based on specific consulting type
      let technicalProposalDocument = null;
      let financialProposalDocument = null;

      if (businessType === "HR Consulting") {
        technicalProposalDocument = contractData?.techProposalDocHRC || null;
        financialProposalDocument = contractData?.finProposalDocHRC || null;
      } else if (businessType === "Mgt Consulting") {
        technicalProposalDocument = contractData?.techProposalDocMGTC || null;
        financialProposalDocument = contractData?.finProposalDocMGTC || null;
      } else {
        // Fallback for generic consulting contracts
        technicalProposalDocument = contractData?.technicalProposalDocument || null;
        financialProposalDocument = contractData?.financialProposalDocument || null;
      }

      return {
        contractStartDate: contractData?.contractStartDate
          ? new Date(contractData.contractStartDate)
          : null,
        contractEndDate: contractData?.contractEndDate
          ? new Date(contractData.contractEndDate)
          : null,
        technicalProposalNotes: contractData?.technicalProposalNotes || "",
        financialProposalNotes: contractData?.financialProposalNotes || "",
        technicalProposalDocument,
        financialProposalDocument,
      };
    }

    if (formType === "outsourcing") {
      return {
        contractStartDate: contractData?.contractStartDate
          ? new Date(contractData.contractStartDate)
          : null,
        contractEndDate: contractData?.contractEndDate
          ? new Date(contractData.contractEndDate)
          : null,
        contractType: contractData?.ContractType || contractData?.contractType || "",
        serviceCategory: contractData?.serviceCategory || "",
        numberOfResources: contractData?.numberOfResources || 0,
        durationPerResource: contractData?.durationPerResource || 0,
        slaTerms: contractData?.slaTerms || "",
        totalCost: contractData?.totalCost || 0,
        contractDocument: contractData?.contractDocument || null,
      };
    }

    return {};
  };

  const handleEditContract = (businessType: string) => {
    const contractKey = CONTRACT_MAPPING[businessType as keyof typeof CONTRACT_MAPPING];
    const contractData = clientData.contracts[contractKey];
    const mappedData = mapContractDataToFormData(contractData, businessType);
    setFormData(mappedData);
    setEditDialogOpen(businessType);
  };

  const handleFormSubmit = async (updatedFormData: any) => {
    if (!editDialogOpen || !clientId) return;

    setIsSubmitting(true);

    try {
      // Get the backend contract type (mapped value) to send to API
      const contractKey = CONTRACT_MAPPING[editDialogOpen as keyof typeof CONTRACT_MAPPING];
      await updateContract(clientId, contractKey, updatedFormData);

      toast.success(`${editDialogOpen} contract updated successfully!`);
      setEditDialogOpen(null);

      // Optional: Refresh client data to show updated values
      // You might want to call a refresh function here or update local state
    } catch (error) {
      console.error("Failed to update contract:", error);
      toast.error(`Failed to update ${editDialogOpen} contract. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContract = async () => {
    if (!deleteDialogOpen || !clientId) return;

    setIsDeleting(true);

    try {
      // Get the backend contract type (mapped value) to send to API
      const contractKey = CONTRACT_MAPPING[deleteDialogOpen as keyof typeof CONTRACT_MAPPING];
      await deleteContract(clientId, contractKey);

      toast.success(`${deleteDialogOpen} contract deleted successfully!`);
      setDeleteDialogOpen(null);

      // Optional: Refresh client data to remove deleted contract
      // You might want to call a refresh function here or update local state
    } catch (error) {
      console.error("Failed to delete contract:", error);
      toast.error(`Failed to delete ${deleteDialogOpen} contract. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddContract = () => {
    setAddContractFormData({
      lineOfBusiness: [],
      contractForms: {},
    });
    setAddContractDialogOpen(true);
  };

  const handleCloseAddContractDialog = () => {
    setAddContractDialogOpen(false);
    setAddContractFormData({
      lineOfBusiness: [],
      contractForms: {},
    });
  };

  const handleSubmitContract = async () => {
    if (!clientId || !addContractFormData.lineOfBusiness.length) {
      toast.error("Please select at least one line of business");
      return;
    }

    setIsAddingContract(true);

    try {
      // Submit contracts for each selected line of business
      const promises = addContractFormData.lineOfBusiness.map(async (businessType: string) => {
        // Use businessType as key to access form data (stored by ContractInformationTab)
        const contractFormData = addContractFormData.contractForms[businessType];
        console.log(contractFormData);
        if (contractFormData) {
          await addContract(
            clientId,
            CONTRACT_MAPPING[businessType as keyof typeof CONTRACT_MAPPING],
            contractFormData,
          );
        }
      });

      await Promise.all(promises);

      toast.success("Contract(s) added successfully!");
      handleCloseAddContractDialog();

      // Refresh the page to show new contracts
      window.location.reload();
    } catch (error) {
      console.error("Failed to add contract:", error);
      toast.error("Failed to add contract. Please try again.");
    } finally {
      setIsAddingContract(false);
    }
  };

  const renderEditForm = (businessType: string) => {
    const formType = getFormType(businessType);

    if (formType === "business") {
      return <BusinessForm formData={formData} setFormData={setFormData} />;
    }

    if (formType === "consulting") {
      return <ConsultingForm formData={formData} setFormData={setFormData} />;
    }

    if (formType === "outsourcing") {
      return <OutsourcingForm formData={formData} setFormData={setFormData} />;
    }

    return null;
  };

  if (!clientData) {
    return <div className="text-center py-8 text-gray-500">Loading contract information...</div>;
  }

  // Get line of business array
  const lineOfBusiness = clientData.lineOfBusiness || [];

  // Filter to only show contracts that exist in the data
  const availableContracts = lineOfBusiness.filter((business: string) => {
    const contractKey = CONTRACT_MAPPING[business as keyof typeof CONTRACT_MAPPING];
    return contractKey && clientData.contracts[contractKey];
  });

  if (availableContracts.length === 0) {
    return (
      <>
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">No contract information available</p>
          <p className="text-xs text-gray-400 mt-1">
            Contract details will appear here once configured
          </p>
          <Button onClick={handleAddContract} className="mt-4 flex items-center gap-2 mx-auto">
            <Plus className="h-4 w-4" />
            Add Contract
          </Button>
        </div>
        {/* Add Contract Dialog */}
        <Dialog open={addContractDialogOpen} onOpenChange={handleCloseAddContractDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Contract</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <ContractInformationTab
                formData={addContractFormData}
                setFormData={setAddContractFormData}
              />
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCloseAddContractDialog}
                  disabled={isAddingContract}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitContract} disabled={isAddingContract}>
                  {isAddingContract ? "Adding Contract..." : "Submit Contract"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getContractSummary = (contractData: any, contractType: string) => {
    if (!contractData) return null;

    // Common contract info with all possible properties
    const summary: {
      contractType?: string;
      ContractType?: string;
      startDate?: string;
      endDate?: string;
      hasDocument: boolean;
      details?: string;
      hasTechProposal?: boolean;
      hasFinProposal?: boolean;
    } = {
      contractType: contractData.ContractType || contractData.contractType || "Not specified",
      startDate: contractData.contractStartDate,
      endDate: contractData.contractEndDate,
      hasDocument: !!contractData.contractDocument?.url,
    };

    // Add specific details based on contract type
    if (
      contractType === "Recruitment" ||
      contractType === "IT & Technology" ||
      contractType === "HR Managed Services"
    ) {
      if (contractData.ContractType === "Fix with Advance") {
        summary.details = `${contractData.fixedPercentage || 0}% + ${contractData.advanceMoneyAmount || 0} ${contractData.advanceMoneyCurrency || "SAR"}`;
      } else if (contractData.ContractType === "Fix without Advance") {
        summary.details = `${contractData.fixedPercentageWithoutAdvance || 0}%`;
      } else if (contractData.ContractType === "Level Based (Hiring)") {
        const levelTypes = contractData.levelBasedHiring?.levelTypes || [];
        summary.details = `${levelTypes.length} levels configured`;
      } else if (contractData.ContractType === "Level Based With Advance") {
        const levelTypes = contractData.levelBasedAdvanceHiring?.levelTypes || [];
        summary.details = `${levelTypes.length} levels with advance`;
      }
    } else if (contractType === "HR Consulting" || contractType === "Mgt Consulting") {
      if (contractType === "HR Consulting") {
        summary.hasTechProposal = !!contractData.techProposalDocHRC?.url;
        summary.hasFinProposal = !!contractData.finProposalDocHRC?.url;
      } else {
        summary.hasTechProposal = !!contractData.techProposalDocMGTC?.url;
        summary.hasFinProposal = !!contractData.finProposalDocMGTC?.url;
      }
    } else if (contractType === "Outsourcing") {
      summary.details = `${contractData.numberOfResources || 0} resources - ${contractData.totalCost || 0} total cost`;
    }

    return summary;
  };

  const handleShowDetails = (contractType: string) => {
    setExpandedContract(expandedContract === contractType ? null : contractType);
  };

  const renderContractDetails = (contractData: any, contractType: string) => {
    if (!contractData) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-3">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Contract Type:</span>
            <p className="text-gray-800">
              {contractData.ContractType || contractData.contractType || "Not specified"}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Duration:</span>
            <p className="text-gray-800">
              {formatDate(contractData.contractStartDate)} -{" "}
              {formatDate(contractData.contractEndDate)}
            </p>
          </div>
        </div>

        {/* Recruitment/IT specific details */}
        {(contractType === "Recruitment" ||
          contractType === "IT & Technology" ||
          contractType === "HR Managed Services") && (
          <div className="space-y-2">
            {contractData.ContractType === "Fix with Advance" ||
              (contractData.contractType === "Fix with Advance" && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Fixed Percentage:</span>
                    <p className="text-gray-800">{contractData.fixedPercentage || 0}%</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Advance Amount:</span>
                    <p className="text-gray-800">
                      {contractData.advanceMoneyAmount || 0}{" "}
                      {contractData.advanceMoneyCurrency || "SAR"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Notes:</span>
                    <p className="text-gray-800">
                      {contractData.fixedPercentageAdvanceNotes || "No notes"}
                    </p>
                  </div>
                </div>
              ))}

            {contractData.ContractType === "Level Based (Hiring)" ||
              (contractData.contractType === "Level Based (Hiring)" &&
                contractData.levelBasedHiring?.levelTypes?.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-600">Level Configuration:</span>
                    <div className="mt-2 space-y-1">
                      {contractData.levelBasedHiring.levelTypes.map((level: string) => {
                        const levelKey =
                          LEVEL_TYPE_MAPPING[level] || level.toLowerCase().replace(/[^a-z]/g, "");
                        const levelData = contractData.levelBasedHiring[levelKey] || {};
                        return (
                          <div key={level} className="text-sm grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-600">Level Type:</p>
                              <p>{level}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-600">Percentage:</p>
                              <p>{levelData.percentage || 0}%</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-600">Amount:</p>
                              <p>{levelData.amount || 0} {levelData.currency || "SAR"}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-600">Notes:</p>
                              <p>{levelData.notes || "No notes"}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

            {contractData.ContractType === "Level Based With Advance" ||
              (contractData.contractType === "Level Based With Advance" &&
                contractData.levelBasedAdvanceHiring?.levelTypes?.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Level Configuration (With Advance):
                    </span>
                    <div className="mt-2 space-y-1">
                      {contractData.levelBasedAdvanceHiring.levelTypes.map((level: string) => {
                        const levelKey =
                          LEVEL_TYPE_MAPPING[level] || level.toLowerCase().replace(/[^a-z]/g, "");
                        const levelData = contractData.levelBasedAdvanceHiring[levelKey] || {};
                        return (
                          <div key={level} className="text-sm grid grid-cols-3 gap-4">
                            <div>
                              <p className="font-medium text-gray-600">Level Type:</p>
                              <p>{level}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-600">Percentage:</p>
                              <p>{levelData.percentage || 0}%</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-600">Amount:</p>
                              <p>
                                {levelData.amount || 0} {levelData.currency || "SAR"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-600">Notes:</p>
                              <p>{levelData.notes || "No notes"}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
          </div>
        )}

        {/* Consulting specific details */}
        {(contractType === "HR Consulting" || contractType === "Mgt Consulting") && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Currency:</span>
                <p className="text-gray-800">{contractData.salaryCurrency || "SAR"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Technical Proposal:</span>
                <p className="text-gray-800">{contractData.technicalProposalNotes || "No notes"}</p>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-600">Financial Proposal:</span>
                <p className="text-gray-800">{contractData.financialProposalNotes || "No notes"}</p>
              </div>
            </div>
          </div>
        )}

        {/* HR Consulting Contract Documents */}
        {contractType === "HR Consulting" && (
          <div className="space-y-2">
            {contractData.techProposalDocHRC?.url && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Technical Proposal Document:
                    </span>
                    <span className="text-sm text-gray-800">
                      {contractData.techProposalDocHRC.fileName || "Technical Proposal"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(contractData.techProposalDocHRC.url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}

            {contractData.finProposalDocHRC?.url && (
              <div className={contractData.techProposalDocHRC?.url ? "pt-2" : "pt-2 border-t"}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Financial Proposal Document:
                    </span>
                    <span className="text-sm text-gray-800">
                      {contractData.finProposalDocHRC.fileName || "Financial Proposal"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(contractData.finProposalDocHRC.url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mgt Consulting Contract Documents */}
        {contractType === "Mgt Consulting" && (
          <div className="space-y-2">
            {contractData.techProposalDocMGTC?.url && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Technical Proposal Document:
                    </span>
                    <span className="text-sm text-gray-800">
                      {contractData.techProposalDocMGTC.fileName || "Technical Proposal"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(contractData.techProposalDocMGTC.url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}

            {contractData.finProposalDocMGTC?.url && (
              <div className={contractData.techProposalDocMGTC?.url ? "pt-2" : "pt-2 border-t"}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Financial Proposal Document:
                    </span>
                    <span className="text-sm text-gray-800">
                      {contractData.finProposalDocMGTC.fileName || "Financial Proposal"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(contractData.finProposalDocMGTC.url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Outsourcing specific details */}
        {contractType === "Outsourcing" && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Resources:</span>
              <p className="text-gray-800">{contractData.numberOfResources || 0}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Total Cost:</span>
              <p className="text-gray-800">{contractData.totalCost || 0}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Service Category:</span>
              <p className="text-gray-800">{contractData.serviceCategory || "Not specified"}</p>
            </div>
          </div>
        )}

        {/* Contract Document */}
        {contractData.contractDocument?.url && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Contract Document:</span>
                <span className="text-sm text-gray-800">
                  {contractData.contractDocument.fileName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(contractData.contractDocument.url, "_blank")}
              >
                View
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Add Contract Button */}
      <div className="flex justify-end">
        <Button onClick={handleAddContract} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Contract
        </Button>
      </div>

      {availableContracts.map((businessType: string) => {
        const contractKey = CONTRACT_MAPPING[businessType as keyof typeof CONTRACT_MAPPING];
        const contractData = clientData.contracts[contractKey];
        const summary = getContractSummary(contractData, businessType);
        const isExpanded = expandedContract === businessType;

        return (
          <div key={businessType} className="border rounded-lg shadow-sm bg-white">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-semibold text-gray-800">{businessType} Contract</h3>
                    <Badge variant="secondary" className="text-xs">
                      {summary?.contractType || summary?.ContractType}
                    </Badge>
                  </div>

                  {summary?.details && (
                    <p className="text-sm text-gray-600 mt-1">{summary.details}</p>
                  )}

                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    {summary?.startDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(summary.startDate)}</span>
                      </div>
                    )}
                    {summary?.hasDocument && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>Document attached</span>
                      </div>
                    )}
                    {summary?.hasTechProposal && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>Technical proposal</span>
                      </div>
                    )}
                    {summary?.hasFinProposal && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>Financial proposal</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShowDetails(businessType)}
                    className="text-xs"
                  >
                    {isExpanded ? "Hide Details" : "Show Complete Details"}
                    <ChevronRight
                      className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditContract(businessType)}
                    className="text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(businessType)}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              {isExpanded && renderContractDetails(contractData, businessType)}
            </div>
          </div>
        );
      })}

      {/* Edit Contract Dialog */}
      <Dialog open={!!editDialogOpen} onOpenChange={(open) => !open && setEditDialogOpen(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editDialogOpen} Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editDialogOpen && renderEditForm(editDialogOpen)}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={() => handleFormSubmit(formData)} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Contract Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteDialogOpen}
        onOpenChange={(open) => !open && setDeleteDialogOpen(null)}
        title="Delete Contract"
        description={`Are you sure you want to delete the ${deleteDialogOpen} contract? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteContract}
        loading={isDeleting}
        confirmVariant="destructive"
      />

      {/* Add Contract Dialog */}
      <Dialog open={addContractDialogOpen} onOpenChange={handleCloseAddContractDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ContractInformationTab
              formData={addContractFormData}
              setFormData={setAddContractFormData}
            />
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCloseAddContractDialog}
                disabled={isAddingContract}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitContract} disabled={isAddingContract}>
                {isAddingContract ? "Adding Contract..." : "Submit Contract"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
