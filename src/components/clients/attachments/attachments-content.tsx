"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { UploadAttachment } from "./uploadAttachment";
import { AttachmentList } from "./attachmentList";

export interface BackendAttachment {
  _id: string;
  fileName: string;
  uploadedAt: string;
  url: string;
}

interface AttachmentsContentProps {
  clientId: string;
}

const API_BASE_URL = "https://aems-backend.onrender.com/api/attachments";

export function AttachmentsContent({ clientId }: AttachmentsContentProps) {
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [attachments, setAttachments] = useState<BackendAttachment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch attachments from backend
  const fetchAttachments = async () => {
    if (!clientId) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}?client_id=${clientId}`);
      setAttachments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete selected attachments
  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map(id => axios.delete(`${API_BASE_URL}/${id}`))
      );
      fetchAttachments();
    } catch (error) {
      console.error("Error deleting attachments:", error);
    }
  };

  // Upload a file
  const handleUpload = async (file: File) => {
    if (!clientId) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("client_id", clientId);

      await axios.post(API_BASE_URL, formData);
      // Always refresh list after upload to ensure new file appears
      await fetchAttachments();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Delete a file
  const handleDelete = async (attachmentId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${attachmentId}`);
      setAttachments((prev) =>
        prev.filter((item) => item._id !== attachmentId)
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    fetchAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Upload File</h3>
        <Button
          onClick={() => setShowUploadBox(true)}
          disabled={showUploadBox}
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      <UploadAttachment
        show={showUploadBox}
        setShow={setShowUploadBox}
        onUpload={handleUpload}
        attachments={attachments}
      />

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading attachments...</div>
      ) : attachments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="w-48 h-48 mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full text-blue-500">
              <rect x="50" y="80" width="100" height="60" rx="10" fill="currentColor" opacity="0.1" />
              <rect x="70" y="100" width="60" height="20" rx="4" fill="currentColor" opacity="0.2" />
              <circle cx="100" cy="120" r="8" fill="currentColor" opacity="0.2" />
              <rect x="120" y="90" width="20" height="8" rx="2" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No attachments yet</h2>
          <p className="text-gray-500 mb-4">
            Add your first attachment to share files with your team.
          </p>
        </div>
      ) : (
        <AttachmentList
          attachments={attachments}
          onDelete={handleDelete}
          onDeleteSelected={handleBulkDelete}
        />
      )}
    </div>
  );
}
