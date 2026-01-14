'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, MessageCircle, Award, Users } from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useAuthStore } from '../../../store/authStore';
import { ProfileBanner } from '../../../components/Social/ProfileBanner';
import { ProfileStats } from '../../../components/Social/ProfileStats';
import { ProfileAchievements } from '../../../components/Social/ProfileAchievements';
import { UserProfileCard } from '../../../components/Social/UserProfileCard';
import { Button } from '../../../components/ui/Button';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    getProfile, 
    getUserAchievements, 
    getAvailableAchievements, 
    followUser, 
    unfollowUser,
    getFollowers,
    getFollowing,
    profiles
  } = useSocialStore();

  const userId = params.userId as string;
  const profile = getProfile(userId);
  const currentUser = user;

  // Check if current user is following this profile
  const isFollowing = React.useMemo(() => {
    if (!currentUser || !profile) return false;
    const followers = getFollowers(profile.id);
    return followers.includes(currentUser.id);
  }, [currentUser, profile, getFollowers]);

  const userAchievements = profile ? getUserAchievements(profile.id) : [];
  const availableAchievements = getAvailableAchievements();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            User not found
          </h2>
          <p className="text-[var(--muted-foreground)] mb-4">
            The user profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleFollowToggle = () => {
    if (!currentUser) return;
    
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  const handleMessage = () => {
    // Navigate to messages (not implemented yet)
    console.log('Navigate to messages with user:', userId);
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
                {profile.name}'s Profile
              </h1>
              <p className="text-[var(--muted-foreground)]">
                View learning progress and achievements
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {currentUser && currentUser.id !== userId && (
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleFollowToggle}
                variant={isFollowing ? "outline" : "default"}
                className="flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </Button>
              
              <Button
                onClick={handleMessage}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </Button>
            </div>
          )}
        </div>

        {/* Profile Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Banner */}
          <ProfileBanner
            profile={profile}
            currentUserId={currentUser?.id}
            achievements={userAchievements.slice(0, 6)}
          />

          {/* Tab Navigation */}
          <div className="border-b border-[var(--border)]">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Users },
                { id: 'achievements', label: 'Achievements', icon: Award },
                { id: 'stats', label: 'Statistics', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {/* Overview Tab */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--foreground)]">
                    {profile.totalXP.toLocaleString()}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">Total XP</div>
                </div>
                
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--foreground)]">
                    {userAchievements.length}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">Achievements</div>
                </div>
                
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--foreground)]">
                    {profile.followersCount}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">Followers</div>
                </div>
                
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--foreground)]">
                    {profile.currentStreak}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">Day Streak</div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Recent Achievements
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userAchievements.slice(0, 4).map((userAchievement) => (
                    <div
                      key={userAchievement.achievement.id}
                      className="flex items-center space-x-3 p-3 bg-[var(--accent)]/30 rounded-lg"
                    >
                      <span className="text-2xl">{userAchievement.achievement.icon}</span>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {userAchievement.achievement.name}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {userAchievement.earnedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {userAchievements.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-[var(--muted-foreground)]">
                      No achievements yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements Tab */}
            <ProfileAchievements
              achievements={userAchievements}
              availableAchievements={availableAchievements}
              currentUserId={currentUser?.id}
              userId={profile.id}
              showLocked={false}
            />

            {/* Stats Tab */}
            <ProfileStats profile={profile} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}