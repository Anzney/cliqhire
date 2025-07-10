"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Upload } from "lucide-react"
import { useRef, useState } from "react"

interface AttachmentsContentProps {
  jobId: string;
}

export function AttachmentsContent({ jobId }: AttachmentsContentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    // Handle file upload logic here
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Handle file upload logic here
  }

  return (
    <div className="p-4">
      {/* Upload Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upload Files</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleUploadClick}
          >
            <Plus className="h-4 w-4" />
            Upload Files
          </Button>
        </div>

        {/* Drag and Drop Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <div className="mb-4">
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag and drop files here, or click to select files
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum file size: 10MB
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <div className="w-48 h-48 mx-auto mb-6">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-blue-500"
          >
            {/* Folder background */}
            <path 
              d="M40 60 L80 60 L90 50 L160 50 L160 150 L40 150 Z" 
              fill="currentColor" 
              fillOpacity="0.1"
            />
            {/* Folder front */}
            <path 
              d="M35 70 L165 70 L155 155 L45 155 Z" 
              fill="currentColor" 
              fillOpacity="0.2"
            />
            {/* Upload arrow */}
            <path 
              d="M90 100 L110 100 L110 130 L90 130 Z" 
              fill="currentColor"
            />
            <path 
              d="M85 115 L100 100 L115 115" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No attachments uploaded yet</h3>
        <p className="text-muted-foreground mb-6">
          Upload files by dragging & dropping them or clicking the upload button above.
        </p>
        <Button 
          variant="link" 
          className="text-blue-500"
        >
          Learn more about attachments
        </Button>
      </div>
    </div>
  )
}