"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type SubmissionSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
};

export function SubmissionSuccessDialog({
  open,
  onOpenChange,
  title = "Congratulations!",
  description = "Your form has been submitted successfully! Thank you for reaching out. Our team will review your details and will contact you shortly with next steps.",
  confirmText = "Ok",
}: SubmissionSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader className="items-center">
          <div className="mt-2 flex items-center justify-center">
            {/* Success Illustration: solid green circle with white check */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 96 96"
              className="h-24 w-24"
              aria-hidden="true"
            >
              <circle cx="48" cy="48" r="46" fill="#22c55e" />
              <path
                d="M28 50l12 12 28-28"
                fill="none"
                stroke="#ffffff"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <DialogTitle className="mt-4 text-center text-3xl font-extrabold tracking-tight">{title}</DialogTitle>
          <DialogDescription className="mt-2 text-center text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 items-center justify-center">
          <Button
            className="w-full sm:w-auto rounded-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 font-medium"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
