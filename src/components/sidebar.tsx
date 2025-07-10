"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Calendar, Home, Lock, MessageSquare, Settings, Users, Briefcase, UserCheck, BarChart, Search, DollarSign } from 'lucide-react'
import { cn } from "@/lib/utils"

const menuItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Clients", icon: Building2, href: "/clients" },
  { name: "Jobs", icon: Briefcase, href: "/jobs" },
  { name: "Recruiters", icon: Users, href: "/recruiter"   }, 
  { name: "Candidates", icon: Users, href: "/candidates" }, // Line after "Candidates"
  { name: "Placements", icon: UserCheck, href: "/placements" },
  { name: "Activities", icon: Calendar, href: "/activities" },
  
  { name: "Inbox", icon: MessageSquare, href: "/inbox" },  // Line after "Inbox"
  { name: "Account & Finance", icon: DollarSign, href: "/finance" },
  { name: "Reports", icon: BarChart, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Administration", icon: Lock, href: "/admin" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-[240px] border-r bg-gray-50/40 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-semibold">Cliqhire</h1>
      </div>
      <nav className="flex-1 px-2">
        <ol>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
                pathname === item.href 
                  ? "bg-blue-100 text-blue-600 font-medium" 
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <item.icon className={cn("h-4 w-4", pathname === item.href ? "text-blue-600" : "text-gray-500")} />
              {item.name}
            </Link>
            {/* Add horizontal line after "Candidates" and "Inbox" */}
            {(item.name === "Candidates" || item.name === "Inbox") && <hr className="my-2 border-gray-200" />}
          </li>
        ))}
        </ol>
      </nav>
    </div>
  )
}