"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";

export interface ExportFilterParams {
    year?: number;
    month?: number;
}

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    onExport: (params?: ExportFilterParams) => Promise<Blob | any>;
    isExporting?: boolean;
    filename?: string;
}

export function ExportDialog({
    isOpen,
    onClose,
    title = "Export Data",
    description = "Choose what data you would like to export.",
    onExport,
    filename = "export_data"
}: ExportDialogProps) {
    const [filterType, setFilterType] = useState<"all" | "custom">("all");
    const [year, setYear] = useState<string>("");
    const [month, setMonth] = useState<string>("");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (!isOpen) {
            if (downloadUrl) {
                window.URL.revokeObjectURL(downloadUrl);
            }
            setDownloadUrl(null);
            setFilterType("all");
            setYear("");
            setMonth("");
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleExportClick = async () => {
        try {
            setIsLoading(true);
            const params = filterType === "custom" ? {
                year: year ? parseInt(year) : undefined,
                month: month ? parseInt(month) : undefined
            } : undefined;

            const data = await onExport(params);

            // Create blob URL
            const blob = new Blob([data]);
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);

        } catch (error) {
            console.error("Export failed in dialog:", error);
            // specific error handling could be done here or in the parent
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadClick = () => {
        if (!downloadUrl) return;

        const link = document.createElement('a');
        link.href = downloadUrl;

        const date = new Date().toISOString().slice(0, 10);
        link.setAttribute('download', `${filename}_${date}.xlsx`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Optional: Close dialog after download
        // onClose();
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <RadioGroup value={filterType} onValueChange={(v) => {
                        setFilterType(v as "all" | "custom");
                        // Reset download state if filter changes to encourage fresh export?
                        // Or keep it? Let's reset to avoid confusion.
                        if (downloadUrl) {
                            window.URL.revokeObjectURL(downloadUrl);
                            setDownloadUrl(null);
                        }
                    }}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="r-all" />
                            <Label htmlFor="r-all">Select All Data</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="r-custom" />
                            <Label htmlFor="r-custom">Apply Custom Filters (Year & Month)</Label>
                        </div>
                    </RadioGroup>

                    {filterType === "custom" && (
                        <div className="grid grid-cols-2 gap-4 ml-6 animate-in slide-in-from-top-2 fade-in-0">
                            <div className="space-y-2">
                                <Label htmlFor="year-select">Year</Label>
                                <Select
                                    value={year}
                                    onValueChange={(v) => {
                                        setYear(v);
                                        if (downloadUrl) setDownloadUrl(null);
                                    }}
                                >
                                    <SelectTrigger id="year-select">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((y) => (
                                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="month-select">Month</Label>
                                <Select
                                    value={month}
                                    onValueChange={(v) => {
                                        setMonth(v);
                                        if (downloadUrl) setDownloadUrl(null);
                                    }}
                                >
                                    <SelectTrigger id="month-select">
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    {downloadUrl ? (
                        <Button
                            onClick={handleDownloadClick}
                            className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download Data
                        </Button>
                    ) : (
                        <Button
                            onClick={handleExportClick}
                            disabled={isLoading || (filterType === 'custom' && (!year || !month))}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Fetching Data...
                                </>
                            ) : "Export"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
