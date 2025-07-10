import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '@/styles/phone-input-override.css';

export default function CreateCandidateform({ onCandidateCreated }: { onCandidateCreated?: (candidate: any) => void }) {
  const [activeTab, setActiveTab] = useState<'basic' | 'job'>('basic');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    currentPosition: '',
    currentCompany: '',
    noticePeriod: '',
    currentSalary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send form data to a mock endpoint so payload is visible in Network tab
    fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(response => response.json())
      .then(data => {
        // Optionally, show a success message or handle response
        alert('Candidate created! Check the Network tab for payload.');
        if (onCandidateCreated) onCandidateCreated(form);
      })
      .catch(error => {
        alert('Error submitting form');
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          type="button"
          className={`px-4 py-2 font-semibold focus:outline-none ${activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-semibold focus:outline-none ${activeTab === 'job' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('job')}
        >
          Job Details
        </button>
      </div>

      {activeTab === 'basic' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
  <Label>Name</Label>
  <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter candidate name"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
              />
            </div>
            <div className="flex flex-col gap-2">
  <Label>Phone</Label>
  <PhoneInput
                country={'sa'}
                value={form.phone}
                onChange={phone => setForm(prev => ({ ...prev, phone }))}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: false,
                }}
                enableSearch={true}
                preferredCountries={['sa']}
                inputClass="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                containerClass="w-full"
                buttonClass="!border-none !bg-transparent"
                dropdownClass="!z-50"
              />
            </div>
            <div className="flex flex-col gap-2">
  <Label>Email</Label>
  <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
              />
            </div>
            <div className="flex flex-col gap-2">
  <Label>Location</Label>
  <Input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="Enter location"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="button" onClick={() => setActiveTab('job')}>Next</Button>
          </div>
        </>
      )}

      {activeTab === 'job' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
  <Label>Current Position</Label>
  <Input
                type="text"
                name="currentPosition"
                value={form.currentPosition}
                onChange={handleChange}
                required
                placeholder="Enter current position"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
              />
            </div>
            <div className="flex flex-col gap-2">
  <Label>Current Company</Label>
  <Input
                type="text"
                name="currentCompany"
                value={form.currentCompany}
                onChange={handleChange}
                required
                placeholder="Enter current company"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
              />
            </div>
            <div className="flex flex-col gap-2">
  <Label>Notice Period</Label>
  <Input
                type="text"
                name="noticePeriod"
                value={form.noticePeriod}
                onChange={handleChange}
                required
                placeholder="Enter notice period"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
              />
            </div>
            <div className="flex flex-col gap-2">
  <Label>Current Salary</Label>
  <Input
                type="text"
                name="currentSalary"
                value={form.currentSalary}
                onChange={handleChange}
                required
                placeholder="Enter current salary"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-gray-50 placeholder:font-normal"
              />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button type="button" variant="secondary" onClick={() => setActiveTab('basic')}>Previous</Button>
            <Button type="submit">Create Candidate</Button>
          </div>
        </>
      )}
    </form>
  );
}

