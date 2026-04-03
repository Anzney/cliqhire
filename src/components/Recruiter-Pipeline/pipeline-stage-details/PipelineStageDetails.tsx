"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Target, 
  Clock, 
  Edit3, 
  Check, 
  X, 
  Loader2 
} from "lucide-react";
import { RecruiterPipelineService } from "@/services/recruiterPipelineService";
import { toast } from "sonner";
import { getStageFields, getStageColor, formatDateForDisplay, StageField } from "./stage-fields";
import { mapUIStageToBackendStage } from "../dummy-data";
import { renderFieldInput } from "./field-inputs";

// Helper function to get stage key from stage name
const getStageKey = (stageName: string): string => {
  let stageKey = stageName.toLowerCase().replace(/\s+/g, '');
  
  // Special handling for "Client Review" -> "clientScreening"
  if (stageName === "Client Review") {
    stageKey = "clientScreening";
  }
  
  return stageKey;
};

interface PipelineStageDetailsProps {
  candidate: any;
  selectedStage?: string;
  onStageSelect?: (stage: string) => void;
  onUpdateCandidate?: (updatedCandidate: any) => void;
  pipelineId?: string;
  canModify?: boolean;
}

export function PipelineStageDetails({ 
  candidate, 
  selectedStage, 
  onStageSelect,
  onUpdateCandidate,
  pipelineId,
  canModify = true
}: PipelineStageDetailsProps) {
  const [isEditingStage, setIsEditingStage] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Ensure confirm dialog is closed on unmount
  React.useEffect(() => {
    return () => setShowConfirmDialog(false);
  }, []);
  
  if (!candidate) return null;
  
  // Use selectedStage if provided, otherwise fallback to currentStage or default
  const displayStage = selectedStage || candidate.currentStage || "Sourcing";
  
  const stageFields = getStageFields(displayStage, candidate);

  const handleEditAll = () => {
    setIsEditingStage(true);
    const initialValues: Record<string, string> = {};
    stageFields.forEach(field => {
      const val = field.value?.toString() || "";
      initialValues[field.key] = val === "Not set" ? "" : val;
    });
    setEditValues(initialValues);
  };

  const handleUpdateFieldValue = (key: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveAll = () => {
    if (!canModify) {
      toast.error('You do not have permission to modify the recruitment pipeline.');
      return;
    }
    // Show confirmation dialog before bulk saving
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    const hasApiIntegration = pipelineId && candidate.id;
    
    // Create an object with only the fields that were actually modified or at least present in editValues
    // We update all fields from editValues bulk.
    const updatedFields: Record<string, any> = {};
    Object.entries(editValues).forEach(([key, val]) => {
      if (val === "" || val === "Not set") {
        updatedFields[key] = null;
      } else {
        updatedFields[key] = val;
      }
    });

    if (!hasApiIntegration) {
      // Update local mode
      console.warn("API integration not available - updating locally only");
      
      const stageKey = getStageKey(displayStage);
      const updatedCandidate = {
        ...candidate,
        [stageKey]: {
          ...candidate[stageKey],
          ...updatedFields
        }
      };
      onUpdateCandidate?.(updatedCandidate);
      
      toast.success(`Stage details updated locally`);
      setIsEditingStage(false);
      setShowConfirmDialog(false);
      return;
    }

    setIsUpdating(true);
    
    try {
      const stageKey = getStageKey(displayStage);
      const existingStageData = candidate[stageKey] || {};
      
      // Prepare the update data for all fields
      const updateData = {
        fields: {
          ...existingStageData, // Preserve any existing fields not rendered
          ...updatedFields      // Overwrite with all updated fields
        },
        notes: `Bulk updated stage details for ${displayStage}`
      };

      const backendStage = mapUIStageToBackendStage(displayStage);
      const response = await RecruiterPipelineService.updateStageFields(
        pipelineId,
        candidate.id,
        backendStage,
        updateData
      );

      if (response.success) {
        // Update local state
        const updatedCandidate = {
          ...candidate,
          [stageKey]: {
            ...candidate[stageKey],
            ...updatedFields
          }
        };
        onUpdateCandidate?.(updatedCandidate);
        
        toast.success(`Stage details updated successfully`);
        setIsEditingStage(false);
      } else {
        toast.error(response.error || "Failed to update details");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error("An error occurred while updating the details");
    } finally {
      setIsUpdating(false);
      setShowConfirmDialog(false);
    }
  };

  const handleCancelSave = () => {
    setShowConfirmDialog(false);
  };

  const handleCancelEdit = () => {
    setIsEditingStage(false);
    setEditValues({});
  };

  const hasApiIntegration = pipelineId && candidate.id;

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="h-5 w-5 text-blue-500 mr-2" />
              Stage Details: {displayStage}
            </CardTitle>
            {!hasApiIntegration && (
              <Badge variant="secondary" className="text-xs">
                Local Mode
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${getStageColor(displayStage)} font-medium mr-2`}
            >
              {displayStage}
            </Badge>
            {!isEditingStage && canModify && displayStage === candidate.currentStage && stageFields.length > 0 && (
              <Button size="sm" variant="outline" onClick={handleEditAll} className="h-8">
                <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit Details
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {displayStage !== candidate.currentStage && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Viewing previous stage data. This stage is in read-only mode. Only the current stage ({candidate.currentStage}) can be edited.
              </p>
            </div>
          </div>
        )}
        
        {stageFields.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stageFields.map((field, index) => (
                <div key={index} className="flex flex-col space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${field.color} shadow-sm`}>
                      {React.cloneElement(field.icon as React.ReactElement, { className: 'h-3.5 w-3.5' })}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{field.label}</p>
                    {/* Optional indicator could go here */}
                  </div>
                  
                  <div className="flex-1">
                    {isEditingStage ? (
                      <div className="mt-1">
                        {renderFieldInput(
                          field, 
                          editValues[field.key] || "", 
                          (val) => handleUpdateFieldValue(field.key, val)
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 break-words mt-1">
                        {field.type === 'date' && field.value ? (
                          formatDateForDisplay(field.value.toString())
                        ) : typeof field.value === 'string' && field.value.startsWith('http') ? (
                          <a 
                            href={field.value} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                          >
                            View Link
                          </a>
                        ) : (
                          field.value || <span className="text-gray-400 italic">Not set</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isEditingStage && (
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <Button variant="outline" onClick={handleCancelEdit} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAll} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700">
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No details available for this stage</p>
          </div>
        )}
      </CardContent>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update all modified fields for this stage?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSave}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmSave}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Confirm Updates'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

