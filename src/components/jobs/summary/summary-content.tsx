"use client";

import { DetailRow } from "@/components/clients/summary/detail-row";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus, Pencil, ChevronsUpDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EditFieldDialog } from "./edit-field-dialog";
import { EditSalaryDialog } from "./edit-salary-dialog";
import { updateJobById, uploadJobFile } from "@/services/jobService";
import { JobDescriptionInternal } from "./job-description";
import { JobTeamInfoSection } from "./JobTeamInfoSection";
import { JDBenefitFilesSection } from "./jd-benefit-files-section";
import { toast } from "sonner";
import { JobData } from "../types";
import { Label } from "@/components/ui/label";
import { GenderSelector } from "./gender-selector";
import { DeadlinePicker } from "./deadline-picker";
import { DateRangePicker } from "./date-range-picker";
import { NationalitySelector } from "./nationality-selector";
import { JobStageSelector } from "./job-stage-selector";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { EditExperienceDialog } from "./edit-experience-dialog";
import { EditTeamSizeDialog } from "./edit-team-size-dialog";

interface SummaryContentProps {
  jobId: string;
  jobData: JobData;
  canModify?: boolean;
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

export function SummaryContent({ jobId, jobData, canModify }: SummaryContentProps) {
  const [jobDetails, setJobDetails] = useState<JobData>(jobData);
  const [loading, setLoading] = useState(false);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isInternalDescriptionModalOpen, setIsInternalDescriptionModalOpen] = useState(false);
  const [internalDescription, setInternalDescription] = useState("");
  const [isGenderDialogOpen, setIsGenderDialogOpen] = useState(false);
  const [isDeadlineDialogOpen, setIsDeadlineDialogOpen] = useState(false);
  const [isDateRangeDialogOpen, setIsDateRangeDialogOpen] = useState(false);
  const [isNationalityDialogOpen, setIsNationalityDialogOpen] = useState(false);
  const [isJobStageDialogOpen, setIsJobStageDialogOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [isTeamSizeDialogOpen, setIsTeamSizeDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const canEdit = canModify ?? true;

  const handleFieldSave = async (editingField: any, newValue: string | Date) => {
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
          : "Field updated successfully",
      );
      // Ensure the job data is refetched so other views see the latest
      await queryClient.invalidateQueries({ queryKey: ["job", jobId] });
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

  const handleUpdateMultipleFields = async (fields: Record<string, any>) => {
    if (!jobDetails) return;
    try {
      const updatedDetails = {
        ...jobDetails,
        ...fields,
      };
      await updateJobById(jobId, fields);
      setJobDetails(updatedDetails);
      toast.success("Team assignment updated successfully");
      // Invalidate the job query to refetch latest data
      await queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    } catch (err) {
      toast.error("Failed to update team assignment");
    }
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
      toast.success("Internal job description updated successfully");
    } catch (err) {
      toast.error("Failed to update internal job description");
    }
  };

  const handleDateRangeSave = async (startDate: Date | undefined, endDate: Date | undefined) => {
    if (!jobDetails) return;
    try {
      const updatedDetails = {
        ...jobDetails,
        startDateByInternalTeam: startDate,
        endDateByInternalTeam: endDate,
      };

      // Send Date objects to backend
      await updateJobById(jobId, {
        startDateByInternalTeam: startDate,
        endDateByInternalTeam: endDate,
      });

      setJobDetails(updatedDetails);
      toast.success("Date range updated successfully");
    } catch (err) {
      toast.error("Failed to update date range");
    }
  };

  const handleNationalitySave = async (nationalitiesArray: string[]) => {
    if (!jobDetails) return;
    try {
      const updatedDetails = {
        ...jobDetails,
        nationalities: nationalitiesArray,
      };

      // Send array of strings to backend
      await updateJobById(jobId, {
        nationalities: nationalitiesArray,
      });

      setJobDetails(updatedDetails);
      toast.success("Nationalities updated successfully");
    } catch (err) {
      toast.error("Failed to update nationalities");
    }
  };

  const handleFileUpdate = async (field: "jobDescriptionPdf" | "benefitPdf", file: File) => {
    if (!jobDetails) return;
    try {
      const uploadResult = await uploadJobFile(jobId, file, field);

      const updatedDetails = {
        ...jobDetails,
        [field]: {
          url: uploadResult.filePath,
          fileName: file.name,
        },
      };

      await updateJobById(jobId, { [field]: uploadResult.filePath });
      setJobDetails(updatedDetails);
      toast.success(
        `${field === "jobDescriptionPdf" ? "Job Description" : "Benefit"} PDF uploaded successfully`,
      );
    } catch (err) {
      console.error(`Error uploading ${field}:`, err);
      toast.error(
        `Failed to upload ${field === "jobDescriptionPdf" ? "Job Description" : "Benefit"} PDF`,
      );
      throw err; // Re-throw to let the modal handle the error
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
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Department"
                value={jobDetails.department}
                onUpdate={handleUpdateField("department")}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Job Location"
                value={
                  Array.isArray(jobDetails.location)
                    ? jobDetails.location.join(", ")
                    : jobDetails.location
                }
                onUpdate={handleUpdateField("location")}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Headcount"
                value={jobDetails.headcount.toString()}
                onUpdate={handleUpdateField("headcount")}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Job Stage"
                value={jobDetails.stage}
                onUpdate={handleUpdateField("stage")}
                customEdit={canEdit ? () => setIsJobStageDialogOpen(true) : undefined}
                disableInternalEdit={!canEdit}
              />
            </div>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              <DetailRow
                label="Job Type"
                value={capitalize(jobDetails.jobType)}
                onUpdate={handleUpdateField("jobType")}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Experience"
                value={capitalize(jobDetails.experience)}
                onUpdate={handleUpdateField("experience")}
                customEdit={canEdit ? () => setIsExperienceDialogOpen(true) : undefined}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Gender"
                value={capitalize(jobDetails.gender)}
                onUpdate={handleUpdateField("gender")}
                customEdit={canEdit ? () => setIsGenderDialogOpen(true) : undefined}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Deadline (By Client)"
                value={
                  jobDetails.deadlineByClient
                    ? format(jobDetails.deadlineByClient, "dd-MM-yyyy")
                    : ""
                }
                onUpdate={handleUpdateField("deadlineByClient")}
                customEdit={canEdit ? () => setIsDeadlineDialogOpen(true) : undefined}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Date Range (By Internal Team)"
                value={
                  jobDetails.startDateByInternalTeam && jobDetails.endDateByInternalTeam
                    ? `${format(jobDetails.startDateByInternalTeam, "dd-MM-yyyy")} to ${format(jobDetails.endDateByInternalTeam, "dd-MM-yyyy")}`
                    : ""
                }
                onUpdate={() =>
                  handleDateRangeSave(
                    jobDetails.startDateByInternalTeam,
                    jobDetails.endDateByInternalTeam,
                  )
                }
                customEdit={canEdit ? () => setIsDateRangeDialogOpen(true) : undefined}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Nationality"
                value={jobDetails.nationalities ? jobDetails.nationalities.join(", ") : ""}
                onUpdate={() => {}} // Not used since we use customEdit
                customEdit={canEdit ? () => setIsNationalityDialogOpen(true) : undefined}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Reporting To"
                value={jobDetails.reportingTo}
                onUpdate={handleUpdateField("reportingTo")}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Team Size"
                value={jobDetails.teamSize?.toString() || ""}
                onUpdate={handleUpdateField("teamSize")}
                customEdit={canEdit ? () => setIsTeamSizeDialogOpen(true) : undefined}
                disableInternalEdit={!canEdit}
              />
              <DetailRow
                label="Key Skills"
                value={jobDetails.keySkills}
                onUpdate={handleUpdateField("keySkills")}
                disableInternalEdit={!canEdit}
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
              <span className="text-sm">
                {jobDetails.salaryCurrency || "SAR"} {jobDetails.minimumSalary || 0}
              </span>
              <span className="text-sm">-</span>
              <span className="text-sm">{jobDetails.maximumSalary || 0}</span>
            </div>
            {canEdit && (
              <Button variant="outline" size="sm" onClick={() => setIsSalaryDialogOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
        {/* Job Description */}
        <Collapsible className="rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-semibold">Job Description By Client</h4>
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
                <Label className="text-sm tracking-tight">Description</Label>
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={() => setIsDescriptionModalOpen(true)}>
                    {jobDetails.jobDescription ? (
                      <>
                        <Pencil className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {jobDetails.jobDescription ? (
                  <div className="w-full">
                    <p className="text-sm whitespace-pre-wrap break-words overflow-hidden">{jobDetails.jobDescription}</p>
                  </div>
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
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm tracking-tight">Description</Label>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsInternalDescriptionModalOpen(true)}
                  >
                    {jobDetails.jobDescriptionByInternalTeam ? (
                      <>
                        <Pencil className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {jobDetails.jobDescriptionByInternalTeam ? (
                  <p className="text-sm whitespace-pre-wrap">
                    {jobDetails.jobDescriptionByInternalTeam}
                  </p>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No description added yet
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        {/* JD and Benefit Files Section */}
        <div className="rounded-lg border shadow-sm px-4 pb-4 pt-4">
          <JDBenefitFilesSection
            jobDescriptionPdf={jobDetails.jobDescriptionPdf}
            benefitPdf={jobDetails.benefitPdf}
            onFileUpdate={handleFileUpdate}
            canModify={canEdit}
          />
        </div>

        {/* Job Info Section */}
                    <JobTeamInfoSection 
              jobDetails={jobDetails} 
              handleUpdateField={handleUpdateField}
              handleUpdateMultipleFields={handleUpdateMultipleFields}
              canModify={canEdit}
            />
      </div>
      {canEdit && (
        <EditSalaryDialog
          open={isSalaryDialogOpen}
          onClose={() => setIsSalaryDialogOpen(false)}
          currentValues={{
            minSalary: jobDetails.minimumSalary,
            maxSalary: jobDetails.maximumSalary,
            currency: jobDetails.salaryCurrency || "SAR",
          }}
          onSave={handleSalarySave}
        />
      )}
      {/* Description Modal (reuse EditFieldDialog for description) */}
      {canEdit && isDescriptionModalOpen && (
        <EditFieldDialog
          open={true}
          onClose={() => setIsDescriptionModalOpen(false)}
          fieldName="Job Description By Client"
          currentValue={jobDetails.jobDescription || ""}
          onSave={async (val: string) => {
            await handleFieldSave("jobDescription", val);
            setIsDescriptionModalOpen(false);
          }}
          isTextArea={true}
        />
      )}

      {canEdit && isInternalDescriptionModalOpen && (
        <EditFieldDialog
          open={true}
          onClose={() => setIsInternalDescriptionModalOpen(false)}
          fieldName="Job Description By Internal Team"
          currentValue={jobDetails.jobDescriptionByInternalTeam || ""}
          onSave={async (val: string) => {
            await handleFieldSave("jobDescriptionByInternalTeam", val);
            setIsInternalDescriptionModalOpen(false);
          }}
          isTextArea={true}
        />
      )}

      {/* Gender Selector Dialog */}
      {canEdit && (
      <GenderSelector
        open={isGenderDialogOpen}
        onClose={() => setIsGenderDialogOpen(false)}
        currentValue={jobDetails.gender || ""}
        onSave={async (val: string) => {
          await handleFieldSave("gender", val);
          setIsGenderDialogOpen(false);
        }}
      />
      )}

      {/* Deadline Picker Dialog */}
      {canEdit && (
      <DeadlinePicker
        open={isDeadlineDialogOpen}
        onClose={() => setIsDeadlineDialogOpen(false)}
        currentValue={jobDetails.deadlineByClient || ""}
        onSave={async (val: Date | null) => {
          await handleFieldSave("deadlineByClient", val || "");
          setIsDeadlineDialogOpen(false);
        }}
      />
      )}

      {/* Experience Edit Dialog */}
      {canEdit && (
        <EditExperienceDialog
          open={isExperienceDialogOpen}
          onClose={() => setIsExperienceDialogOpen(false)}
          currentValue={jobDetails.experience || ""}
          onSave={async (val: string) => {
            await handleFieldSave("experience", val);
            setIsExperienceDialogOpen(false);
          }}
        />
      )}

      {/* Team Size Edit Dialog */}
      {canEdit && (
        <EditTeamSizeDialog
          open={isTeamSizeDialogOpen}
          onClose={() => setIsTeamSizeDialogOpen(false)}
          currentValue={jobDetails.teamSize?.toString() || ""}
          onSave={async (val: string) => {
            await handleFieldSave("teamSize", val);
            setIsTeamSizeDialogOpen(false);
          }}
        />
      )}

      {/* Date Range Picker Dialog */}
      {canEdit && (
      <DateRangePicker
        open={isDateRangeDialogOpen}
        onClose={() => setIsDateRangeDialogOpen(false)}
        currentValue={
          jobDetails.startDateByInternalTeam && jobDetails.endDateByInternalTeam
            ? `${jobDetails.startDateByInternalTeam} to ${jobDetails.endDateByInternalTeam}`
            : ""
        }
        onSave={async (startDate: Date | undefined, endDate: Date | undefined) => {
          await handleDateRangeSave(startDate, endDate);
          setIsDateRangeDialogOpen(false);
        }}
      />
      )}

      {/* Nationality Selector Dialog */}
      {canEdit && (
      <NationalitySelector
        open={isNationalityDialogOpen}
        onClose={() => setIsNationalityDialogOpen(false)}
        currentValue={jobDetails.nationalities || []}
        onSave={async (val: string[]) => {
          await handleNationalitySave(val);
          setIsNationalityDialogOpen(false);
        }}
      />
      )}

      {/* Job Stage Selector Dialog */}
      {canEdit && (
      <JobStageSelector
        open={isJobStageDialogOpen}
        onClose={() => setIsJobStageDialogOpen(false)}
        currentValue={jobDetails.stage || ""}
        onSave={async (val: string) => {
          await handleFieldSave("stage", val);
          setIsJobStageDialogOpen(false);
        }}
      />
      )}
    </div>
  );
}
