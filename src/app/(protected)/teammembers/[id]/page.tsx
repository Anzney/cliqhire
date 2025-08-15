"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Dashboardheader from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Mail, Phone, MapPin, Briefcase, RefreshCw } from "lucide-react";
import { getTeamMemberById } from "@/services/teamMembersService";
import { TeamMember } from "@/types/teamMember";

export default function TeamMemberDetailPage() {
  const params = useParams();
  const teamMemberId = params?.id as string;
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMember = async () => {
    if (!teamMemberId) {
      setError("No team member ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching team member with ID:", teamMemberId);
      const teamMemberData = await getTeamMemberById(teamMemberId);
      console.log("Team member data received:", teamMemberData);
      setTeamMember(teamMemberData);
    } catch (error: any) {
      console.error("Error fetching team member:", error);
      const errorMessage = error.message || "Failed to load team member details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMember();
  }, [teamMemberId]);

  const handleBack = () => {
    window.history.back();
  };

  const handleDownloadResume = (resumeUrl: string | undefined) => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      alert("No resume available for download");
    }
  };

  const handleRetry = () => {
    fetchTeamMember();
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Dashboardheader
          setOpen={() => {}}
          setFilterOpen={() => {}}
          initialLoading={loading}
          heading="Team Member Details"
          buttonText=""
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading team member details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <Dashboardheader
          setOpen={() => {}}
          setFilterOpen={() => {}}
          initialLoading={false}
          heading="Team Member Details"
          buttonText=""
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="flex flex-col h-full">
        <Dashboardheader
          setOpen={() => {}}
          setFilterOpen={() => {}}
          initialLoading={false}
          heading="Team Member Details"
          buttonText=""
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">Team member not found</div>
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Dashboardheader
        setOpen={() => {}}
        setFilterOpen={() => {}}
        initialLoading={false}
        heading="Team Member Details"
        buttonText=""
      />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team Members
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg font-semibold">{teamMember.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {teamMember.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {teamMember.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {teamMember.location}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience</label>
                  <p className="text-lg">{teamMember.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={teamMember.status === "Active" ? "default" : "secondary"}>
                      {teamMember.status}
                    </Badge>
                  </div>
                </div>
                {teamMember.teamRole && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Team Role</label>
                    <p className="text-lg">{teamMember.teamRole}</p>
                  </div>
                )}
                {teamMember.department && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-lg">{teamMember.department}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {teamMember.skills && teamMember.skills.length > 0 ? (
                  teamMember.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resume */}
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>
            <CardContent>
              {teamMember.resume ? (
                <Button
                  onClick={() => handleDownloadResume(teamMember.resume)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </Button>
              ) : (
                <p className="text-muted-foreground">No resume uploaded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
