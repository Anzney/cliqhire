
"use client";

import React, { useState, useRef } from 'react';
import {DialogFooter} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import ReactSelect, { SingleValue } from "react-select";
import countryList, { Country } from "react-select-country-list";
import ReactCountryFlag from "react-country-flag";
import { Upload } from "lucide-react";
import { subDays } from "date-fns";
import { candidateService } from "@/services/candidateService";
import { headhunterCandidatesService } from "@/services/headhunterCandidatesService";
import { convertTempCandidateToReal, type ConvertTempCandidateRequest } from "@/services/recruitmentPipelineService";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "@/styles/phone-input-override.css";

interface CreateCandidateFormProps {
  onCandidateCreated?: (candidate: any) => void;
  showAdvanced: boolean;
  setShowAdvanced: (value: boolean) => void;
  onClose: () => void; // for dialog close (X)
  goBack: () => void; // for Cancel button
  tempCandidateData?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    description?: string;
    gender?: string;
    dateOfBirth?: string;
    country?: string;
    nationality?: string;
    willingToRelocate?: string;
  };
  // Props for temp candidate conversion
  isTempCandidateConversion?: boolean;
  pipelineId?: string;
  tempCandidateId?: string;
  isHeadhunterCreate?: boolean;
}

export default function CreateCandidateForm({
  onCandidateCreated,
  showAdvanced,
  setShowAdvanced,
  onClose,
  goBack,
  tempCandidateData,
  isTempCandidateConversion = false,
  pipelineId,
  tempCandidateId,
  isHeadhunterCreate,
}: CreateCandidateFormProps) {
  const [form, setForm] = useState({
    name: tempCandidateData?.name || "",
    phone: tempCandidateData?.phone || "",
    email: tempCandidateData?.email || "",
    location: tempCandidateData?.location || "",
    description: tempCandidateData?.description || "",
    gender: tempCandidateData?.gender || "",
    dateOfBirth: tempCandidateData?.dateOfBirth ? new Date(tempCandidateData.dateOfBirth) : null as Date | null,
    country: tempCandidateData?.country || "",
    nationality: tempCandidateData?.nationality || "",
    willingToRelocate: tempCandidateData?.willingToRelocate || "",
    cv: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [dobOpen, setDobOpen] = useState(false);
  const [countryOptions] = useState<Country[]>(countryList().getData());
  const [nationalityOptions] = useState<Country[]>(countryList().getData());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when tempCandidateData changes
  React.useEffect(() => {
    if (tempCandidateData) {
      setForm({
        name: tempCandidateData.name || "",
        phone: tempCandidateData.phone || "",
        email: tempCandidateData.email || "",
        location: tempCandidateData.location || "",
        description: tempCandidateData.description || "",
        gender: tempCandidateData.gender || "",
        dateOfBirth: tempCandidateData.dateOfBirth ? new Date(tempCandidateData.dateOfBirth) : null,
        country: tempCandidateData.country || "",
        nationality: tempCandidateData.nationality || "",
        willingToRelocate: tempCandidateData.willingToRelocate || "",
        cv: null,
      });
    }
  }, [tempCandidateData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (option: SingleValue<Country>) => {
    setForm((prev) => ({ ...prev, country: option ? option.label : "" }));
  };
  
  const handleNationalityChange = (option: SingleValue<Country>) => {
    setForm((prev) => ({ ...prev, nationality: option ? option.label : "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (PDF, DOC, or DOCX)');
        return;
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setForm((prev) => ({ ...prev, cv: file }));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!form.name) {
        alert("Please enter candidate name");
        setIsSubmitting(false);
        return;
      }

      if (!form.phone || !form.email) {
        alert("Please fill in all required fields (Phone, Email)");
        setIsSubmitting(false);
        return;
      }

      if (showAdvanced && !form.location) {
        alert("Please fill in all required fields (Location)");
        setIsSubmitting(false);
        return;
      }

      if (isTempCandidateConversion) {
        // Handle temp candidate conversion
        if (!pipelineId || !tempCandidateId) {
          alert("Missing pipeline or temp candidate information");
          setIsSubmitting(false);
          return;
        }

        const candidateData: ConvertTempCandidateRequest = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          description: form.description,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth ? form.dateOfBirth.toISOString() : undefined,
          country: form.country,
          nationality: form.nationality,
          willingToRelocate: form.willingToRelocate,
        };

        const result = await convertTempCandidateToReal(pipelineId, tempCandidateId, candidateData);
        
        if (result.success) {
          // Show success toast message
          toast.success("Temp candidate converted to real candidate successfully!");
          
          // Call the callback with the converted candidate
          if (onCandidateCreated) {
            onCandidateCreated(result.data);
          }
          
          // Close the modal
          onClose();
        } else {
          throw new Error(result.error || result.message);
        }
      } else {
        // Handle regular candidate creation
        // Create FormData for file upload
        const formData = new FormData();
        
        // Add all form fields to FormData
        Object.keys(form).forEach(key => {
          if (key === 'cv' && form.cv) {
            formData.append('resume', form.cv);
          } else if (key === 'dateOfBirth' && form.dateOfBirth) {
            formData.append('dateOfBirth', form.dateOfBirth.toISOString());
          } else if (key !== 'cv' && key !== 'dateOfBirth') {
            formData.append(key, (form as any)[key]);
          }
        });

        // Send data to backend
        const createdCandidate = isHeadhunterCreate
          ? await headhunterCandidatesService.createCandidate(formData)
          : await candidateService.createCandidate(formData);
        
        // Show success toast message
        toast.success("Candidate created successfully!");
        
        // Call the callback with the created candidate
        if (onCandidateCreated) {
          onCandidateCreated(createdCandidate);
        }
        
        // Close the modal
        onClose();
        
        if (!isHeadhunterCreate) {
          const candidateId = createdCandidate._id;
          router.push(`/candidates/${candidateId}`);
        }
      }
      
    } catch (error: any) {
      console.error('Error creating/converting candidate:', error);
      
      // Show error toast message
      if (error.message) {
        toast.error(`Failed to ${isTempCandidateConversion ? 'convert' : 'create'} candidate: ${error.message}`);
      } else {
        toast.error(`Failed to ${isTempCandidateConversion ? 'convert' : 'create'} candidate. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form state when canceling
  const handleCancel = () => {
    // Reset form to initial state
    setForm({
      name: "",
      phone: "",
      email: "",
      location: "",
      description: "",
      gender: "",
      dateOfBirth: null,
      country: "",
      nationality: "",
      willingToRelocate: "",
      cv: null,
    });
    
    // Reset advanced options to hidden
    setShowAdvanced(false);
    
    // Reset date picker state
    setDobOpen(false);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Call the original goBack function
    goBack();
  };

  // Custom styles for ReactSelect to match the black border on focus
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? '#000000' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #000000' : 'none',
      borderWidth: '1px',
      '&:hover': {
        borderColor: state.isFocused ? '#000000' : '#9ca3af'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#f3f4f6' : state.isFocused ? '#f9fafb' : 'white',
      color: '#374151',
      '&:hover': {
        backgroundColor: '#f3f4f6'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }),
    // Override any default focus styles
    singleValue: (provided: any) => ({
      ...provided,
      color: '#374151'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af'
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#374151'
    })
  };

  const yesterday = subDays(new Date(), 1);

  return (
    <>
      <form onSubmit={handleSubmit} id="candidate-form" className="overflow-y-auto flex flex-col flex-1 min-h-0 p-2">
        <p className="text-gray-500 text-sm mb-4">Creating candidates will allow you to fill in their details, upload resumes to their profiles, add them to jobs and much more.</p>
        <div className="flex-1 min-h-0 flex flex-col gap-4 pr-1">

          {/* Candidate Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="name">Candidate Name<span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={255}
                placeholder="Enter full name"
                className="pr-16"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none bg-white px-0 py-1">
                {form.name.length} / 255
              </span>
            </div>
          </div>

          {/* Phone Number - Required */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number<span className="text-red-500">*</span></Label>
            <PhoneInput
              country={"sa"}
              value={form.phone || ""}
              onChange={(value) => setForm(prev => ({ ...prev, phone: value || "" }))}
              inputClass="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
              enableSearch={true}
              preferredCountries={["sa", "us", "gb", "in"]}
              countryCodeEditable={false}
              autoFormat={true}
              inputProps={{ id: "phone", name: "phone", placeholder: "Enter phone number", required: true }}
            />
          </div>

          {/* Email - Required */}
          <div className="space-y-2">
            <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                maxLength={255}
                className="pr-16"
                required
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none bg-white px-0 py-1">
                {form.email.length} / 255
              </span>
            </div>
          </div>

          {showAdvanced && (
            <>
              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Popover open={dobOpen} onOpenChange={setDobOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setDobOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.dateOfBirth ? format(form.dateOfBirth, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={form.dateOfBirth ?? undefined}
                      onSelect={(date) => {
                        setForm((prev) => ({ ...prev, dateOfBirth: date ?? null }));
                        setDobOpen(false);
                      }}
                      fromDate={new Date(1900, 0, 1)}
                      toDate={yesterday}
                      initialFocus
                      disabled={[{ from: new Date(), to: undefined }]}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <ReactSelect
                  options={countryOptions}
                  value={countryOptions.find(option => option.label === form.country) || null}
                  onChange={handleCountryChange}
                  formatOptionLabel={(option: Country) => (
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag countryCode={option.value} svg style={{ width: '1.5em', height: '1.5em' }} />
                      <span>{option.label}</span>
                    </div>
                  )}
                  placeholder="Select country"
                  isClearable
                  styles={customStyles}
                />
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <ReactSelect
                  options={nationalityOptions}
                  value={nationalityOptions.find(option => option.label === form.nationality) || null}
                  onChange={handleNationalityChange}
                  formatOptionLabel={(option: Country) => (
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag countryCode={option.value} svg style={{ width: '1.5em', height: '1.5em' }} />
                      <span>{option.label}</span>
                    </div>
                  )}
                  placeholder="Select nationality"
                  isClearable
                  styles={customStyles}
                />
              </div>

              {/* Willing to Relocate */}
              <div className="space-y-2">
                <Label htmlFor="willingToRelocate">Are you willing to relocate?</Label>
                <Select onValueChange={(value) => handleSelectChange('willingToRelocate', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location - Required when advanced is shown */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  placeholder="Enter location" 
                />
              </div>

              {/* Description - Optional */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Additional details about the candidate"
                ></textarea>
              </div>

              {/* Upload CV */}
              <div className="space-y-2">
                <Label htmlFor="cv">Upload CV</Label>
                <div 
                  className="relative border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={handleFileClick}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="cv"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600">
                    {form.cv ? (
                      <span className="text-green-600 font-medium">{form.cv.name}</span>
                    ) : (
                      <>
                        <span className="font-medium text-gray-900">Click to upload</span>
                        <br />
                        <span className="text-gray-500">PDF, DOC, DOCX (max 5MB)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            className="text-blue-600 text-sm font-medium flex items-center gap-1 focus:outline-none"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "- Hide Advanced Options" : "+ Show Advanced Options"}
          </button>
        </div>
      </form>
             <DialogFooter>
         <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
           Cancel
         </Button>
         <Button type="submit" form="candidate-form" disabled={isSubmitting}>
           {isSubmitting ? "Creating..." : "Continue"}
         </Button>
       </DialogFooter>
    </>
  );
}

