'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Calendar, Share2 } from 'lucide-react';
import { UserAchievement, Achievement } from '../../lib/types';
import { getRarityColor } from '../../lib/achievements';
import { cn } from '../../lib/utils';

interface ProfileAchievementsProps {
  achievements: (UserAchievement & { achievement: Achievement })[];
  availableAchievements: Achievement[];
  currentUserId?: string;
  userId?: string;
  showLocked?: boolean;
  category?: Achievement['category'];
  onShare?: (achievement: Achievement) => void;
  className?: string;
}

export const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({
  achievements,
  availableAchievements,
  currentUserId,
  userId,
  showLocked = false,
  category,
  onShare,
  className
}) => {
  const isOwnProfile = currentUserId === userId;
  
  // Filter achievements by category if specified
  const filteredAchievements = category 
    ? achievements.filter(ua => ua.achievement.category === category)
    : achievements;

  // Get locked achievements
  const lockedAchievements = showLocked ? availableAchievements.filter(
    achievement => !achievements.some(ua => ua.achievementId === achievement.id)
  ) : [];

  const categories: Achievement['category'][] = ['learning', 'consistency', 'performance', 'social', 'special'];
  const categoryNames = {
    learning: 'Learning',
    consistency: 'Consistency', 
    performance: 'Performance',
    social: 'Social',
    special: 'Special'
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-6 h-6 text-[var(--primary)]" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Achievements ({achievements.length})
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <select 
            className="px-3 py-1 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm"
            onChange={(e) => {
              // Filter logic would be handled by parent component
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {categoryNames[cat]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Earned Achievements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Earned Achievements</h3>
        
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
            <p className="text-[var(--muted-foreground)] text-lg">
              {isOwnProfile ? 'No achievements earned yet' : 'This user hasn\'t earned any achievements'}
            </p>
            <p className="text-[var(--muted-foreground)] text-sm mt-2">
              {isOwnProfile ? 'Keep studying to unlock your first achievement!' : 'Check back later to see their achievements'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAchievements.map((userAchievement, index) => (
              <motion.div
                key={userAchievement.achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Achievement Badge */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg",
                      getRarityColor(userAchievement.achievement.rarity)
                    )}>
                      {userAchievement.achievement.icon}
                    </div>
                    
                    {/* Rarity indicator */}
                    <div className={cn(
                      "absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center",
                      userAchievement.achievement.rarity === 'legendary' ? 'bg-yellow-500 text-white' :
                      userAchievement.achievement.rarity === 'rare' ? 'bg-purple-500 text-white' :
                      userAchievement.achievement.rarity === 'uncommon' ? 'bg-gray-500 text-white' :
                      'bg-amber-600 text-white'
                    )}>
                      {userAchievement.achievement.rarity === 'legendary' ? 'L' :
                       userAchievement.achievement.rarity === 'rare' ? 'R' :
                       userAchievement.achievement.rarity === 'uncommon' ? 'U' : 'C'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-[var(--foreground)] text-sm leading-tight">
                      {userAchievement.achievement.name}
                    </h4>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                      {userAchievement.achievement.description}
                    </p>
                    <div className="flex items-center justify-center space-x-1 text-xs text-[var(--muted-foreground)]">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {userAchievement.earnedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="absolute top-2 right-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold px-2 py-1 rounded-full">
                  {userAchievement.achievement.points} pts
                </div>

                {/* Share Button */}
                {onShare && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare(userAchievement.achievement);
                    }}
                    className="absolute top-2 left-2 p-1 bg-[var(--background)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--accent)]"
                  >
                    <Share2 className="w-3 h-3" />
                  </button>
                )}

                {/* Tooltip on hover */}
                <div className="absolute inset-0 bg-black/80 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="text-center">
                    <div className="text-lg mb-2">{userAchievement.achievement.icon}</div>
                    <div className="font-semibold text-sm mb-1">
                      {userAchievement.achievement.name}
                    </div>
                    <div className="text-xs opacity-90 mb-2">
                      {userAchievement.achievement.description}
                    </div>
                    <div className="text-xs opacity-75">
                      Earned on {userAchievement.earnedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Locked Achievements */}
      {showLocked && lockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Locked Achievements</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lockedAchievements.slice(0, 12).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 opacity-60"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-2xl">
                      <Lock className="w-8 h-8 text-[var(--muted-foreground)]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-[var(--muted-foreground)] text-sm leading-tight">
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                      {achievement.description}
                    </p>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {achievement.category} • {achievement.rarity}
                    </div>
                  </div>
                </div>

                {/* Hidden achievement indicator */}
                {achievement.hidden && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    ?
                  </div>
                )}
              </motion.div>
            ))}
            
            {lockedAchievements.length > 12 && (
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border)] rounded-lg">
                <span className="text-[var(--muted-foreground)]">
                  +{lockedAchievements.length - 12} more locked
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {achievements.length}
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">Total Earned</div>
        </div>
        
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {achievements.reduce((sum, ua) => sum + ua.achievement.points, 0)}
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">Total Points</div>
        </div>
        
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {achievements.filter(ua => ua.achievement.rarity === 'legendary').length}
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">Legendary</div>
        </div>
        
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {Math.round((achievements.length / availableAchievements.length) * 100)}%
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">Completion</div>
        </div>
      </div>
    </div>
  );
};