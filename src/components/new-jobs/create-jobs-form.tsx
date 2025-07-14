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

export function CreateJobRequirementForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState({
    clientName: "",
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
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [errors, setErrors] = useState<{ clientName?: string; positionName?: string }>({});

  // Add ref for click outside detection
  const clientDropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (showClientDropdown || clientSearch.length > 0) {
      fetchClients(clientSearch).then((clients) => {
        setClientOptions(clients);
      });
    }
  }, [clientSearch, showClientDropdown]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    };

    if (showClientDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showClientDropdown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors: typeof errors = {};
    if (!form.clientName.trim()) newErrors.clientName = "Client Name is required.";
    if (!form.positionName.trim()) newErrors.positionName = "Position Name is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Prepare job data for API call - matching JobData interface
      const jobData = {
        jobTitle: form.positionName,
        client: form.clientName, // This will be the client name, the service will handle the conversion
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
        onOpenChange(false);
      } catch (error) {
        // Optionally handle error (e.g., show a message)
        console.error("Failed to create job:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl p-0 flex flex-col h-[85vh] max-h-[500px]">
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
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-20">
          <form id="job-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Label className="block text-sm font-medium mb-1">
                Client Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="clientName"
                value={clientSearch || form.clientName}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  handleChange(e);
                }}
                onFocus={() => setShowClientDropdown(true)}
                onClick={() => setShowClientDropdown(true)}
                placeholder="Enter client name"
                className={errors.clientName ? "border-red-500" : ""}
                autoComplete="off"
              />
              {showClientDropdown && clientOptions.length > 0 && (
                <div
                  ref={clientDropdownRef}
                  className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto"
                >
                  {clientOptions.map((client) => (
                    <div
                      key={client._id}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${form.clientName === client.name ? "bg-blue-100" : ""}`}
                      onMouseDown={() => {
                        setForm((prev) => ({ ...prev, clientName: client.name }));
                        setClientSearch("");
                        setShowClientDropdown(false);
                      }}
                    >
                      {client.name}
                    </div>
                  ))}
                </div>
              )}
              {errors.clientName && (
                <div className="text-xs text-red-500 mt-1">{errors.clientName}</div>
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

            {/* Only the additional details section is conditionally rendered here */}
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

            <div>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 mt-2"
                onClick={() => setShowAdditional((v) => !v)}
                aria-expanded={showAdditional}
              >
                <PlusIcon className="w-4 h-4" />
                Add Additional Detail
                {showAdditional ? (
                  <ChevronUpIcon className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
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
