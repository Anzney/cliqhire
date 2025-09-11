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
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{assignedJobs.length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{todayInterviews.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">
                {personalTasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {personalTasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
