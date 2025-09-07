/**
 * Utility functions for handling temp candidate validation in recruitment pipeline
 */

export interface TempCandidateValidationResult {
  canChangeStage: boolean;
  message?: string;
}

/**
 * Validates if a candidate's stage can be changed
 * @param candidate - The candidate object
 * @returns Validation result with canChangeStage flag and optional message
 */
export function validateTempCandidateStageChange(candidate: any): TempCandidateValidationResult {
  // Check if candidate is a temp candidate
  const isTempCandidate = candidate?.candidateId?.isTempCandidate === true || 
                         candidate?.isTempCandidate === true;

  if (isTempCandidate) {
    return {
      canChangeStage: false,
      message: "Change the status of the candidate (CV Received), then create the candidate, then change the stage."
    };
  }

  return {
    canChangeStage: true
  };
}

/**
 * Checks if a candidate is a temp candidate
 * @param candidate - The candidate object
 * @returns boolean indicating if the candidate is a temp candidate
 */
export function isTempCandidate(candidate: any): boolean {
  return candidate?.candidateId?.isTempCandidate === true || 
         candidate?.isTempCandidate === true;
}

/**
 * Gets the appropriate stage for a temp candidate
 * @param candidate - The candidate object
 * @returns The stage that should be used for temp candidates
 */
export function getTempCandidateStage(candidate: any): string {
  if (isTempCandidate(candidate)) {
    return "Sourcing";
  }
  return candidate?.currentStage || "Sourcing";
}
