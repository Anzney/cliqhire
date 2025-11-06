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
        <DialogContent className="sm:max-w-[400px] md:max-w-[500px] p-0 overflow-hidden rounded-2xl [&>button.absolute.right-4.top-4]:hidden">
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-16 px-6 pt-6 border-0 bg-muted relative">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl tracking-tight">User Profile</CardTitle>
                  <CardDescription>
                    Your account information
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground ">Active</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 px-6">
              <div className="space-y-6">
                {/* User Avatar and Basic Info Card overlapping header */}
                <div className="-mt-12">
                  <div className="relative rounded-2xl bg-white shadow-xl border border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative ">
                        <Avatar className="h-20 w-20 ring-8 ring-white shadow-lg">
                          <AvatarFallback className="text-xl">
                            {user ? getUserInitials(user.name) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-xl font-semibold truncate">{user?.name || 'User Name'}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 truncate">
                          <Mail className="h-4 w-4" />
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <Separator /> */}

                {/* User Details */}
                <div className="grid gap-4">
                  {/* Team Role Card */}
                  <div className="flex items-center gap-4 rounded-xl border bg-background px-4 py-4 shadow-sm">
                    <div className="h-10 w-10 rounded-md flex items-center justify-center bg-muted text-foreground">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Team Role</p>
                      <p className="text-base font-semibold truncate">{user?.role || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Member Since Card */}
                  {user?.createdAt && (
                    <div className="flex items-center gap-4 rounded-xl border bg-background px-4 py-4 shadow-sm">
                      <div className="h-10 w-10 rounded-md flex items-center justify-center bg-muted text-foreground">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Member Since</p>
                        <p className="text-base font-semibold truncate">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  )}

                  {/* Account Security Card */}
                  <button
                    type="button"
                    onClick={() => setShowPasswordDialog(true)}
                    className="flex items-center gap-4 rounded-xl border bg-background px-4 py-4 shadow-sm w-full text-left hover:bg-muted/50 transition"
                  >
                    <div className="h-10 w-10 rounded-md flex items-center justify-center bg-muted text-foreground">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Account Security</p>
                      <p className="text-base font-semibold">Change Password</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col justify-between sm:flex-row gap-3 p-5 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                onClick={handleLogout}
                disabled={loading}
                variant="destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {loading ? 'Logging out...' : 'Logout'}
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <ChangePasswordDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog} 
      />
    </>
  );
}
