"use client";

import { Bell, Gift, HelpCircle, Plus, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
      <header className="border-b">
        <div className="flex h-12 items-center px-4 gap-4">
          <SidebarTrigger />
          {isOnIdPage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              <ArrowLeft className="h-4 w-4" />
              {getBackNavigation().label}
            </Button>
          )}
          <div className="flex justify-center w-full">
            {/* <div className="relative max-w-[400px] w-full mx-auto">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Name, Job, Email or Client"
                className="pl-8 bg-blue-50"
              />
            </div> */}
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {/* <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button> */}
            {/* <Button variant="ghost" size="icon">
              <Gift className="h-4 w-4" />
            </Button> */}
            {/* <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button> */}
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAvatarClick}
            >
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
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
