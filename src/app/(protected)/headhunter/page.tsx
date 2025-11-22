"use client"
import { useEffect, useState } from "react";
import { HeadhunterPipeline } from "@/components/Headhunter-Pipeline/headhunter-pipeline";
import Dashboardheader from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { HeadhunterCandidatesTable } from "@/components/Headhunter-Pipeline/headhunter-candidates-table";
import { headhunterCandidatesService } from "@/services/headhunterCandidatesService";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { DeleteConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";

const HeadhunterPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [activeTab, setActiveTab] = useState("Candidates");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [pdfViewer, setPdfViewer] = useState<{ isOpen: boolean; pdfUrl: string | null; candidateName: string | null }>({
    isOpen: false,
    pdfUrl: null,
    candidateName: null,
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        const list = await headhunterCandidatesService.getCandidates();
        if (!mounted) return;
        const mapped = (Array.isArray(list) ? list : []).map((item: any) => ({
          id: item._id || item.id || "",
          name: item.name || "",
          email: item.email || "",
          phone: item.phone || item.otherPhone || "",
          status: item.status || "Pending",
          resumeUrl: item.resume || item.resumeUrl || undefined,
        }));
        setCandidates(mapped);
        setSelectedRows(new Set());
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchCandidates();
    return () => {
      mounted = false;
    };
  }, []);
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
  const confirmDeleteSelected = async () => {
    if (selectedRows.size === 0) return;
    setIsDeleting(true);
    try {
      await Promise.all(Array.from(selectedRows).map(id => headhunterCandidatesService.deleteCandidate(id)));
      setCandidates(prev => prev.filter(c => !selectedRows.has(c.id)));
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
          initialLoading={isLoading || isRefetching}
          heading="Clients"
          buttonText="Create Candiadte"
          showCreateButton={true}
          selectedCount={selectedRows.size}
          onDelete={handleDeleteSelected}
          onRefresh={() => {
            // re-fetch
            (async () => {
              await headhunterCandidatesService.getCandidates().then(list => {
                const mapped = (Array.isArray(list) ? list : []).map((item: any) => ({
                  id: item._id || item.id || "",
                  name: item.name || "",
                  email: item.email || "",
                  phone: item.phone || item.otherPhone || "",
                  status: item.status || "Pending",
                  resumeUrl: item.resume || item.resumeUrl || undefined,
                }));
                setCandidates(mapped);
                setSelectedRows(new Set());
              });
            })();
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
            <HeadhunterPipeline />
          </TabsContent>
        </Tabs>

        <CreateCandidateModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          isHeadhunterCreate={true}
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
