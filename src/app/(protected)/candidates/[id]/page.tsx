"use client";
import { mockCandidates, Candidate } from "@/data/candidatesData";
import React, { useState } from "react";
import CandidateSummary from '@/components/candidates/summary/candidate-summary';
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RefreshCcw, Plus, FileText, Mail, Users, Briefcase, Star, Activity, StickyNote, Paperclip, Clock, User, Globe, MessageSquare } from "lucide-react";
import { useParams } from 'next/navigation';
// If TAB_ICONS is available, import it, otherwise use placeholders
// import { TAB_ICONS } from "@/components/candidates/summary/tab-icons";

const TABS = [
  { label: "Jobs", icon: <Briefcase className="w-4 h-4" /> },
  { label: "Summary", icon: <FileText className="w-4 h-4" /> },
  { label: "Activities", icon: <Activity className="w-4 h-4" /> },
  { label: "Notes", icon: <StickyNote className="w-4 h-4" /> },
  { label: "Client Team", icon: <Users className="w-4 h-4" /> },
  { label: "Contacts", icon: <User className="w-4 h-4" /> },
  { label: "History", icon: <Clock className="w-4 h-4" /> },
];

export default function CandidatePage() {
  const params = useParams();
  const email = decodeURIComponent(params.id as string);
  // Find candidate by email from shared data
  const candidate = mockCandidates.find((c: Candidate) => c.email === email);
  const [activeTab, setActiveTab] = useState("Jobs");

  if (!candidate) {
    return (
      <div className="min-h-[300px] font-sans w-full flex items-center justify-center">
        <div className="text-gray-500 text-lg">Candidate not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-[300px] font-sans w-full">
      {/* Header */}
      <div className="flex flex-col gap-0">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 pt-4 px-6">
          <div>
            <div className="text-2xl font-bold">{candidate.name}</div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
              <span>{candidate.experience}</span>
              <span className="mx-1">•</span>
              <span>{candidate.location}</span>
              <span className="mx-1">•</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">{candidate.status}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border border-gray-300 rounded-md px-4 py-1 h-9 text-sm font-medium">
              Website
            </Button>
            <Button variant="outline" size="sm" className="border border-gray-300 rounded-md px-4 py-1 h-9 text-sm font-medium">
              WhatsApp
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 py-3 px-6">
          <Button
            size="sm"
            className="bg-black text-white hover:bg-gray-900 font-semibold px-4 py-1 h-9 rounded-md flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Create Job Requirement
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border border-gray-300 rounded-md flex items-center gap-2 px-3 py-1 h-9 text-sm font-medium"
              onClick={() => console.log("Open Resume")}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border border-gray-300 rounded-md flex items-center gap-2 px-3 py-1 h-9 text-sm font-medium"
              onClick={() => console.log("Open Inbox")}
            >
              <RefreshCcw className={`h-4 w-4 `} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      {/* Tab bar */}
      <div className="border-b border-gray-200 px-6">
        <nav className="flex space-x-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-2 py-2 text-base font-medium border-b-2 transition-colors duration-150 whitespace-nowrap focus:outline-none
                ${activeTab === tab.label ? "border-black text-black font-semibold" : "border-transparent text-gray-600 hover:text-black hover:border-black"}`}
              type="button"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      {/* Tab content */}
      <div className="mt-4 px-6">
        {activeTab === "Summary" && (
          <CandidateSummary candidate={candidate} />
        )}
        {activeTab !== "Summary" && (
          <div className="text-gray-400">{activeTab} content coming soon...</div>
        )}
      </div>
    </div>
  );
}
