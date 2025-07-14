"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { fetchClients } from "./clientApi";
import { createJob } from "@/services/jobService";
import { currencies } from "country-data-list";
import CurrencyFlag from "react-currency-flags";
import { Combobox } from "@/components/ui/combobox";

export function CreateJobRequirementForm({
  open,
  onOpenChange,
  lockedClientId,
  lockedClientName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockedClientId?: string;
  lockedClientName?: string;
}) {
  const [form, setForm] = useState({
    clientName: lockedClientName || "",
    clientId: lockedClientId || "",
    positionName: "",
    headcount: "",
    contractType: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    currency: "SAR",
    jobDescription: "",
  });
  const [clientOptions, setClientOptions] = useState<{ _id: string; name: string }[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showAdditional, setShowAdditional] = useState(false);
  const [errors, setErrors] = useState<{ clientName?: string; positionName?: string }>({});

 // Helper to find client by id
  const getClientById = (id: string) => clientOptions.find((c) => c._id === id);

  // If lockedClientId is provided, only show that client in the dropdown
  useEffect(() => {
    if (lockedClientId && lockedClientName) {
      setClientOptions([{ _id: lockedClientId, name: lockedClientName }]);
    } else {
      fetchClients(clientSearch).then((clients) => {
        setClientOptions(clients);
      });
    }
  }, [clientSearch, lockedClientId, lockedClientName]);

  // Form options grouped for readability and reusability
  const formOptions = {
    contractOptions: [
      "Full Time",
      "Part Time",
      "Internship",
      "Apprenticeship",
      "Temporary",
    ],
    currencyOptions: Object.values(currencies)
      .filter((c: any) => c.code && c.name && c.symbol)
      .map((c: any) => ({
        code: c.code,
        name: c.name,
        symbol: c.symbol,
        countryCode: c.countries && c.countries.length > 0 ? c.countries[0] : undefined,
      })),
  };

  // Centralized handleChange function for all form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors: typeof errors = {};
    if (!lockedClientId && !form.clientName.trim()) newErrors.clientName = "Client Name is required.";
    if (!form.positionName.trim()) newErrors.positionName = "Position Name is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Prepare job data for API call - matching JobData interface
      const jobData = {
        jobTitle: form.positionName,
        client: form.clientId, // use clientId here
        jobType: form.contractType || "full time",
        experience: "entry level", // Default value as required by interface
        headcount: form.headcount ? parseInt(form.headcount) : undefined,
        location: form.location ? [form.location] : undefined,
        minimumSalary: form.minSalary ? parseInt(form.minSalary) : undefined,
        maximumSalary: form.maxSalary ? parseInt(form.maxSalary) : undefined,
        salaryCurrency: form.currency || undefined,
        jobDescription: form.jobDescription || undefined,
      };
      try {
        await createJob(jobData);
         setForm({
        clientName: lockedClientName || "",
        clientId: lockedClientId || "",
        positionName: "",
        headcount: "",
        contractType: "",
        location: "",
        minSalary: "",
        maxSalary: "",
        currency: "SAR",
        jobDescription: "",
      });
        onOpenChange(false);
      } catch (error) {
        // Optionally handle error (e.g., show a message)
        console.error("Failed to create job:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`w-full max-w-2xl p-0 flex flex-col ${showAdditional ? 'h-[85vh] max-h-[500px]' : 'h-auto max-h-[400px]'} transition-all duration-300`}
      >
        {/* Fixed Header */}
        <div className="sticky top-0 z-20 bg-white pb-2 flex-shrink-0 rounded-t-xl">
          <div className="p-6 pb-4">
            <DialogHeader className="p-0">
              <DialogTitle className="text-lg">Create Job Requirement</DialogTitle>
              <DialogDescription className="text-sm">
                Fill in the job requirement details below. Required fields are marked with an
                asterisk (*).
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className={
            showAdditional
              ? "flex-1 min-h-0 overflow-y-auto px-6 pb-20"
              : "px-6 pb-20"
          }
        >
          <form id="job-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Label className="block text-sm font-medium mb-1">
                Client Name <span className="text-red-500">*</span>
              </Label>
              {lockedClientId ? (
                <div className="py-2 px-3 border rounded bg-gray-100 text-gray-700">
                  {lockedClientName}
                </div>
              ) : (
                <Combobox
                  options={clientOptions.map((c) => ({ value: c._id, label: c.name }))}
                  value={form.clientId}
                  onValueChange={(val) => {
                    const client = clientOptions.find((c) => c._id === val);
                    setForm((prev) => ({
                      ...prev,
                      clientId: val,
                      clientName: client ? client.name : "",
                    }));
                  }}
                  placeholder="Select client"
                  inputPlaceholder="Search client name"
                  className={errors.clientName ? "border-red-500" : ""}
                />
              )}
              {errors.clientName && (
                !lockedClientId && <div className="text-xs text-red-500 mt-1">{errors.clientName}</div>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">
                Position Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="positionName"
                value={form.positionName}
                onChange={handleChange}
                placeholder="Enter position name"
                className={errors.positionName ? "border-red-500" : ""}
              />
              {errors.positionName && (
                <div className="text-xs text-red-500 mt-1">{errors.positionName}</div>
              )}
            </div>

            <Button
              type="button"
              className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-0 active:text-blue-800 bg-transparent border-none shadow-none !bg-transparent !border-none !shadow-none"
              onClick={() => setShowAdditional((v) => !v)}
              aria-expanded={showAdditional}
            >
              {showAdditional ? (
                <span className="flex items-center gap-2">
                  Hide More Additional Detail
                  <ChevronUpIcon className="w-4 h-4 ml-1" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Show More Additional Detail
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </span>
              )}
            </Button>

            {showAdditional && (
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium mb-1">Headcount</Label>
                  <Input
                    name="headcount"
                    value={form.headcount}
                    onChange={handleChange}
                    placeholder="Enter headcount"
                    type="number"
                    min="1"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Contract Details</Label>
                  <Select value={form.contractType} onValueChange={(val) => setForm((prev) => ({ ...prev, contractType: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.contractOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Location</Label>
                  <Input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Enter job location"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="block text-sm font-medium mb-1">Currency</Label>
                    <Select value={form.currency} onValueChange={(val) => setForm((prev) => ({ ...prev, currency: val }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {formOptions.currencyOptions.map((option: any) => (
                          <SelectItem key={option.code} value={option.code}>
                            <div className="flex items-center gap-2">
                              <CurrencyFlag currency={option.code} size="sm" />
                              <span>{option.code}</span>
                              <span className="text-gray-500">({option.name})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium mb-1">Minimum Salary</Label>
                    <Input
                      name="minSalary"
                      value={form.minSalary}
                      onChange={handleChange}
                      placeholder="Min salary"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium mb-1">Maximum Salary</Label>
                    <Input
                      name="maxSalary"
                      value={form.maxSalary}
                      onChange={handleChange}
                      placeholder="Max salary"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">Job Description</Label>
                  <textarea
                    name="jobDescription"
                    value={form.jobDescription}
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 min-h-[120px] text-sm resize-none"
                    placeholder="Enter detailed job description..."
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Always render the fixed footer at the bottom, outside the scrollable area */}
        <div className="absolute bottom-0 left-0 right-0 bg-white z-50 border-t p-4 rounded-b-xl shadow-lg">
          <DialogFooter className="p-0 flex-row gap-1 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" form="job-form">
              Create Job
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
