import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Calendar, Clock, CheckCircle } from "lucide-react";
import { AssignedJob, Interview, PersonalTask } from "./types";

interface StatsOverviewProps {
  assignedJobs: AssignedJob[];
  todayInterviews: Interview[];
  personalTasks: PersonalTask[];
}

export function StatsOverview({ assignedJobs, todayInterviews, personalTasks }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Assigned Jobs</p>
              <p className="text-2xl font-bold text-slate-900">{assignedJobs.length}</p>
            </div>
            <Briefcase className="w-10 h-10 p-2 bg-blue-50 text-blue-600 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Reminder Task</p>
              <p className="text-2xl font-bold text-slate-900">{todayInterviews.length}</p>
            </div>
            <Calendar className="w-10 h-10 p-2 bg-green-50 text-green-600 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Tasks</p>
              <p className="text-2xl font-bold text-slate-900">
                {personalTasks.filter(t => t.status === 'to-do').length}
              </p>
            </div>
            <Clock className="w-10 h-10 p-2 bg-yellow-50 text-yellow-600 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed Today</p>
              <p className="text-2xl font-bold text-slate-900">
                {personalTasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 p-2 bg-emerald-50 text-emerald-600 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
