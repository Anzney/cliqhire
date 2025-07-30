// "use client";

// // import React, { useState } from 'react';

// // import { Button } from '../ui/button';
// // import { Input } from '../ui/input';
// // import { Label } from '../ui/label';
// // import PhoneInput from 'react-phone-input-2';
// // import 'react-phone-input-2/lib/style.css';
// // import '@/styles/phone-input-override.css';

// // export default function CreateCandidateform({ onCandidateCreated }: { onCandidateCreated?: (candidate: any) => void }) {
// //   const [activeTab, setActiveTab] = useState<'basic' | 'job'>('basic');
// //   const [form, setForm] = useState({
// //     name: '',
// //     phone: '',
// //     email: '',
// //     location: '',
// //     currentPosition: '',
// //     currentCompany: '',
// //     noticePeriod: '',
// //     currentSalary: '',
// //   });

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;
// //     setForm((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     // Send form data to a mock endpoint so payload is visible in Network tab
// //     fetch('https://httpbin.org/post', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(form),
// //     })
// //       .then(response => response.json())
// //       .then(data => {
// //         // Optionally, show a success message or handle response
// //         alert('Candidate created! Check the Network tab for payload.');
// //         if (onCandidateCreated) onCandidateCreated(form);
// //       })
// //       .catch(error => {
// //         alert('Error submitting form');
// //         console.error(error);
// //       });
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col gap-6">
// //       {/* Tabs */}
// //       <div className="flex border-b mb-4">
// //         <button
// //           type="button"
// //           className={`px-4 py-2 font-semibold focus:outline-none ${activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
// //           onClick={() => setActiveTab('basic')}
// //         >
// //           Basic Info
// //         </button>
// //         <button
// //           type="button"
// //           className={`px-4 py-2 font-semibold focus:outline-none ${activeTab === 'job' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
// //           onClick={() => setActiveTab('job')}
// //         >
// //           Job Details
// //         </button>
// //       </div>

// //       {activeTab === 'basic' && (
// //         <>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div className="flex flex-col gap-2">
// /* // <div className="flex flex-col gap-2">
// //   <Label>Name</Label>
// //   <Input
// //     type="text"
// //     name="name"
// //     value={form.name}
// //     onChange={handleChange}
// //     required
// //     placeholder="Enter candidate name"
// //     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
// //   />
// // </div>
// // <div className="flex flex-col gap-2">

// // </div> */
// //             <div className="flex flex-col gap-2">
// //   <Label>Phone</Label>
// //   <PhoneInput
// //                 country={'sa'}
// //                 value={form.phone}
// //                 onChange={phone => setForm(prev => ({ ...prev, phone }))}
// //                 inputProps={{
// //                   name: 'phone',
// //                   required: true,
// //                   autoFocus: false,
// //                 }}
// //                 enableSearch={true}
// //                 preferredCountries={['sa']}
// //                 inputClass="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
// //                 containerClass="w-full"
// //                 buttonClass="!border-none !bg-transparent"
// //                 dropdownClass="!z-50"
// //               />
// //             </div>
// //             <div className="flex flex-col gap-2">
// //   <Label>Email</Label>
// //   <Input
// //                 type="email"
// //                 name="email"
// //                 value={form.email}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="Enter email address"
// //                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
// //               />
// //             </div>
// //             <div className="flex flex-col gap-2">
// //   <Label>Location</Label>
// //   <Input
// //                 type="text"
// //                 name="location"
// //                 value={form.location}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="Enter location"
// //                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
// //               />
// //             </div>
// //           </div>
// //           <div className="flex justify-end mt-4">
// //             <Button type="button" onClick={() => setActiveTab('job')}>Next</Button>
// //           </div>
// //         </>
// //       )}

// //       {activeTab === 'job' && (
// //         <>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div className="flex flex-col gap-2">
// //   <Label>Current Position</Label>
  



// // "use client";
// // import {DialogFooter} from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { useState } from "react";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";

// // // interface CreateCandidateModalProps {
// // //   // isOpen: boolean;
// // //   // onClose: () => void;
// // //   onCandidateCreated?: (candidate: any) => void;

// // // }

// // interface CreateCandidateFormProps {
// //   onCandidateCreated?: (candidate: any) => void;
// //   showAdvanced: boolean;
// //   setShowAdvanced: (value: boolean) => void;
// //   onClose: () => void;
// // }

// // export default function CreateCandidateForm({
// //   onCandidateCreated,
// //   showAdvanced,
// //   setShowAdvanced,
// //   onClose,
// // }: CreateCandidateFormProps) {
// //   const [form, setForm] = useState({
// //     name: "",
// //     phone: "",
// //     email: "",
// //     location: "",
// //     description: "",
// //   });

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
// //     setForm((prev) => ({ ...prev, [name]: value }));
// //   };

  

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (onCandidateCreated) onCandidateCreated(form);
// //   };

// //   return (
// //     <>
// //       <form onSubmit={handleSubmit} id="candidate-form" className="overflow-y-auto flex flex-col flex-1 min-h-0 p-2">
// //         <p className="text-gray-500 text-sm mb-4">Creating candidates will allow you to fill in their details, upload resumes to their profiles, add them to jobs and much more.</p>
// //         <div className="flex-1 min-h-0  flex flex-col gap-4 pr-1">
// //           {/* <div className="space-y-2"> */}
// //   <Label htmlFor="name">Candidate Name<span className="text-red-500">*</span></Label>
// //   <div className="relative">
// //     <Input
// //       id="name"
// //       name="name"
// //       value={form.name}
// //       onChange={handleChange}
// //       required
// //       maxLength={255}
// //       placeholder="Enter full name"
// //       className="pr-16"
// //     />
// //     <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none bg-white px-0 py-1">
// //       {form.name.length} / 255
// //     </span>
// //   </div>
// // {/* </div> */}
// //         {showAdvanced && (
// //           <>
// //             {/* <div className="space-y-2"> */}
// //               <Label htmlFor="phone" >Phone Number<span className="text-red-500">*</span></Label>
// //               <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" required />
// //             {/* </div> */}
// //             {/* <div className="space-y-2"> */}
// //   <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
// //   <div className="relative">
// //     <Input
// //       id="email"
// //       name="email"
// //       value={form.email}
// //       onChange={handleChange}
// //       placeholder="Enter email address"
// //       maxLength={255}
// //       className="pr-16"
// //       required
// //     />
// //     <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none bg-white px-0 py-1">
// //       {form.email.length} / 255
// //     </span>
// //   </div>
// // {/* </div> */}
// //             {/* <div className="space-y-2"> */}
// //               <Label htmlFor="location">Location<span className="text-red-500">*</span></Label>
// //               <Input id="location" name="location" value={form.location} onChange={handleChange} placeholder="Enter location" required />
// //             {/* </div> */}
// //             <div className="space-y-2">
// //               <Label htmlFor="description">Description</Label>
// //               <textarea
// //                 id="description"
// //                 name="description"
// //                 value={form.description}
// //                 onChange={handleChange}
// //                 rows={5}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
// //                 placeholder="Additional details about the candidate"
// //               ></textarea>
// //             </div>
// //           </>
// //         )}
// //         <button
// //           type="button"
// //           className="text-blue-600 text-sm font-medium flex items-center gap-1 focus:outline-none"
// //           onClick={() => setShowAdvanced(!showAdvanced)}
// //         >
// //           {showAdvanced ? "- Hide Advanced Options" : "+ Show Advanced Options"}
// //         </button>
// //       </div>
// //       </form>
// //       <DialogFooter>
// //         <Button type="button" variant="secondary" onClick={onClose}>
// //           Cancel
// //         </Button>
// //         <Button type="submit" form="candidate-form">Continue</Button>
// //       </DialogFooter>
// //     </>
// //   );
// // }

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

