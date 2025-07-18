"use client";

import { SectionHeader } from "@/components/clients/summary/section-header";
import { DetailRow } from "@/components/clients/summary/detail-row";
import { TeamMember } from "@/components/clients/summary/team-member";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FileUploadRow } from "@/components/clients/summary/file-upload-row";
import { Plus, Pencil, ChevronsUpDown, RefreshCcw, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EditFieldDialog } from "./edit-field-dialog";
import { EditSalaryDialog } from "./edit-salary-dialog";
import { getJobById, updateJobById, updateJobStage } from "@/services/jobService";
import { JobDiscriptionI } from "./jobDiscriptionI";
import { JobInfoSection } from "./JobInfoSection";
import { toast } from "sonner";
import { JobStageBadge } from "@/components/jobs/job-stage-badge";

interface SummaryContentProps {
  jobId: string;
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

export function SummaryContent({ jobId }: SummaryContentProps) {
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<any>(null);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([
    { name: "John Doe", role: "Hiring Manager", email: "john@example.com", isActive: true },
  ]);
  const [internalDescription, setInternalDescription] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await getJobById(jobId);
        const job = Array.isArray(response.data) ? response.data[0] : response.data;
        setJobDetails(job);
        setInternalDescription(job?.jobDescriptionInternal || "");
      } catch (err) {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const handleFieldEdit = (field: string, value: any, options?: any) => {
    // Prevent reopening the dialog for 'stage' if already editing or just closed
    if (editingField && editingField.name === field && editingField.value === value) return;
    setEditingField({ name: field, value, ...options });
  };

  const handleFieldSave = async (newValue: string) => {
    if (!editingField || !jobDetails) return;
    try {
      let processedValue: any = newValue;
      if (editingField.isDate) {
        processedValue = new Date(newValue).toISOString();
      }
      const updatedDetails = {
        ...jobDetails,
        [editingField.name]: processedValue,
      };
      await updateJobById(jobId, { [editingField.name]: processedValue });
      setJobDetails(updatedDetails);
      // Ensure dialog closes and does not reopen for Stage
      setEditingField(null);
      if (editingField.name === "stage") return;
      toast.success(
        editingField.name === "jobDescription"
          ? "Job description updated successfully"
          : "Field updated successfully"
      );
    } catch (err) {
      toast.error(
        editingField.name === "jobDescription"
          ? "Failed to update job description"
          : "Failed to update field"
      );
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
    } finally {
      setIsSalaryDialogOpen(false); // Always close dialog after save
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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="size-6 animate-spin" />
        <div className="text-lg text-gray-600 mt-2">Loading Summary Details ......</div>
      </div>
    );
  if (!jobDetails) return <div>No job details found</div>;

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
              <DetailRow label="Job Title" value={jobDetails.jobTitle} onUpdate={() => handleFieldEdit("jobTitle", jobDetails.jobTitle)} />
              <DetailRow label="Department" value={jobDetails.department} onUpdate={() => handleFieldEdit("department", jobDetails.department)} />
              <DetailRow label="Client" value={jobDetails.client?.name || jobDetails.client} onUpdate={() => {}} />
              <DetailRow label="Location" value={Array.isArray(jobDetails.location) ? jobDetails.location.join(", ") : jobDetails.location} onUpdate={() => handleFieldEdit("location", jobDetails.location)} />
              <DetailRow label="Headcount" value={jobDetails.headcount} onUpdate={() => handleFieldEdit("headcount", jobDetails.headcount)} />
              {/* Inline Stage dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-1/3">Stage</span>
                <JobStageBadge
                  stage={jobDetails.stage}
                  onStageChange={async (newStage) => {
                    try {
                      await updateJobStage(jobId, newStage);
                      setJobDetails({ ...jobDetails, stage: newStage });
                      toast.success("Stage updated successfully");
                    } catch (err) {
                      toast.error("Failed to update stage");
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3">
              <DetailRow label="Status" value={jobDetails.status} onUpdate={() => handleFieldEdit("status", jobDetails.status)} />
              <DetailRow label="Job Type" value={capitalize(jobDetails.jobType)} onUpdate={() => handleFieldEdit("jobType", jobDetails.jobType)} />
              <DetailRow label="Experience" value={capitalize(jobDetails.experience)} onUpdate={() => handleFieldEdit("experience", jobDetails.experience)} />
              <DetailRow label="Gender" value={capitalize(jobDetails.gender)} onUpdate={() => handleFieldEdit("gender", jobDetails.gender)} />
              <DetailRow label="Deadline" value={jobDetails.deadline} onUpdate={() => handleFieldEdit("deadline", jobDetails.deadline)} />
              <DetailRow label="Reporting To" value={jobDetails.reportingTo} onUpdate={() => handleFieldEdit("reportingTo", jobDetails.reportingTo)} />
              <DetailRow label="Team Size" value={jobDetails.teamSize} onUpdate={() => handleFieldEdit("teamSize", jobDetails.teamSize)} />
              <DetailRow label="Key Skills" value={jobDetails.keySkills} onUpdate={() => handleFieldEdit("keySkills", jobDetails.keySkills)} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      {/* Right Column: Other Sections (Collapsible) */}
      <div className="space-y-6">
        {/* Package Details */}
        <div className="rounded-lg border shadow-sm px-4 pb-4 pt-4">
          <h4 className="text-sm font-semibold mb-4">Package Details</h4>
          <DetailRow
            label="Salary Range"
            value={`${jobDetails.salaryCurrency || "SAR"} ${jobDetails.minimumSalary || jobDetails.minSalary || 0} - ${jobDetails.maximumSalary || jobDetails.maxSalary || 0}`}
            onUpdate={() => setIsSalaryDialogOpen(true)}
            disableInternalEdit={true}
          />
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
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingField({ name: "jobDescription", value: jobDetails.jobDescription || "", isTextArea: true });
                  setIsDescriptionModalOpen(true);
                }}>
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
            <JobDiscriptionI value={internalDescription} onSave={handleInternalDescriptionSave} disabled={loading} />
          </CollapsibleContent>
        </Collapsible>
        {/* Job Info Section */}
        <JobInfoSection jobDetails={jobDetails} handleFieldEdit={handleFieldEdit} />
      </div>
      {/* Edit Dialogs */}
      {editingField && editingField.name !== "stage" && (
        <EditFieldDialog
          open={true}
          onClose={() => setEditingField(null)}
          fieldName={editingField.name}
          currentValue={editingField.value}
          onSave={handleFieldSave}
          isDate={editingField.isDate}
          isTextArea={editingField.isTextArea}
          isSelect={editingField.isSelect}
        />
      )}
      {/* Render Stage dialog only if editingField is set and name is 'stage' */}
      {editingField && editingField.name === "stage" && (
        <EditFieldDialog
          open={true}
          onClose={() => setEditingField(null)}
          fieldName={editingField.name}
          currentValue={editingField.value}
          onSave={handleFieldSave}
        />
      )}
      <EditSalaryDialog
        open={isSalaryDialogOpen}
        onClose={() => setIsSalaryDialogOpen(false)}
        currentValues={{
          minSalary: jobDetails.minimumSalary || jobDetails.minSalary || 0,
          maxSalary: jobDetails.maximumSalary || jobDetails.maxSalary || 0,
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
            await handleFieldSave(val);
            setIsDescriptionModalOpen(false);
          }}
          isTextArea={true}
        />
      )}
    </div>
  );
}