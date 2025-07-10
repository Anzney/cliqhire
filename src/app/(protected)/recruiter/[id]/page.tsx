"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Dashboardheader from '@/components/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { getRecruiterById } from '@/services/recruiterService';
import { Recruiter } from '@/types/recruiter';

export default function RecruiterDetailPage() {
  const params = useParams();
  const recruiterId = params.id as string;
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const recruiterData = await getRecruiterById(recruiterId);
        setRecruiter(recruiterData);
      } catch (error) {
        console.error('Error fetching recruiter:', error);
      } finally {
        setLoading(false);
      }
    };

    if (recruiterId) {
      fetchRecruiter();
    }
  }, [recruiterId]);

  const handleBack = () => {
    window.history.back();
  };

  const handleDownloadResume = (resumeUrl: string) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('No resume available for download');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Dashboardheader 
          setOpen={() => {}}
          setFilterOpen={() => {}}
          initialLoading={loading}
          heading="Recruiter Details"
          buttonText=""
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading recruiter details...</div>
        </div>
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="flex flex-col h-full">
        <Dashboardheader 
          setOpen={() => {}}
          setFilterOpen={() => {}}
          initialLoading={false}
          heading="Recruiter Details"
          buttonText=""
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Recruiter not found</div>
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
        heading="Recruiter Details"
        buttonText=""
      />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recruiters
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
                  <p className="text-lg font-semibold">{recruiter.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {recruiter.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {recruiter.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {recruiter.location}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience</label>
                  <p className="text-lg">{recruiter.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={recruiter.status === 'Active' ? 'default' : 'secondary'}>
                      {recruiter.status}
                    </Badge>
                  </div>
                </div>
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
                {recruiter.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resume */}
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>
            <CardContent>
              {recruiter.resume ? (
                <Button
                  onClick={() => handleDownloadResume(recruiter.resume)}
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
