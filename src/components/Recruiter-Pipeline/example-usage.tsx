"use client";

import React, { useState } from 'react';
import { PipelineStageDetails } from './pipeline-stage-details';
import { useRecruiterPipeline } from '@/hooks/useRecruiterPipeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, User, Calendar, Building } from 'lucide-react';

// Example candidate data
const exampleCandidate = {
  id: "64f1a2b3c4d5e6f7g8h9i0j2",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  currentStage: "Sourcing",
  position: "Senior React Developer",
  company: "Tech Corp",
  // Stage-specific fields
  sourcingDate: "2024-01-15",
  connection: "LinkedIn",
  referredBy: "Jane Smith",
  screeningRating: "4.5/5",
  outreachChannel: "Email",
  sourcingDueDate: "2024-01-30",
  followUpDateTime: "2024-01-20T10:00",
  // Add more fields as needed for different stages
};

const pipelineStages = [
  "Sourcing",
  "Screening", 
  "Client Screening",
  "Interview",
  "Verification",
  "Onboarding",
  "Hired"
];

export function RecruiterPipelineExample() {
  const [selectedStage, setSelectedStage] = useState<string>("Sourcing");
  const [candidate, setCandidate] = useState(exampleCandidate);
  const [pipelineId] = useState<string>("64f1a2b3c4d5e6f7g8h9i0j1"); // Example pipeline ID

  // Use the custom hook for API operations
  const { 
    isLoading, 
    error, 
    updateStageField, 
    moveCandidateToStage 
  } = useRecruiterPipeline({
    pipelineId,
    candidateId: candidate.id
  });

  const handleUpdateCandidate = (updatedCandidate: any) => {
    setCandidate(updatedCandidate);
  };

  const handleStageChange = async (newStage: string) => {
    const result = await moveCandidateToStage(
      newStage,
      `Moved candidate from ${candidate.currentStage} to ${newStage}`
    );

    if (result.success) {
      setCandidate(prev => ({
        ...prev,
        currentStage: newStage
      }));
      setSelectedStage(newStage);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Pipeline</h1>
          <p className="text-gray-600">Manage candidate progression through recruitment stages</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Pipeline ID: {pipelineId.slice(0, 8)}...
        </Badge>
      </div>

      {/* Candidate Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Candidate Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{candidate.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Position</p>
              <p className="text-sm text-gray-900">{candidate.position}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Stage</p>
              <Badge className="mt-1">{candidate.currentStage}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Select Stage to View Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pipelineStages.map((stage) => (
              <Button
                key={stage}
                variant={selectedStage === stage ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStage(stage)}
                className="text-xs"
              >
                {stage}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Move to Stage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Move Candidate to Different Stage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select
              value={candidate.currentStage}
              onValueChange={handleStageChange}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {pipelineStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Moving candidate...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stage Details */}
      <PipelineStageDetails
        candidate={candidate}
        selectedStage={selectedStage}
        pipelineId={pipelineId}
        onUpdateCandidate={handleUpdateCandidate}
        onStageSelect={setSelectedStage}
      />

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">API Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span>{isLoading ? 'API call in progress...' : 'Ready for API calls'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Pipeline ID: {pipelineId}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Candidate ID: {candidate.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
