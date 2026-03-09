import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { pipelineStages, mapUIStageToBackendStage } from "./dummy-data";
import { exportCandidatesToExcel } from "@/services/recruitmentPipelineService";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

interface ExportCandidatesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    pipelineId: string;
    jobTitle: string;
}

export function ExportCandidatesDialog({
    isOpen,
    onClose,
    pipelineId,
    jobTitle,
}: ExportCandidatesDialogProps) {
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const isAllSelected = selectedStages.length === pipelineStages.length;

    useEffect(() => {
        return () => {
            if (downloadUrl) {
                window.URL.revokeObjectURL(downloadUrl);
            }
        };
    }, [downloadUrl]);

    const handleClose = () => {
        if (downloadUrl) {
            window.URL.revokeObjectURL(downloadUrl);
            setDownloadUrl(null);
        }
        setIsExporting(false);
        setSelectedStages([]);
        onClose();
    };

    const handleToggleAll = (checked: boolean) => {
        if (checked) {
            setSelectedStages([...pipelineStages]);
        } else {
            setSelectedStages([]);
        }
        if (downloadUrl) {
            window.URL.revokeObjectURL(downloadUrl);
            setDownloadUrl(null);
        }
    };

    const handleToggleStage = (stage: string, checked: boolean) => {
        if (checked) {
            setSelectedStages((prev) => [...prev, stage]);
        } else {
            setSelectedStages((prev) => prev.filter((s) => s !== stage));
        }
        if (downloadUrl) {
            window.URL.revokeObjectURL(downloadUrl);
            setDownloadUrl(null);
        }
    };

    const handleExport = async () => {
        if (selectedStages.length === 0) {
            toast.warning("Please select at least one stage to export.");
            return;
        }

        setIsExporting(true);
        setDownloadUrl(null);

        try {
            const backendStages = isAllSelected
                ? []
                : selectedStages.map(mapUIStageToBackendStage);

            const blob = await exportCandidatesToExcel(pipelineId, backendStages);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([blob]));
            setDownloadUrl(url);

            toast.success("Export ready for download!");
        } catch (error: any) {
            console.error("Export failed:", error);
            toast.error("Failed to export candidates. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadFile = () => {
        if (!downloadUrl) return;

        const link = document.createElement("a");
        link.href = downloadUrl;

        // Clean up text for filename
        const cleanJobTitle = jobTitle.replace(/[^a-zA-Z0-9_-]/g, "_");
        link.setAttribute("download", `Candidate_Details_${cleanJobTitle}.xlsx`);

        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode?.removeChild(link);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export Candidates</DialogTitle>
                    <DialogDescription>
                        Select the pipeline stages you want to export candidates from.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="flex items-center space-x-2 border-b pb-3">
                        <Checkbox
                            id="stage-all"
                            checked={isAllSelected}
                            onCheckedChange={(checked) => handleToggleAll(checked as boolean)}
                        />
                        <Label htmlFor="stage-all" className="font-semibold cursor-pointer">
                            All Stages
                        </Label>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pl-2">
                        {pipelineStages.map((stage) => (
                            <div key={stage} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`stage-${stage}`}
                                    checked={selectedStages.includes(stage)}
                                    onCheckedChange={(checked) => handleToggleStage(stage, checked as boolean)}
                                />
                                <Label htmlFor={`stage-${stage}`} className="font-medium cursor-pointer text-sm">
                                    {stage}
                                </Label>
                            </div>
                        ))}
                    </div>

                    {/* Green Progress Indicator */}
                    {isExporting && (
                        <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-2 rounded-md">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm font-medium">Preparing export data...</span>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex items-center justify-end gap-2 sm:gap-0 mt-4">
                    <Button variant="outline" onClick={handleClose} disabled={isExporting}>
                        Cancel
                    </Button>

                    {!downloadUrl ? (
                        <Button
                            onClick={handleExport}
                            disabled={isExporting || selectedStages.length === 0}
                            className="min-w-[100px]"
                        >
                            Export
                        </Button>
                    ) : (
                        <Button
                            onClick={handleDownloadFile}
                            className="min-w-[100px] bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
