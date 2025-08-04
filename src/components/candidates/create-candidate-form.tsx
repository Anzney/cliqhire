
"use client";

import React, { useState } from 'react';
import {DialogFooter} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "../create-client-modal/date-picker";
import ReactSelect, { SingleValue } from "react-select";
import countryList, { Country } from "react-select-country-list";
import ReactCountryFlag from "react-country-flag";

interface CreateCandidateFormProps {
  onCandidateCreated?: (candidate: any) => void;
  showAdvanced: boolean;
  setShowAdvanced: (value: boolean) => void;
  onClose: () => void; // for dialog close (X)
  goBack: () => void; // for Cancel button
}

export default function CreateCandidateForm({
  onCandidateCreated,
  showAdvanced,
  setShowAdvanced,
  onClose,
  goBack,
}: CreateCandidateFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    description: "",
    gender: "",
    dateOfBirth: null as Date | null,
    country: "",
    nationality: "",
    willingToRelocate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [dobOpen, setDobOpen] = useState(false);
  const [countryOptions] = useState<Country[]>(countryList().getData());
  const [nationalityOptions] = useState<Country[]>(countryList().getData());

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!form.name) {
        alert("Please enter candidate name");
        setIsSubmitting(false);
        return;
      }

      if (showAdvanced) {
        if (!form.phone || !form.email || !form.location) {
          alert("Please fill in all required fields (Phone, Email, Location)");
          setIsSubmitting(false);
          return;
        }
      }

      // Send data to backend using axios
      const response = await axios.post('/api/candidates', form);

      if (response.status === 201) {
        const createdCandidate = response.data;

        // router.push(`/candidates/${createdCandidate._id}`);
        
        // Call the callback with the created candidate
        if (onCandidateCreated) {
          onCandidateCreated(createdCandidate);
        }
        
        // Close the modal
        onClose();
        
        // Redirect to candidate summary page
        router.push(`/candidates/${createdCandidate._id}`);
      }
      
    } catch (error: any) {
      console.error('Error creating candidate:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.error || 'Failed to create candidate';
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        // Network error
        alert('Network error. Please check your connection and try again.');
      } else {
        // Other error
        alert(`Error creating candidate: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
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
                <DatePicker
                  open={dobOpen}
                  setOpen={setDobOpen}
                  value={form.dateOfBirth ?? new Date()}
                  setValue={(date) => setForm((prev) => ({ ...prev, dateOfBirth: date }))}
                />
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

              {/* Phone Number - Required when advanced is shown */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number<span className="text-red-500">*</span></Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  placeholder="Enter phone number" 
                  required={showAdvanced}
                />
              </div>

              {/* Email - Required when advanced is shown */}
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
                    required={showAdvanced}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none bg-white px-0 py-1">
                    {form.email.length} / 255
                  </span>
                </div>
              </div>

              {/* Location - Required when advanced is shown */}
              <div className="space-y-2">
                <Label htmlFor="location">Location<span className="text-red-500">*</span></Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  placeholder="Enter location" 
                  required={showAdvanced}
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
        <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" form="candidate-form" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Continue"}
        </Button>
      </DialogFooter>
    </>
  );
}

