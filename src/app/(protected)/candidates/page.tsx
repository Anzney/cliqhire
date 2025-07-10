"use client";
import { fetchCandidatesFromAPI, Candidate } from "@/data/candidatesData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Users, Folder, Search, Route, Router } from "lucide-react";
import { CandidatesEmptyState } from "./empty-states";
import { CreateCandidate } from "@/components/candidates/create-candidate";
// import Link from 'next/link'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateFolder } from "@/components/candidates/create-folder";
import { AdvanceSearch } from "@/components/candidates/AdvSearch";
import Dashboardheader from "@/components/dashboard-header";
import Tableheader from "@/components/table-header";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";

const columsArr = [
  "Candidate Name",
  "Candidate Email",
  "Candidate Phone",
  "Location",
  "Experience",
  "Skills",
  "Resume",
  "Status",
  "Actions",
];

export default function CandidatesPage() {
  const router = useRouter();
  // Add candidates state
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setInitialLoading(true);
    fetchCandidatesFromAPI().then(data => {
      setCandidates(data);
      setInitialLoading(false);
    });
  }, []);
  // const [selected, setSelected] = useState("candidate");
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  // const showSelectedOption = () => {
  //   switch(selected) {
  //     case 'candidate':
  //       return  <CreateCandidate />;
  //     case 'Folder':
  //       return  <CreateFolder />;
  //     case 'advanced':
  //       return  <AdvanceSearch />;

  //   }
  // }

  return (
    <div className="flex flex-col h-full">
      <CreateCandidateModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCandidateCreated={(candidate) => setCandidates((prev) => [candidate, ...prev])}
      />

      {/* Header */}

      <Dashboardheader
        setOpen={setOpen}
        setFilterOpen={() => {}}
        initialLoading={false}
        heading="Candidates"
        buttonText="Create Candidate"
      />

      {/* <CreateCandidate /> */}

      {/* Create Candidate Modal */}

      {/* Create Folder Modal */}
      {/* <CreateFolder /> */}

      {/* Advanced Search Modal */}
      {/* <AdvanceSearch
     /> */}

      {/* Tabs */}
      {/* <div className="border-b px-4">
        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="w-fit border-b-0">
            <TabsTrigger value="candidates" className="gap-2" onClick={()=>{setSelected('candidate')}}>
              <Users className="h-4 w-4" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="folder" className="gap-2" onClick={()=>{setSelected('Folder')}}>
              <Folder className="h-4 w-4"  />
              Folders
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2" onClick={()=>{setSelected('advanced')}}>
              <Search className="h-4 w-4" />
              Advanced Search
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div> */}

      <div className="flex-1">
        {candidates.length === 0 ? (
          <CandidatesEmptyState />
        ) : (
          <Table>
            <TableHeader>
              <Tableheader tableHeadArr={columsArr} />
            </TableHeader>
            <TableBody>
              {initialLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
                    <div className="py-24">
                      <div className="text-center">Loading candidates...</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-[calc(100vh-240px)] text-center">
                    <div className="py-24">
                      <div className="text-center">No candidates found</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate, idx) => (
                  <TableRow
                    key={candidate.email + idx}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      router.push(`/candidates/${encodeURIComponent(candidate.email)}`)
                    }
                  >
                    <TableCell className="text-sm font-medium">{candidate.name}</TableCell>
                    <TableCell className="text-sm">{candidate.email}</TableCell>
                    <TableCell className="text-sm">{candidate.phone}</TableCell>
                    <TableCell className="text-sm">{candidate.location}</TableCell>
                    <TableCell className="text-sm">{candidate.experience}</TableCell>
                    <TableCell className="text-sm">{candidate.skills}</TableCell>
                    <TableCell className="text-sm">{candidate.resume}</TableCell>
                    <TableCell className="text-sm">{candidate.status}</TableCell>
                    {/* <TableCell className="text-sm">{candidate.actions}</TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        {/* Pagination Controls */}
        {/* <div className="flex items-center justify-between p-4 border-t">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {clients.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalClients)} of {totalClients} clients
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Show</span>
                        <select 
                          className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm" 
                          value={pageSize}
                          onChange={(e) => {
                            const newSize = parseInt(e.target.value);
                            setPageSize(newSize);
                            // Reset to page 1 when changing page size
                            setCurrentPage(1);
                            // Fetch clients with the new page size
                            fetchClients(1, newSize);
                          }}
                            // Fetch clients with the new page size
                            fetchClients(1, newSize);
                          }}
                        >
                          <option value="1000">All</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value="200">200</option>
                        </select>
                        <span className="text-sm">per page</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || initialLoading}
                      >
                        Previous
                      </Button>
                      <div className="text-sm">
                        Page {currentPage} of {totalPages}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || initialLoading}
                      >
                        Next
                      </Button>
                    </div>
                  </div> */}
      </div>

      {/* Content */}
      {/* {showSelectedOption()} */}
    </div>
  );
}
