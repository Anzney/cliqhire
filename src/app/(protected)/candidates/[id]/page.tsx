// Remove 'use client' and refactor to server component
import CandidateSummary from '@/components/candidates/summary/candidate-summary';
import { SlidersHorizontal, RefreshCcw, Plus, FileText, Users, Briefcase, Star, Activity, StickyNote, Paperclip, Clock, User } from "lucide-react";
import dynamic from 'next/dynamic';

const TABS = [
  { label: "Summary", icon: <FileText className="w-4 h-4" /> },
  { label: "Activities", icon: <Activity className="w-4 h-4" /> },
  { label: "Notes", icon: <StickyNote className="w-4 h-4" /> },
  { label: "Client Team", icon: <Users className="w-4 h-4" /> },
  { label: "Contacts", icon: <User className="w-4 h-4" /> },
  { label: "History", icon: <Clock className="w-4 h-4" /> },
];

// Dynamically import the client component for tabs and editing
const ClientCandidateTabs = dynamic(() => import('./ClientCandidateTabs'), { ssr: false });

export default async function CandidatePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await fetch(`/api/candidates/${id}`);
  const candidate = await res.json();

  if (!candidate) {
    return (
      <div className="min-h-[300px] font-sans w-full flex items-center justify-center">
        <div className="text-gray-500 text-lg">Candidate not found.</div>
      </div>
    );
  }

  return (
    <ClientCandidateTabs candidate={candidate} tabs={TABS} />
  );
}
