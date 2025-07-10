import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import StandardContractForm from "./standard-contract-form";
import ConsultingContractForm from "./consulting-contract-form";
import OutsourcingContractForm from "./outsourcing-contract-form";

import { 
  businessInitialState,
  outsourcingInitialState,
  consultingInitialState,
} from "./constants";
import { ClientContractInfo } from "./type";
import { Pencil } from "lucide-react";

interface ContractInformationTabProps {
  formData: ClientContractInfo;
  setFormData: React.Dispatch<React.SetStateAction<ClientContractInfo>>;
}

export function ContractInformationTab({
  formData,
  setFormData,
}: ContractInformationTabProps) {

  // Business tabs
  const [activeBusinessTab, setActiveBusinessTab] = useState<string | null>(null);
 

  const [standardContractFormData, setStandardContractFormData] = useState(businessInitialState);
  const [consultingContractFormData, setConsultingContractFormData] = useState(consultingInitialState);
  const [outsourcingContractFormData, setOutsourcingContractFormData] = useState(outsourcingInitialState);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBusiness, setModalBusiness] = useState<string | null>(null);
 


  const handleSaveContract = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (modalBusiness === "Recruitment" || modalBusiness === "HR Managed Services" || modalBusiness === "IT & Technology") {
      const clonedFormData = structuredClone(formData);
      clonedFormData.contractForms[modalBusiness!] = standardContractFormData;
      setFormData(clonedFormData);
    } else if (modalBusiness === "HR Consulting" || modalBusiness === "Mgt Consulting") {
      const clonedFormData = structuredClone(formData);
      clonedFormData.contractForms[modalBusiness!] = consultingContractFormData;
      setFormData(clonedFormData);
    } else if (modalBusiness === "Outsourcing") {
      const clonedFormData = structuredClone(formData);
      clonedFormData.contractForms[modalBusiness!] = outsourcingContractFormData;
      setFormData(clonedFormData);
    }
    setStandardContractFormData(businessInitialState);
    setConsultingContractFormData(consultingInitialState);
    setOutsourcingContractFormData(outsourcingInitialState);
  
    setModalOpen(false);
  };

  // console.log(formData);

  const businessOptions = [
    "Recruitment",
    "HR Consulting",
    "Mgt Consulting",
    "Outsourcing",
    "HR Managed Services",
    "IT & Technology",
  ];

  return (
    <div className="space-y-6 pt-4 pb-2">
      <div className="space-y-1">
        <Label htmlFor="lineOfBusiness">
          Line of Business<span className="text-red-700">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-2">
          {businessOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`lob-${option}`}
                checked={formData.lineOfBusiness?.includes(option)}
                onCheckedChange={(checked) => {
                  setFormData((prev: ClientContractInfo) => {
                    const current = Array.isArray(prev.lineOfBusiness)
                      ? prev.lineOfBusiness
                      : prev.lineOfBusiness
                        ? [prev.lineOfBusiness]
                        : [];
                    return {
                      ...prev,
                      lineOfBusiness: checked
                        ? [...current, option]
                        : current.filter((item: string) => item !== option),
                    };
                  });
                  if (!formData.lineOfBusiness?.includes(option) && activeBusinessTab === option) {
                    setActiveBusinessTab(null);
                  }
                }}
              />
              <label
                htmlFor={`lob-${option}`}
                className={`text-xs sm:text-sm font-medium leading-none cursor-pointer ${
                  formData.lineOfBusiness?.includes(option) ? "font-bold text-primary" : ""
                }`}
                onClick={() =>
                  formData.lineOfBusiness?.includes(option) &&
                  setFormData((prev: ClientContractInfo) => ({ ...prev, lineOfBusiness: [option] }))
                }
              >
                {option
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </label>
            </div>
          ))}
        </div>
      </div>

      {formData.lineOfBusiness &&
        Array.isArray(formData.lineOfBusiness) &&
        formData.lineOfBusiness.length > 0 && (
          <div className="w-full">
            {formData.lineOfBusiness.map((business: string) => (
              <div
                key={business}
                className="rounded border bg-white py-4 px-6 mb-4 flex items-center justify-between w-full"
              >
                <span className="font-medium text-xs sm:text-sm">{business} contract form</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    type="button"
                    className="w-24"
                    variant="outline"
                    onClick={() => {
                      setActiveBusinessTab(business);
                      setModalBusiness(business);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                    Fill Form
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Modal for contract form */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl w-full h-[400px] p-4 gap-0 flex flex-col">
          <DialogHeader className="mb-0 pb-0">
            <DialogTitle className="text-base leading-tight m-0 p-0">
              {modalBusiness} Contract Form
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <div className="overflow-y-auto overflow-x-hidden h-full pr-1 flex flex-col gap-1">
              {modalBusiness &&
                ["Recruitment", "HR Managed Services", "IT & Technology"].includes(modalBusiness) &&
                <StandardContractForm 
                  formData={standardContractFormData}
                  setFormData={setStandardContractFormData}
                />}
              {modalBusiness &&
                ["HR Consulting", "Mgt Consulting"].includes(modalBusiness) &&
                <ConsultingContractForm 
                  formData={consultingContractFormData}
                  setFormData={setConsultingContractFormData}
                />}
              {modalBusiness === "Outsourcing" && (
                <OutsourcingContractForm 
                  formData={outsourcingContractFormData}
                  setFormData={setOutsourcingContractFormData}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="ml-auto "
              onClick={(e) => handleSaveContract(e)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
