"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { KPISection } from "@/components/Recruiter-Pipeline/kpi-section";
import { PipelineJobCard } from "@/components/Recruiter-Pipeline/pipeline-job-card";
import { type Job } from "@/components/Recruiter-Pipeline/dummy-data";

export const HeadhunterPipeline: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(() => [
    {
      id: "hh-001",
      title: "Senior Software Engineer",
      clientName: "TechCorp Inc.",
      location: "Remote",
      salaryRange: "120000 - 150000 USD",
      headcount: 2,
      jobType: "Full-time",
      isExpanded: false,
      totalCandidates: 4,
      jobId: {
        _id: "job-001",
        jobTitle: "Senior Software Engineer",
        location: "Remote",
        stage: "Active",
        jobTeamInfo: {
          hiringManager: { _id: "hm-1", name: "Sarah Johnson", email: "sarah@techcorp.com" },
          recruiter: { _id: "rec-1", name: "Alex Lee", email: "alex@cliqhire.com" },
        },
      },
      candidates: [
        {
          id: "cand-001",
          name: "John Smith",
          source: "LinkedIn",
          currentStage: "Sourcing",
          currentJobTitle: "Software Engineer",
          subStatus: "Pending",
          email: "john.smith@example.com",
          location: "New York, USA",
        },
        {
          id: "cand-002",
          name: "Emily Davis",
          source: "Referral",
          currentStage: "Screening",
          currentJobTitle: "Senior Engineer",
          subStatus: "Submitted",
          email: "emily.davis@example.com",
          location: "San Francisco, USA",
        },
        {
          id: "cand-003",
          name: "David Wilson",
          source: "Indeed",
          currentStage: "Client Review",
          currentJobTitle: "Backend Engineer",
          subStatus: "Pending",
          email: "david.wilson@example.com",
          location: "Austin, USA",
        },
        {
          id: "cand-004",
          name: "Maria Garcia",
          source: "Direct",
          currentStage: "Interview",
          currentJobTitle: "Software Engineer",
          subStatus: "Accepted",
          email: "maria.garcia@example.com",
          location: "Remote",
        },
      ],
    },
    {
      id: "hh-002",
      title: "Product Manager",
      clientName: "InnovateTech",
      location: "Berlin, DE",
      salaryRange: "90000 - 110000 EUR",
      headcount: 1,
      jobType: "Contract",
      isExpanded: false,
      totalCandidates: 3,
      jobId: {
        _id: "job-002",
        jobTitle: "Product Manager",
        location: "Berlin, DE",
        stage: "Active",
        jobTeamInfo: {
          hiringManager: { _id: "hm-2", name: "Michael Chen", email: "michael@innovate.tech" },
          recruiter: { _id: "rec-2", name: "Priya Patel", email: "priya@cliqhire.com" },
        },
      },
      candidates: [
        {
          id: "cand-101",
          name: "Alex Thompson",
          source: "LinkedIn",
          currentStage: "Verification",
          currentJobTitle: "PM",
          subStatus: "Pending",
          email: "alex.thompson@example.com",
          location: "Berlin, DE",
        },
        {
          id: "cand-102",
          name: "Jennifer Brown",
          source: "Referral",
          currentStage: "Interview",
          currentJobTitle: "Senior PM",
          subStatus: "Accepted",
          email: "jennifer.brown@example.com",
          location: "Munich, DE",
        },
        {
          id: "cand-103",
          name: "Grace Kim",
          source: "Direct",
          currentStage: "Screening",
          currentJobTitle: "Associate PM",
          subStatus: "Pending",
          email: "grace.kim@example.com",
          location: "Berlin, DE",
        },
      ],
    },
    {
      id: "hh-003",
      title: "UX Designer",
      clientName: "DesignStudio",
      location: "London, UK",
      salaryRange: "60000 - 75000 GBP",
      headcount: 1,
      jobType: "Full-time",
      isExpanded: false,
      totalCandidates: 2,
      jobId: {
        _id: "job-003",
        jobTitle: "UX Designer",
        location: "London, UK",
        stage: "Closed",
        jobTeamInfo: {
          hiringManager: { _id: "hm-3", name: "Lisa Rodriguez", email: "lisa@designstudio.co" },
          recruiter: { _id: "rec-3", name: "Omar Hassan", email: "omar@cliqhire.com" },
        },
      },
      candidates: [
        {
          id: "cand-201",
          name: "Paul Williams",
          source: "Referral",
          currentStage: "Onboarding",
          currentJobTitle: "UX Designer",
          subStatus: "Accepted",
          email: "paul.williams@example.com",
          location: "London, UK",
        },
        {
          id: "cand-202",
          name: "Emily Zhang",
          source: "LinkedIn",
          currentStage: "Hired",
          currentJobTitle: "UX Specialist",
          subStatus: "Accepted",
          email: "emily.zhang@example.com",
          location: "London, UK",
        },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [jobNameFilter, setJobNameFilter] = useState("");
  const [clientNameFilter, setClientNameFilter] = useState("");
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);

  const kpiData = useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.jobId?.stage && job.jobId.stage.toLowerCase() !== "closed").length;
    const inactiveJobs = jobs.filter(job => job.jobId?.stage && job.jobId.stage.toLowerCase() === "closed").length;

    let appliedCandidates = jobs.reduce((total, job) => total + (job.totalCandidates || job.candidates.length || 0), 0);
    let hiredCandidates = 0;
    let disqualifiedCandidates = 0;

    jobs.forEach(job => {
      if (job.candidates && job.candidates.length > 0) {
        hiredCandidates += job.candidates.filter(c => c.currentStage === "Hired").length;
        disqualifiedCandidates += job.candidates.filter(c => c.status === "Disqualified").length;
      }
    });

    return {
      totalJobs,
      activeJobs,
      inactiveJobs,
      appliedCandidates,
      hiredCandidates,
      disqualifiedCandidates,
    };
  }, [jobs]);

  const getFilteredAndSortedJobs = () => {
    let filteredJobs = [...jobs];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredJobs = filteredJobs.filter(job => {
        if (job.title.toLowerCase().includes(searchLower)) return true;
        if (job.clientName.toLowerCase().includes(searchLower)) return true;
        if (job.candidates.some(candidate => candidate.name.toLowerCase().includes(searchLower))) return true;
        if (job.notes?.toLowerCase().includes(searchLower)) return true;
        return false;
      });
    }

    if (jobNameFilter.trim() || clientNameFilter.trim()) {
      const jobLower = jobNameFilter.trim().toLowerCase();
      const clientLower = clientNameFilter.trim().toLowerCase();
      filteredJobs = filteredJobs.filter(job => {
        const jobMatch = jobLower ? job.title.toLowerCase().includes(jobLower) : true;
        const clientMatch = clientLower ? job.clientName.toLowerCase().includes(clientLower) : true;
        return jobMatch && clientMatch;
      });
    }

    if (statusFilter !== "all") {
      filteredJobs = filteredJobs.filter(job => {
        switch (statusFilter) {
          case "active":
            return job.jobId?.stage && job.jobId.stage.toLowerCase() !== "closed";
          case "completed":
            return job.jobId?.stage && job.jobId.stage.toLowerCase() === "closed";
          case "paused":
            return job.jobId?.stage && (
              job.jobId.stage.toLowerCase().includes("hold") ||
              job.jobId.stage.toLowerCase().includes("pause") ||
              job.jobId.stage.toLowerCase().includes("suspended")
            );
          default:
            return true;
        }
      });
    }

    filteredJobs.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "candidates":
          return (b.totalCandidates || 0) - (a.totalCandidates || 0);
        case "client":
          return a.clientName.localeCompare(b.clientName);
        case "date":
        default:
          return 0;
      }
    });

    return filteredJobs;
  };

  const toggleJobExpansion = (jobId: string) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, isExpanded: !j.isExpanded } : j)));
  };

  const handleCandidateUpdate = (jobId: string, updatedCandidate: any) => {
    setJobs(prev => prev.map(j => {
      if (j.id !== jobId) return j;
      return {
        ...j,
        candidates: j.candidates.map(c => c.id === updatedCandidate.id ? { ...c, ...updatedCandidate } : c),
      };
    }));
  };
  const updateCandidateStage = async (_jobId: string, _candidateId: string, _newStage: string) => {};

  const filteredJobs = getFilteredAndSortedJobs();

  return (
    <div className="space-y-3">
      <KPISection data={kpiData} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"></div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs, candidates, or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <Input
            placeholder="Job name"
            value={jobNameFilter}
            onChange={(e) => setJobNameFilter(e.target.value)}
            className="w-[200px]"
          />
          <Input
            placeholder="Client name"
            value={clientNameFilter}
            onChange={(e) => setClientNameFilter(e.target.value)}
            className="w-[200px]"
          />
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <PipelineJobCard
            key={job.id}
            job={job}
            loadingJobId={loadingJobId}
            isHighlighted={highlightedJobId === job.id}
            onToggleExpansion={toggleJobExpansion}
            onUpdateCandidateStage={updateCandidateStage}
            onCandidateUpdate={(jid, c) => handleCandidateUpdate(jid, c)}
            canModify={true}
            hideCopyFormAndViewTableButtons={true}
            tableOptions={{ showStageColumn: false }}
            hideStageFilters={true}
            hideClientName={true}
            statusOptionsOverride={["Pending","Submitted","Accepted","Rejected"]}
            isHeadhunterMode={true}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">No jobs available</div>
      )}
    </div>
  );
};



