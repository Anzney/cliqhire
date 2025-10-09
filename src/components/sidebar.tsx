"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Calendar,
  Home,
  Lock,
  MessageSquare,
  Settings,
  Users,
  Briefcase,
  UserCheck,
  BarChart,
  Search,
  DollarSign,
  Route,
  LockKeyhole,
  ListTodo
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar as UISidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

const menuItems = [
  { name: "Home", icon: Home, href: "/", permission: "HOME" },
  // { name: "Today's Tasks", icon: ListTodo , href: "/today-tasks", permission: "TODAY_TASKS" },
  { name: "Clients", icon: Building2, href: "/clients", permission: "CLIENTS" },
  { name: "Jobs", icon: Briefcase, href: "/jobs", permission: "JOBS" },
  { name: "Candidates", icon: Users, href: "/candidates", permission: "CANDIDATE" },
  { name: "Recruitment Pipeline", icon: Route, href: "/reactruterpipeline", permission: "RECRUITMENT_PIPELINE" },
  { name: "Team Members", icon: Users, href: "/teammembers", permission: "TEAM_MEMBERS" },
  { name: "User Access", icon: LockKeyhole, href: "/user-access", permission: "USER_ACCESS" },
  // { name: "Placements", icon: UserCheck, href: "/placements", permission: "PLACEMENTS" },
  // { name: "Activities", icon: Calendar, href: "/activities", permission: "ACTIVITIES" },
  // { name: "Inbox", icon: MessageSquare, href: "/inbox", permission: "INBOX" },
  // { name: "Account & Finance", icon: DollarSign, href: "/finance", permission: "FINANCE" },
  // { name: "Reports", icon: BarChart, href: "/reports", permission: "REPORTS" },
  // { name: "Settings", icon: Settings, href: "/settings", permission: "SETTINGS" },
  // { name: "Administration", icon: Lock, href: "/admin", permission: "ADMIN" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN';

  // Determine which permissions to use
  // If user has custom permissions, use those; otherwise use default permissions
  let finalPermissions = (user?.permissions && user.permissions.length > 0) 
    ? user.permissions 
    : user?.defaultPermissions || [];
  
  // Ensure TODAY_TASKS permission is available for all non-admin users
  if (!isAdmin && !finalPermissions.includes('TODAY_TASKS')) {
    finalPermissions = [...finalPermissions, 'TODAY_TASKS'];
  }

  return (
    <UISidebar
      collapsible="icon"
      className="border-r"
      data-variant="sidebar"
      style={{ ["--sidebar-width" as any]: "13rem", ["--sidebar-width-icon" as any]: "2.5rem" }}
    >
      <SidebarHeader className="border-b">
        <div className="px-4 py-8">
          <h1 className="text-xl font-semibold">Cliqhire</h1>
        </div>
      </SidebarHeader>
      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter((item) => {
                  if (isAdmin && item.permission === 'TODAY_TASKS') return false;
                  return isAdmin || item.permission === "HOME" || finalPermissions.includes(item.permission);
                })
                .map((item, index) => {
                  const active = (item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        isActive={!!active}
                        tooltip={{
                          children: item.name,
                          className: "bg-green-100 text-green-700 border border-green-200"
                        }}
                        className={cn(
                          active && "bg-blue-100 text-blue-600 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-600"
                        )}
                      >
                        <Link href={item.href} className={cn(active ? "font-medium" : undefined)}>
                          <Icon />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </UISidebar>
  );
}