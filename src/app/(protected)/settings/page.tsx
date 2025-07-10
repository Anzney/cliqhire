import { SettingsCard } from "@/components/settings-card"
import {
  ProfileIcon,
  PreferencesIcon,
  IntegrationsIcon,
  NotificationsIcon,
  EmailIcon,
  SecurityIcon
} from "@/components/settings-icon"

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SettingsCard
              title="Profile"
              description="View and edit your personal profile settings. Manage your password."
              icon={<ProfileIcon />}
              href="/settings/profile"
            />
            <SettingsCard
              title="Preferences"
              description="Set your preferred currency, as well as time and date formats."
              icon={<PreferencesIcon />}
              href="/settings/preferences"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SettingsCard
              title="Integrations"
              description="Manage your calendar and email integrations."
              icon={<IntegrationsIcon />}
              href="/settings/integrations"
            />
            <SettingsCard
              title="Notifications"
              description="Manage your in-app and email notifications."
              icon={<NotificationsIcon />}
              href="/settings/notifications"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SettingsCard
              title="Email Settings"
              description="Manage your email settings and templates."
              icon={<EmailIcon />}
              href="/settings/email"
            />
            <SettingsCard
              title="Two-Factor Authentication"
              description="Enhance the security of your account with Two-Factor Authentication."
              icon={<SecurityIcon />}
              href="/settings/2fa"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

