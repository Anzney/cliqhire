"use client";

import { useState } from "react";
import { ChevronRight, FileText, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export function ContractSection({ clientId, clientData }: ContractSectionProps) {
  const [expandedContract, setExpandedContract] = useState<string | null>(null);

  if (!clientData) {
    return <div className="text-center py-8 text-gray-500">Loading contract information...</div>;
  }

  // Get line of business array
  const lineOfBusiness = clientData.lineOfBusiness || [];

  // Filter to only show contracts that exist in the data
  const availableContracts = lineOfBusiness.filter((business: string) => {
    const contractKey = CONTRACT_MAPPING[business as keyof typeof CONTRACT_MAPPING];
    return contractKey && clientData[contractKey];
  });

  if (availableContracts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm">No contract information available</p>
        <p className="text-xs text-gray-400 mt-1">
          Contract details will appear here once configured
        </p>
      </div>
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

    // Common contract info
    const summary = {
      contractType: contractData.ContractType || "Not specified",
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
      summary.hasTechProposal = !!(
        contractData.techProposalDocHRC?.url || contractData.techProposalDocMGTC?.url
      );
      summary.hasFinProposal = !!(
        contractData.finProposalDocHRC?.url || contractData.finProposalDocMGTC?.url
      );
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
            <p className="text-gray-800">{contractData.ContractType || "Not specified"}</p>
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
            {contractData.ContractType === "Fix with Advance" && (
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
            )}

            {contractData.ContractType === "Level Based (Hiring)" &&
              contractData.levelBasedHiring?.levelTypes?.length > 0 && (
                <div>
                  <span className="font-medium text-gray-600">Level Configuration:</span>
                  <div className="mt-2 space-y-1">
                    {contractData.levelBasedHiring.levelTypes.map((level: string) => {
                      const levelKey = level.toLowerCase().replace(/[^a-z]/g, "");
                      const levelData = contractData.levelBasedHiring[levelKey] || {};
                      return (
                        <div key={level} className="flex justify-between text-sm">
                          <span>{level}:</span>
                          <span>
                            {levelData.percentage || 0}% {levelData.notes && `(${levelData.notes})`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {contractData.ContractType === "Level Based With Advance" &&
              contractData.levelBasedAdvanceHiring?.levelTypes?.length > 0 && (
                <div>
                  <span className="font-medium text-gray-600">
                    Level Configuration (With Advance):
                  </span>
                  <div className="mt-2 space-y-1">
                    {contractData.levelBasedAdvanceHiring.levelTypes.map((level: string) => {
                      const levelKey = level.toLowerCase().replace(/[^a-z]/g, "");
                      const levelData = contractData.levelBasedAdvanceHiring[levelKey] || {};
                      return (
                        <div key={level} className="text-sm">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{level}:</span>
                            <div className="text-right">
                              <div>
                                {levelData.percentage || 0}% + {levelData.amount || 0}{" "}
                                {levelData.currency || "SAR"}
                              </div>
                              {levelData.notes && (
                                <div className="text-xs text-gray-500 mt-1">
                                  ({levelData.notes})
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
      {availableContracts.map((businessType: string) => {
        const contractKey = CONTRACT_MAPPING[businessType as keyof typeof CONTRACT_MAPPING];
        const contractData = clientData[contractKey];
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
                      {summary?.contractType}
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
                  </div>
                </div>

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
              </div>

              {isExpanded && renderContractDetails(contractData, businessType)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
