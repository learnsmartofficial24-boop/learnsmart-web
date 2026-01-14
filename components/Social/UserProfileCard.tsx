'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Crown, Calendar, TrendingUp, Users, Award, MessageCircle } from 'lucide-react';
import { UserProfile } from '../../lib/types';
import { cn } from '../../lib/utils';

interface UserProfileCardProps {
  profile: UserProfile;
  currentUserId?: string;
  onFollow?: () => void;
  onMessage?: () => void;
  onViewAchievements?: () => void;
  showFollowButton?: boolean;
  compact?: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  currentUserId,
  onFollow,
  onMessage,
  onViewAchievements,
  showFollowButton = false,
  compact = false
}) => {
  const isOwnProfile = currentUserId === profile.id;
  const levelProgress = (profile.totalXP % 1000) / 10; // Assuming 1000 XP per level

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-semibold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            {profile.currentStreak > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                🔥
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-[var(--foreground)] truncate">
                {profile.name}
              </h3>
              <div className="flex items-center space-x-1 text-xs text-[var(--muted-foreground)]">
                <Crown className="w-3 h-3" />
                <span>Lv.{profile.currentLevel}</span>
              </div>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] truncate">
              {profile.bio || `${profile.totalXP} XP`}
            </p>
          </div>

          {showFollowButton && !isOwnProfile && (
            <button
              onClick={onFollow}
              className="px-3 py-1 text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--primary)]/90 transition-colors"
            >
              Follow
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold text-xl">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            {profile.currentStreak > 0 && (
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm text-white font-bold">
                {profile.currentStreak}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {profile.name}
              </h2>
              <div className="flex items-center space-x-1 px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm">
                <Crown className="w-4 h-4" />
                <span className="font-semibold">Level {profile.currentLevel}</span>
              </div>
            </div>
            
            <p className="text-[var(--muted-foreground)] mb-2">
              {profile.bio || 'No bio provided'}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {profile.joinDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{profile.totalXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showFollowButton && !isOwnProfile && (
          <div className="flex space-x-2">
            <button
              onClick={onFollow}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--primary)]/90 transition-colors font-medium"
            >
              Follow
            </button>
            <button
              onClick={onMessage}
              className="p-2 border border-[var(--border)] rounded-md hover:bg-[var(--accent)] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-[var(--accent)]/50 rounded-lg">
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {profile.totalConcepts}
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">Concepts</div>
        </div>
        
        <div className="text-center p-3 bg-[var(--accent)]/50 rounded-lg">
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {profile.totalQuizzes}
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">Quizzes</div>
        </div>
        
        <div className="text-center p-3 bg-[var(--accent)]/50 rounded-lg">
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {profile.averageQuizScore.toFixed(1)}%
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">Avg Score</div>
        </div>
        
        <div className="text-center p-3 bg-[var(--accent)]/50 rounded-lg">
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {Math.floor(profile.totalStudyTime / 60)}h
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">Study Time</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Level Progress
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">
            {profile.totalXP % 1000}/1000 XP
          </span>
        </div>
        <div className="w-full bg-[var(--accent)] rounded-full h-2">
          <motion.div
            className="bg-[var(--primary)] h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Social Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="text-[var(--muted-foreground)]">
              {profile.followersCount} followers
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="text-[var(--muted-foreground)]">
              {profile.achievementsCount} achievements
            </span>
          </div>
        </div>

        {onViewAchievements && (
          <button
            onClick={onViewAchievements}
            className="text-sm text-[var(--primary)] hover:underline font-medium"
          >
            View Achievements
          </button>
        )}
      </div>
    </motion.div>
  );
};