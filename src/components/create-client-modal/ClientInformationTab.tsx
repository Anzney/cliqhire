import { NestedSelect } from "@/components/ui/nested-select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import "react-phone-input-2/lib/style.css";
import "@/styles/phone-input-override.css";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { optionsForClient } from "./constants";

import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import UserSelectDialog from "@/components/shared/UserSelectDialog";
import { CreateClientFormData } from "./schema";
import { IndustrySelector } from "@/components/shared/industry-selector";

// Removed hardcoded sales leads; using UserSelectDialog instead

interface ClientInformationTabProps {
  form: UseFormReturn<CreateClientFormData>;
}

export function ClientInformationTab({ form }: ClientInformationTabProps) {
  const [showSalesLeadDialog, setShowSalesLeadDialog] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-2">
      <FormField
        control={form.control}
        name="clientGeneralInfo.clientStage"
        render={({ field }) => (
          <FormItem className="space-y-1 ml-2">
            <div className="flex items-center mb-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Client Stage Info"
                    className="mr-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="max-w-xs text-sm">
                  <div className="font-semibold mb-2 text-base">Client Stage Definitions</div>
                  <div className="mb-2">
                    <span className="font-semibold">1. Lead:</span> Potential customer who has shown
                    initial interest but has not yet been contacted or qualified. First stage where
                    basic information is gathered.
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">2. Engaged:</span> The lead has responded or
                    interacted. There is active communication and interest from both sides.
                  </div>
                  <div>
                    <span className="font-semibold">3. Signed:</span> The deal is finalized. The
                    customer has agreed to the terms, and a formal contract or agreement has been
                    signed.
                  </div>
                </PopoverContent>
              </Popover>
              <FormLabel>
                Client Stage<span className="text-red-700">*</span>
              </FormLabel>
            </div>
            <FormControl>
              <NestedSelect
                options={optionsForClient}
                value={form.watch("clientGeneralInfo.clientSubStage") || field.value}
                onValueChange={(value) => {
                  const baseStage = value.includes("_") ? value.split("_")[0] : value;
                  const detailedStage = value;
                  form.setValue(
                    "clientGeneralInfo.clientStage",
                    baseStage as "Lead" | "Engaged" | "Signed",
                  );
                  form.setValue("clientGeneralInfo.clientSubStage", detailedStage);
                  field.onChange(baseStage);
                }}
                placeholder="Select client stage"
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientGeneralInfo.salesLead"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>
              Sales Lead (Internal)<span className="text-red-700">*</span>
            </FormLabel>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={field.value || ""}
                placeholder="Select sales lead"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSalesLeadDialog(true)}
              >
                Choose
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientGeneralInfo.referredBy"
        render={({ field }) => (
          <FormItem className="space-y-1 ml-2">
            <FormLabel>Referred By (External)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                className="w-full"
                placeholder="Enter the name of the person who referred"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientGeneralInfo.clientPriority"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Client Priority</FormLabel>
            <Select
              value={field.value !== undefined ? String(field.value) : ""}
              onValueChange={(value) => field.onChange(value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientGeneralInfo.clientSegment"
        render={({ field }) => (
          <FormItem className="space-y-1 ml-2">
            <FormLabel>Client Segment</FormLabel>
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Segment</SelectLabel>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientGeneralInfo.clientSource"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Client Source</FormLabel>
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Client Source" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Client Source</SelectLabel>
                  <SelectItem value="Cold Call">Cold Call</SelectItem>
                  <SelectItem value="Reference">Reference</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Existing Old Client">Existing Old Client</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientGeneralInfo.industry"
        render={({ field }) => (
          <FormItem className="space-y-1 ml-2">
            <FormLabel>Client Industry</FormLabel>
            <IndustrySelector
              value={field.value}
              onValueChange={field.onChange}
              modal
            />
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Sales Lead Selector Dialog */}
      <UserSelectDialog
        open={showSalesLeadDialog}
        onClose={() => setShowSalesLeadDialog(false)}
        title="Select Sales Lead"
        onSelect={(user) => {
          const name = user?.name || user?.email || "";
          form.setValue("clientGeneralInfo.salesLead", name, { shouldValidate: true, shouldDirty: true });
          setShowSalesLeadDialog(false);
        }}
      />
    </div>
  );
}
