// Client-side headhunter pipeline overview
"use client";

import React, { useEffect, useState } from "react";
import { Search, Briefcase, Building2, Users, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  getAllPipelineEntries, 
  getPipelineEntry, 
  type PipelineListItem, 
  type PipelineEntryDetail 
} from "@/services/recruitmentPipelineService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HeadhunterJob {
  id: string;
  title: string;
  clientName: string;
  location: string;
  jobType?: string;
  totalCandidates: number;
  stage?: string;
}

interface HeadhunterCandidate {
  id: string;
  name: string;
  currentStage: string;
  status: string;
  email?: string;
  phone?: string;
  location?: string;
  currentJobTitle?: string;
}

export const HeadhunterPipeline: React.FC = () => {
  const [jobs, setJobs] = useState<HeadhunterJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [jobCandidates, setJobCandidates] = useState<Record<string, HeadhunterCandidate[]>>({});
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await getAllPipelineEntries();
        if (res.success && res.data?.pipelines) {
          const mapped: HeadhunterJob[] = res.data.pipelines.map((p: PipelineListItem) => ({
            id: p._id,
            title: p.jobId.jobTitle,
            clientName: p.jobId.clientName || "Unknown client",
            location: p.jobId.location,
            jobType: p.jobId.jobType,
            totalCandidates: p.totalCandidates,
            stage: p.jobId.stage,
          }));
          setJobs(mapped);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const handleToggleJob = async (jobId: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }

    setExpandedJobId(jobId);

    if (!jobCandidates[jobId]) {
      setLoadingJobId(jobId);
      try {
        const res = await getPipelineEntry(jobId);
        if (res.success && res.data) {
          const entry: PipelineEntryDetail = res.data;
          const mappedCandidates: HeadhunterCandidate[] =
            (entry.candidateIdArray || []).map((c) => ({
              id: c.candidateId._id,
              name: c.candidateId.name,
              currentStage: c.currentStage,
              status: c.status,
              email: c.candidateId.email,
              phone: c.candidateId.phone,
              location: c.candidateId.location,
              currentJobTitle: c.candidateId.currentJobTitle,
            }));
          setJobCandidates((prev) => ({ ...prev, [jobId]: mappedCandidates }));
        }
      } finally {
        setLoadingJobId(null);
      }
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.clientName.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term)
    );
  });

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Briefcase className="h-4 w-4 text-primary" />
              Open positions overview
            </CardTitle>
            <CardDescription>
              A compact view of all positions and associated candidate volume for headhunting.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search by role, client, or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {isLoading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading positions…
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            {searchTerm ? "No positions match your search." : "No positions available in the headhunter pipeline yet."}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-260px)] pr-4">
            <div className="grid gap-3 md:gap-4">
              {filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                const candidates = jobCandidates[job.id] || [];

                return (
                  <Card key={job.id} className="transition-colors">
                    <CardContent
                      className="flex flex-col gap-3 py-4 cursor-pointer"
                      onClick={() => void handleToggleJob(job.id)}
                    >
                      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium md:text-base">
                              {job.title}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="h-3.5 w-3.5" />
                              {job.clientName}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground md:text-sm">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location || "Location not specified"}
                            </span>
                            {job.jobType && (
                              <Badge variant="outline" className="text-xs">
                                {job.jobType}
                              </Badge>
                            )}
                            {job.stage && (
                              <Badge variant="secondary" className="text-xs">
                                {job.stage}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs md:text-sm">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span className="font-medium">{job.totalCandidates}</span>
                            <span className="text-muted-foreground">candidates</span>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div
                          className="mt-3 rounded-lg border bg-muted/30 p-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {loadingJobId === job.id ? (
                            <div className="py-4 text-center text-xs text-muted-foreground">
                              Loading candidates…
                            </div>
                          ) : candidates.length === 0 ? (
                            <div className="py-4 text-center text-xs text-muted-foreground">
                              No candidates in this pipeline yet.
                            </div>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[26%]">Candidate</TableHead>
                                  <TableHead className="w-[20%]">Role</TableHead>
                                  <TableHead className="w-[16%]">Stage</TableHead>
                                  <TableHead className="w-[16%]">Status</TableHead>
                                  <TableHead className="w-[22%]">Location / Contact</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {candidates.map((c) => (
                                  <TableRow key={c.id}>
                                    <TableCell className="text-sm font-medium">
                                      {c.name}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {c.currentJobTitle || "Not specified"}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {c.currentStage || "—"}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {c.status || "—"}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                      <div className="flex flex-col gap-0.5">
                                        <span>{c.location || "Location N/A"}</span>
                                        {c.email && <span>{c.email}</span>}
                                        {c.phone && <span>{c.phone}</span>}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};



