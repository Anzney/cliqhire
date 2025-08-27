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
  Target
} from "lucide-react";

interface KPIData {
  totalJobs: number;
  activeJobs: number;
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
    title: "Applied Candidates",
    value: "appliedCandidates",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Total applications received"
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
  {
    title: "Disqualified",
    value: "disqualifiedCandidates",
    icon: UserX,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    description: "Candidates not selected"
  }
];

export function KPISection({ data }: KPISectionProps) {
  const getCardData = (valueKey: string) => {
    return data[valueKey as keyof KPIData] || 0;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recruitment Overview</h2>
          <p className="text-gray-600 mt-1">Key performance indicators for your recruitment pipeline</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Last 30 days
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {KPI_CARDS.map((card) => {
          const IconComponent = card.icon;
          const value = getCardData(card.value);
          
          return (
            <Card 
              key={card.title} 
              className={`border ${card.borderColor} hover:shadow-md transition-shadow`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {card.description}
                </p>
                
                {/* Additional metrics for specific cards */}
                {card.value === "totalJobs" && data.activeJobs > 0 && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round((data.activeJobs / data.totalJobs) * 100)}% Active
                    </Badge>
                  </div>
                )}
                
                {card.value === "appliedCandidates" && data.hiredCandidates > 0 && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round((data.hiredCandidates / data.appliedCandidates) * 100)}% Success Rate
                    </Badge>
                  </div>
                )}
                
                {card.value === "hiredCandidates" && data.appliedCandidates > 0 && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                      +{Math.round((data.hiredCandidates / data.appliedCandidates) * 100)}% Conversion
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
