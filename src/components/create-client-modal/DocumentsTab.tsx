import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Eye, Download } from "lucide-react";

interface DocumentsTabProps {
  uploadedFiles: { [key: string]: File | null };
  handleFileChange: (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePreview: (file: File | string | null) => void;
  handleDownload: (file: File | null) => void;
}

export function DocumentsTab({
  uploadedFiles,
  handleFileChange,
  handlePreview,
  handleDownload,
}: DocumentsTabProps) {
  
  const documentFields = [
    { key: "crCopy", label: "CR Copy" },
    { key: "vatCopy", label: "VAT Copy" },
    { key: "gstTinDocument", label: "GST/TIN Document" },
    { key: "profileImage", label: "Profile Image" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 pt-4 pb-2">
      {documentFields.map(({ key, label }) => (
        <div key={key} className="space-y-2">
          <Label>{label}</Label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-stretch">
            <div
              className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1 w-full"
              onClick={() => document.getElementById(`${key}Input`)?.click()}
            >
              <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
            </div>
            <input
              id={`${key}Input`}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange(key as keyof typeof uploadedFiles)}
            />
            <div className="flex flex-col space-y-2 ">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2 gap-1"
                onClick={() => handlePreview(uploadedFiles[key])}
                disabled={!uploadedFiles[key]}
              >
                <Eye className="h-3 w-3" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={() => handleDownload(uploadedFiles[key])}
                disabled={!uploadedFiles[key]}
              >
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
          {uploadedFiles[key] && (
            <p className="text-xs text-muted-foreground truncate">
              Selected file: {uploadedFiles[key]!.name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
