'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useAuthStore } from '../../../store/authStore';
import { AchievementGrid } from '../../../components/Achievements/AchievementGrid';
import { Button } from '../../../components/ui/Button';

export default function MyAchievementsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    getProfile, 
    getUserAchievements, 
    getAvailableAchievements,
    unlockAchievement
  } = useSocialStore();

  const profile = user ? getProfile(user.id) : null;
  const userAchievements = profile ? getUserAchievements(profile.id) : [];
  const availableAchievements = getAvailableAchievements();

  const handleShareAchievement = (achievement: any) => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: `I earned the ${achievement.name} achievement!`,
        text: achievement.description,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(
        `I just earned the "${achievement.name}" achievement in LearnSmart! ${achievement.description}`
      );
    }
  };

  const handleAchievementClick = (achievement: any) => {
    // Navigate to achievement details or show modal
    console.log('Achievement clicked:', achievement);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              My Achievements
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Track your learning milestones and badges
            </p>
          </div>
        </div>

        {/* Achievement Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AchievementGrid
            achievements={userAchievements}
            availableAchievements={availableAchievements}
            currentUserId={profile.id}
            userId={profile.id}
            showLocked={true}
            layout="grid"
            onShare={handleShareAchievement}
            onAchievementClick={handleAchievementClick}
          />
        </motion.div>
      </div>
    </div>
  );
}