"use client";

import React, { useRef, useState } from "react";
import { X, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios-config";
import { initializeAuth } from "@/lib/axios-config";

interface UploadResumeProps {
  open: boolean;
  onUploaded?: (url: string) => void;
  onClose?: () => void; // for dialog close (X)
  goBack: () => void; // for Cancel button
  candidateId?: string; // Add candidateId prop
}

export const UploadResume: React.FC<UploadResumeProps> = ({ 
  open, 
  onUploaded, 
  onClose, 
  goBack, 
  candidateId 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }
    if (!candidateId) {
      setError("Candidate ID is required.");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    try {
      // Ensure authentication is initialized before making the API call
      await initializeAuth();
      
      const formData = new FormData();
      formData.append("resume", selectedFile);
      
      // Use the configured axios instance with authentication
      const response = await api.patch(`/api/candidates/${candidateId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Extract the resume URL from the response
      const resumeUrl = response.data.data?.resume || response.data.resume;
      if (onUploaded && resumeUrl) {
        onUploaded(resumeUrl);
      }
      setSelectedFile(null);
      if (onClose) onClose();
    } catch (err: any) {
      console.error('Error uploading resume:', err);
      
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        setError(err.response?.data?.message || err.message || "Failed to upload");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div
        className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
        style={{ height: "50vh", minHeight: 220 }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-disabled={isUploading}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.rtf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        {selectedFile ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-2 w-full justify-center">
              <CloudUpload className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-blue-700 truncate max-w-[180px]">{selectedFile.name}</span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="ml-2 p-1 rounded hover:bg-red-100 text-red-600"
                aria-label="Remove file"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <CloudUpload className="w-8 h-8 text-blue-400 mx-auto" />
            <span className="text-gray-500">
              Drag & drop your resume here, or <span className="text-blue-600 underline">browse</span> (PDF, DOC, DOCX, RTF)
            </span>
          </div>
        )}
        {error && <div className="text-red-500 text-sm w-full text-center">{error}</div>}
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" onClick={goBack} disabled={isUploading}>Cancel</Button>
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? "Uploading..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};
