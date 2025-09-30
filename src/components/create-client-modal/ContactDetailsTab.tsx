import { Button } from "@/components/ui/button";
import { countryCodes } from "./constants";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-input-2";
import { UseFormReturn } from "react-hook-form";
import { CreateClientFormData } from "./schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PrimaryContact } from "./type";

interface ContactDetailsTabProps {
  form: UseFormReturn<CreateClientFormData>;
  setIsContactModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ContactDetailsTab({ form, setIsContactModalOpen }: ContactDetailsTabProps) {
  const getCountryCodeLabel = (code: string) => {
    const country = countryCodes.find((option) => option.code === code);
    return country ? country.label : code;
  };

  const primaryContacts = form.watch("clientContactInfo.primaryContacts");

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-2">
        {/* Client Name */}
        <FormField
          control={form.control}
          name="clientContactInfo.name"
          render={({ field }) => (
            <FormItem className="space-y-1 ml-2">
              <FormLabel>
                Client Name<span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} className="w-full" placeholder="Enter client name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Client Email(s) */}
        <FormField
          control={form.control}
          name="clientContactInfo.emails"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>
                Client Email(s)<span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  value={field.value?.join(", ") || ""}
                  onChange={(e) => {
                    const emails = e.target.value
                      .split(", ")
                      .filter((email) => email.trim() !== "");
                    field.onChange(emails);
                  }}
                  placeholder="Enter client email(s) separated by commas"
                  autoComplete="off"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Client Landline Number */}
        <FormField
          control={form.control}
          name="clientContactInfo.phoneNumber"
          render={({ field }) => (
            <FormItem className="space-y-1 ml-2">
              <FormLabel>
                Client Landline Number<span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <PhoneInput
                  country={"sa"}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value || "")}
                  inputClass="flex h-9 rounded-md border border-input bg-transparent px-3 py-0 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                  enableSearch={true}
                  preferredCountries={["sa", "us", "gb", "in"]}
                  countryCodeEditable={false}
                  autoFormat={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Client Address */}
        <FormField
          control={form.control}
          name="clientContactInfo.address"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>
                Client Address <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter detailed address" className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Client Website */}
        <FormField
          control={form.control}
          name="clientContactInfo.website"
          render={({ field }) => (
            <FormItem className="space-y-1 ml-2">
              <FormLabel>
                Client Website
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://www.example.com"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Client LinkedIn Profile ... */}
        <FormField
          control={form.control}
          name="clientContactInfo.linkedInProfile"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>
                Client LinkedIn Profile
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://www.linkedin.com/in/..."
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Google Maps Link */}
        <FormField
          control={form.control}
          name="clientContactInfo.googleMapsLink"
          render={({ field }) => (
            <FormItem className="space-y-1 ml-2">
              <FormLabel>
                Google Maps Link
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://maps.google.com/..." className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country of Business */}
        <FormField
          control={form.control}
          name="clientContactInfo.countryOfBusiness"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Country of Business</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Enter country of business"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Primary Contacts full row */}
      <FormField
        control={form.control}
        name="clientContactInfo.primaryContacts"
        render={({ field }) => (
          <FormItem className="space-y-1 ml-2 mb-6">
            <div className="flex items-center justify-between mb-2">
              <FormLabel>
                Primary Contacts <span className="text-red-700">*</span>
              </FormLabel>
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
            <FormMessage />
            <div className="bg-white rounded-lg border shadow-sm p-4">
              {primaryContacts.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No contacts added.
                </div>
              ) : (
                <div className="space-y-3">
                  {primaryContacts.map((contact: PrimaryContact, index: number) => (
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
          </FormItem>
        )}
      />
    </>
  );
}
