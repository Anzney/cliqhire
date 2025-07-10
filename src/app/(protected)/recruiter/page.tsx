"use client";
import React from 'react';
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import Dashboardheader from '@/components/dashboard-header';
import { Table ,TableBody ,TableCell, TableHeader ,TableHead, TableRow } from '@/components/ui/table';
import Tableheader from '@/components/table-header';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Download, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecruiterStatusBadge } from "@/components/recruiter/recruiter-status-badge";
import { CreateRecruiterModal } from "@/components/create-recruiter-modal/create-recruiter-modal";
import { getRecruiters, deleteRecruiter } from "@/services/recruiterService";
import { Recruiter, RecruiterStatus } from "@/types/recruiter";

const headerArr = [
  "Recruiter Name",
  "Recruiter Email",
  "Recruiter Phone", 
  "Recruiter Location",
  "Recruiter Experience",
  "Recruiter Skills",
  "Recruiter Resume",
  "Recruiter Status",
  "Actions"
];

export default function RecruiterPage() {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const router = useRouter();

  // Fetch recruiters from API
  const fetchRecruiters = async () => {
    setInitialLoading(true);
    try {
      const response = await getRecruiters();
      setRecruiters(response.recruiters);
    } catch (error) {
      console.error('Error fetching recruiters:', error);
      // For now, keep empty array on error
      setRecruiters([]);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleStatusChange = (recruiterId: string, newStatus: RecruiterStatus) => {
    setRecruiters(prevRecruiters =>
      prevRecruiters.map(recruiter =>
        recruiter._id === recruiterId
          ? { ...recruiter, status: newStatus }
          : recruiter
      )
    );
  };

  const handleViewRecruiter = (recruiterId: string) => {
    router.push(`/recruiter/${recruiterId}`);
  };

  const handleEditRecruiter = (recruiterId: string) => {
    // console.log("Edit recruiter:", recruiterId);
    // Open edit modal
  };

  const handleDeleteRecruiter = async (recruiterId: string) => {
    if (confirm('Are you sure you want to delete this recruiter?')) {
      try {
        await deleteRecruiter(recruiterId);
        setRecruiters(prevRecruiters =>
          prevRecruiters.filter(recruiter => recruiter._id !== recruiterId)
        );
      } catch (error) {
        console.error('Error deleting recruiter:', error);
        alert('Failed to delete recruiter');
      }
    }
  };

  const handleDownloadResume = (resumeUrl: string, recruiterName: string) => {
    // Handle resume download
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('No resume available for download');
    }
  };

  const handleCreateSuccess = () => {
    fetchRecruiters(); // Refresh the list
  };

  return (
   <div className="flex flex-col h-full">
      <Dashboardheader 
          setOpen={setOpen}
          setFilterOpen={setFilterOpen}
          initialLoading={initialLoading}
          heading="Recruiter"
          buttonText="Add Recruiter"
     />

      {/* Table */}
      <div className="flex-1">
        <Table>
          <TableHeader>
            <Tableheader
              tableHeadArr={headerArr}
            />
          </TableHeader>
          <TableBody>
            {initialLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
                  <div className="py-24">
                    <div className="text-center">Loading recruiters...</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : recruiters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
                  <div className="py-24">
                    <div className="text-center">No recruiters found</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              recruiters.map((recruiter) => (
                <TableRow
                  key={recruiter._id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => router.push(`/recruiter/${recruiter._id}`)}
                >
                  <TableCell className="text-sm font-medium">{recruiter.name}</TableCell>
                  <TableCell className="text-sm">{recruiter.email}</TableCell>
                  <TableCell className="text-sm">{recruiter.phone}</TableCell>
                  <TableCell className="text-sm">{recruiter.location}</TableCell>
                  <TableCell className="text-sm">{recruiter.experience}</TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-wrap gap-1">
                      {recruiter.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {recruiter.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{recruiter.skills.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadResume(recruiter.resume, recruiter.name);
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm">
                    <RecruiterStatusBadge
                      id={recruiter._id}
                      status={recruiter.status}
                      onStatusChange={handleStatusChange}
                    />
                  </TableCell>
                  <TableCell className="text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewRecruiter(recruiter._id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditRecruiter(recruiter._id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteRecruiter(recruiter._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateRecruiterModal 
        open={open} 
        onOpenChange={setOpen} 
        onSuccess={handleCreateSuccess}
      />
   </div>
  )
}