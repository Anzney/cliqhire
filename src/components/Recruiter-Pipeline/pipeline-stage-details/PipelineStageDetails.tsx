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
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFieldKey, setPendingFieldKey] = useState<string | null>(null);
  
  // Ensure confirm dialog is closed on unmount to avoid any lingering overlay/focus trap
  React.useEffect(() => {
    return () => {
      setShowConfirmDialog(false);
      setPendingFieldKey(null);
    };
  }, []);
  
  if (!candidate) return null;
  
  // Use selectedStage if provided, otherwise fallback to currentStage or default
  // This allows viewing any stage, not just the current one
  const displayStage = selectedStage || candidate.currentStage || "Sourcing";
  
  const stageFields = getStageFields(displayStage, candidate);

  const handleEditField = (field: StageField) => {
    setEditingField(field.key);
    setEditValue(field.value?.toString() || "");
  };

  const handleSaveField = (fieldKey: string) => {
    if (!canModify) {
      toast.error('You do not have permission to modify the recruitment pipeline.');
      return;
    }
    // Show confirmation dialog instead of immediately saving
    setPendingFieldKey(fieldKey);
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingFieldKey) return;
    
    const fieldKey = pendingFieldKey;
    const fieldLabel = stageFields.find(field => field.key === fieldKey)?.label || fieldKey;
    
    // Check if API integration is available
    const hasApiIntegration = pipelineId && candidate.id;
    
    if (!hasApiIntegration) {
      // Update locally only when API integration is not available
      console.warn("API integration not available - updating locally only");
      
      // Update local state - update the nested stage data
      const stageKey = getStageKey(displayStage);
      const updatedCandidate = {
        ...candidate,
        [stageKey]: {
          ...candidate[stageKey],
          [fieldKey]: editValue
        }
      };
      onUpdateCandidate?.(updatedCandidate);
      
      toast.success(`${fieldLabel} updated locally (API integration not available)`);
      setEditingField(null);
      setEditValue("");
      setShowConfirmDialog(false);
      setPendingFieldKey(null);
      return;
    }

    setIsUpdating(true);
    
    try {
      // Use displayStage for API calls
      const stageKey = getStageKey(displayStage);
      const existingStageData = candidate[stageKey] || {};
      
      // Prepare the update data - only update the specific field, preserve others
      const updateData = {
        fields: {
          ...existingStageData, // Preserve all existing fields
          [fieldKey]: editValue // Update only the specific field
        },
        notes: `Updated ${fieldKey} to: ${editValue}`
      };

      // Call the API to update the field
      const backendStage = mapUIStageToBackendStage(displayStage);
      const response = await RecruiterPipelineService.updateStageFields(
        pipelineId,
        candidate.id,
        backendStage,
        updateData
      );

      if (response.success) {
        // Update local state - update the nested stage data
        const stageKey = getStageKey(displayStage);
        const updatedCandidate = {
          ...candidate,
          [stageKey]: {
            ...candidate[stageKey],
            [fieldKey]: editValue
          }
        };
        onUpdateCandidate?.(updatedCandidate);
        
        toast.success(`${fieldLabel} updated successfully`);
        setEditingField(null);
        setEditValue("");
      } else {
        toast.error(response.error || "Failed to update field");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error("An error occurred while updating the field");
    } finally {
      setIsUpdating(false);
      setShowConfirmDialog(false);
      setPendingFieldKey(null);
    }
  };

  const handleCancelSave = () => {
    setShowConfirmDialog(false);
    setPendingFieldKey(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  // Check if API integration is available
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
          <Badge 
            variant="outline" 
            className={`${getStageColor(displayStage)} font-medium`}
          >
            {displayStage}
          </Badge>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stageFields.map((field, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow duration-200">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${field.color} shadow-sm`}>
                  {field.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{field.label}</p>
                    {editingField === field.key ? (
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveField(field.key)}
                          disabled={isUpdating}
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (canModify && displayStage === candidate.currentStage) ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditField(field)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    ) : null}
                  </div>
                  
                  {editingField === field.key ? (
                    <div className="mt-2">
                      {renderFieldInput(field, editValue, setEditValue)}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 break-words">
                      {field.type === 'date' ? (
                        formatDateForDisplay(field.value?.toString() || "")
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
                        field.value || "Not set"
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
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
              Are you sure you want to update the field {pendingFieldKey ? stageFields.find(field => field.key === pendingFieldKey)?.label || pendingFieldKey : ''}?
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
                  Updating...
                </>
              ) : (
                'Confirm Update'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

