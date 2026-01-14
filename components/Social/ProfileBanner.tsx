'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Calendar, TrendingUp, Award, Users, Star, Flame } from 'lucide-react';
import { UserProfile } from '../../lib/types';
import { cn } from '../../lib/utils';

interface ProfileBannerProps {
  profile: UserProfile;
  currentUserId?: string;
  onEdit?: () => void;
  showEditButton?: boolean;
  achievements?: Array<{ achievement: { icon: string; name: string } }>;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  profile,
  currentUserId,
  onEdit,
  showEditButton = false,
  achievements = []
}) => {
  const isOwnProfile = currentUserId === profile.id;
  const levelProgress = (profile.totalXP % 1000) / 10;
  const nextLevelXP = 1000 - (profile.totalXP % 1000);

  return (
    <div className="relative">
      {/* Background Banner */}
      <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        {/* Achievement showcase background pattern */}
        <div className="absolute inset-0 opacity-10">
          {achievements.slice(0, 20).map((achievement, index) => (
            <div
              key={index}
              className="absolute text-4xl"
              style={{
                left: `${(index % 10) * 10}%`,
                top: `${Math.floor(index / 10) * 25}%`,
                transform: 'rotate(15deg)'
              }}
            >
              {achievement.achievement.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-b-lg">
        <div className="relative px-6 pb-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16 relative z-10">
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-32 h-32 rounded-full border-4 border-[var(--card)] bg-[var(--card)] flex items-center justify-center overflow-hidden shadow-xl"
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold text-4xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>
              
              {/* Level Badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                <Crown className="w-4 h-4" />
                <span className="font-bold text-sm">Lv.{profile.currentLevel}</span>
              </div>

              {/* Streak Badge */}
              {profile.currentStreak > 0 && (
                <div className="absolute -top-2 -left-2 bg-orange-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                  <Flame className="w-4 h-4" />
                  <span className="font-bold text-sm">{profile.currentStreak}</span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                    {profile.name}
                  </h1>
                  
                  {profile.bio && (
                    <p className="text-[var(--muted-foreground)] text-lg mb-3 max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{profile.totalXP.toLocaleString()} XP</span>
                    </div>

                    {profile.favoriteSubject && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
                        <Star className="w-3 h-3" />
                        <span className="font-medium">{profile.favoriteSubject}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                {showEditButton && isOwnProfile && onEdit && (
                  <button
                    onClick={onEdit}
                    className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Level Progress Section */}
          <div className="mt-8 p-4 bg-[var(--accent)]/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[var(--primary)] rounded-lg">
                  <Crown className="w-5 h-5 text-[var(--primary-foreground)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    Level {profile.currentLevel}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {nextLevelXP} XP to next level
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {profile.totalXP.toLocaleString()}
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">Total XP</div>
              </div>
            </div>

            <div className="w-full bg-[var(--background)] rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Achievement Showcase */}
          {achievements.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="font-semibold text-[var(--foreground)]">Recent Achievements</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {achievements.slice(0, 6).map((achievement, index) => (
                  <motion.div
                    key={achievement.achievement.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    title={achievement.achievement.name}
                  >
                    <span className="text-lg">{achievement.achievement.icon}</span>
                    <span className="text-sm font-medium text-[var(--foreground)] truncate max-w-20">
                      {achievement.achievement.name}
                    </span>
                  </motion.div>
                ))}
                
                {achievements.length > 6 && (
                  <div className="flex items-center justify-center w-12 h-12 bg-[var(--accent)]/50 rounded-lg border-2 border-dashed border-[var(--border)]">
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">
                      +{achievements.length - 6}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[var(--accent)]/30 rounded-lg">
              <div className="text-xl font-bold text-[var(--foreground)]">
                {profile.totalConcepts}
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">Concepts Learned</div>
            </div>
            
            <div className="text-center p-3 bg-[var(--accent)]/30 rounded-lg">
              <div className="text-xl font-bold text-[var(--foreground)]">
                {profile.totalQuizzes}
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">Quizzes Taken</div>
            </div>
            
            <div className="text-center p-3 bg-[var(--accent)]/30 rounded-lg">
              <div className="text-xl font-bold text-[var(--foreground)]">
                {profile.averageQuizScore.toFixed(1)}%
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">Average Score</div>
            </div>
            
            <div className="text-center p-3 bg-[var(--accent)]/30 rounded-lg">
              <div className="text-xl font-bold text-[var(--foreground)]">
                {Math.floor(profile.totalStudyTime / 60)}h
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">Study Time</div>
            </div>
          </div>

          {/* Social Stats */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="text-[var(--muted-foreground)]">
                  {profile.followersCount} followers • {profile.followingCount} following
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="text-[var(--muted-foreground)]">
                  {profile.achievementsCount} achievements
                </span>
              </div>
            </div>

            {profile.currentStreak > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full">
                <Flame className="w-4 h-4" />
                <span className="font-semibold">
                  {profile.currentStreak} day streak
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};