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
            <CardHeader className="pb-20 px-6 pt-6 border-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white relative">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl tracking-tight text-white">User Profile</CardTitle>
                  <CardDescription className="text-white/80">
                    Your account information
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/20 text-white px-3 py-1 text-xs font-medium ring-1 ring-white/30">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                    Active
                  </span>
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
                          <AvatarFallback className="text-xl bg-primary/10 text-primary">
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
                  <div className="flex items-center gap-4 rounded-[18px] border border-blue-100 bg-blue-50/60 px-4 py-4 shadow-sm">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-blue-600 text-white">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold tracking-widest text-blue-700 uppercase">Team Role</p>
                      <p className="text-base font-semibold text-blue-900 truncate">{user?.role || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Member Since Card */}
                  {user?.createdAt && (
                    <div className="flex items-center gap-4 rounded-[18px] border border-purple-100 bg-purple-50/60 px-4 py-4 shadow-sm">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-purple-600 text-white">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold tracking-widest text-purple-700 uppercase">Member Since</p>
                        <p className="text-base font-semibold text-purple-900 truncate">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  )}

                  {/* Account Security Card */}
                  <button
                    type="button"
                    onClick={() => setShowPasswordDialog(true)}
                    className="flex items-center gap-4 rounded-[18px] border border-amber-300 bg-amber-50 px-4 py-4 shadow-sm w-full text-left hover:bg-amber-50/80 transition"
                  >
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-500 text-white">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold tracking-widest text-amber-700 uppercase">Account Security</p>
                      <p className="text-base font-semibold text-amber-900">Change Password</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-amber-700" />
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col justify-between sm:flex-row gap-3 bg-muted/30 p-5 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto rounded-full shadow-sm px-5"
              >
                Close
              </Button>
              <Button
                onClick={handleLogout}
                disabled={loading}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 px-5"
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
