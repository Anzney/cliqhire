# CliqHire - ATS Frontend Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Folder Structure](#project-folder-structure)
3. [UI Component Hierarchy](#ui-component-hierarchy)
4. [Architecture Patterns](#architecture-patterns)

---

## Overview

CliqHire is an Applicant Tracking System (ATS) built with Next.js 14, React 18, TypeScript, and Tailwind CSS. The application follows a modern, scalable architecture with a clear separation of concerns, implementing route groups, protected routes, and a comprehensive component-based UI system.

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query (TanStack Query) + Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Authentication**: Context API (AuthContext)

---

## Project Folder Structure

```
src/
├── app/                          # Next.js App Router directory
│   ├── (auth)/                   # Authentication route group
│   │   ├── layout.tsx           # Auth layout wrapper
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── register/
│   │       └── page.tsx         # Registration page
│   │
│   ├── (client-d)/               # Client dashboard route group
│   │   ├── layout.tsx           # Client dashboard layout
│   │   └── dashboards/
│   │       └── page.tsx         # Client dashboard page
│   │
│   ├── (form)/                   # Form route group
│   │   ├── layout.tsx           # Form layout wrapper
│   │   └── candidate/
│   │       └── page.tsx         # Candidate form page
│   │
│   ├── (landing)/                # Landing page route group
│   │   ├── layout.tsx           # Landing page layout
│   │   └── landing/
│   │       └── page.tsx         # Landing page
│   │
│   ├── (protected)/              # Protected routes group (main app)
│   │   ├── layout.tsx           # Protected layout (with Sidebar & Header)
│   │   ├── activities/
│   │   │   ├── page.tsx         # Activities page
│   │   │   └── empty-statetwo.tsx
│   │   ├── admin/
│   │   │   └── page.tsx         # Admin page
│   │   ├── candidates/
│   │   │   ├── page.tsx         # Candidates list page
│   │   │   └── [id]/            # Dynamic candidate detail route
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx     # Candidate detail page
│   │   │       └── ClientCandidateTabs.tsx
│   │   ├── clients/
│   │   │   ├── page.tsx         # Clients list page
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx     # Client detail page
│   │   │   ├── data/
│   │   │   │   ├── sample-clients.tsx
│   │   │   │   └── sample-jobs.tsx
│   │   │   └── empty-state.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Main dashboard
│   │   ├── emails/
│   │   │   └── page.tsx         # Emails page
│   │   ├── finance/
│   │   │   └── page.tsx         # Finance page
│   │   ├── inbox/
│   │   │   ├── page.tsx         # Inbox page
│   │   │   └── empty-state.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx         # Jobs list page
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx     # Job detail page
│   │   │   └── empty-state.tsx
│   │   ├── placements/
│   │   │   ├── page.tsx         # Placements page
│   │   │   └── empty-state.tsx
│   │   ├── reactruterpipeline/
│   │   │   ├── page.tsx         # Recruiter pipeline page
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Pipeline detail page
│   │   ├── reports/
│   │   │   └── page.tsx         # Reports page
│   │   ├── settings/
│   │   │   └── page.tsx         # Settings page
│   │   ├── teammembers/
│   │   │   └── page.tsx         # Team members page
│   │   ├── today-tasks/
│   │   │   └── page.tsx         # Today's tasks page
│   │   └── user-access/
│   │       ├── [id]/
│   │       └── page.tsx         # User access management
│   │
│   ├── api/                      # API routes
│   │   ├── linkedin/
│   │   │   └── post/            # LinkedIn API endpoints
│   │   └── positions/           # Position API endpoints
│   │
│   ├── client/                   # Client-facing routes
│   │   └── login/
│   │       └── page.tsx         # Client login page
│   │
│   ├── layout.tsx               # Root layout (providers, theme)
│   ├── page.tsx                 # Root page
│   ├── globals.css              # Global styles
│   └── favicon.ico
│
├── components/                   # React components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── combobox.tsx
│   │   ├── command.tsx
│   │   ├── confirmation-dialog.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── multi-select.tsx
│   │   ├── nested-select.tsx
│   │   ├── pdf-viewer.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   │
│   ├── candidates/              # Candidate-related components
│   │   ├── add-to-job-dialog.tsx
│   │   ├── AddCandidateDialog.tsx
│   │   ├── AdvSearch.tsx
│   │   ├── attachments/
│   │   │   ├── attachments-content.tsx
│   │   │   ├── attachments-header.tsx
│   │   │   ├── attachment-item.tsx
│   │   │   └── upload-attachment.tsx
│   │   ├── CandidateFilter.tsx
│   │   ├── CandidateFilters.tsx
│   │   ├── CandidateFiltersInline.tsx
│   │   ├── CandidatePaginationControls.tsx
│   │   ├── create-candidate-button.tsx
│   │   ├── create-candidate-dialog.tsx
│   │   ├── create-candidate-form.tsx
│   │   ├── create-candidate-modal.tsx
│   │   ├── create-candidate.tsx
│   │   ├── create-folder.tsx
│   │   ├── empty-states.tsx
│   │   ├── jobs/
│   │   │   └── jobs-content.tsx
│   │   ├── notes/
│   │   │   └── notes-content.tsx
│   │   ├── summary/
│   │   │   ├── candidate-avatar.tsx
│   │   │   ├── candidate-basic-info.tsx
│   │   │   ├── candidate-contact-info.tsx
│   │   │   ├── candidate-education.tsx
│   │   │   ├── candidate-experience.tsx
│   │   │   ├── candidate-location.tsx
│   │   │   ├── candidate-skills.tsx
│   │   │   └── summary-content.tsx
│   │   └── UploadResume.tsx
│   │
│   ├── clients/                 # Client-related components
│   │   ├── activities/
│   │   │   ├── activities-content.tsx
│   │   │   ├── create-activity.tsx
│   │   │   └── activity-item.tsx
│   │   ├── attachments/
│   │   │   ├── attachments-content.tsx
│   │   │   ├── attachments-header.tsx
│   │   │   ├── attachment-item.tsx
│   │   │   └── upload-attachment.tsx
│   │   ├── client-tabs.tsx
│   │   ├── ClientPaginationControls.tsx
│   │   ├── ClientsFilter.tsx
│   │   ├── ClientTableRow.tsx
│   │   ├── contacts/
│   │   │   ├── contacts-content.tsx
│   │   │   ├── contact-item.tsx
│   │   │   └── create-contact.tsx
│   │   ├── contract/
│   │   │   └── contract-content.tsx
│   │   ├── email-templates/
│   │   │   ├── email-templates-content.tsx
│   │   │   ├── template-item.tsx
│   │   │   ├── create-template.tsx
│   │   │   ├── edit-template.tsx
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── guest/
│   │   │   └── guest-access.tsx
│   │   ├── history/
│   │   │   └── history-content.tsx
│   │   ├── jobs/
│   │   │   └── jobs-content.tsx
│   │   ├── modals/
│   │   │   ├── delete-client-modal.tsx
│   │   │   ├── edit-client-modal.tsx
│   │   │   ├── share-client-modal.tsx
│   │   │   └── archive-client-modal.tsx
│   │   ├── notes/
│   │   │   ├── notes-content.tsx
│   │   │   ├── note-item.tsx
│   │   │   ├── create-note.tsx
│   │   │   └── edit-note.tsx
│   │   ├── summary/
│   │   │   ├── client-basic-info.tsx
│   │   │   ├── client-contact-info.tsx
│   │   │   ├── client-contract-info.tsx
│   │   │   ├── client-location.tsx
│   │   │   ├── client-status.tsx
│   │   │   ├── summary-content.tsx
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── tabs/
│   │   │   ├── tab-content.tsx
│   │   │   ├── tab-list.tsx
│   │   │   └── tab-trigger.tsx
│   │   └── team/
│   │       ├── team-content.tsx
│   │       ├── team-member-item.tsx
│   │       ├── add-team-member.tsx
│   │       └── remove-team-member.tsx
│   │
│   ├── jobs/                    # Job-related components
│   │   ├── activities/
│   │   │   ├── activities-content.tsx
│   │   │   └── create-activity.tsx
│   │   ├── attachments/
│   │   │   └── attachments-content.tsx
│   │   ├── candidates/
│   │   │   ├── candidates-content.tsx
│   │   │   ├── add-candidate-dialog.tsx
│   │   │   └── job-candidates-list.tsx
│   │   ├── create-job-modal.tsx
│   │   ├── job-stage-badge.tsx
│   │   ├── job-tabs.tsx
│   │   ├── JobPaginationControls.tsx
│   │   ├── jobs-table.tsx
│   │   ├── JobsFilter.tsx
│   │   ├── linkedin-post-dialog.tsx
│   │   ├── notes/
│   │   │   ├── notes-content.tsx
│   │   │   └── add-note-dialog.tsx
│   │   ├── recommendations/
│   │   │   └── recommendations-content.tsx
│   │   ├── reports/
│   │   │   └── reports-content.tsx
│   │   ├── sourcing/
│   │   │   └── sourcing-content.tsx
│   │   ├── summary/
│   │   │   ├── summary-content.tsx
│   │   │   ├── job-description.tsx
│   │   │   ├── edit-field-dialog.tsx
│   │   │   ├── edit-salary-dialog.tsx
│   │   │   ├── job-stage-selector.tsx
│   │   │   ├── gender-selector.tsx
│   │   │   ├── nationality-selector.tsx
│   │   │   ├── date-range-picker.tsx
│   │   │   ├── deadline-picker.tsx
│   │   │   ├── jd-benefit-files-section.tsx
│   │   │   ├── JobTeamInfoSection.tsx
│   │   │   ├── team-selection-dialog.tsx
│   │   │   └── toolbar-plugin.tsx
│   │   ├── tabs/
│   │   │   ├── tab-content.tsx
│   │   │   ├── tab-list.tsx
│   │   │   └── tab-trigger.tsx
│   │   ├── teams/
│   │   │   ├── team-content.tsx
│   │   │   ├── Client-Team.tsx
│   │   │   ├── Internal-Team.tsx
│   │   │   └── ClientPrimaryContactsDialog.tsx
│   │   └── types.ts
│   │
│   ├── Recruiter-Pipeline/      # Recruiter pipeline components
│   │   ├── recruiter-pipeline.tsx
│   │   ├── PipelineJobHeader.tsx
│   │   ├── PipelineJobExpanded.tsx
│   │   ├── PipelineCandidatesTable.tsx
│   │   ├── pipeline-job-card.tsx
│   │   ├── pipeline-stage-badge.tsx
│   │   ├── PipelineStageFilters.tsx
│   │   ├── kpi-section.tsx
│   │   ├── sourcing-header.tsx
│   │   ├── add-candidate-dialog.tsx
│   │   ├── create-candidate-dialog.tsx
│   │   ├── create-pipeline-dialog.tsx
│   │   ├── candidate-details-dialog.tsx
│   │   ├── interview-details-dialog.tsx
│   │   ├── disqualification-dialog.tsx
│   │   ├── status-change-confirmation-dialog.tsx
│   │   ├── temp-candidate-alert-dialog.tsx
│   │   ├── connection-badge.tsx
│   │   ├── status-badge.tsx
│   │   ├── pipeline-stage-details/
│   │   │   ├── PipelineStageDetails.tsx
│   │   │   ├── stage-fields.tsx
│   │   │   └── field-inputs.tsx
│   │   ├── utils/
│   │   │   └── convert.ts
│   │   ├── pipeline-mapper.ts
│   │   ├── stage-store.ts
│   │   └── dummy-data.ts
│   │
│   ├── Recruitment-Pipeline/    # Recruitment pipeline components
│   │   ├── tabs/
│   │   │   ├── tab-content.tsx
│   │   │   └── tab-list.tsx
│   │   └── view-candidate-dialog.tsx
│   │
│   ├── today-tasks/             # Today's tasks components
│   │   ├── tasks-content.tsx
│   │   ├── task-item.tsx
│   │   ├── create-task.tsx
│   │   ├── edit-task.tsx
│   │   ├── task-filters.tsx
│   │   ├── task-calendar.tsx
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── teamMembers/             # Team members components
│   │   ├── team-members-table.tsx
│   │   ├── team-member-card.tsx
│   │   ├── add-team-member.tsx
│   │   ├── edit-team-member.tsx
│   │   ├── team-member-filters.tsx
│   │   ├── team-member-dialog.tsx
│   │   ├── team-member-status.tsx
│   │   ├── team-member-role.tsx
│   │   └── team-member-permissions.tsx
│   │
│   ├── user-Access/             # User access management components
│   │   ├── user-access-tabs.tsx
│   │   ├── user-permission-dialog.tsx
│   │   ├── user-permission-tab.tsx
│   │   ├── add-team-members-dialog.tsx
│   │   ├── view-team-dialog.tsx
│   │   └── team-status-badge.tsx
│   │
│   ├── client/                  # Client dashboard components
│   │   ├── ClientTopNav.tsx
│   │   ├── ClientProfileDialog.tsx
│   │   ├── ClientKPI.tsx
│   │   ├── ClientJobsTable.tsx
│   │   ├── ClientJobsTableHeader.tsx
│   │   └── ClientJobsTableBody.tsx
│   │
│   ├── client-external/         # External client components
│   │   ├── client-login.tsx
│   │   ├── client-register.tsx
│   │   └── client-info.tsx
│   │
│   ├── landing/                 # Landing page components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Workflow.tsx
│   │   ├── Pricing.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   │
│   ├── finance/                 # Finance components
│   │   ├── finance-overview.tsx
│   │   ├── expenses-table.tsx
│   │   └── invoices-table.tsx
│   │
│   ├── common/                  # Common shared components
│   │   ├── add-existing-candidate-dialog.tsx
│   │   ├── add-position-dialog.tsx
│   │   ├── entity-header.tsx
│   │   ├── ShareMenu.tsx
│   │   └── submission-success-dialog.tsx
│   │
│   ├── create-client-modal/     # Client creation modal
│   │   ├── create-client-modal.tsx
│   │   ├── ClientInformationTab.tsx
│   │   ├── ContactDetailsTab.tsx
│   │   ├── ContractInformationTab.tsx
│   │   ├── DocumentsTab.tsx
│   │   ├── ContactModal.tsx
│   │   ├── date-picker.tsx
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   ├── schema.ts
│   │   └── type.ts
│   │
│   ├── create-teamMembers-modal/ # Team member creation modal
│   │   ├── create-teamMembers-modal.tsx
│   │   ├── PersonalInformationTab.tsx
│   │   └── SkillsAndStatusTab.tsx
│   │
│   ├── contract-forms/          # Contract form components
│   │   ├── new-contract-modal.tsx
│   │   ├── business-form.tsx
│   │   ├── consulting-form.tsx
│   │   └── outsourcing-form.tsx
│   │
│   ├── new-jobs/                # Job creation components
│   │   ├── create-jobs-form.tsx
│   │   └── clientApi.ts
│   │
│   ├── shared/                  # Shared utility components
│   │   └── UserSelectDialog.tsx
│   │
│   ├── protected/               # Protected route components
│   │   └── ProtectedHomeClient.tsx
│   │
│   ├── user-profile/            # User profile components
│   │   ├── user-profile-dialog.tsx
│   │   └── user-profile-content.tsx
│   │
│   ├── AuthGuard.tsx            # Authentication guard component
│   ├── sidebar.tsx              # Main sidebar navigation
│   ├── sidebar-nav.tsx          # Sidebar navigation items
│   ├── header.tsx               # Main header component
│   ├── dashboard-header.tsx     # Dashboard page header
│   ├── table-header.tsx         # Table header component
│   ├── login-form.tsx           # Login form component
│   ├── register-form.tsx        # Registration form component
│   ├── client-form.tsx          # Client form component
│   ├── theme-provider.tsx       # Theme provider (dark/light mode)
│   ├── mode-toggle.tsx          # Theme toggle component
│   ├── candidate-status-badge.tsx
│   ├── client-stage-badge.tsx
│   ├── client-stage-status-badge.tsx
│   ├── admin-card.tsx
│   ├── admin-icons.tsx
│   ├── settings-card.tsx
│   ├── settings-icon.tsx
│   ├── report-card.tsx
│   ├── report-icons.tsx
│   ├── candidates-logo.tsx
│   ├── email-logo.tsx
│   ├── folder-logo.tsx
│   ├── placement-logo.tsx
│   ├── searchLogo.tsx
│   ├── filter-modal.tsx
│   ├── tags-input.tsx
│   ├── TemplateDialog.tsx
│   ├── AddGroupDialog.tsx
│   ├── scrollbar-hide.css
│   └── dummy/
│       └── recruitment-pipeline-data.ts
│
├── services/                    # API service layer
│   ├── authService.ts           # Authentication service
│   ├── clientAuthService.ts     # Client authentication service
│   ├── candidateService.ts      # Candidate CRUD operations
│   ├── clientService.ts         # Client CRUD operations
│   ├── jobService.ts            # Job CRUD operations
│   ├── teamMembersService.ts    # Team member operations
│   ├── teamService.ts           # Team operations
│   ├── activityService.ts       # Activity operations
│   ├── attachmentService.ts     # Attachment operations
│   ├── contractService.ts       # Contract operations
│   ├── clientContractService.ts # Client contract operations
│   ├── clientJobsService.ts     # Client job operations
│   ├── positionService.ts       # Position operations
│   ├── recruiterPipelineService.ts # Recruiter pipeline operations
│   ├── recruitmentPipelineService.ts # Recruitment pipeline operations
│   ├── taskService.ts           # Task operations
│   ├── tempCandidateService.ts  # Temporary candidate operations
│   ├── linkedinService.ts       # LinkedIn integration
│   └── permissionService.ts     # Permission operations
│
├── contexts/                    # React contexts
│   ├── AuthContext.tsx          # Authentication context
│   └── query-provider.tsx       # React Query provider
│
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── useRecruiterPipeline.ts  # Recruiter pipeline hook
│
├── types/                       # TypeScript type definitions
│   ├── client.ts                # Client types
│   ├── job.ts                   # Job types
│   ├── teamMember.ts            # Team member types
│   └── react-select-country-list.d.ts
│
├── lib/                         # Utility libraries
│   ├── utils.ts                 # Utility functions (cn, etc.)
│   ├── axios-config.ts          # Axios configuration
│   ├── constants.ts             # Application constants
│   └── temp-candidate-validation.ts
│
├── data/                        # Static data
│   └── teamData.ts              # Team data
│
├── pages/                       # Legacy pages (if any)
│   └── api/                     # API route handlers
│       └── [various API routes]
│
└── styles/                      # Global styles
    └── phone-input-override.css
```

---

## UI Component Hierarchy

### Application Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── ThemeProvider (Dark/Light mode)
├── AuthProvider (Authentication context)
├── QueryProvider (React Query)
└── Toaster (Notifications)
    └── {children}
        │
        ├── (auth)/layout.tsx (Authentication routes)
        │   └── Login/Register pages
        │
        ├── (landing)/layout.tsx (Landing page)
        │   ├── Navbar
        │   ├── Hero
        │   ├── Features
        │   ├── Workflow
        │   ├── Pricing
        │   ├── CTA
        │   └── Footer
        │
        ├── (client-d)/layout.tsx (Client dashboard)
        │   └── Client dashboard pages
        │
        └── (protected)/layout.tsx (Main application)
            ├── AuthGuard
            ├── QueryProvider
            └── SidebarProvider
                ├── Sidebar
                │   ├── SidebarHeader
                │   ├── SidebarContent
                │   │   └── SidebarMenu (Navigation items)
                │   └── SidebarFooter
                └── SidebarInset
                    ├── Header
                    │   ├── SidebarTrigger
                    │   ├── Back button (conditional)
                    │   ├── ModeToggle
                    │   ├── Bell icon
                    │   └── Avatar (User profile)
                    └── main
                        └── {page content}
```

### Component Hierarchy by Feature

#### 1. Jobs Feature

```
JobsPage (app/(protected)/jobs/page.tsx)
├── Dashboardheader
│   ├── Create Job Button
│   ├── Filters Button
│   ├── Delete Button (conditional)
│   └── Refresh Button
├── Table
│   ├── TableHeader
│   │   └── Tableheader (column headers)
│   └── TableBody
│       └── TableRow (for each job)
│           ├── Checkbox
│           ├── Job Title
│           ├── Job Type
│           ├── Location
│           ├── Headcount
│           ├── JobStageBadge
│           ├── Minimum Salary
│           ├── Maximum Salary
│           └── Job Owner
├── JobPaginationControls
├── JobsFilter (Modal)
│   ├── Position Name Filter
│   ├── Job Owner Filter
│   └── Stage Filter
├── CreateJobRequirementForm (Modal)
└── DeleteConfirmationDialog
```

```
JobDetailPage (app/(protected)/jobs/[id]/page.tsx)
├── JobTabs
│   ├── Summary Tab
│   │   └── SummaryContent
│   │       ├── JobDescription (Lexical editor)
│   │       ├── JobBasicInfo
│   │       ├── JobSalaryInfo
│   │       ├── JobStageSelector
│   │       ├── JobTeamInfoSection
│   │       └── EditFieldDialog
│   ├── Candidates Tab
│   │   └── CandidatesContent
│   │       ├── AddCandidateDialog
│   │       └── JobCandidatesList
│   ├── Activities Tab
│   │   └── ActivitiesContent
│   │       └── CreateActivity
│   ├── Notes Tab
│   │   └── NotesContent
│   │       └── AddNoteDialog
│   ├── Attachments Tab
│   │   └── AttachmentsContent
│   ├── Teams Tab
│   │   └── TeamContent
│   │       ├── ClientTeam
│   │       └── InternalTeam
│   ├── Sourcing Tab
│   │   └── SourcingContent
│   ├── Reports Tab
│   │   └── ReportsContent
│   └── Recommendations Tab
│       └── RecommendationsContent
```

#### 2. Candidates Feature

```
CandidatesPage (app/(protected)/candidates/page.tsx)
├── Dashboardheader
├── CandidateFilters
│   ├── CandidateFiltersInline
│   └── CandidateFilter
├── Table
│   ├── TableHeader
│   └── TableBody
│       └── TableRow (for each candidate)
│           ├── Checkbox
│           ├── Candidate Avatar
│           ├── Candidate Name
│           ├── Candidate Status Badge
│           ├── Email
│           ├── Phone
│           ├── Location
│           └── Actions
├── CandidatePaginationControls
├── CreateCandidateDialog
└── AddToJobDialog
```

```
CandidateDetailPage (app/(protected)/candidates/[id]/page.tsx)
├── ClientCandidateTabs
│   ├── Summary Tab
│   │   └── SummaryContent
│   │       ├── CandidateAvatar
│   │       ├── CandidateBasicInfo
│   │       ├── CandidateContactInfo
│   │       ├── CandidateLocation
│   │       ├── CandidateSkills
│   │       ├── CandidateExperience
│   │       └── CandidateEducation
│   ├── Jobs Tab
│   │   └── JobsContent
│   ├── Notes Tab
│   │   └── NotesContent
│   └── Attachments Tab
│       └── AttachmentsContent
│           ├── AttachmentsHeader
│           ├── AttachmentItem
│           └── UploadAttachment
```

#### 3. Clients Feature

```
ClientsPage (app/(protected)/clients/page.tsx)
├── Dashboardheader
├── ClientsFilter
├── Table
│   ├── TableHeader
│   └── TableBody
│       └── ClientTableRow (for each client)
│           ├── Checkbox
│           ├── Client Name
│           ├── Client Stage Badge
│           ├── Contact Info
│           ├── Location
│           └── Actions
├── ClientPaginationControls
└── CreateClientModal
    ├── ClientInformationTab
    ├── ContactDetailsTab
    ├── ContractInformationTab
    └── DocumentsTab
```

```
ClientDetailPage (app/(protected)/clients/[id]/page.tsx)
├── ClientTabs
│   ├── Summary Tab
│   │   └── SummaryContent
│   │       ├── ClientBasicInfo
│   │       ├── ClientContactInfo
│   │       ├── ClientContractInfo
│   │       ├── ClientLocation
│   │       └── ClientStatus
│   ├── Contacts Tab
│   │   └── ContactsContent
│   │       ├── ContactItem
│   │       └── CreateContact
│   ├── Jobs Tab
│   │   └── JobsContent
│   ├── Activities Tab
│   │   └── ActivitiesContent
│   │       ├── ActivityItem
│   │       └── CreateActivity
│   ├── Notes Tab
│   │   └── NotesContent
│   │       ├── NoteItem
│   │       ├── CreateNote
│   │       └── EditNote
│   ├── Attachments Tab
│   │   └── AttachmentsContent
│   ├── Team Tab
│   │   └── TeamContent
│   │       ├── TeamMemberItem
│   │       ├── AddTeamMember
│   │       └── RemoveTeamMember
│   ├── Contract Tab
│   │   └── ContractContent
│   ├── Email Templates Tab
│   │   └── EmailTemplatesContent
│   │       ├── TemplateItem
│   │       ├── CreateTemplate
│   │       └── EditTemplate
│   └── History Tab
│       └── HistoryContent
```

#### 4. Recruiter Pipeline Feature

```
RecruiterPipelinePage (app/(protected)/reactruterpipeline/page.tsx)
├── RecruiterPipeline
│   ├── SourcingHeader
│   ├── KPISection
│   ├── PipelineJobHeader
│   ├── PipelineStageFilters
│   ├── PipelineJobExpanded
│   │   └── PipelineCandidatesTable
│   │       └── PipelineJobCard (for each candidate)
│   │           ├── ConnectionBadge
│   │           ├── StatusBadge
│   │           ├── PipelineStageBadge
│   │           └── Actions
│   ├── AddCandidateDialog
│   ├── CreateCandidateDialog
│   ├── CreatePipelineDialog
│   ├── CandidateDetailsDialog
│   ├── InterviewDetailsDialog
│   ├── DisqualificationDialog
│   ├── StatusChangeConfirmationDialog
│   └── TempCandidateAlertDialog
```

#### 5. Today's Tasks Feature

```
TodayTasksPage (app/(protected)/today-tasks/page.tsx)
├── TasksContent
│   ├── TaskFilters
│   ├── TaskCalendar
│   └── TaskList
│       └── TaskItem (for each task)
│           ├── Task Title
│           ├── Task Description
│           ├── Task Due Date
│           ├── Task Status
│           └── Actions
├── CreateTask (Dialog)
└── EditTask (Dialog)
```

#### 6. Team Members Feature

```
TeamMembersPage (app/(protected)/teammembers/page.tsx)
├── Dashboardheader
├── TeamMembersTable
│   ├── TableHeader
│   └── TableBody
│       └── TeamMemberCard (for each member)
│           ├── Avatar
│           ├── Name
│           ├── Email
│           ├── Role
│           ├── TeamMemberStatus
│           ├── TeamMemberRole
│           └── Actions
├── CreateTeamMembersModal
│   ├── PersonalInformationTab
│   └── SkillsAndStatusTab
└── TeamMemberDialog
```

#### 7. User Access Feature

```
UserAccessPage (app/(protected)/user-access/page.tsx)
├── UserAccessTabs
│   ├── Users Tab
│   │   └── UsersContent
│   │       ├── AddTeamMembersDialog
│   │       └── ViewTeamDialog
│   └── Permissions Tab
│       └── UserPermissionTab
│           ├── UserPermissionDialog
│           └── TeamStatusBadge
```

#### 8. Dashboard Feature

```
DashboardPage (app/(protected)/dashboard/page.tsx)
├── DashboardHeader
├── KPICards
│   ├── Total Jobs
│   ├── Active Candidates
│   ├── Total Clients
│   └── Placements
└── Charts
    ├── Jobs by Stage
    ├── Candidates by Status
    └── Recent Activities
```

### Base UI Components (shadcn/ui)

All base UI components are located in `components/ui/` and follow the shadcn/ui pattern:

```
ui/
├── button.tsx           # Button component
├── input.tsx            # Input component
├── table.tsx            # Table components
├── dialog.tsx           # Dialog/Modal component
├── dropdown-menu.tsx    # Dropdown menu
├── select.tsx           # Select component
├── checkbox.tsx         # Checkbox component
├── tabs.tsx             # Tabs component
├── card.tsx             # Card component
├── badge.tsx            # Badge component
├── avatar.tsx           # Avatar component
├── sidebar.tsx          # Sidebar component
├── form.tsx             # Form components
├── calendar.tsx         # Calendar component
├── popover.tsx          # Popover component
├── tooltip.tsx          # Tooltip component
├── alert-dialog.tsx     # Alert dialog
├── confirmation-dialog.tsx # Confirmation dialog
├── skeleton.tsx         # Loading skeleton
├── sonner.tsx           # Toast notifications
└── ... (other UI primitives)
```

---

## Architecture Patterns

### 1. Route Groups
- `(auth)`: Authentication-related routes
- `(protected)`: Protected application routes (main app)
- `(client-d)`: Client dashboard routes
- `(form)`: Form-specific routes
- `(landing)`: Landing page routes

### 2. Layout Composition
- **Root Layout**: Provides global providers (Theme, Auth, Query)
- **Route Group Layouts**: Provide specific layouts for route groups
- **Nested Layouts**: Support nested layouts for detail pages

### 3. Component Organization
- **Feature-based**: Components organized by feature (jobs, candidates, clients, etc.)
- **UI Primitives**: Base UI components in `components/ui/`
- **Shared Components**: Common components in `components/common/`
- **Layout Components**: Layout-specific components (sidebar, header)

### 4. Service Layer
- All API calls abstracted into service files
- Services handle HTTP requests, error handling, and data transformation
- Services are used by components via React Query hooks

### 5. State Management
- **Server State**: React Query for server state management
- **Client State**: React useState/useReducer for local component state
- **Global State**: Context API for authentication and theme
- **Form State**: React Hook Form for form state management

### 6. Authentication & Authorization
- **AuthGuard**: Protects routes and redirects unauthenticated users
- **Permission-based**: Role and permission-based access control
- **AuthContext**: Provides authentication state and user information

### 7. Data Fetching
- **React Query**: Used for all server data fetching
- **Query Keys**: Organized by resource type (jobs, candidates, clients, etc.)
- **Optimistic Updates**: Supported for better UX

### 8. Form Handling
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Form Components**: Reusable form components in `components/ui/form.tsx`

### 9. Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Supported via next-themes
- **Component Variants**: Using class-variance-authority for component variants

### 10. Type Safety
- **TypeScript**: Full type safety across the application
- **Type Definitions**: Centralized in `src/types/`
- **Service Types**: Types defined for API responses and requests

---

## Key Features

1. **Multi-role Support**: Admin, Hiring Manager, Team Lead, Recruiter
2. **Permission-based Access**: Fine-grained permissions for different features
3. **Recruitment Pipeline**: Visual pipeline for tracking candidates through stages
4. **Client Management**: Comprehensive client management with contacts, contracts, and jobs
5. **Job Management**: Full job lifecycle management
6. **Candidate Management**: Complete candidate profile and tracking
7. **Task Management**: Today's tasks and activity tracking
8. **Team Management**: Team member management and user access control
9. **Dark Mode**: Full dark mode support
10. **Responsive Design**: Mobile-responsive design

---

## Development Guidelines

### Adding New Features
1. Create route in appropriate route group (`app/(protected)/`)
2. Create feature components in `components/[feature-name]/`
3. Create service in `services/[feature]Service.ts`
4. Add types in `types/[feature].ts`
5. Update sidebar navigation if needed

### Component Naming
- Use PascalCase for component files
- Use descriptive names that indicate the component's purpose
- Group related components in feature folders

### Service Naming
- Use camelCase with "Service" suffix: `[feature]Service.ts`
- Export functions that correspond to API operations

### Type Naming
- Use PascalCase for types and interfaces
- Group related types in feature-specific type files

---

## Notes

- This architecture supports scalability and maintainability
- Components are designed to be reusable and composable
- The service layer provides a clean separation between UI and API logic
- Type safety is enforced throughout the application
- The routing structure follows Next.js 14 App Router conventions
