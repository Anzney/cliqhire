"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { fetchClients } from "./clientApi";
import { createJob } from "@/services/jobService";

export function CreateJobRequirementForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [clientName, setClientName] = useState("");
  const [clientOptions, setClientOptions] = useState<{ _id: string; name: string }[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [positionName, setPositionName] = useState("");
  const [showAdditional, setShowAdditional] = useState(false);
  const [errors, setErrors] = useState<{ clientName?: string; positionName?: string }>({});

  useEffect(() => {
    if (showClientDropdown || clientSearch.length > 0) {
      fetchClients(clientSearch).then((clients) => {
        setClientOptions(clients);
      });
    }
  }, [clientSearch, showClientDropdown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors: typeof errors = {};
    if (!clientName.trim()) newErrors.clientName = "Client Name is required.";
    if (!positionName.trim()) newErrors.positionName = "Position Name is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Prepare job data for API call
      const jobData = {
        clientName,
        positionName,
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
      <DialogContent className="w-full max-w-md p-6 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg">Create Job Requirement</DialogTitle>
          <DialogDescription className="text-sm">
            Fill in the job requirement details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Client Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={clientSearch || clientName}
              onChange={e => {
                setClientSearch(e.target.value);
                setShowClientDropdown(true);
                setClientName("");
              }}
              onFocus={() => setShowClientDropdown(true)}
              placeholder="Enter client name"
              className={errors.clientName ? "border-red-500" : ""}
              autoComplete="off"
            />
            {showClientDropdown && clientOptions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {clientOptions.map((client) => (
                  <div
                    key={client._id}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${clientName === client.name ? 'bg-blue-100' : ''}`}
                    onMouseDown={() => {
                      setClientName(client.name);
                      setClientSearch("");
                      setShowClientDropdown(false);
                    }}
                  >
                    {client.name}
                  </div>
                ))}
              </div>
            )}
            {errors.clientName && <div className="text-xs text-red-500 mt-1">{errors.clientName}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Position Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={positionName}
              onChange={e => setPositionName(e.target.value)}
              placeholder="Enter position name"
              className={errors.positionName ? "border-red-500" : ""}
            />
            {errors.positionName && <div className="text-xs text-red-500 mt-1">{errors.positionName}</div>}
          </div>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 mt-2"
            onClick={() => setShowAdditional(v => !v)}
            aria-expanded={showAdditional}
          >
            <PlusIcon className="w-4 h-4" />
            Add Additional Detail
            {showAdditional ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />}
          </Button>
          {showAdditional && (
            <div className="mt-2 border rounded-md p-4 bg-gray-50 flex flex-col gap-3">
              {/* Placeholder for additional fields */}
              <div>
                <label className="block text-sm font-medium mb-1">Job Description</label>
                <textarea className="w-full border rounded-md p-2 min-h-[60px] text-sm" placeholder="Enter job description..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input placeholder="Enter location" />
              </div>
              {/* Add more fields as needed */}
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
