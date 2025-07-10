import React, { useRef, useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import DatePicker from "./date-picker";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";

interface ConsultingContractFormProps {
  formData: {
    contractStartDate: Date | null;
    contractEndDate: Date | null;
    technicalProposalNotes: string;
    financialProposalNotes: string;
    technicalProposalDocument: File | null;
    financialProposalDocument: File | null;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ConsultingContractForm = ({ formData, setFormData }: ConsultingContractFormProps) => {
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  const technicalProposalOptionInputRef = useRef<HTMLInputElement>(null);
  const financialProposalOptionInputRef = useRef<HTMLInputElement>(null);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 mt-4">
        {/* Dates in one row */}
        <div className="flex flex-row gap-4 ml-2">
          {/* Contract Start Date */}
          <div className="flex-1 space-y-1">
            <Label htmlFor="contractStartDate">Contract Start Date</Label>
            <div className="grid gap-2">
              <DatePicker
                open={openStartDatePicker}
                setOpen={setOpenStartDatePicker}
                value={formData.contractStartDate!}
                setValue={(date) => setFormData({ ...formData, contractStartDate: date })}
              />
            </div>
          </div>
          {/* Contract End Date */}
          <div className="flex-1 space-y-1">
            <Label htmlFor="contractEndDate">Contract End Date</Label>
            <div className="grid gap-2">
              <DatePicker
                open={openEndDatePicker}
                setOpen={setOpenEndDatePicker}
                value={formData.contractEndDate!}
                setValue={(date) => setFormData({ ...formData, contractEndDate: date })}
              />
            </div>
          </div>
        </div>
        {/* Proposals in one row */}
        <div className="flex flex-row gap-4 ml-2">
          {/* Technical Proposal */}
          <div className="flex-1 space-y-1">
            <Label>Technical Proposal</Label>
            <Textarea
              value={formData.technicalProposalNotes || ""}
              onChange={(e) => setFormData({ ...formData, technicalProposalNotes: e.target.value })}
              placeholder="Enter Technical Proposal notes..."
              className="min-h-[60px]"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => technicalProposalOptionInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> Upload File
              </Button>
              <input
                ref={technicalProposalOptionInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) =>
                  setFormData({ ...formData, technicalProposalDocument: e.target.files?.[0] || null })
                }
              />
              {formData.technicalProposalDocument && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="text-xs text-muted-foreground truncate max-w-[150px] inline-block align-middle cursor-pointer"
                    >
                      {formData.technicalProposalDocument.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {formData.technicalProposalDocument.name}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          {/* Financial Proposal */}
          <div className="flex-1 space-y-1">
            <Label>Financial Proposal</Label>
            <Textarea
              value={formData.financialProposalNotes || ""}
              onChange={(e) => setFormData({ ...formData, financialProposalNotes: e.target.value })}
              placeholder="Enter Financial Proposal notes..."
              className="min-h-[60px]"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => financialProposalOptionInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> Upload File
              </Button>
              <input
                ref={financialProposalOptionInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) =>
                  setFormData({ ...formData, financialProposalDocument: e.target.files?.[0] || null })
                }
              />
              {formData.financialProposalDocument && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="text-xs text-muted-foreground truncate max-w-[150px] inline-block align-middle cursor-pointer"
                    >
                      {formData.financialProposalDocument.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {formData.financialProposalDocument.name}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ConsultingContractForm;
