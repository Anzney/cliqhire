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

  const fileName = selectedFile
    ? selectedFile.name
    : currentFileName || (docUrl ? docUrl.split(/[\\/]/).pop() : "");

  return (
    <div className={`grid grid-cols-2 items-center gap-2 py-2 ${className || ''}`}>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-800 truncate" title={fileName || "No Details"}>
          {fileName || <span className="text-gray-400">No Details</span>}
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
