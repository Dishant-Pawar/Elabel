'use client';

import { Camera, Check, LogOut, Shield, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/libs/supabase/client';

type UserProfile = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [sendingResetEmail, setSendingResetEmail] = useState(false);

  // Logout state
  const [loggingOut, setLoggingOut] = useState(false);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // In production, fetch from users table
        const userProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        };
        setProfile(userProfile);
        setProfileForm({
          name: userProfile.name || '',
        });
      }
    };
    loadProfile();
  }, [supabase]);

  // Handle profile update
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileForm.name,
        },
      });

      if (error) {
        throw error;
      }

      setProfile(prev => prev ? { ...prev, ...profileForm } : null);
      setIsEditingProfile(false);

      // Refresh the page to update the header
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    setPasswordError('');

    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.new.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    // Verify current password before changing
    if (!passwordForm.current) {
      setPasswordError('Please enter your current password');
      return;
    }

    setSavingPassword(true);
    try {
      // First, verify the current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: profile?.email || '',
        password: passwordForm.current,
      });

      if (verifyError) {
        setPasswordError('Current password is incorrect');
        setSavingPassword(false);
        return;
      }

      // Now update the password
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new,
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('same_password') || error.message.includes('same password')) {
          setPasswordError('New password must be different from your current password');
        } else {
          setPasswordError(error.message || 'Failed to update password. Please try again.');
        }
        setSavingPassword(false);
        return;
      }

      setIsEditingPassword(false);
      setPasswordForm({ current: '', new: '', confirm: '' });

      // Sign out user after password change to force re-login with new password
      await supabase.auth.signOut();

      // Show success message and redirect
      setPasswordError('Password updated successfully! Please login with your new password.');
      setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 2000);
    } catch (error: any) {
      console.error('Error updating password:', error);

      // Parse error message for better user feedback
      if (error?.message?.includes('same_password') || error?.message?.includes('same password')) {
        setPasswordError('New password must be different from your current password');
      } else if (error?.message) {
        setPasswordError(error.message);
      } else {
        setPasswordError('Failed to update password. Please try again.');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!profile?.email || sendingResetEmail) {
      return;
    }

    setSendingResetEmail(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        // Handle rate limiting error
        if (error.message?.includes('email_send_rate_limit') || error.message?.includes('rate limit')) {
          setPasswordError('Too many requests. Please wait a few minutes before trying again.');
        } else {
          setPasswordError(error.message || 'Failed to send reset email. Please try again.');
        }
        setTimeout(() => {
          setPasswordError('');
          setSendingResetEmail(false);
        }, 5000);
        return;
      }

      setPasswordError('Password reset email sent! Check your inbox.');
      setTimeout(() => {
        setPasswordError('');
        setSendingResetEmail(false);
      }, 5000);
    } catch (error: any) {
      console.error('Error sending reset email:', error);

      // Handle specific error cases
      if (error?.message?.includes('email_send_rate_limit') || error?.message?.includes('rate limit')) {
        setPasswordError('Too many password reset requests. Please wait 60 seconds before trying again.');
      } else if (error?.status === 429) {
        setPasswordError('Too many requests. Please wait a few minutes and try again.');
      } else {
        setPasswordError('Failed to send reset email. Please try again later.');
      }
      setTimeout(() => {
        setPasswordError('');
        setSendingResetEmail(false);
      }, 60000); // 60 second cooldown on error
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  // Handle logout all devices
  const handleLogoutAllDevices = async () => {
    try {
      // Sign out globally - this invalidates all sessions
      await supabase.auth.signOut({ scope: 'global' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out all devices:', error);
    }
  };

  if (!profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your profile information
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-2xl font-bold text-white">
                {profile.name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 rounded-full bg-white p-1.5 shadow-lg ring-2 ring-white hover:bg-gray-50"
              >
                <Camera className="size-4 text-gray-600" />
              </button>
            </div>
            <div>
              <p className="font-medium">{profile.name || 'No name set'}</p>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          <Separator />

          {/* Name */}
          {!isEditingProfile
            ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Name</Label>
                    <p className="mt-1 font-medium">{profile.name || 'Not set'}</p>
                  </div>
                  <Button onClick={() => setIsEditingProfile(true)} variant="outline">
                    Edit Profile
                  </Button>
                </div>
              )
            : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={savingProfile}>
                      <Check className="mr-2 size-4" />
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileForm({
                          name: profile.name || '',
                        });
                      }}
                      variant="outline"
                    >
                      <X className="mr-2 size-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Password & Security
          </CardTitle>
          <CardDescription>
            Manage your password and account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-semibold">Password</Label>
            {!isEditingPassword
              ? (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-600">••••••••••••</p>
                    <div className="flex gap-2">
                      <Button onClick={() => setIsEditingPassword(true)} variant="outline" size="sm">
                        Change Password
                      </Button>
                      <Button
                        onClick={handleForgotPassword}
                        variant="ghost"
                        size="sm"
                        disabled={sendingResetEmail}
                      >
                        {sendingResetEmail ? 'Sending...' : 'Forgot Password?'}
                      </Button>
                    </div>
                  </div>
                )
              : (
                  <div className="mt-2 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordForm.current}
                        onChange={e =>
                          setPasswordForm({ ...passwordForm, current: e.target.value })}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.new}
                        onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        placeholder="Enter new password (min. 6 characters)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        placeholder="Re-enter new password"
                      />
                    </div>
                    {passwordError && (
                      <p className={`text-sm ${passwordError.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordError}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handlePasswordChange} disabled={savingPassword} size="sm">
                        {savingPassword ? 'Updating...' : 'Update Password'}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditingPassword(false);
                          setPasswordForm({ current: '', new: '', confirm: '' });
                          setPasswordError('');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
          </div>
        </CardContent>
      </Card>

      {/* Logout Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <LogOut className="size-5" />
            Sign Out
          </CardTitle>
          <CardDescription>
            Sign out of your account or all devices for enhanced security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="mr-2 size-4" />
            {loggingOut ? 'Logging out...' : 'Log Out'}
          </Button>
          <Button
            onClick={handleLogoutAllDevices}
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-100"
          >
            Log Out of All Devices
          </Button>
          <p className="text-sm text-gray-600">
            Logging out of all devices will end all active sessions on other devices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
