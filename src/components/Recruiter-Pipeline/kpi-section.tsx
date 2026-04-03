"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp,
  Building2,
  Target,
  Clock
} from "lucide-react";

interface KPIData {
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
  appliedCandidates: number;
  hiredCandidates: number;
  disqualifiedCandidates: number;
}

interface KPISectionProps {
  data: KPIData;
}

const KPI_CARDS = [
  {
    title: "Total Jobs",
    value: "totalJobs",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Total job postings"
  },
  {
    title: "Active Jobs",
    value: "activeJobs", 
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Currently active positions"
  },
  {
    title: "Inactive Jobs",
    value: "inactiveJobs",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Paused or closed positions"
  },
 
  {
    title: "Hired Candidates",
    value: "hiredCandidates",
    icon: UserCheck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Successfully placed candidates"
  },
  
];

export function KPISection({ data }: KPISectionProps) {
  const getCardData = (valueKey: string) => {
    return data[valueKey as keyof KPIData] || 0;
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {KPI_CARDS.map((card) => {
        const IconComponent = card.icon;
        const value = getCardData(card.value);
        
        return (
          <div 
            key={card.title} 
            className={`flex items-center p-2.5 rounded-xl border ${card.borderColor} bg-white shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`p-2 rounded-lg ${card.bgColor} mr-3 shrink-0`}>
              <IconComponent className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-500 tracking-tight">{card.title}</span>
              <span className="text-base font-extrabold text-slate-900 leading-tight">
                {value.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
