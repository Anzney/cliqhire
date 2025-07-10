"use client";

import { X, FileText, Upload, Files, Table } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import CreateCandidateform from "./create-candidate-form";
interface CreateCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

function OptionCard({ icon, title, onClick }: OptionCardProps) {
  return (
    <Button
      variant="outline"
      className="h-auto flex flex-col items-center gap-6 p-8 hover:border-blue-600 hover:bg-blue-50"
      onClick={onClick}
    >
      <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-lg">
        {icon}
      </div>
      <span className="text-lg font-semibold">{title}</span>
    </Button>
  );
}

interface CreateCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateCreated?: (candidate: any) => void;
}

export function CreateCandidateModal({
  isOpen,
  onClose,
  onCandidateCreated,
}: CreateCandidateModalProps) {
  const [showForm, setShowForm] = useState(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setShowForm(false);
        onClose();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Create Candidate</DialogTitle>
          </div>
        </DialogHeader>
        {showForm ? (
          <div>
            <CreateCandidateform
              onCandidateCreated={(candidate: any) => {
                if (onCandidateCreated) onCandidateCreated(candidate);
                setShowForm(false);
                onClose();
              }}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <OptionCard
                icon={<FileText className="w-8 h-8 text-blue-600" />}
                title="Complete a Form"
                onClick={() => setShowForm(true)}
              />
              <OptionCard
                icon={<Upload className="w-8 h-8 text-blue-600" />}
                title="Upload a Resume"
                onClick={() => {
                  /* You can implement resume upload logic here */
                }}
              />
            </div>
            <div className="text-center text-gray-600 pt-4">
              Or{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                install a chrome extension
              </Link>{" "}
              to source candidates from LinkedIn.
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
