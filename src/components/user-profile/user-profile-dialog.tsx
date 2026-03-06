"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut,
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  ChevronRight
} from "lucide-react";
import { authService, User } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ChangePasswordDialog } from "./change-password-dialog";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      onOpenChange(false);
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Password dialog is now handled by the ChangePasswordDialog component

  const getUserInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return 'U';
    }
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem] bg-background">
          <div className="flex flex-col w-full">
            {/* Header / Cover Area */}
            <div className="h-20 bg-gradient-to-br from-brand via-brand/80 to-brand/60 relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 0 L100 0 L100 100 L0 0 Z" fill="white" />
                </svg>
              </div>
            </div>

            {/* Profile Section */}
            <div className="px-8 pb-6 flex flex-col items-center text-center">
              {/* Avatar stays centered and overlapping */}
              <div className="-mt-10 mb-2 relative z-10">
                <Avatar className="h-20 w-20 ring-[6px] ring-background shadow-xl border-none">
                  <AvatarFallback className="bg-brand text-white text-xl font-bold">
                    {user ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name and Email */}
              <div className="space-y-0.5 mb-4">
                <h3 className="text-xl font-bold tracking-tight text-foreground">{user?.name || 'User Name'}</h3>
                <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs font-medium">
                  <Mail className="h-3.5 w-3.5 opacity-70" />
                  {user?.email || 'user@example.com'}
                </p>
              </div>

              {/* Info Cards - Uniform Width */}
              <div className="w-full space-y-1.5">
                <div className="flex items-center gap-3.5 rounded-2xl border border-muted bg-muted/30 px-4 py-2.5 transition-all">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-brand/10 text-brand">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">Role</p>
                    <p className="text-sm font-bold text-foreground">{user?.role || 'Member'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-muted bg-muted/30 px-4 py-2.5 transition-all">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-brand/10 text-brand">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">Member Since</p>
                    <p className="text-sm font-bold text-foreground">
                      {user?.createdAt ? formatDate(user.createdAt) : 'Joined recently'}
                    </p>
                  </div>
                </div>

                {/* VISIBLE Password Change Option */}
                <button
                  type="button"
                  onClick={() => setShowPasswordDialog(true)}
                  className="w-full flex items-center gap-3.5 rounded-2xl border border-muted bg-muted/30 px-4 py-2.5 transition-all hover:bg-brand/5 hover:border-brand/20 group"
                >
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-brand/10 text-brand group-hover:scale-110 transition-transform">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">Security</p>
                    <p className="text-sm font-bold text-foreground">Change Password</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {/* Logout Button */}
              <div className="w-full mt-5 pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl px-4 py-3 h-auto transition-all group"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <div className="flex items-center gap-3.5 w-full">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive group-hover:scale-110 transition-transform">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold">{loading ? 'Logging out...' : 'Sign Out'}</p>
                      <p className="text-[10px] font-medium opacity-70 leading-tight">End your current session</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
}
