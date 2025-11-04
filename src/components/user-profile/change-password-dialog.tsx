"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { logout } = useAuth();
  const router = useRouter();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    setPasswordLoading(true);
    try {
      // Call auth service to change password
      const result = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (result.success) {
        // Show success message
        toast.success("Password updated", {
          description: "Your password has been changed successfully. You will be logged out."
        });
        
        // Reset form
        resetForm();
        
        // Close the dialog
        onOpenChange(false);
        
        // Add a small delay before logout to allow the toast to be seen
        setTimeout(async () => {
          try {
            // Logout the user
            await logout();
            
            // Redirect to login page
            router.push('/login');
          } catch (error) {
            console.error('Error during logout after password change:', error);
          }
        }, 1500);
      } else {
        // Show error message from the API
        setPasswordError(result.message || "Failed to change password. Please check your current password.");
        toast.error("Password change failed", {
          description: result.message || "Failed to change password. Please check your current password."
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError("Failed to change password. Please check your current password.");
      toast.error("Password change failed", {
        description: "An unexpected error occurred. Please try again later."
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const resetForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[560px] p-8 bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 text-white">
        <DialogHeader className="items-center text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center shadow-lg/50 shadow-black/20">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <DialogTitle className="text-3xl font-semibold tracking-tight">Change Password</DialogTitle>
          <DialogDescription className="text-white/80 text-sm">
            Keep your account secure with a strong password
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handlePasswordChange}>
          <div className="space-y-5 py-2">
            {passwordError && (
              <div className="bg-red-500/15 text-red-200 text-sm p-3 rounded-md flex items-center gap-2 border border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                {passwordError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-white/90 text-sm">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input 
                  id="current-password" 
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                  required
                  className="pl-10 pr-10 h-12 rounded-xl bg-white/10 border-white/20 placeholder:text-white/70 text-white focus-visible:ring-white/40 focus-visible:ring-2"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white/90 text-sm">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input 
                  id="new-password" 
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                  required
                  className="pl-10 pr-10 h-12 rounded-xl bg-white/10 border-white/20 placeholder:text-white/70 text-white focus-visible:ring-white/40 focus-visible:ring-2"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white/90 text-sm">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input 
                  id="confirm-password" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                  required
                  className="pl-10 pr-10 h-12 rounded-xl bg-white/10 border-white/20 placeholder:text-white/70 text-white focus-visible:ring-white/40 focus-visible:ring-2"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={passwordLoading}
              className="h-11 rounded-xl px-6 bg-white/10 hover:bg-white/15 text-white border border-white/20"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={passwordLoading || !(
                passwordData.currentPassword &&
                passwordData.newPassword.length >= 8 &&
                passwordData.newPassword === passwordData.confirmPassword
              )}
              className="h-11 rounded-xl px-6 bg-white/25 hover:bg-white/30 text-white disabled:opacity-50 disabled:bg-white/10 disabled:text-white/70"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}