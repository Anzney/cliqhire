import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { HeadhunterCandidate } from "./headhunter-candidates-table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CandidateDetailsDialogProps {
    candidate: HeadhunterCandidate | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CandidateDetailsDialog: React.FC<CandidateDetailsDialogProps> = ({
    candidate,
    open,
    onOpenChange,
}) => {
    if (!candidate) return null;

    const DetailItem = ({ label, value, isLink = false, fullWidth = false }: { label: string; value: string | undefined | React.ReactNode; isLink?: boolean; fullWidth?: boolean }) => (
        <div className={`flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50 ${fullWidth ? 'col-span-2' : 'col-span-1'}`}>
            <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
                {isLink && typeof value === 'string' ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline truncate">
                        View Resume
                    </a>
                ) : (
                    <span className="text-sm font-medium text-gray-900 truncate block" title={typeof value === 'string' ? value : undefined}>
                        {value || "N/A"}
                    </span>
                )}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0 ml-2">
                <Pencil className="h-3 w-3" />
            </Button>
        </div>
    );

    const formatDate = (dateString?: string) => {
        if (!dateString) return undefined;
        return new Date(dateString).toLocaleDateString();
    };

    const formatArray = (arr?: string[]) => {
        if (!arr || arr.length === 0) return undefined;
        return arr.join(", ");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] bg-white p-0 overflow-hidden gap-0 max-h-[85vh] flex flex-col">
                <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                    <DialogTitle className="text-lg font-semibold text-gray-900">Candidate Details</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[60vh]">
                    <div className="p-6 grid grid-cols-2 gap-4">
                        <DetailItem label="Name" value={candidate.name} />
                        <DetailItem label="Email" value={candidate.email} />

                        <DetailItem label="Phone" value={candidate.phone} />
                        <DetailItem label="Status" value={candidate.status} />

                        <DetailItem label="Location" value={candidate.location} />
                        <DetailItem label="Gender" value={candidate.gender} />

                        <DetailItem label="Date of Birth" value={formatDate(candidate.dateOfBirth)} />
                        <DetailItem label="Willing to Relocate" value={candidate.willingToRelocate} />

                        <DetailItem label="Resume" value={candidate.resumeUrl} isLink={true} />
                        <div className="col-span-1"></div>

                        <DetailItem label="Soft Skills" value={formatArray(candidate.softSkill)} fullWidth />
                        <DetailItem label="Technical Skills" value={formatArray(candidate.technicalSkill)} fullWidth />

                        <DetailItem label="Description" value={candidate.description} fullWidth />
                    </div>
                </ScrollArea>

                <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100 flex-shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
