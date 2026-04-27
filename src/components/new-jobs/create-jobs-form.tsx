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
import { PlusIcon, MinusIcon, Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { fetchClients } from "./clientApi";
import { useDebounce } from "@/hooks/use-debounce";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createJob } from "@/services/jobService";
import { currencies } from "country-data-list";
import CurrencyFlag from "react-currency-flags";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LocationInput } from "@/components/location/LocationInput";

// Inteface
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockedClientId?: string;
  lockedClientName?: string;
}

interface Form {
  clientName: string;
  clientId: string;
  positionName: string;
  headcount: string;
  jobType: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  currency: string;
  jobDescription: string;
}

export function CreateJobRequirementForm({
  open,
  onOpenChange,
  lockedClientId,
  lockedClientName,
}: Props) {
  const [form, setForm] = useState<Form>({
    clientName: lockedClientName || "",
    clientId: lockedClientId || "",
    positionName: "",
    headcount: "",
    jobType: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    currency: "SAR",
    jobDescription: "",
  });
  const [clientOptions, setClientOptions] = useState<{ _id: string; name: string }[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [clientPage, setClientPage] = useState(1);
  const [hasMoreClients, setHasMoreClients] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(clientSearch, 500);

  const [showAdditional, setShowAdditional] = useState(false);
  const [errors, setErrors] = useState<{ clientName?: string; positionName?: string; clientId?: string }>({});
  const router = useRouter();

  // Helper to find client by id
  const getClientById = (id: string) => clientOptions.find((c) => c._id === id);

  // Reset page when search changes or dropdown toggles
  useEffect(() => {
    if (!lockedClientId) {
      setClientPage(1);
      setClientOptions([]);
      setHasMoreClients(true);
    }
  }, [debouncedSearch, clientDropdownOpen, lockedClientId]);

  // Fetch clients when search, page or modal state changes
  useEffect(() => {
    if (lockedClientId && lockedClientName) {
      setClientOptions([{ _id: lockedClientId, name: lockedClientName }]);
      return;
    }

    if (open && (clientDropdownOpen || clientPage > 1)) {
      const loadClients = async () => {
        setLoadingClients(true);
        try {
          const result = await fetchClients(debouncedSearch, clientPage);
          setClientOptions((prev) => {
            const newOptions = clientPage === 1 ? result.clients : [...prev, ...result.clients];
            // Filter duplicates by _id
            return newOptions.filter((v, i, a) => a.findIndex(t => t._id === v._id) === i);
          });
          setHasMoreClients(result.hasMore);
        } catch (error) {
          console.error("Error loading clients:", error);
        } finally {
          setLoadingClients(false);
        }
      };
      loadClients();
    }
  }, [debouncedSearch, clientPage, open, clientDropdownOpen, lockedClientId, lockedClientName]);

  const handleClientScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100 &&
      hasMoreClients &&
      !loadingClients
    ) {
      setClientPage((prev) => prev + 1);
    }
  };

  // Keep form state in sync when a locked client is provided (or changes)
  useEffect(() => {
    if (lockedClientId) {
      setForm((prev) => ({
        ...prev,
        clientId: lockedClientId,
        clientName: lockedClientName || prev.clientName,
      }));
    }
  }, [lockedClientId, lockedClientName]);

  // Form options grouped for readability and reusability
  const formOptions = {
    jobTypeOptions: ["Full Time", "Part Time", "Internship", "Apprenticeship", "Temporary"],
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
    if (!lockedClientId && !form.clientName.trim()) {
      newErrors.clientName = "Client Name is required.";
    }
    // Always ensure a clientId is present in payload
    if (!form.clientId) {
      newErrors.clientId = "Client selection is required.";
    }
    if (!form.positionName.trim()) newErrors.positionName = "Position Name is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Prepare job data for API call - matching JobData interface
      const jobData = {
        jobTitle: form.positionName,
        client: form.clientId, // use clientId here
        jobType: (form.jobType || "full time").toLowerCase(),
        experience: "0", // Default value as required by interface
        headcount: form.headcount ? parseInt(form.headcount) : undefined,
        location: form.location ? [form.location] : undefined,
        minimumSalary: form.minSalary ? parseInt(form.minSalary) : undefined,
        maximumSalary: form.maxSalary ? parseInt(form.maxSalary) : undefined,
        salaryCurrency: form.currency || undefined,
        jobDescription: form.jobDescription || undefined,
      };
      try {
        const result = await createJob(jobData);
        if (result && result.success && result.data && (result.data as any)._id) {
          toast.success("Job created successfully");
          setForm({
            clientName: lockedClientName || "",
            clientId: lockedClientId || "",
            positionName: "",
            headcount: "",
            jobType: "",
            location: "",
            minSalary: "",
            maxSalary: "",
            currency: "SAR",
            jobDescription: "",
          });
          onOpenChange(false);
          router.push(`/jobs/${(result.data as any)._id}`);
          return;
        }
        // fallback if no id returned
        toast.success("Job created, but could not redirect (missing job ID)");
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        // Optionally handle error (e.g., show a message)
        console.error("Failed to create job:", error);
        toast.error("Failed to create job. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`w-full max-w-2xl p-0 flex flex-col ${showAdditional ? "h-[85vh] max-h-[550px]" : "h-auto max-h-[410px]"} transition-all duration-300`}
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
          className={showAdditional ? "flex-1 min-h-0 overflow-y-auto px-6 pb-20" : "px-6 pb-20"}
        >
          <form id="job-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="positionName" className="block text-sm font-medium mb-1">
                Position Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="positionName"
                value={form?.positionName}
                onChange={handleChange}
                placeholder="Enter position name"
                className={errors.positionName ? "border-red-500" : ""}
              />
              {errors.positionName && (
                <div className="text-xs text-red-500 mt-1">{errors.positionName}</div>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="clientName" className="block text-sm font-medium mb-1">
                Client Name <span className="text-red-500">*</span>
              </Label>
              {lockedClientId ? (
                <div className="py-2 px-3 border rounded bg-gray-100 text-gray-700">
                  {lockedClientName}
                </div>
              ) : (
                // <Combobox
                //   options={clientOptions.map((c) => ({ value: c._id, label: c.name }))}
                //   value={form.clientId}
                //   onValueChange={(val) => {
                //     const client = clientOptions.find((c) => c._id === val);
                //     setForm((prev) => ({
                //       ...prev,
                //       clientId: val,
                //       clientName: client ? client.name : "",
                //     }));
                //   }}
                //   placeholder="Select client"
                //   inputPlaceholder="Search client name"
                //   className={errors.clientName ? "border-red-500" : ""}
                // />
                <Popover open={clientDropdownOpen} onOpenChange={setClientDropdownOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clientDropdownOpen}
                      className={cn(
                        "w-full justify-between font-normal",
                        !form.clientId && "text-muted-foreground",
                        errors.clientName ? "border-red-500" : ""
                      )}
                    >
                      {form.clientId
                        ? clientOptions.find((c) => c._id === form.clientId)?.name || form.clientName || "Select client"
                        : "Select client"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[100]" align="start">
                    <div className="flex flex-col rounded-md border bg-popover text-popover-foreground shadow-md">
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Search client..."
                          value={clientSearch}
                          onChange={(e) => setClientSearch(e.target.value)}
                        />
                      </div>
                      <div
                        className="max-h-[300px] overflow-y-auto p-1 overflow-x-hidden"
                        onScroll={handleClientScroll}
                      >
                        {clientOptions.length === 0 && !loadingClients && (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            {clientSearch ? "No client found." : "Loading clients..."}
                          </div>
                        )}
                        <div className="overflow-hidden p-1 text-foreground">
                          {clientOptions.map((client) => (
                            <div
                              key={client._id}
                              className={cn(
                                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                form.clientId === client._id && "bg-accent text-accent-foreground"
                              )}
                              onMouseDown={(e) => {
                                // use onMouseDown for immediate firing before focus changes
                                e.preventDefault();
                                e.stopPropagation();
                                setForm((prev) => ({ ...prev, clientId: client._id, clientName: client.name }));
                                setClientDropdownOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.clientId === client._id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {client.name}
                            </div>
                          ))}
                        </div>
                        {loadingClients && (
                          <div className="flex items-center justify-center p-4 border-t bg-muted/20">
                            <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                            <span className="text-sm font-medium text-muted-foreground animate-pulse">
                              Loading more clients...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              {errors.clientName && !lockedClientId && (
                <div className="text-xs text-red-500 mt-1">{errors.clientName}</div>
              )}
            </div>

            {/* Toggle Button: Show when additional details are hidden */}
            {!showAdditional && (
              <Button
                type="button"
                className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-0 active:text-blue-800 !bg-transparent !border-none !shadow-none"
                onClick={() => setShowAdditional((v) => !v)}
                aria-expanded={showAdditional}
              >
                <span className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  <span className="border-b-2 border-transparent hover:border-blue-600 leading-none pb-0">
                    Additional Details
                  </span>
                </span>
              </Button>
            )}

            {showAdditional && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="headcount" className="block text-sm font-medium mb-1">
                    Headcount
                  </Label>
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
                  <Label htmlFor="jobType" className="block text-sm font-medium mb-1">
                    Job Types
                  </Label>
                  <Select
                    value={form.jobType}
                    onValueChange={(val) => setForm((prev) => ({ ...prev, jobType: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.jobTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location" className="block text-sm font-medium mb-1">
                    Location
                  </Label>
                  <LocationInput
                    value={form.location}
                    onChange={(val) => setForm((prev) => ({ ...prev, location: val as string }))}
                    placeholder="Enter job location"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currency" className="block text-sm font-medium mb-1">
                      Currency
                    </Label>
                    <Select
                      value={form.currency}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, currency: val }))}
                    >
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

                {/* Toggle Button: Show when additional details are visible, below Job Description */}
                <Button
                  type="button"
                  className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-0 active:text-blue-800 !bg-transparent !border-none !shadow-none"
                  onClick={() => setShowAdditional((v) => !v)}
                  aria-expanded={showAdditional}
                >
                  <span className="flex items-center gap-2">
                    <MinusIcon className="w-4 h-4" />
                    <span className="border-b-2 border-transparent hover:border-blue-600 leading-none pb-0">
                      Additional Details
                    </span>
                  </span>
                </Button>
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
