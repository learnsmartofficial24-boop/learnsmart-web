'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { UserProfile } from '../../lib/types';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { ProfileBanner } from '../../components/Social/ProfileBanner';
import { EditProfile } from '../../components/Social/EditProfile';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

export default function MyProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    currentProfile, 
    setCurrentProfile, 
    updateProfile, 
    getProfile,
    getUserAchievements,
    getAvailableAchievements
  } = useSocialStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get or create current user profile
  const profile = React.useMemo(() => {
    if (user) {
      let userProfile = getProfile(user.id);
      if (!userProfile) {
        // Create profile if it doesn't exist
        const newProfile: UserProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          class: user.class,
          stream: user.stream,
          specialization: user.specialization,
          subjects: user.subjects,
          avatar: user.avatar,
          theme: user.theme,
          createdAt: user.createdAt,
          bio: '',
          joinDate: new Date(),
          lastActive: new Date(),
          totalXP: 0,
          currentLevel: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalQuizzes: 0,
          totalConcepts: 0,
          totalStudyTime: 0,
          averageQuizScore: 0,
          achievementsCount: 0,
          followersCount: 0,
          followingCount: 0,
          groupsCount: 0,
          privacy: {
            showProfile: true,
            showProgress: true,
            showAchievements: true,
            showStats: true
          }
        };
        updateProfile(user.id, newProfile);
        userProfile = newProfile;
      }
      setCurrentProfile(userProfile);
      return userProfile;
    }
    return null;
  }, [user, getProfile, updateProfile, setCurrentProfile]);

  const userAchievements = profile ? getUserAchievements(profile.id) : [];
  const availableAchievements = getAvailableAchievements();

  const handleSaveProfile = async (profileData: Partial<UserProfile>) => {
    if (!profile) return;

    setIsLoading(true);
    try {
      // Update profile in store
      updateProfile(profile.id, profileData);
      setCurrentProfile({ ...profile, ...profileData });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Loading profile...</p>
        </div>
      </div>
    );
  }

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
                My Profile
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Manage your profile and track your learning progress
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={() => {/* Save is handled in EditProfile */}}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EditProfile
              profile={profile}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
              isLoading={isLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Profile Banner */}
            <ProfileBanner
              profile={profile}
              currentUserId={profile.id}
              showEditButton={true}
              onEdit={() => setIsEditing(true)}
              achievements={userAchievements.slice(0, 6)}
            />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/profile/me/achievements')}
                className="flex items-center justify-center space-x-2 h-12"
              >
                <span>🏆</span>
                <span>View Achievements ({userAchievements.length})</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/social/leaderboard')}
                className="flex items-center justify-center space-x-2 h-12"
              >
                <span>📊</span>
                <span>View Leaderboard</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/groups')}
                className="flex items-center justify-center space-x-2 h-12"
              >
                <span>👥</span>
                <span>My Groups ({profile.groupsCount})</span>
              </Button>
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                {userAchievements.slice(0, 3).map((userAchievement) => (
                  <div
                    key={userAchievement.achievement.id}
                    className="flex items-center space-x-3 p-3 bg-[var(--accent)]/30 rounded-lg"
                  >
                    <span className="text-2xl">{userAchievement.achievement.icon}</span>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        Unlocked "{userAchievement.achievement.name}"
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {userAchievement.earnedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {userAchievements.length === 0 && (
                  <p className="text-[var(--muted-foreground)] text-center py-4">
                    No recent achievements. Start learning to unlock your first achievement!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}