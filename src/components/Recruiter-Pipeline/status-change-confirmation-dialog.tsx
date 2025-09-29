"use client";

import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { getStageColor } from "./dummy-data";

interface StatusChangeConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidateName: string;
  currentStage: string;
  newStage: string;
}

export function StatusChangeConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  currentStage,
  newStage,
}: StatusChangeConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Confirm Status Change
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to move candidate{" "}
            <span className="font-medium text-gray-900">{candidateName}</span>{" "}
            to the next stage?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex items-center justify-center space-x-4 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Current Stage</p>
            <Badge variant="outline" className={`${getStageColor(currentStage)} border`}>
              {currentStage}
            </Badge>
          </div>
          
          <div className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">New Stage</p>
            <Badge variant="outline" className={`${getStageColor(newStage)} border`}>
              {newStage}
            </Badge>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="border-gray-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Confirm Change
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
