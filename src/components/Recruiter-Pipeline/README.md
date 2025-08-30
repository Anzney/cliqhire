# Recruiter Pipeline Components

## PipelineStageDetails Component

The `PipelineStageDetails` component displays detailed information for each stage of the recruitment pipeline. It shows different fields based on the candidate's current stage and allows users to click on any stage to view its details.

### Features

- **Dynamic Field Display**: Shows different fields based on the selected pipeline stage
- **Interactive Progress Bar**: Click on any stage in the progress bar to view its details
- **Individual Field Editing**: Each field has its own edit icon for inline editing
- **Responsive Design**: Adapts to different screen sizes
- **Visual Indicators**: Color-coded icons and status indicators
- **Interactive Elements**: Clickable links and hover effects

### Pipeline Stages

The component supports the following pipeline stages:

1. **Sourcing**
   - Sourcing Date
   - Connection
   - Referred By
   - Screening Rating
   - Outreach Channel
   - Sourcing Due Date
   - Follow-up Date & Time

2. **Screening**
   - Screening Date
   - AEMS Interview Date
   - Screening Status (Pending/Complete)
   - Screening Rating
   - Follow-up Date
   - Screening Due Date

3. **Client Screening**
   - Client Screening Date
   - Client Feedback
   - Client Rating

4. **Interview**
   - Interview Date
   - Interview Status
   - Interview Round No
   - No. of Interview Reschedules
   - Interview Meeting Link

5. **Verification**
   - Documents
   - Offer Letter
   - Background Check

6. **Onboarding**
   - Onboarding Start Date
   - Onboarding Status
   - Training Completed

7. **Hired**
   - Hire Date
   - Contract Type
   - Salary

8. **Disqualified**
   - Disqualification Date
   - Reason
   - Feedback

### Usage

```tsx
import { PipelineStageDetails } from "./pipeline-stage-details";

// In your component
const [selectedStage, setSelectedStage] = useState<string | undefined>(undefined);

// The progress bar stages are clickable and will call setSelectedStage
// The PipelineStageDetails component will display the details for the selected stage
<PipelineStageDetails 
  candidate={candidate}
  selectedStage={selectedStage}
  onStageSelect={setSelectedStage}
/>
```

### Props

- `candidate`: The candidate object containing all relevant data
- `selectedStage`: (Optional) The currently selected stage to display
- `onStageSelect`: (Optional) Callback function when a stage is selected
- `onUpdateCandidate`: (Optional) Callback function when candidate data is updated

### Interaction Pattern

- **Default Behavior**: Shows details for the candidate's current stage
- **Stage Selection**: Click on any stage in the progress bar to view its details
- **Individual Field Editing**: Click the edit icon on any field to edit it inline
- **Save/Cancel Actions**: Use save (✓) or cancel (✗) buttons when editing
- **Visual Feedback**: Selected stages are highlighted with enhanced styling
- **Hover Effects**: Stages show hover effects to indicate they are clickable

### Styling

The component uses:
- **shadcn/ui** components (Card, Button, Badge)
- **Lucide React** icons
- **Tailwind CSS** for styling
- Responsive grid layout
- Hover effects and transitions

### Mock Data

The component includes mock data for demonstration purposes. In a production environment, replace the mock data with real candidate data from your API.

## Individual Field Editing

The component supports inline editing for individual fields with the following features:

### Field Types Supported

- **Text Input**: For simple text fields
- **Date Picker**: For date selection using shadcn/ui Calendar component
- **DateTime Picker**: For date and time selection with separate date and time inputs
- **Select Dropdown**: For predefined options
- **Rating Selector**: For rating fields (1/5 to 5/5)
- **URL Input**: For web links with validation
- **Textarea**: For longer text content

### Editing Workflow

1. **Click Edit Icon**: Each field has a small edit icon (✏️) in the top-right corner
2. **Inline Editing**: The field transforms into an appropriate input control
   - **Date Fields**: Open a beautiful calendar picker with shadcn/ui components
   - **DateTime Fields**: Show separate date and time inputs for precise control
   - **Other Fields**: Display appropriate input types (text, select, textarea, etc.)
3. **Save/Cancel**: Use the save (✓) or cancel (✗) buttons to confirm or discard changes
4. **Real-time Updates**: Changes are immediately reflected in the UI
5. **Formatted Display**: Dates are displayed in a user-friendly format (e.g., "January 15, 2024")

### Stage-Specific Fields

Each pipeline stage has its own set of editable fields:

1. **Sourcing**: 7 fields including dates, connections, ratings, etc.
2. **Screening**: 6 fields including interview dates, status, ratings
3. **Client Screening**: 3 fields for client feedback and ratings
4. **Interview**: 5 fields including meeting links and reschedules
5. **Verification**: 3 fields for documents and background checks
6. **Onboarding**: 3 fields for training and status
7. **Hired**: 3 fields for contract and salary details
8. **Disqualified**: 3 fields for reasons and feedback

### Customization

To customize the fields for each stage, modify the `getStageFields` function in the component. You can:
- Add new fields
- Change field labels
- Modify icons and colors
- Update validation logic
- Add new field types
