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
  ListTodo,
  UserRoundSearch
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
  { name: "Today's Tasks", icon: ListTodo , href: "/today-tasks", permission: "TODAY_TASKS" },
  { name: "Clients", icon: Building2, href: "/clients", permission: "CLIENTS" },
  { name: "Jobs", icon: Briefcase, href: "/jobs", permission: "JOBS" },
  { name: "Candidates", icon: Users, href: "/candidates", permission: "CANDIDATE" },
  { name: "Recruitment Pipeline", icon: Route, href: "/reactruterpipeline", permission: "RECRUITMENT_PIPELINE" },
  { name: "Head Hunter", icon:  UserRoundSearch, href: "/headhunter", permission: "HEAD_HUNTER" },
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

  // Check user role
  const isAdmin = user?.role === 'ADMIN';
  const isHiringManager = user?.role === 'HIRING_MANAGER';
  const isTeamLead = user?.role === 'TEAM_LEAD';
  const isManagerOrLead = isAdmin || isHiringManager || isTeamLead;

  // Determine which permissions to use
  // If user has custom permissions, use those; otherwise use default permissions
  let finalPermissions = (user?.permissions && user.permissions.length > 0) 
    ? user.permissions 
    : user?.defaultPermissions || [];
  
  // Ensure TODAY_TASKS permission is available for all non-admin users
  if (!isAdmin && !finalPermissions.includes('TODAY_TASKS')) {
    finalPermissions = [...finalPermissions, 'TODAY_TASKS'];
  }

  // Map base permissions to required VIEW permissions for sidebar visibility
  const permissionViewMap: Record<string, string> = {
    CLIENTS: 'CLIENTS_VIEW',
    JOBS: 'JOBS_VIEW',
    CANDIDATE: 'CANDIDATE_VIEW',
    RECRUITMENT_PIPELINE: 'RECRUITMENT_PIPELINE_VIEW',
    TEAM_MEMBERS: 'TEAM_MEMBERS_VIEW',
    USER_ACCESS: 'USER_ACCESS_VIEW',
  };

  // Special permissions for managers and leads
  if (isManagerOrLead) {
    finalPermissions = [...finalPermissions, 'TEAM_MEMBERS_VIEW', 'USER_ACCESS_VIEW'];
  }

  return (
    <UISidebar
      collapsible="icon"
      className="border-r"
      data-variant="sidebar"
      style={{ ["--sidebar-width" as any]: "13rem", ["--sidebar-width-icon" as any]: "3rem" }}
    >
      <SidebarHeader className=" group-data-[collapsible=icon]:hidden">
          <h1 className="text-xl font-semibold">Cliqhire</h1>
      </SidebarHeader>
      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:gap-2">
              {menuItems
                .filter((item) => {
                  if (isAdmin && item.permission === 'TODAY_TASKS') return false;
                  if (isAdmin) return true;
                  if (item.permission === 'HOME') return true;
                  const requiredView = permissionViewMap[item.permission as keyof typeof permissionViewMap];
                  if (requiredView) {
                    return finalPermissions.includes(requiredView);
                  }
                  return finalPermissions.includes(item.permission);
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
                          className: "bg-blue-100 text-blue-700 border border-blue-200"
                        }}
                        className={cn(
                          active && " bg-blue-100 text-blue-600 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-600"
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