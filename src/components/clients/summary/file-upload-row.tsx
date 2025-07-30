"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadIcon, Eye, Download as DownloadIcon } from "lucide-react";

interface FileUploadRowProps {
  id: string;
  label: string;
  onFileSelect: (file: File | null) => void | Promise<void>;
  docUrl?: string;
  currentFileName?: string;
  onPreview?: () => void;
  onDownload?: () => void;
  className?: string;
}

export const FileUploadRow = ({ id, label, onFileSelect, docUrl, currentFileName, onPreview, onDownload, className }: FileUploadRowProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className={`flex items-center justify-between py-2 ${className || ''}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-10">
        <span className="text-sm text-gray-800 truncate" title={currentFileName || "No Details"}>
          {currentFileName || <span className="text-gray-400">No Details</span>}
        </span>
        <div className="flex items-center gap-4">
          {onPreview && (
            <Button variant="ghost" className="p-2 h-auto" onClick={onPreview} title="Preview">
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onDownload && (
            <Button variant="ghost" className="p-2 h-auto" onClick={onDownload} title="Download">
              <DownloadIcon className="h-4 w-4" />
            </Button>
          )}
          <Button asChild variant="ghost" className="p-2 h-auto" title="Upload">
            <label htmlFor={id} className="cursor-pointer">
              <UploadIcon className="h-4 w-4" />
            </label>
          </Button>
          <Input
            id={id}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};