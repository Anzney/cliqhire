"use client"
import { useEffect, useState } from "react";
import { HeadhunterPipeline } from "@/components/Headhunter-Pipeline/headhunter-pipeline";
import Dashboardheader from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { HeadhunterCandidatesTable } from "@/components/Headhunter-Pipeline/headhunter-candidates-table";
import { headhunterCandidatesService } from "@/services/headhunterCandidatesService";
import { PDFViewer } from "@/components/ui/pdf-viewer";

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
            <HeadhunterCandidatesTable candidates={candidates} onViewResume={handleViewResume} />
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
      </div>
    </div>
  );
};

export default HeadhunterPage;
