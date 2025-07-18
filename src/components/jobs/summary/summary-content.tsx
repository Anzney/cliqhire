  "use client";

import { SectionHeader } from "@/components/clients/summary/section-header";
import { DetailRow } from "@/components/clients/summary/detail-row";
import { TeamMember } from "@/components/clients/summary/team-member";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FileUploadRow } from "@/components/clients/summary/file-upload-row";
import { Plus, Pencil, RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { CollapsibleSection } from "@/components/clients/summary/collapsible-section";
import { EditFieldDialog } from "./edit-field-dialog";
import { EditSalaryDialog } from "./edit-salary-dialog";
import { getJobById, updateJobById } from "@/services/jobService";
import { JobDiscriptionI } from "./jobDiscriptionI";
import { JobInfoSection } from "./JobInfoSection";

interface SummaryContentProps {
  jobId: string;
}

interface TeamMemberType {
  name: string;
  role: string;
  email: string;
  isActive?: boolean;
}

// Utility function to capitalize first letter
function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function SummaryContent({ jobId }: SummaryContentProps) {
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<any>(null);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([]);
  const [internalDescription, setInternalDescription] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await getJobById(jobId);
        const job = Array.isArray(response.data) ? response.data[0] : response.data;
        setJobDetails(job);
        setInternalDescription(job?.jobDescriptionInternal || "");
        // Remove teamMembers logic
      } catch (err) {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const handleFieldEdit = (field: string, value: any, options?: any) => {
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
      setEditingField(null);
    } catch (err) {
      setError("Failed to update field");
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
    } catch (err) {
      setError("Failed to update salary");
    }
  };

  const handleInternalDescriptionSave = async (val: string) => {
    if (!jobDetails) return;
    try {
      await updateJobById(jobId, { jobDescriptionInternal: val });
      setInternalDescription(val);
      setJobDetails({ ...jobDetails, jobDescriptionInternal: val });
    } catch (err) {
      setError("Failed to update internal job description");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <RefreshCcw className="h-8 w-8 mb-2 animate-spin text-gray-500" />
      <div className="text-lg text-gray-600">Loading...</div>
    </div>
  );
  if (error) return <div className="text-red-600">{error}</div>;
  if (!jobDetails) return <div>No job details found</div>;

  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      <div className="space-y-6">
        <CollapsibleSection title="Job Details">
          <div className="space-y-3">
            <DetailRow
              label="Job Title"
              value={jobDetails.jobTitle}
              onUpdate={(val: string) => handleFieldEdit("jobTitle", jobDetails.jobTitle)}
            />
            <DetailRow
              label="Department"
              value={jobDetails.department}
              onUpdate={(val: string) => handleFieldEdit("department", jobDetails.department)}
            />
            <DetailRow
              label="Client"
              value={jobDetails.client?.name || jobDetails.client}
              onUpdate={() => {}}
            />
            <DetailRow
              label="Location"
              value={Array.isArray(jobDetails.location) ? jobDetails.location.join(", ") : jobDetails.location}
              onUpdate={(val: string) => handleFieldEdit("location", jobDetails.location)}
            />
            <DetailRow
              label="Headcount"
              value={jobDetails.headcount}
              onUpdate={(val: string) => handleFieldEdit("headcount", jobDetails.headcount)}
            />
            <DetailRow
              label="Stage"
              value={jobDetails.stage}
              onUpdate={(val: string) => handleFieldEdit("stage", jobDetails.stage)}
            />
            <DetailRow
              label="Status"
              value={jobDetails.status}
              onUpdate={(val: string) => handleFieldEdit("status", jobDetails.status)}
            />
            <DetailRow
              label="Job Type"
              value={capitalize(jobDetails.jobType)}
              onUpdate={(val: string) => handleFieldEdit("jobType", jobDetails.jobType)}
            />
            <DetailRow
              label="Experience"
              value={capitalize(jobDetails.experience)}
              onUpdate={(val: string) => handleFieldEdit("experience", jobDetails.experience)}
            />
            <DetailRow
              label="Gender"
              value={capitalize(jobDetails.gender)}
              onUpdate={(val: string) => handleFieldEdit("gender", jobDetails.gender)}
            />
            <DetailRow
              label="Deadline"
              value={jobDetails.deadline}
              onUpdate={(val: string) => handleFieldEdit("deadline", jobDetails.deadline)}
            />
            <DetailRow
              label="Reporting To"
              value={jobDetails.reportingTo}
              onUpdate={(val: string) => handleFieldEdit("reportingTo", jobDetails.reportingTo)}
            />
            <DetailRow
              label="Team Size"
              value={jobDetails.teamSize}
              onUpdate={(val: string) => handleFieldEdit("teamSize", jobDetails.teamSize)}
            />
            <DetailRow
              label="Key Skills"
              value={jobDetails.keySkills}
              onUpdate={(val: string) => handleFieldEdit("keySkills", jobDetails.keySkills)}
            />
          </div>
        </CollapsibleSection>
      </div>
      <div className="space-y-6">
        <CollapsibleSection title="Job Description">
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
        </CollapsibleSection>
        <CollapsibleSection title="Job Description By Internal">
          <JobDiscriptionI
            value={internalDescription}
            onSave={handleInternalDescriptionSave}
            disabled={loading}
          />
        </CollapsibleSection>
        <CollapsibleSection title="Package Details">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <DetailRow
              label="Salary Range"
              value={`${jobDetails.salaryCurrency || "SAR"} ${jobDetails.minimumSalary || jobDetails.minSalary || 0} - ${jobDetails.maximumSalary || jobDetails.maxSalary || 0}`}
              onUpdate={() => setIsSalaryDialogOpen(true)}
            />
          </div>
        </CollapsibleSection>
        <JobInfoSection jobDetails={jobDetails} handleFieldEdit={handleFieldEdit} />
        {/* Team section removed as Job does not have teamMembers */}
      </div>
      {/* Edit Dialogs */}
      {editingField && (
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