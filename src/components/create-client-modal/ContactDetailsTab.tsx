import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ClientForm } from "@/components/create-client-modal/type";
import { countryCodes } from "./constants";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-input-2";
import { ClientContactInfo } from "./type";
import { useState } from "react";

interface ContactDetailsTabProps {
  formData: ClientContactInfo;
  setFormData: React.Dispatch<React.SetStateAction<ClientContactInfo>>;
  setIsContactModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errors?: {
    name?: string;
    phoneNumber?: string;
    address?: string;
    primaryContacts?: string;
    website?: string;
    linkedInProfile?: string;
    googleMapsLink?: string;
    primaryContactEmails?: string;
  };
}

export function ContactDetailsTab({
  formData,
  setFormData,
  setIsContactModalOpen,
  errors = {},
}: ContactDetailsTabProps) {

  const getCountryCodeLabel = (code: string) => {
    const country = countryCodes.find((option) => option.code === code);
    return country ? country.label : code;
  };

  const handleInputChange = (field: keyof ClientContactInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 pb-2">
        {/* Client Name */}
        <div className="space-y-1 ml-2">
          <Label htmlFor="name">Client Name<span className="text-red-700">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
            className="w-full"
            placeholder="Enter client name"
          />
          {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
        </div>

        {/* Client Email(s) */}
        <div className="space-y-1">
          <Label htmlFor="emails">Client Email(s)</Label>
          <Input
            id="emails"
            type="text"
            value={formData.emails?.join(", ")}
            onChange={(e) => setFormData((prev) => ({ ...prev, emails: e.target.value.split(", ") }))}
            placeholder="Enter client email(s) separated by commas"
            autoComplete="off"
            className="w-full"
          />
        </div>

        {/* Client Landline Number */}
        <div className="space-y-1 ml-2">
          <Label htmlFor="phoneNumber">Client Landline Number<span className="text-red-700">*</span></Label>
          <PhoneInput
            country={"sa"}
            value={formData.phoneNumber || "966"}
            onChange={(value) => setFormData((prev) => ({ ...prev, phoneNumber: value || "" }))}
            inputClass="flex h-9 rounded-md border border-input bg-transparent px-3 py-0 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
            inputProps={{ id: "phoneNumber", required: true }}
            enableSearch={true}
          />
          {errors.phoneNumber && (
            <div className="text-xs text-red-500 mt-1">{errors.phoneNumber}</div>
          )}
        </div>

        {/* Client Address */}
        <div className="space-y-1">
          <Label htmlFor="address">Client Address <span className="text-red-700">*</span></Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Enter detailed address"
            required
            className="w-full"
          />
          {errors.address && <div className="text-xs text-red-500 mt-1">{errors.address}</div>}
        </div>

        {/* Client Website */}
        <div className="space-y-1 ml-2">
          <Label htmlFor="website">Client Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
            placeholder="https://www.example.com"
            className="w-full"
          />
        </div>

        {/* Client LinkedIn Profile */}
        <div className="space-y-1">
          <Label htmlFor="linkedInProfile">Client LinkedIn Profile</Label>
          <Input
            id="linkedInProfile"
            value={formData.linkedInProfile}
            onChange={(e) => setFormData((prev) => ({ ...prev, linkedInProfile: e.target.value }))}
            placeholder="https://www.linkedin.com/in/..."
            className="w-full"
          />
        </div>

        {/* Google Maps Link */}
        <div className="space-y-1 ml-2">
          <Label htmlFor="googleMapsLink">Google Maps Link</Label>
          <Input
            id="googleMapsLink"
            value={formData.googleMapsLink}
            onChange={(e) => setFormData((prev) => ({ ...prev, googleMapsLink: e.target.value }))}
            placeholder="https://maps.google.com/..."
            className="w-full"
          />
        </div>

        {/* Country of Business */}
        <div className="space-y-1">
          <Label htmlFor="countryOfBusiness">Country of Business</Label>
          <Input
            id="countryOfBusiness"
            value={formData.countryOfBusiness}
            onChange={(e) => setFormData((prev) => ({ ...prev, countryOfBusiness: e.target.value }))}
            placeholder="Enter country of business"
            className="w-full"
          />
        </div>
      </div>
      {/* Primary Contacts full row */}
      <div className="space-y-1 ml-2 mb-6">
        <div className="flex items-center justify-between mb-2">
          <Label>Primary Contacts <span className="text-red-700">*</span></Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsContactModalOpen(true)}
            type="button"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add
          </Button>
        </div>
        {errors.primaryContacts && (
          <div className="text-xs text-red-500 mb-2">{errors.primaryContacts}</div>
        )}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          {formData.primaryContacts.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">No contacts added.</div>
          ) : (
            <div className="space-y-3">
              {formData.primaryContacts.map((contact, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="block space-y-1">
                    <div className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{contact.gender}</div>
                    <div className="text-sm text-gray-500">{contact.designation}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {contact.email || "No email"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {getCountryCodeLabel(contact.countryCode || "+966")}{" "}
                      {contact.phone || "No phone"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {contact.linkedin || "No LinkedIn"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
