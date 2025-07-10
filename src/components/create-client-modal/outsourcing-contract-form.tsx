import { Label } from '@radix-ui/react-label';
import { Download, Eye, Upload } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import DatePicker from './date-picker';

interface OutsourcingContractFormProps {
  formData: {
    contractStartDate: Date | null;
    contractEndDate: Date | null;
    contractType: string;
    serviceCategory: string;
    numberOfResources: number;
    durationPerResource: number;
    slaTerms: string;
    totalCost: number;
    contractDocument: File | null;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const OutsourcingContractForm = ({
  formData,
  setFormData,
}: OutsourcingContractFormProps) => {

  const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false)

  const handlePreview = (file: File | null) => {
    if (file) {
      window.open(URL.createObjectURL(file), '_blank')
    }
  }

  const handleDownload = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
    }
  }

  return (
    <div className="flex flex-col gap-1 mt-3">
      {/* Dates and Contract Type in one row */}
      <div className="flex flex-row gap-2">
        {/* Contract Start Date */}
        <div className="flex-1 space-y-1 ml-2">
          <Label htmlFor="outsourcingContractStartDate">Contract Start Date</Label>
          <div className="grid gap-2">
            <DatePicker 
              open={openStartDatePicker}
              setOpen={setOpenStartDatePicker}
              value={formData.contractStartDate!}
              setValue={(date: Date | null) => setFormData({ ...formData, contractStartDate: date })}
            />
          </div>
        </div>
        {/* Contract End Date */}
        <div className="flex-1 space-y-1">
          <Label htmlFor="outsourcingContractEndDate">Contract End Date</Label>
          <div className="grid gap-2">
            <DatePicker 
              open={openEndDatePicker}
              setOpen={setOpenEndDatePicker}
              value={formData.contractEndDate!}
              setValue={(date: Date | null) => setFormData({ ...formData, contractEndDate: date })}
            />
          </div>
        </div>
        {/* Custom Contract Type */}
        <div className="flex-1 space-y-1">
          <Label htmlFor="outsourcingContractType">Contract Type</Label>
          <Select
            value={formData.contractType || ""}
            onValueChange={(value) =>
              setFormData((prev: any) => ({ ...prev, contractType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fixed Cost">Fixed Cost</SelectItem>
              <SelectItem value="Cost Plus">Cost Plus</SelectItem>
              <SelectItem value="Time & Materials">Time & Materials</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Always show details fields, even if contract type is not selected */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="flex-1 ml-2">
          <Label>Service Category</Label>
          <Input
            value={formData.serviceCategory || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                serviceCategory: e.target.value,
              }))
            }
            placeholder="Service Category"
          />
        </div>
        <div className="flex-1">
          <Label>Number of Resources</Label>
          <Input
            type="number"
            value={formData.numberOfResources || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                numberOfResources: e.target.value,
              }))
            }
            placeholder="Number of Resources"
          />
        </div>
        <div className="flex-1 ml-2">
          <Label>Duration Per Resource</Label>
          <Input
            type="number"
            value={formData.durationPerResource || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                durationPerResource: e.target.value,
              }))
            }
            placeholder="Duration Per Resource"
          />
        </div>
        <div className="flex-1">
          <Label>SLA Terms</Label>
          <Input
            value={formData.slaTerms || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                slaTerms: e.target.value,
              }))
            }
            placeholder="SLA Terms"
          />
        </div>
        <div className="flex-1 ml-2">
          <Label>Total Cost</Label>
          <Input
            type="number"
            value={formData.totalCost || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                totalCost: e.target.value,
              }))
            }
            placeholder="Total Cost"
          />
        </div>
      </div>
      {/* Contract Document row */}
      <div className="space-y-2 mt-4">
        <Label className="text-sm sm:text-base font-semibold">Contract Document</Label>
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:space-x-2 ">
          <div className="flex gap-2">
            <div
              className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1 w-full"
              onClick={() =>
                document.getElementById("outsourcingContractDocumentInput")?.click()
              }
            >
              <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
            </div>
            <input
              id="outsourcingContractDocumentInput"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => setFormData({ ...formData, contractDocument: e.target.files?.[0] || null })}
            />
            <div className="flex flex-col gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2 gap-1"
                onClick={() => handlePreview(formData.contractDocument)}
                disabled={!formData.contractDocument}
              >
                <Eye className="h-3 w-3" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => handleDownload(formData.contractDocument)}
                disabled={!formData.contractDocument}
              >
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
          {formData.contractDocument && (
            <span className="text-xs text-muted-foreground truncate">
              Selected file: {formData.contractDocument.name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default OutsourcingContractForm