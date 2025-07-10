"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RefreshCcw } from 'lucide-react';
import { CreateRecruiterData, RecruiterStatus } from '@/types/recruiter';
import { createRecruiter } from '@/services/recruiterService';
import { PersonalInformationTab } from './PersonalInformationTab';
import { SkillsAndStatusTab } from './SkillsAndStatusTab';

interface CreateRecruiterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateRecruiterModal({ open, onOpenChange, onSuccess }: CreateRecruiterModalProps) {
  const [formData, setFormData] = useState<CreateRecruiterData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    skills: [],
    status: 'Active',
    department: '',
    specialization: '',
    manager: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTab, setCurrentTab] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const createdRecruiter = await createRecruiter(formData);
            
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        skills: [],
        status: 'Active',
        department: '',
        specialization: '',
        manager: ''
      });
      setErrors({});
      setCurrentTab(0);
      
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating recruiter:', error);
      alert(error.message || 'Failed to create recruiter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        skills: [],
        status: 'Active',
        department: '',
        specialization: '',
        manager: ''
      });
      setErrors({});
      setCurrentTab(0);
      onOpenChange(false);
    }
  };

  const handleNext = () => {
    // Validate current tab before proceeding
    if (currentTab === 0) {
      const tabErrors: Record<string, string> = {};
      if (!formData.name.trim()) tabErrors.name = 'Name is required';
      if (!formData.email.trim()) tabErrors.email = 'Email is required';
      if (!formData.phone.trim()) tabErrors.phone = 'Phone number is required';
      if (!formData.location.trim()) tabErrors.location = 'Location is required';
      if (!formData.experience.trim()) tabErrors.experience = 'Experience is required';
      
      if (Object.keys(tabErrors).length > 0) {
        setErrors(tabErrors);
        return;
      }
    }
    
    setCurrentTab(1);
    setErrors({}); // Clear errors when moving to next tab
  };

  const handlePrevious = () => {
    setCurrentTab(0);
    setErrors({}); // Clear errors when moving back
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Recruiter</DialogTitle>
          <DialogDescription>
            Fill in the recruiter details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b mb-4">
          {["Personal Information", "Skills & Status"].map((tab, index) => (
            <button
              key={tab}
              className={`flex-1 px-4 py-2 text-center text-sm ${
                currentTab === index 
                  ? "border-b-2 border-blue-500 text-blue-500" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setCurrentTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
            Please fix the following errors:
            <ul className="list-disc list-inside mt-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab Content */}
        {currentTab === 0 && (
          <PersonalInformationTab
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        
        {currentTab === 1 && (
          <SkillsAndStatusTab
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}

        {/* Footer */}
        <DialogFooter>
          <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
            <div>
              {currentTab > 0 && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {currentTab < 1 && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              )}
              {currentTab < 1 ? (
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  disabled={isSubmitting} 
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Recruiter'
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 