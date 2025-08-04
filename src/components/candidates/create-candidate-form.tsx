
"use client";

import React, { useState } from 'react';
import {DialogFooter} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

