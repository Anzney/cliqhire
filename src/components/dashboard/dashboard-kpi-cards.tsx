"use client";

import { Building2, Briefcase, Calendar, Users } from 'lucide-react';
import { useDashboardStats } from "@/hooks/useDashboard";

export function DashboardKpiCards() {
    const { data: dashboardStats, isLoading } = useDashboardStats();

    return (
        <div className="grid md:grid-cols-4 gap-4">
            <div className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-brand/10 rounded-xl text-brand">
                        <Users className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Candidates</p>
                    <h3 className="text-2xl font-bold text-[#2B3674]">
                        {isLoading ? "..." : dashboardStats?.candidates?.total || 0}
                    </h3>
                    <p className="text-xs text-brand mt-1">{isLoading ? "..." : dashboardStats?.candidates?.active || 0} active currently</p>
                </div>
            </div>

            <div className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-600">
                        <Briefcase className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Active Jobs</p>
                    <h3 className="text-2xl font-bold text-[#2B3674]">
                        {isLoading ? "..." : dashboardStats?.jobs?.active || 0}
                    </h3>
                    <p className="text-xs text-orange-600 mt-1">out of {isLoading ? "..." : dashboardStats?.jobs?.total || 0} total jobs</p>
                </div>
            </div>

            <div className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600">
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Interviews Scheduled</p>
                    <h3 className="text-2xl font-bold text-[#2B3674]">
                        {isLoading ? "..." : dashboardStats?.pipeline?.candidatesInterviewing || 0}
                    </h3>
                    <p className="text-xs text-blue-600 mt-1">across {isLoading ? "..." : dashboardStats?.pipeline?.activePipelines || 0} active pipelines</p>
                </div>
            </div>

            <div className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-green-500/10 rounded-xl text-green-600">
                        <Building2 className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Clients</p>
                    <h3 className="text-2xl font-bold text-[#2B3674]">
                        {isLoading ? "..." : dashboardStats?.clients?.total || 0}
                    </h3>
                    <p className="text-xs text-green-600 mt-1">{isLoading ? "..." : dashboardStats?.clients?.byStage?.signed || 0} successfully signed</p>
                </div>
            </div>
        </div>
    );
}
