'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Shield, Bell, Eye, Palette } from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/ui/Button';
import { EditProfile } from '../../../components/Social/EditProfile';
import { UserProfile } from '../../../lib/types';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { getProfile, updateProfile, setCurrentProfile } = useSocialStore();

  const [isLoading, setIsLoading] = useState(false);
  
  const profile = user ? getProfile(user.id) : null;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Loading settings...</p>
        </div>
      </div>
    );
  }

  const handleSave = async (profileData: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      updateProfile(profile.id, profileData);
      setCurrentProfile({ ...profile, ...profileData });
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/profile/me');
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)]">
                Account Settings
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Manage your account, privacy, and preferences
              </p>
            </div>
          </div>
        </div>

        <EditProfile
          profile={profile}
          onSave={handleSave}
          onCancel={() => router.back()}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
