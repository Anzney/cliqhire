"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  DollarSign, 
  Calendar,
  GraduationCap,
  Languages,
  Award,
  FileText,
  Globe
} from "lucide-react";
import { type Candidate } from "./dummy-data";

interface CandidateDetailsDialogProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateDetailsDialog({ 
  candidate, 
  isOpen, 
  onClose 
}: CandidateDetailsDialogProps) {
  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-lg bg-gray-200">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl font-semibold">
                {candidate.name}
              </DialogTitle>
              <DialogDescription>
                {candidate.currentJobTitle || "Professional"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Current Status</h3>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              {candidate.currentStage}
            </Badge>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Basic Information</h4>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Current Position:</span>
                  <span>{candidate.currentJobTitle || "Not specified"}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">Previous Company:</span>
                  <span>{candidate.previousCompanyName || "Not specified"}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Experience:</span>
                  <span>{candidate.experience || "Not specified"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Email:</span>
                  <span>{candidate.email || "Not provided"}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Phone:</span>
                  <span>{candidate.phone || "Not provided"}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Location:</span>
                  <span>{candidate.location || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Salary Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidate.currentSalary && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Current Salary:</span>
                  <span>{candidate.currentSalary} {candidate.currentSalaryCurrency}</span>
                </div>
              )}
              
              {candidate.expectedSalary && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Expected Salary:</span>
                  <span>{candidate.expectedSalary} {candidate.expectedSalaryCurrency}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Education:</span>
                  <span>{candidate.education || "Not specified"}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Languages className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Languages:</span>
                  <span>{candidate.languages || "Not specified"}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Skills:</span>
                  <span>{candidate.skills || "Not specified"}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Source:</span>
                  <span>{candidate.source}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {candidate.notes && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Notes</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{candidate.notes}</p>
              </div>
            </div>
          )}

          {/* Resume/CV Link */}
          {candidate.resumeUrl && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Documents</h4>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <a 
                  href={candidate.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  View Resume/CV
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
