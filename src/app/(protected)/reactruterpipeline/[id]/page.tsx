"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronLeft, Users, MapPin, DollarSign, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Briefcase, Trash2, EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { pipelineStages, getStageColor, type Job, type Candidate } from "@/components/Recruiter-Pipeline/dummy-data";
import { getPipelineEntry } from "@/services/recruitmentPipelineService";

const Page = () => {
  const params = useParams();
  const id = (params as any)?.id as string;
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [job, setJob] = React.useState<Job | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getPipelineEntry(id);
        // Transform API response to match Job type used by pipeline components
        const entry = res.data;
        const jobData: any = entry.jobId || {};
        const salaryMin = jobData?.salaryRange?.min ?? jobData?.minimumSalary;
        const salaryMax = jobData?.salaryRange?.max ?? jobData?.maximumSalary;
        const salaryCurrency = jobData?.salaryRange?.currency ?? jobData?.salaryCurrency ?? "";
        const salaryRangeString =
          (salaryMin !== undefined && salaryMin !== null && salaryMax !== undefined && salaryMax !== null)
            ? `${salaryMin}-${salaryMax} ${salaryCurrency}`
            : "";
        const mappedJob: Job = {
          id: entry._id,
          title: entry.jobId?.jobTitle || "",
          clientName: (entry.jobId as any)?.client?.name || "",
          location: Array.isArray(entry.jobId?.location) ? entry.jobId.location.join(", ") : (entry.jobId?.location || ""),
          salaryRange: salaryRangeString,
          headcount: entry.jobId?.numberOfPositions || 0,
          jobType: entry.jobId?.jobType || "",
          isExpanded: true,
          candidates: (entry.candidateIdArray || []).map((c) => ({
            id: (c as any)._id || (c as any).candidateId?._id || "",
            name: (c as any).candidateId?.name || "",
            source: (c as any).sourcing?.source || "",
            currentStage: (c as any).currentStage || (c as any).status || "Sourcing",
            avatar: undefined,
            experience: (c as any).candidateId?.experience,
            currentSalary: (c as any).candidateId?.currentSalary,
            currentSalaryCurrency: (c as any).candidateId?.currentSalaryCurrency,
            expectedSalary: (c as any).candidateId?.expectedSalary,
            expectedSalaryCurrency: (c as any).candidateId?.expectedSalaryCurrency,
            currentJobTitle: (c as any).candidateId?.currentJobTitle,
            previousCompanyName: (c as any).candidateId?.previousCompanyName,
            currentCompanyName: (c as any).candidateId?.currentCompanyName,
            subStatus: (c as any).status,
          })) as Candidate[],
          pipelineStatus: entry.status,
          priority: entry.priority,
          notes: entry.notes,
          assignedDate: entry.assignedDate,
          totalCandidates: entry.totalCandidates,
          activeCandidates: entry.activeCandidates,
          completedCandidates: entry.completedCandidates,
          droppedCandidates: entry.droppedCandidates,
          // numberOfCandidates not available on PipelineEntryDetail
          recruiterName: entry.recruiterId?.name,
          recruiterEmail: entry.recruiterId?.email,
        };
        if (isMounted) setJob(mappedJob);
      } catch (e: any) {
        if (isMounted) setError(e.message || "Failed to load pipeline");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (id) load();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-4">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="text-red-600">{error || "Job not found"}</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm border-gray-200">
        <CardHeader className="pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{job.clientName}</span>
                </div>
                <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                    <span>{job.salaryRange}</span>
                  </div>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700">
                    {job.jobType}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>{job.totalCandidates || job.candidates.length} candidates</span>
                  </div>
                  {job.pipelineStatus && (
                    <Badge 
                      variant="outline" 
                      className={`${
                        job.pipelineStatus === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                        job.pipelineStatus === 'Closed' ? 'bg-red-100 text-red-700 border-red-200' :
                        job.pipelineStatus === 'On Hold' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {job.pipelineStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="border-2 border-blue-200 rounded-md p-2 bg-gray-50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[44px]"></TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Current Position</TableHead>
                  <TableHead className="w-[200px]">Stage</TableHead>
                  <TableHead className="w-[90px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {job.candidates.map((candidate) => (
                  <TableRow key={candidate.id} className="bg-white">
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback className="text-xs bg-gray-200">
                          {candidate.name ? candidate.name.split(' ').map(n => n[0]).join('') : 'NA'}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-[220px]">
                      {candidate.name || 'Unknown Candidate'}
                    </TableCell>
                    <TableCell className="truncate max-w-[260px] text-gray-700">
                      {candidate.currentJobTitle || 'Position not specified'}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={candidate.currentStage}
                        onValueChange={(value) => {
                          // Future: integrate update via API
                          console.log('Change stage', candidate.id, value);
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pipelineStages.map((stage) => (
                            <SelectItem key={stage} value={stage} className="text-xs">
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            title="More options"
                          >
                            <EllipsisVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View & Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Briefcase className="h-4 w-4 mr-2" />
                            View Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Trash2 className="size-4 mr-2 text-red-500" />
                            Delete Candidate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
