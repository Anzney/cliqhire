"use client";
import { useState } from "react";
import { HeadhunterPipeline } from "@/components/Headhunter-Pipeline/headhunter-pipeline";
import Dashboardheader from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HeadhunterPage = () => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [activeTab, setActiveTab] = useState("Candidates");
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="">
        <Dashboardheader
                  setOpen={setOpen}
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

          <TabsContent value="Candidates" className="pt-4">
            <div className="text-sm text-muted-foreground">Candidates tab content</div>
          </TabsContent>

          <TabsContent value="Jobs" className="pt-4">
            <HeadhunterPipeline />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HeadhunterPage;
