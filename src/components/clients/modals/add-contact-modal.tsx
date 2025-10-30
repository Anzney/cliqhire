"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '@/styles/phone-input-override.css';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AddPositionDialog } from "@/components/common/add-position-dialog";
import { getPositions } from "@/services/positionService";

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (contact: { firstName: string; lastName: string; gender: string; email: string; phone: string; countryCode: string; position: string; linkedin: string }) => void;
  countryCodes?: { code: string; label: string }[];
  positionOptions: { value: string; label: string }[];
  initialValues?: {
    firstName?: string;
    lastName?: string;
    gender?: string;
    email?: string;
    phone?: string;
    countryCode?: string;
    position?: string;
    linkedin?: string;
  };
  isEdit?: boolean;
}

const initialForm ={
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    countryCode: "+966",
    position: "",
    linkedin: "",
}

export function AddContactModal({ open, onOpenChange, onAdd, countryCodes, positionOptions, initialValues, isEdit }: AddContactModalProps) {
  const [formData, setFormData] = useState({
    firstName: initialValues?.firstName ?? "",
    lastName:initialValues?.lastName ?? "",
    gender:initialValues?.gender ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
    countryCode: initialValues?.countryCode ?? "+966",
    position: initialValues?.position ?? "",
    linkedin: initialValues?.linkedin ?? "",
  });
  const [isAddPositionOpen, setIsAddPositionOpen] = useState(false);
  const [localPositionOptions, setLocalPositionOptions] = useState(positionOptions ?? []);

  // Sync formData with initialValues when modal opens or initialValues change
  useEffect(() => {
    if (open) {
      setFormData({
        firstName: initialValues?.firstName ?? "",
        lastName: initialValues?.lastName ?? "",
        gender: initialValues?.gender ?? "",
        email: initialValues?.email ?? "",
        phone: initialValues?.phone ?? "",
        countryCode: initialValues?.countryCode ?? "+966",
        position: initialValues?.position ?? "",
        linkedin: initialValues?.linkedin ?? "",
      });
    }
  }, [open, initialValues]);

  // Keep local options in sync with props when they change
  useEffect(() => {
    setLocalPositionOptions(positionOptions ?? []);
  }, [positionOptions]);

  // Load positions from API when the modal opens
  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await getPositions();
        const opts = (data || []).map((p: { name: string }) => ({ value: p.name, label: p.name }));
        setLocalPositionOptions(opts);
      } catch (err) {
        console.error("Failed to load positions", err);
      }
    };
    if (open) {
      loadPositions();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phone || !formData.position) {
      alert("Please fill all required fields.");
      return;
    }
    onAdd({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      gender: formData.gender,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      countryCode: formData.countryCode,
      position: formData.position,
      linkedin: formData.linkedin.trim(),
    });
    onOpenChange(false);
    setFormData(initialForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Contact" : "Add Contact"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <PhoneInput
                country="sa"
                preferredCountries={['sa']}
                value={formData.phone}
                onChange={(value, data: { name: string; dialCode: string; countryCode: string }) => setFormData(prev => ({ ...prev, phone: value, countryCode: `+${data.dialCode}` }))}
                inputClass="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                inputProps={{ id: 'phone', required: true }}
                enableSearch={true}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="position">Position</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddPositionOpen(true)}>Add new</Button>
              </div>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {localPositionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AddPositionDialog
                open={isAddPositionOpen}
                onOpenChange={setIsAddPositionOpen}
                title="Add Position"
                existingNames={localPositionOptions.map(o => o.label)}
                onCreated={(name) => {
                  const newOption = { value: name, label: name };
                  setLocalPositionOptions((prev) => {
                    const exists = prev.some(p => p.value.toLowerCase() === name.toLowerCase());
                    if (exists) return prev;
                    return [...prev, newOption];
                  });
                  setFormData(prev => ({ ...prev, position: name }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="Enter LinkedIn profile URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEdit ? "Save Changes" : "Add Contact"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}