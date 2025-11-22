"use client";
import { useState } from "react";
import { HeadhunterPipeline } from "@/components/Headhunter-Pipeline/headhunter-pipeline";
import Dashboardheader from "@/components/dashboard-header";

const HeadhunterPage = () => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4">
        <Dashboardheader
                  setOpen={setOpen}
                  setFilterOpen={setFilterOpen}
                  initialLoading={isLoading || isRefetching}
                  heading="Clients"
                  buttonText="Create Candiadte"
                  showCreateButton={true}
                />
        <HeadhunterPipeline />
      </div>
    </div>
  );
};

export default HeadhunterPage;
