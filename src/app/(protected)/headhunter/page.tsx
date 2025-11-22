"use client"
import { useEffect, useMemo, useState } from "react";
import { HeadhunterPipeline } from "@/components/Headhunter-Pipeline/headhunter-pipeline";
import Dashboardheader from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { HeadhunterCandidatesTable } from "@/components/Headhunter-Pipeline/headhunter-candidates-table";
import { headhunterCandidatesService } from "@/services/headhunterCandidatesService";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { DeleteConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { Job } from "@/components/Recruiter-Pipeline/dummy-data";

const HeadhunterPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [activeTab, setActiveTab] = useState("Candidates");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data: rawData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["headhunterCandidates"],
    queryFn: () => headhunterCandidatesService.getCandidates(),
  });
  const candidates = useMemo(() => {
    const list = Array.isArray(rawData) ? rawData : [];
    return list.map((item: any) => ({
      id: item._id || item.id || "",
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || item.otherPhone || "",
      status: item.status || "Pending",
      resumeUrl: item.resume || item.resumeUrl || undefined,
    }));
  }, [rawData]);
  const [pdfViewer, setPdfViewer] = useState<{ isOpen: boolean; pdfUrl: string | null; candidateName: string | null }>({
    isOpen: false,
    pdfUrl: null,
    candidateName: null,
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();
  const headhunterId = (user as any)?.profile?._id || "";

  useEffect(() => {
    setSelectedRows(new Set());
  }, [rawData]);
  const handleViewResume = (candidate: any) => {
    if (!candidate?.resumeUrl) return;
    setPdfViewer({ isOpen: true, pdfUrl: candidate.resumeUrl, candidateName: candidate.name || null });
  };
  const handleClosePdfViewer = () => {
    setPdfViewer({ isOpen: false, pdfUrl: null, candidateName: null });
  };
  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (selectedRows.size === candidates.length) {
      setSelectedRows(new Set());
    } else {
      const all = new Set<string>();
      candidates.forEach(c => all.add(c.id));
      setSelectedRows(all);
    }
  };
  const handleDeleteSelected = () => {
    if (selectedRows.size === 0) return;
    setShowDeleteDialog(true);
  };

  const { data: jobsRaw, isLoading: jobsLoading, isFetching: jobsFetching, refetch: refetchJobs } = useQuery({
    queryKey: ["headhunterJobsSummary", headhunterId],
    queryFn: () => headhunterCandidatesService.getJobsSummary(headhunterId),
    enabled: !!headhunterId && activeTab === "Jobs",
  });

  useEffect(() => {
    if (activeTab === "Jobs" && headhunterId) {
      refetchJobs();
    }
  }, [activeTab, headhunterId, refetchJobs]);

  const jobs: Job[] = useMemo(() => {
    const list = Array.isArray(jobsRaw) ? jobsRaw : [];
    return list.map((j: any, idx: number) => ({
      id: j.jobId || "",
      title: j.jobTitle || "",
      clientName: j.clientName || "",
      location: j.location || "",
      salaryRange: `${j?.salaryRange?.min ?? ""} - ${j?.salaryRange?.max ?? ""} ${j?.salaryRange?.currency ?? ""}`.trim(),
      headcount: 1,
      jobType: (j.jobType || "").replace(/-/g, " "),
      isExpanded: false,
      candidates: [],
      jobId: {
        jobTitle: j.jobTitle,
        location: j.location,
        stage: "Active",
      },
    }));
  }, [jobsRaw]);
  const confirmDeleteSelected = async () => {
    if (selectedRows.size === 0) return;
    setIsDeleting(true);
    try {
      await Promise.all(Array.from(selectedRows).map(id => headhunterCandidatesService.deleteCandidate(id)));
      await refetch();
      toast.success(`${selectedRows.size} candidate(s) deleted successfully`);
      setSelectedRows(new Set());
    } catch (error) {
      toast.error('Failed to delete selected candidates');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="">
        <Dashboardheader
          setOpen={setCreateModalOpen}
          setFilterOpen={setFilterOpen}
          initialLoading={isLoading || isFetching || isRefetching}
          heading="Clients"
          buttonText="Create Candiadte"
          showCreateButton={true}
          selectedCount={selectedRows.size}
          onDelete={handleDeleteSelected}
          onRefresh={() => {
            refetch();
          }}
        />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full border-t">
          <TabsList className="flex border-b w-full rounded-none justify-start h-12 bg-transparent p-0">
            <TabsTrigger
              value="Candidates"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12 px-6"
            >
              Candidates
            </TabsTrigger>
            <TabsTrigger
              value="Jobs"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12 px-6"
            >
              Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Candidates" className="">
            <HeadhunterCandidatesTable
              candidates={candidates}
              onViewResume={handleViewResume}
              selectedIds={selectedRows}
              onToggleSelect={toggleRowSelection}
              onToggleSelectAll={toggleSelectAll}
            />
          </TabsContent>

          <TabsContent value="Jobs" className="pt-4">
            <HeadhunterPipeline jobs={jobs} />
          </TabsContent>
        </Tabs>

        <CreateCandidateModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          isHeadhunterCreate={true}
          onCandidateCreated={() => {
            setCreateModalOpen(false);
            refetch();
          }}
        />

        <PDFViewer
          isOpen={pdfViewer.isOpen}
          onClose={handleClosePdfViewer}
          pdfUrl={pdfViewer.pdfUrl || undefined}
          candidateName={pdfViewer.candidateName || undefined}
        />

        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDeleteSelected}
          title="Delete Candidates"
          description={`Are you sure you want to delete ${selectedRows.size} selected candidate(s)? This action cannot be undone.`}
          confirmText={isDeleting ? 'Deleting...' : 'Delete'}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default HeadhunterPage;
