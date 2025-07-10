import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SettingsCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  className?: string
}

export function SettingsCard({
  title,
  description,
  icon,
  href,
  className,
}: SettingsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between p-6 rounded-lg border bg-white shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

