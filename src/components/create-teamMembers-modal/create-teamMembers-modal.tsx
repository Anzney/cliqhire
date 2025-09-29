"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCcw } from "lucide-react";
import { CreateTeamMemberData, TeamMemberStatus } from "@/types/teamMember";
import { createTeamMember, uploadResume, updateTeamMember } from "@/services/teamMembersService";
import { PersonalInformationTab } from "./PersonalInformationTab";
import { SkillsAndStatusTab } from "./SkillsAndStatusTab";
import { toast } from "sonner";

interface CreateTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateTeamMemberModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateTeamMemberModalProps) {
  const [formData, setFormData] = useState<CreateTeamMemberData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    skills: [],
    status: "Active",
    department: "",
    specialization: "",
    teamRole: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTab, setCurrentTab] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.teamRole.trim()) {
      newErrors.teamRole = "Team role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try { 
      let createdTeamMember;
      
      if (resumeFile) {
        // Create FormData for file upload according to API specification
        const formDataToSend = new FormData();
        
        // Required fields
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('teamRole', formData.teamRole);
        
        // Optional fields
        if (formData.phone) formDataToSend.append('phone', formData.phone);
        if (formData.location) formDataToSend.append('location', formData.location);
        if (formData.experience) formDataToSend.append('experience', formData.experience);
        if (formData.status) formDataToSend.append('status', formData.status);
        if (formData.department) formDataToSend.append('department', formData.department);
        if (formData.specialization) formDataToSend.append('specialization', formData.specialization);
        
        // Handle skills array - convert to comma-separated string
        if (formData.skills && formData.skills.length > 0) {
          formDataToSend.append('skills', formData.skills.join(', '));
        }
        
        // Add the resume file
        formDataToSend.append('resume', resumeFile);
        
        createdTeamMember = await createTeamMember(formDataToSend);
      } else {
        // Send as regular JSON
        createdTeamMember = await createTeamMember(formData);
      }
      // Show success toast
      toast.success("Team member created successfully");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
        skills: [],
        status: "Active",
        department: "",
        specialization: "",
        teamRole: "",
      });
      setResumeFile(null);
      setErrors({});
      setCurrentTab(0);

      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("❌ Error creating team member:", error);
      const errorMessage = error.message || "Failed to create team member";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
        skills: [],
        status: "Active",
        department: "",
        specialization: "",
        teamRole: "",
      });
      setResumeFile(null);
      setErrors({});
      setCurrentTab(0);
      onOpenChange(false);
    }
  };

  const handleNext = () => {
    // Validate current tab before proceeding
    if (currentTab === 0) {
      const tabErrors: Record<string, string> = {};
      if (!formData.name.trim()) tabErrors.name = "Name is required";
      if (!formData.email.trim()) tabErrors.email = "Email is required";
      if (!formData.teamRole.trim()) tabErrors.teamRole = "Team role is required";

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
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Team Member</DialogTitle>
          <DialogDescription>
            Fill in the team member details below. Required fields are marked with an asterisk (*).
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

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {currentTab === 0 && (
            <PersonalInformationTab formData={formData} setFormData={setFormData} errors={errors} />
          )}

          {currentTab === 1 && (
            <SkillsAndStatusTab 
              formData={formData} 
              setFormData={setFormData} 
              errors={errors} 
              onResumeFileChange={setResumeFile}
            />
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6">
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
                      "Create Team Member"
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
