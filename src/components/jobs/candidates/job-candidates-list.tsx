"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Candidate } from "@/services/candidateService";

export interface JobCandidatesListRef {
  refresh: () => Promise<void>;
}

export function getCandidateDisplayName(candidate: Candidate) {
  const name = candidate.name || "Unknown Candidate";
  const title = candidate.currentJobTitle ? ` - ${candidate.currentJobTitle}` : "";
  return `${name}${title}`;
}

interface JobCandidatesListProps {
  jobId: string;
  reloadToken?: number;
  onLoaded?: (count: number) => void;
}

export const JobCandidatesList = forwardRef<JobCandidatesListRef, JobCandidatesListProps>(
  ({ jobId, reloadToken, onLoaded }, ref) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const fetchCandidatesForJob = async () => {
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${API_URL}/api/jobs/${jobId}/candidates`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch candidates for job ${jobId}`);
        }
        const json = await res.json();
        const list: Candidate[] = Array.isArray(json?.data) ? json.data : [];
        setCandidates(list);
        onLoaded?.(list.length);
      } catch (err) {
        console.error("Error fetching job candidates:", err);
        setCandidates([]);
        onLoaded?.(0);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCandidatesForJob();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId, reloadToken]);

    useImperativeHandle(ref, () => ({
      refresh: fetchCandidatesForJob,
    }));

    return (
      <div className="w-full">
        <div className="border-b py-2 px-6">
          <div className="flex items-center">
            <div className="grid grid-cols-6 w-full text-sm font-medium text-gray-500">
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Status</div>
              <div>Location</div>
              <div>Current Title</div>
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 flex-col">
                <Loader className="size-6 animate-spin" />
                <div className="text-center">Loading candidates...</div>
              </div>
            </div>
          ) : candidates.length > 0 ? (
            candidates.map((candidate) => (
              <div
                key={candidate._id || Math.random().toString(36)}
                className="border-b hover:bg-gray-50 py-3 px-4 cursor-pointer"
                onClick={() => candidate._id && router.push(`/candidates/${candidate._id}`)}
              >
                <div className="flex items-center">
                  <div className="grid grid-cols-6 w-full">
                    <div className="font-medium">{getCandidateDisplayName(candidate)}</div>
                    <div>{candidate.email || "-"}</div>
                    <div>{candidate.phone || candidate.otherPhone || "-"}</div>
                    <div>{candidate.status || "-"}</div>
                    <div>{candidate.location || candidate.country || "-"}</div>
                    <div>{candidate.currentJobTitle || "-"}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No candidates have been added to this job yet.
            </div>
          )}
        </div>
      </div>
    );
  }
);

JobCandidatesList.displayName = "JobCandidatesList";



