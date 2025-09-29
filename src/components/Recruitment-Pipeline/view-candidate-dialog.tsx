"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Briefcase, 
  Building, 
  UserCheck, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  DollarSign,
  Users
} from "lucide-react";
import { RecruitmentCandidate } from "@/components/dummy/recruitment-pipeline-data";

interface ViewCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: RecruitmentCandidate | null;
}

// Extended candidate data for the dialog
interface ExtendedCandidateData {
  candidate: {
    name: string;
    email: string;
    experience: string;
    skills: string[];
    resume: string;
  };
  job: {
    position: string;
    description: string;
    salaryRange: string;
    skills: string[];
    endDate: string;
  };
  client: {
    name: string;
    email: string;
    phone: string;
    numberOfPositions: number;
  };
  hiringManager: {
    name: string;
    email: string;
    phone: string;
  };
}

// Mock data generator for extended candidate details
const getExtendedCandidateData = (candidate: RecruitmentCandidate): ExtendedCandidateData => {
  const mockSkills = ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "Git"];
  const mockResumes = ["resume_john_smith.pdf", "resume_emily_davis.pdf", "resume_david_wilson.pdf"];
  
  return {
    candidate: {
      name: candidate.candidateName,
      email: `${candidate.candidateName.toLowerCase().replace(' ', '.')}@email.com`,
      experience: `${Math.floor(Math.random() * 8) + 2} years`,
      skills: mockSkills.slice(0, Math.floor(Math.random() * 4) + 3),
      resume: mockResumes[Math.floor(Math.random() * mockResumes.length)]
    },
    job: {
      position: candidate.jobPosition,
      description: `We are looking for a talented ${candidate.jobPosition} to join our dynamic team. This role involves developing innovative solutions and collaborating with cross-functional teams.`,
      salaryRange: `$${Math.floor(Math.random() * 50) + 50}K - $${Math.floor(Math.random() * 100) + 100}K`,
      skills: mockSkills.slice(0, Math.floor(Math.random() * 5) + 2),
      endDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    },
    client: {
      name: candidate.clientName,
      email: `hr@${candidate.clientName.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      numberOfPositions: Math.floor(Math.random() * 5) + 1
    },
    hiringManager: {
      name: candidate.hiringManager,
      email: `${candidate.hiringManager.toLowerCase().replace(' ', '.')}@company.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    }
  };
};

export const ViewCandidateDialog: React.FC<ViewCandidateDialogProps> = ({
  open,
  onOpenChange,
  candidate
}) => {
  if (!candidate) return null;

  const extendedData = getExtendedCandidateData(candidate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Candidate Details - {candidate.candidateName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Candidate Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Candidate Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span>{extendedData.candidate.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span className="text-sm">{extendedData.candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Experience:</span>
                <span>{extendedData.candidate.experience}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Skills:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {extendedData.candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Resume:</span>
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  {extendedData.candidate.resume}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Position:</span>
                <span>{extendedData.job.position}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Description:</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {extendedData.job.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Salary Range:</span>
                <span>{extendedData.job.salaryRange}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Required Skills:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {extendedData.job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">End Date:</span>
                <span>{extendedData.job.endDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Client Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5" />
                Client Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span>{extendedData.client.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span className="text-sm">{extendedData.client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span className="text-sm">{extendedData.client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Positions:</span>
                <span>{extendedData.client.numberOfPositions}</span>
              </div>
            </CardContent>
          </Card>

          {/* Hiring Manager Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="h-5 w-5" />
                Hiring Manager
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span>{extendedData.hiringManager.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span className="text-sm">{extendedData.hiringManager.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span className="text-sm">{extendedData.hiringManager.phone}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
