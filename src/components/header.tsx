"use client";

import { Bell, Gift, HelpCircle, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GlobalSearch } from "@/components/global-search";
import { UserProfileDialog } from "@/components/user-profile/user-profile-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const { user } = useAuth();

  // Check if we're on an ID page (contains /[id] pattern)
  const isOnIdPage = pathname ? /\/[^\/]+\/[^\/]+$/.test(pathname) : false;

  // Determine the back navigation path and label
  const getBackNavigation = () => {
    if (!pathname) {
      return { path: "/", label: "Back" };
    }
    if (pathname.includes("/reactruterpipeline/")) {
      return { path: "/reactruterpipeline", label: "Back to Recruiter Pipeline" };
    }
    if (pathname.includes("/clients/")) {
      return { path: "/clients", label: "Back to Clients" };
    }
    if (pathname.includes("/jobs/")) {
      return { path: "/jobs", label: "Back to Jobs" };
    }
    if (pathname.includes("/candidates/")) {
      return { path: "/candidates", label: "Back to Candidates" };
    }
    // Add more routes as needed
    return { path: "/", label: "Back" };
  };

  const handleBack = () => {
    const { path } = getBackNavigation();
    router.push(path);
  };

  const handleAvatarClick = () => {
    setIsProfileDialogOpen(true);
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((word: string) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-background/80">
        <div className="flex h-14 items-center px-6 gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="hover:bg-brand/10 hover:text-brand transition-colors" />
          </div>

          {isOnIdPage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-brand hover:bg-brand/10 transition-all rounded-full px-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">{getBackNavigation().label}</span>
            </Button>
          )}

          <div className="flex-1 flex justify-center max-w-2xl mx-auto">
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-brand/10 hover:text-brand transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-white ring-1 ring-brand/20 animate-pulse" />
            </Button>

            <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block" />

            <div
              className="flex items-center gap-3 pl-2 cursor-pointer group"
              onClick={handleAvatarClick}
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold leading-none group-hover:text-brand transition-colors">
                  {user?.name || 'User'}
                </span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                  {user?.role || 'Member'}
                </span>
              </div>
              <Avatar
                className="h-9 w-9 ring-2 ring-transparent group-hover:ring-brand/30 transition-all shadow-sm"
              >
                <AvatarFallback className="bg-brand/10 text-brand font-bold text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <UserProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
    </>
  );
}
