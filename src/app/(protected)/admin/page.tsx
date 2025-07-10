import { AdminCard } from "@/components/admin-card"
import {
  AccountIcon,
  DataIcon,
  IntegrationsIcon,
  SubscriptionIcon,
  CareerIcon,
  JobBoardsIcon,
  ResumesIcon,
  CustomizationIcon,
  FeaturesIcon,
  SupportIcon,
} from "@/components/admin-icons"

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-semibold">Administration</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminCard
              title="Account & Users"
              description="Manage your account details, users, groups and guests."
              actionText="Manage your account"
              actionHref="/admin/account"
              icon={<AccountIcon />}
            />
            <AdminCard
              title="Data Management"
              description="Track GDPR consent and view logs. Import candidates, jobs and more."
              actionText="Manage your data"
              actionHref="/admin/data"
              icon={<DataIcon />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminCard
              title="Integrations"
              description="Manage your third-party software and tool integrations."
              actionText="Manage third-party integrations"
              actionHref="/admin/integrations"
              icon={<IntegrationsIcon />}
            />
            <AdminCard
              title="Subscription"
              description="Manage your subscription, payment methods, and access your invoices."
              actionText="Manage your subscription"
              actionHref="/admin/subscription"
              icon={<SubscriptionIcon />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminCard
              title="Career Page"
              description="Enable and set-up your career page."
              actionText="Manage your career page"
              actionHref="/admin/career"
              icon={<CareerIcon />}
            />
            <AdminCard
              title="Job Boards"
              description="Manage your job boards and publish your open positions."
              actionText="Manage your job boards"
              actionHref="/admin/job-boards"
              icon={<JobBoardsIcon />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminCard
              title="Resumes"
              description="Set up your candidate resumes via branded and custom resume features."
              actionText="Customize resumes"
              actionHref="/admin/resumes"
              icon={<ResumesIcon />}
            />
            <AdminCard
              title="Customization"
              description="Customize your jobs, clients, contacts, candidates, and dashboard."
              actionText="Customize your account"
              actionHref="/admin/customization"
              icon={<CustomizationIcon />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminCard
              title="Features"
              description="Manage duplicate detection, vendors, employees and other settings."
              actionText="Manage features"
              actionHref="/admin/features"
              icon={<FeaturesIcon />}
            />
            <AdminCard
              title="Support"
              description="Grant our support team access to your Manatal account, check our documentations or report an incident."
              actionText="Get support"
              actionHref="/admin/support"
              icon={<SupportIcon />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

