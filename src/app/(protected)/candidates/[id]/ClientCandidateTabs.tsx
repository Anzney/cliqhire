"use client";
import React, { useState, useRef, useEffect } from "react";
import CandidateSummary from '@/components/candidates/summary/candidate-summary';
import { CandidateNotesContent } from '@/components/candidates/notes/notes-content';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlidersHorizontal, RefreshCcw, Plus, FileText, Users, Briefcase, Star, Activity, StickyNote, Paperclip, Clock, User, FileIcon, FilePen, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { AttachmentsContent } from '@/components/candidates/attachments/attachments-content';
import { JobsContent, JobsContentRef } from '@/components/candidates/jobs/jobs-content';
import { AddToJobDialog } from '@/components/candidates/add-to-job-dialog';
import { candidateService } from '@/services/candidateService';
import { toast } from "sonner";
import { initializeAuth } from '@/lib/axios-config';


interface Tab {
  label: string;
  icon: React.ReactNode;
}

interface Candidate {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  resume?: string;
  status?: string;
}

export default function ClientCandidateTabs({ candidateId, tabs }: { candidateId: string, tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState("Summary");
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const jobsContentRef = useRef<JobsContentRef>(null);

  // Fetch candidate data on component mount
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Ensure authentication is initialized
        await initializeAuth();
        
        const candidateData = await candidateService.getCandidateById(candidateId);
        setCandidate(candidateData);
      } catch (error) {
        console.error('Error fetching candidate:', error);
        setError('Failed to load candidate data');
        toast.error("Failed to load candidate data");
      } finally {
        setIsLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      
      // Ensure authentication is initialized
      await initializeAuth();
      
      const refreshedCandidate = await candidateService.getCandidateById(candidateId);
      setCandidate(refreshedCandidate);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error('Error refreshing candidate data:', error);
      toast.error("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };


  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center justify-center gap-2 flex-col">
          <RefreshCcw className="size-6 animate-spin" />
          <div className="text-center">Loading candidate data...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !candidate) {
    return (
      <div className="min-h-[400px] font-sans w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">{error || 'Candidate not found.'}</div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Enhanced dummy data for better display
  const enhancedCandidate = {
    ...candidate,
    // Additional fields that would come from API
    currentRole: "Senior Software Engineer",
    company: "Tech Corp",
    salary: "$120,000 - $140,000",
    availability: "2 weeks notice",
    education: "Bachelor's in Computer Science",
    languages: ["English", "Spanish"],
    certifications: ["AWS Certified Developer", "Google Cloud Professional"],
    linkedIn: "linkedin.com/in/johndoe",
    portfolio: "github.com/johndoe",
    notes: "Strong technical skills, excellent communication, looking for remote opportunities.",
    lastContact: "2024-01-15",
    nextFollowUp: "2024-01-22",
    source: "LinkedIn",
    recruiter: "Sarah Johnson"
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'interviewing':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'offer':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const handleCandidateUpdate = async (updatedCandidate: any, fieldKey?: string) => {
    try {
      // Update local state immediately for optimistic UI
      setCandidate(updatedCandidate);
      
      // Make API call to persist changes
      if (candidate._id) {
        // Ensure authentication is initialized before making the API call
        await initializeAuth();
        
        await candidateService.updateCandidate(candidate._id, updatedCandidate);
        
        // Show success toast message based on API response
        if (fieldKey) {
          const allFields = [
            { key: "name", label: "Candidate Name" },
            { key: "location", label: "Location" },
            { key: "experience", label: "Experience" },
            { key: "totalRelevantExperience", label: "Total Relevant Years of Experience" },
            { key: "noticePeriod", label: "Notice Period" },
            { key: "skills", label: "Skills" },
            { key: "resume", label: "Resume" },
            { key: "status", label: "Status" },
            { key: "referredBy", label: "Referred By" },
            { key: "gender", label: "Gender" },
            { key: "dateOfBirth", label: "Date of Birth" },
            { key: "maritalStatus", label: "Marital Status" },
            { key: "country", label: "Country" },
            { key: "nationality", label: "Nationality" },
            { key: "universityName", label: "University Name" },
            { key: "educationDegree", label: "Education Degree/Certificate" },
            { key: "primaryLanguage", label: "Primary Language" },
            { key: "willingToRelocate", label: "Are you willing to relocate?" },
            { key: "phone", label: "Phone Number" },
            { key: "email", label: "Email" },
            { key: "otherPhone", label: "Other Phone Number" },
            { key: "linkedin", label: "LinkedIn" },
            { key: "previousCompanyName", label: "Previous Company Name" },
            { key: "currentJobTitle", label: "Current Job Title" },
            { key: "reportingTo", label: "Reporting To" },
            { key: "totalStaffReporting", label: "Total Number of Staff Reporting to You" },
            { key: "softSkill", label: "Soft Skill" },
            { key: "technicalSkill", label: "Technical Skill" }
          ];
          const fieldLabel = allFields.find(field => field.key === fieldKey)?.label || fieldKey || 'Field';
          
          // Show success toast message
          toast.success(`${fieldLabel} updated successfully`);
        }
        
        // Re-fetch the latest data to ensure UI shows the most up-to-date information
        // Use setTimeout to ensure toast is displayed before re-fetching
        setTimeout(async () => {
          try {
            if (candidate._id) {
              const refreshedCandidate = await candidateService.getCandidateById(candidate._id);
              setCandidate(refreshedCandidate);
            }
          } catch (refreshError) {
            console.error('Error refreshing candidate data:', refreshError);
          }
        }, 100);
      }
    } catch (error: any) {
      console.error('Error updating candidate:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        toast.error("Failed to update candidate");
      }
      
      // Revert local state on error
      setCandidate(candidate);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="border-b bg-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{enhancedCandidate.name || "Unknown Candidate"}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{enhancedCandidate.currentRole}</span>
              <span>•</span>
              <span>{enhancedCandidate.experience}</span>
              <span>•</span>
              <span>{enhancedCandidate.location}</span>
              <span>•</span>
              <Badge variant="outline" className={getStatusColor(enhancedCandidate.status || "unknown")}>
                {enhancedCandidate.status || "Unknown"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border rounded-md px-4">
              Resume
            </Button>
            <Button variant="outline" size="sm" className="border rounded-md px-4">
              Contact
            </Button>
          </div>
        </div>
      </div>

     

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex border-b w-full rounded-none justify-start h-12 bg-transparent p-0">
          <TabsTrigger
            value="Summary"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <FileIcon className="h-4 w-4" />
            Summary
          </TabsTrigger>

          <TabsTrigger
            value="Jobs"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Briefcase className="h-4 w-4" />
            Jobs
          </TabsTrigger>

          <TabsTrigger
            value="Notes"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <StickyNote className="h-4 w-4" />
            Notes
          </TabsTrigger>

          <TabsTrigger
            value="Attachments"
            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none flex items-center gap-2 h-12 px-6"
          >
            <Paperclip className="h-4 w-4" />
            Attachments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Summary" className="p-4">
          <CandidateSummary 
            candidate={candidate} 
            onCandidateUpdate={handleCandidateUpdate}
          />
        </TabsContent>

        <TabsContent value="Jobs">
          <JobsContent 
            ref={jobsContentRef}
            candidateId={candidateId} 
            candidateName={enhancedCandidate.name || "Unknown Candidate"} 
          />
        </TabsContent>

        <TabsContent value="Activities" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Phone call scheduled</p>
                  <p className="text-sm text-gray-600">Scheduled for tomorrow at 2:00 PM</p>
                </div>
                <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Resume uploaded</p>
                  <p className="text-sm text-gray-600">Updated resume received</p>
                </div>
                <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Initial contact</p>
                  <p className="text-sm text-gray-600">First email sent</p>
                </div>
                <span className="text-xs text-gray-500 ml-auto">3 days ago</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Notes" className="p-4">
          <CandidateNotesContent candidateId={candidateId} />
        </TabsContent>

        <TabsContent value="Attachments" className="p-4">
          <AttachmentsContent candidateId={candidateId} />
        </TabsContent>

        <TabsContent value="ClientTeam" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Assigned Team Members</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{enhancedCandidate.recruiter}</p>
                  <p className="text-sm text-gray-600">Primary Recruiter</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Contacts" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">{enhancedCandidate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-600">{enhancedCandidate.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-gray-600">{enhancedCandidate.location}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="History" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Candidate History</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Added to system</p>
                  <p className="text-sm text-gray-600">Candidate profile created</p>
                </div>
                <span className="text-xs text-gray-500 ml-auto">Jan 10, 2024</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Status updated</p>
                  <p className="text-sm text-gray-600">Changed to {enhancedCandidate.status}</p>
                </div>
                <span className="text-xs text-gray-500 ml-auto">Jan 12, 2024</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 