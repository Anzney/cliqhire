"use client";

import { SectionHeader } from "@/components/clients/summary/section-header";
import { DetailRow } from "@/components/clients/summary/detail-row";
import { TeamMember } from "@/components/clients/summary/team-member";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FileUploadRow } from "@/components/clients/summary/file-upload-row";
import { Plus, Pencil, ChevronsUpDown, RefreshCcw, Loader } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EditFieldDialog } from "./edit-field-dialog";
import { EditSalaryDialog } from "./edit-salary-dialog";
import { updateJobById } from "@/services/jobService";
import { JobDescriptionInternal } from "./job-description";
import { JobTeamInfoSection } from "./JobTeamInfoSection";
import { toast } from "sonner";
import { JobData } from "../types";
import { Label } from "@/components/ui/label";

interface SummaryContentProps {
  jobId: string;
  jobData: JobData;
}

interface TeamMemberType {
  name: string;
  role: string;
  email: string;
  isActive?: boolean;
}

function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function SummaryContent({ jobId, jobData }: SummaryContentProps) {
  const [jobDetails, setJobDetails] = useState<JobData>(jobData);
  const [loading, setLoading] = useState(false);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [internalDescription, setInternalDescription] = useState("");

  const handleFieldSave = async (editingField: any, newValue: string) => {
    if (!editingField || !jobDetails) return;
    try {
      let processedValue: any = newValue;
      if (editingField.isDate) {
        processedValue = new Date(newValue).toISOString();
      }
      const updatedDetails = {
        ...jobDetails,
        [editingField]: processedValue,
      };
      await updateJobById(jobId, { [editingField]: processedValue });
      setJobDetails(updatedDetails);
      toast.success(
        editingField === "jobDescription"
          ? "Job description updated successfully"
          : "Field updated successfully"
      );
    } catch (err) {
      toast.error(
        editingField === "jobDescription"
          ? "Failed to update job description"
          : "Failed to update field",
      );
    }
  };

  const handleUpdateField = (field: string) => (value: string) => {
    handleFieldSave(field, value);
  };

  const handleSalarySave = async (values: {
    minSalary: number;
    maxSalary: number;
    currency: string;
  }) => {
    if (!jobDetails) return;
    try {
      const updatedDetails = {
        ...jobDetails,
        minimumSalary: values.minSalary,
        maximumSalary: values.maxSalary,
        salaryCurrency: values.currency,
      };
      await updateJobById(jobId, {
        minimumSalary: values.minSalary,
        maximumSalary: values.maxSalary,
        salaryCurrency: values.currency,
      });
      setJobDetails(updatedDetails);
      toast.success("Salary updated successfully");
    } catch (err) {
      toast.error("Failed to update salary");
    }
  };

  const handleInternalDescriptionSave = async (val: string) => {
    if (!jobDetails) return;
    try {
      await updateJobById(jobId, { jobDescriptionInternal: val });
      setInternalDescription(val);
      setJobDetails({ ...jobDetails, jobDescriptionInternal: val });
      toast.success("Internal job description updated successfully");
    } catch (err) {
      toast.error("Failed to update internal job description");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      {/* Left Column: Details (Collapsible) */}
      <div className="space-y-6">
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Job Details</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-3">
              <DetailRow
                label="Job Title"
                value={jobDetails.jobTitle}
                onUpdate={handleUpdateField("jobTitle")}
              />
              <DetailRow
                label="Department"
                value={jobDetails.department}
                onUpdate={handleUpdateField("department")}
              />
              <DetailRow
                label="Location"
                value={
                  Array.isArray(jobDetails.location)
                    ? jobDetails.location.join(", ")
                    : jobDetails.location
                }
                onUpdate={handleUpdateField("location")}
              />
              <DetailRow
                label="Headcount"
                value={jobDetails.headcount.toString()}
                onUpdate={handleUpdateField("headcount")}
              />
              <DetailRow
                label="Stage"
                value={jobDetails.stage}
                onUpdate={handleUpdateField("stage")}
              />
            </div>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              <DetailRow
                label="Status"
                value={jobDetails.stage}
                onUpdate={handleUpdateField("status")}
              />
              <DetailRow
                label="Job Type"
                value={capitalize(jobDetails.jobType)}
                onUpdate={handleUpdateField("jobType")}
              />
              <DetailRow
                label="Experience"
                value={capitalize(jobDetails.experience)}
                onUpdate={handleUpdateField("experience")}
              />
              <DetailRow
                label="Gender"
                value={capitalize(jobDetails.gender)}
                onUpdate={handleUpdateField("gender")}
              />
              <DetailRow
                label="Deadline"
                value={jobDetails.dateRange.end}
                onUpdate={handleUpdateField("deadline")}
              />
              <DetailRow
                label="Team Size"
                value={jobDetails.teamSize.toString()}
                onUpdate={handleUpdateField("teamSize")}
              />
              <DetailRow
                label="Key Skills"
                value={jobDetails.specialization.join(", ")}
                onUpdate={handleUpdateField("keySkills")}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      {/* Right Column: Other Sections (Collapsible) */}
      <div className="space-y-6">
        {/* Package Details */}
        <div className="rounded-lg border shadow-sm px-4 pb-4 pt-4">
          <h4 className="text-sm font-semibold mb-4">Package Details</h4>
          <div className="flex items-center justify-between">
            <Label className="text-sm tracking-tight">Salary Range</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm">{jobDetails.salaryCurrency || "SAR"} {jobDetails.minimumSalary || 0}</span>
              <span className="text-sm">-</span>
              <span className="text-sm">{jobDetails.maximumSalary || 0}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsSalaryDialogOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
        {/* Job Description */}
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Job Description</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Description</h2>
                <Button variant="outline" size="sm" onClick={() => setIsDescriptionModalOpen(true)}>
                  {jobDetails.jobDescription ? (
                    <>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-3">
                {jobDetails.jobDescription ? (
                  <p className="text-sm whitespace-pre-wrap">{jobDetails.jobDescription}</p>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No description added yet
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        {/* Job Description By Internal Team */}
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Job Description By Internal Team</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs p-1">
                Show Complete Details
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <JobDescriptionInternal
              value={internalDescription}
              onSave={handleInternalDescriptionSave}
              disabled={loading}
            />
          </CollapsibleContent>
        </Collapsible>
        {/* Job Info Section */}
        <JobTeamInfoSection jobDetails={jobDetails} handleUpdateField={handleUpdateField} />
      </div>
      <EditSalaryDialog
        open={isSalaryDialogOpen}
        onClose={() => setIsSalaryDialogOpen(false)}
        currentValues={{
          minSalary: jobDetails.minimumSalary || 0,
          maxSalary: jobDetails.maximumSalary || 0,
          currency: jobDetails.salaryCurrency || "SAR",
        }}
        onSave={handleSalarySave}
      />
      {/* Description Modal (reuse EditFieldDialog for description) */}
      {isDescriptionModalOpen && (
        <EditFieldDialog
          open={true}
          onClose={() => setIsDescriptionModalOpen(false)}
          fieldName="jobDescription"
          currentValue={jobDetails.jobDescription || ""}
          onSave={async (val: string) => {
            await handleFieldSave("jobDescription", val);
            setIsDescriptionModalOpen(false);
          }}
          isTextArea={true}
        />
      )}
    </div>
  );
}
