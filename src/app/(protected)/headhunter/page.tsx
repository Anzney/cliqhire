"use client";

import React from "react";
import { HeadhunterPipeline } from "@/components/Headhunter-Pipeline/headhunter-pipeline";

const HeadhunterPage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4">
        <HeadhunterPipeline />
      </div>
    </div>
  );
};

export default HeadhunterPage;
