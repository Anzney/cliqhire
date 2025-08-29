# Recruiter Pipeline Components

## PipelineStageDetails Component

The `PipelineStageDetails` component displays detailed information for each stage of the recruitment pipeline. It shows different fields based on the candidate's current stage and allows users to click on any stage to view its details.

### Features

- **Dynamic Field Display**: Shows different fields based on the selected pipeline stage
- **Interactive Progress Bar**: Click on any stage in the progress bar to view its details
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

### Interaction Pattern

- **Default Behavior**: Shows details for the candidate's current stage
- **Stage Selection**: Click on any stage in the progress bar to view its details
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

### Customization

To customize the fields for each stage, modify the `getStageFields` function in the component. You can:
- Add new fields
- Change field labels
- Modify icons and colors
- Update validation logic
