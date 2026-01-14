'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, Filter, Grid, List, Search } from 'lucide-react';
import { Achievement } from '../../lib/types';
import { AchievementBadge } from './AchievementBadge';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface AchievementGridProps {
  achievements: Array<{ achievement: Achievement; earnedAt?: Date; progress?: number }>;
  availableAchievements: Achievement[];
  currentUserId?: string;
  userId?: string;
  category?: Achievement['category'];
  rarity?: Achievement['rarity'];
  showLocked?: boolean;
  layout?: 'grid' | 'list';
  onShare?: (achievement: Achievement) => void;
  onAchievementClick?: (achievement: Achievement) => void;
  className?: string;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  availableAchievements,
  currentUserId,
  userId,
  category,
  rarity,
  showLocked = false,
  layout = 'grid',
  onShare,
  onAchievementClick,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | ''>(category || '');
  const [selectedRarity, setSelectedRarity] = useState<Achievement['rarity'] | ''>(rarity || '');
  const [showOnlyEarned, setShowOnlyEarned] = useState(false);

  const isOwnProfile = currentUserId === userId;

  // Create a map of earned achievements
  const earnedAchievementsMap = new Map(
    achievements.map(ua => [ua.achievement.id, ua])
  );

  // Get all achievements (earned + locked)
  const allAchievements = showLocked ? availableAchievements.map(achievement => {
    const earned = earnedAchievementsMap.get(achievement.id);
    return earned 
      ? { ...earned, achievement }
      : { achievement, earnedAt: undefined, progress: 0 };
  }) : achievements;

  // Filter achievements
  const filteredAchievements = allAchievements.filter(item => {
    // Search filter
    if (searchQuery && !item.achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.achievement.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory && item.achievement.category !== selectedCategory) {
      return false;
    }

    // Rarity filter
    if (selectedRarity && item.achievement.rarity !== selectedRarity) {
      return false;
    }

    // Earned filter
    if (showOnlyEarned && !item.earnedAt) {
      return false;
    }

    return true;
  });

  // Sort achievements: earned first, then by rarity, then by name
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    // Earned achievements first
    if (a.earnedAt && !b.earnedAt) return -1;
    if (!a.earnedAt && b.earnedAt) return 1;

    // Then by rarity (legendary > rare > uncommon > common)
    const rarityOrder = { legendary: 4, rare: 3, uncommon: 2, common: 1 };
    if (a.earnedAt && b.earnedAt) {
      const rarityDiff = rarityOrder[b.achievement.rarity] - rarityOrder[a.achievement.rarity];
      if (rarityDiff !== 0) return rarityDiff;
    }

    // Finally by name
    return a.achievement.name.localeCompare(b.achievement.name);
  });

  const categories: Achievement['category'][] = ['learning', 'consistency', 'performance', 'social', 'special'];
  const rarities: Achievement['rarity'][] = ['common', 'uncommon', 'rare', 'legendary'];

  const categoryNames = {
    learning: 'Learning',
    consistency: 'Consistency',
    performance: 'Performance',
    social: 'Social',
    special: 'Special'
  };

  const rarityNames = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    legendary: 'Legendary'
  };

  const earnedCount = achievements.length;
  const totalCount = availableAchievements.length;
  const completionPercentage = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-[var(--primary)]" />
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Achievements
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {earnedCount} of {totalCount} unlocked ({completionPercentage}%)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowOnlyEarned(!showOnlyEarned)}
            className={cn(
              "px-3 py-1 rounded-md text-sm font-medium transition-colors",
              showOnlyEarned
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            Earned Only
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search achievements..."
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Achievement['category'] | '')}
            className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {categoryNames[cat]}
              </option>
            ))}
          </select>

          {/* Rarity Filter */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value as Achievement['rarity'] | '')}
            className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm"
          >
            <option value="">All Rarities</option>
            {rarities.map(rarity => (
              <option key={rarity} value={rarity}>
                {rarityNames[rarity]}
              </option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center px-3 py-2 bg-[var(--accent)]/50 rounded-md text-sm text-[var(--muted-foreground)]">
            {sortedAchievements.length} result{sortedAchievements.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory || selectedRarity || searchQuery || showOnlyEarned) && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-sm font-medium text-[var(--foreground)]">Active filters:</span>
              {selectedCategory && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  {categoryNames[selectedCategory]}
                </span>
              )}
              {selectedRarity && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  {rarityNames[selectedRarity]}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  "{searchQuery}"
                </span>
              )}
              {showOnlyEarned && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  Earned Only
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedRarity('');
                  setShowOnlyEarned(false);
                }}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Achievement Grid/List */}
      {sortedAchievements.length === 0 ? (
        <div className="text-center py-12">
          <Lock className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
            No achievements found
          </h3>
          <p className="text-[var(--muted-foreground)]">
            Try adjusting your filters to see more achievements.
          </p>
        </div>
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AnimatePresence>
            {sortedAchievements.map((item, index) => (
              <motion.div
                key={item.achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <AchievementBadge
                  achievement={item.achievement}
                  isEarned={!!item.earnedAt}
                  earnedAt={item.earnedAt}
                  progress={item.progress}
                  size="md"
                  showDetails={true}
                  onShare={() => onShare?.(item.achievement)}
                  onClick={() => onAchievementClick?.(item.achievement)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sortedAchievements.map((item, index) => (
              <motion.div
                key={item.achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <AchievementBadge
                    achievement={item.achievement}
                    isEarned={!!item.earnedAt}
                    earnedAt={item.earnedAt}
                    progress={item.progress}
                    size="lg"
                    showDetails={false}
                    onShare={() => onShare?.(item.achievement)}
                    onClick={() => onAchievementClick?.(item.achievement)}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--foreground)]">
                      {item.achievement.name}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                      {item.achievement.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-[var(--muted-foreground)]">
                      <span className={cn(
                        "px-2 py-1 rounded-full",
                        item.achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-600' :
                        item.achievement.rarity === 'rare' ? 'bg-purple-500/20 text-purple-600' :
                        item.achievement.rarity === 'uncommon' ? 'bg-gray-500/20 text-gray-600' :
                        'bg-amber-500/20 text-amber-600'
                      )}>
                        {item.achievement.rarity}
                      </span>
                      <span>{item.achievement.category}</span>
                      <span>{item.achievement.points} points</span>
                      {item.earnedAt && (
                        <span>Earned {item.earnedAt.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {!item.earnedAt && item.progress && item.progress > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-[var(--foreground)]">
                        {Math.round(item.progress)}%
                      </div>
                      <div className="w-24 bg-[var(--accent)] rounded-full h-2 mt-1">
                        <div 
                          className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Summary Stats */}
      {sortedAchievements.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {achievements.length}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">Earned</div>
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
              {completionPercentage}%
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">Complete</div>
          </div>
        </div>
      )}
    </div>
  );
};