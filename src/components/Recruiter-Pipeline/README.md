# Recruiter Pipeline API Integration

This document describes the API integration for the Recruiter Pipeline component, specifically for updating stage fields.

## API Endpoint

The main endpoint for updating stage fields is:

```
PATCH /api/recruiter-pipeline/:pipelineId/candidate/:candidateId/stage/:stageName/fields
```

### Parameters:
- `pipelineId`: The ID of the pipeline
- `candidateId`: The ID of the candidate
- `stageName`: The stage name (Sourcing, Screening, Client Screening, Interview, Verification, Onboarding, Hired)

### Request Body:
```json
{
  "fields": {
    "fieldName": "fieldValue"
  },
  "notes": "Optional notes about the update"
}
```

### Example Usage:
```bash
PATCH /api/recruiter-pipeline/64f1a2b3c4d5e6f7g8h9i0j1/candidate/64f1a2b3c4d5e6f7g8h9i0j2/stage/Sourcing/fields
{
  "fields": {
    "source": "LinkedIn",
    "contacted": true,
    "contactDate": "2024-01-15",
    "response": "Interested"
  },
  "notes": "Candidate responded positively"
}
```

## Service Layer

### RecruiterPipelineService

The `RecruiterPipelineService` class provides methods for interacting with the pipeline API:

```typescript
import { RecruiterPipelineService } from '@/services/recruiterPipelineService';

// Update stage fields
const response = await RecruiterPipelineService.updateStageFields(
  pipelineId,
  candidateId,
  stageName,
  {
    fields: { fieldName: "newValue" },
    notes: "Update notes"
  }
);

// Get stage fields
const response = await RecruiterPipelineService.getStageFields(
  pipelineId,
  candidateId,
  stageName
);

// Move candidate to different stage
const response = await RecruiterPipelineService.moveCandidateToStage(
  pipelineId,
  candidateId,
  newStage,
  "Optional notes"
);
```

## Custom Hook

### useRecruiterPipeline

A custom hook for managing pipeline operations with built-in loading states and error handling:

```typescript
import { useRecruiterPipeline } from '@/hooks/useRecruiterPipeline';

const { 
  isLoading, 
  error, 
  updateStageField, 
  getStageFields, 
  moveCandidateToStage 
} = useRecruiterPipeline({
  pipelineId: "your-pipeline-id",
  candidateId: "your-candidate-id"
});

// Update a field
const result = await updateStageField(
  "Sourcing",
  "source",
  "LinkedIn",
  "Updated source field"
);

// Move candidate
const result = await moveCandidateToStage(
  "Screening",
  "Moving to screening stage"
);
```

## Component Usage

### PipelineStageDetails

The updated `PipelineStageDetails` component requires API integration to function:

```tsx
import { PipelineStageDetails } from '@/components/Recruiter-Pipeline/pipeline-stage-details';

<PipelineStageDetails 
  candidate={candidate}
  selectedStage="Sourcing"
  pipelineId="your-pipeline-id"
  onUpdateCandidate={(updatedCandidate) => {
    // Handle candidate update
    console.log('Candidate updated:', updatedCandidate);
  }}
/>
```

### Requirements

The component requires both `pipelineId` and `candidate.id` to be provided:
- **pipelineId**: The ID of the pipeline (required)
- **candidate.id**: The ID of the candidate (required)
- If either is missing, the component will show an error message and prevent field updates

## Available Stages

The following stages are supported:

1. **Sourcing**
   - Fields: sourcingDate, connection, referredBy, screeningRating, outreachChannel, sourcingDueDate, followUpDateTime

2. **Screening**
   - Fields: screeningDate, aemsInterviewDate, screeningStatus, screeningRating, screeningFollowUpDate, screeningDueDate

3. **Client Screening**
   - Fields: clientScreeningDate, clientFeedback, clientRating

4. **Interview**
   - Fields: interviewDate, interviewStatus, interviewRoundNo, interviewReschedules, interviewMeetingLink

5. **Verification**
   - Fields: documents, offerLetter, backgroundCheck

6. **Onboarding**
   - Fields: onboardingStartDate, onboardingStatus, trainingCompleted

7. **Hired**
   - Fields: hireDate, contractType, finalSalary

8. **Disqualified**
   - Fields: disqualificationDate, disqualificationReason, disqualificationFeedback

## Error Handling

The service includes comprehensive error handling:

- Network errors are caught and displayed as user-friendly messages
- API errors are logged and displayed to users
- Loading states are managed automatically
- Toast notifications provide feedback for success/error states

## Toast Notifications

The integration uses the `sonner` library for toast notifications:

- Success messages for successful updates
- Error messages for failed operations
- Loading indicators during API calls

## TypeScript Support

All components and services are fully typed with TypeScript interfaces:

```typescript
interface StageFieldUpdate {
  fields: Record<string, any>;
  notes?: string;
}

interface StageFieldUpdateResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
```
