'use client';

import { Camera, Check, LogOut, Mail, Shield, User, X } from 'lucide-react';
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
  job_title?: string;
  avatar_url?: string;
};

type ConnectedAccount = {
  provider: string;
  email: string;
  connected_at: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', job_title: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Email state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  // Password state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Connected accounts (mock data - would come from Supabase in production)
  const [connectedAccounts] = useState<ConnectedAccount[]>([
    {
      provider: 'Google',
      email: 'user@gmail.com',
      connected_at: '2024-01-15',
    },
  ]);

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
          job_title: user.user_metadata?.job_title || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        };
        setProfile(userProfile);
        setProfileForm({
          name: userProfile.name || '',
          job_title: userProfile.job_title || '',
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
          job_title: profileForm.job_title,
        },
      });

      if (error) {
        throw error;
      }

      setProfile(prev => prev ? { ...prev, ...profileForm } : null);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle email change
  const handleEmailChange = async () => {
    if (!newEmail || newEmail === profile?.email) {
      return;
    }

    setSavingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        throw error;
      }

      setEmailVerificationSent(true);
      setTimeout(() => {
        setIsEditingEmail(false);
        setEmailVerificationSent(false);
        setNewEmail('');
      }, 3000);
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Failed to update email. Please try again.');
    } finally {
      setSavingEmail(false);
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

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new,
      });

      if (error) {
        throw error;
      }

      setIsEditingPassword(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!profile?.email) {
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert('Failed to send reset email. Please try again.');
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
    if (!window.confirm('Are you sure you want to log out of all devices?')) {
      return;
    }

    try {
      // Sign out globally - this invalidates all sessions
      await supabase.auth.signOut({ scope: 'global' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out all devices:', error);
      alert('Failed to log out of all devices. Please try again.');
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
          Manage your profile, security settings, and connected accounts
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
                {profile.name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
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

          {/* Name & Job Title */}
          {!isEditingProfile
            ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Name</Label>
                    <p className="mt-1 font-medium">{profile.name || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Job Title</Label>
                    <p className="mt-1 font-medium">{profile.job_title || 'Not set'}</p>
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
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title (Optional)</Label>
                    <Input
                      id="job-title"
                      value={profileForm.job_title}
                      onChange={e => setProfileForm({ ...profileForm, job_title: e.target.value })}
                      placeholder="e.g., Product Manager"
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
                          job_title: profile.job_title || '',
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

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Security & Authentication
          </CardTitle>
          <CardDescription>
            Manage your email, password, and connected accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div>
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Mail className="size-4" />
              Email Address
            </Label>
            {!isEditingEmail
              ? (
                  <div className="mt-2 space-y-2">
                    <p className="font-medium">{profile.email}</p>
                    <Button onClick={() => setIsEditingEmail(true)} variant="outline" size="sm">
                      Change Email
                    </Button>
                  </div>
                )
              : (
                  <div className="mt-2 space-y-3">
                    {emailVerificationSent
                      ? (
                          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <p className="text-sm text-green-800">
                              ✓ Verification email sent! Check your inbox at
                              {' '}
                              <strong>{newEmail}</strong>
                              {' '}
                              to
                              confirm the change.
                            </p>
                          </div>
                        )
                      : (
                          <>
                            <Input
                              type="email"
                              value={newEmail}
                              onChange={e => setNewEmail(e.target.value)}
                              placeholder="Enter new email address"
                            />
                            <p className="text-sm text-gray-600">
                              You'll receive a verification link at your new email address.
                            </p>
                            <div className="flex gap-2">
                              <Button onClick={handleEmailChange} disabled={savingEmail} size="sm">
                                {savingEmail ? 'Sending...' : 'Send Verification Email'}
                              </Button>
                              <Button
                                onClick={() => {
                                  setIsEditingEmail(false);
                                  setNewEmail('');
                                }}
                                variant="outline"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        )}
                  </div>
                )}
          </div>

          <Separator />

          {/* Password */}
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
                      <Button onClick={handleForgotPassword} variant="ghost" size="sm">
                        Forgot Password?
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
                      <p className="text-sm text-red-600">{passwordError}</p>
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

          <Separator />

          {/* Connected Accounts */}
          <div>
            <Label className="text-base font-semibold">Connected Accounts</Label>
            <p className="mt-1 text-sm text-gray-600">
              Manage third-party accounts linked to your profile
            </p>
            <div className="mt-4 space-y-3">
              {connectedAccounts.length > 0
                ? (
                    connectedAccounts.map(account => (
                      <div
                        key={account.provider}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
                            <span className="text-sm font-semibold">{account.provider[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{account.provider}</p>
                            <p className="text-sm text-gray-600">{account.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      </div>
                    ))
                  )
                : (
                    <p className="text-sm text-gray-500">No connected accounts</p>
                  )}
              <Button variant="outline" size="sm" className="w-full">
                + Connect Google Account
              </Button>
            </div>
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
