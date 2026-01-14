'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Share2, Calendar } from 'lucide-react';
import { Achievement } from '../../lib/types';
import { getRarityColor } from '../../lib/achievements';
import { cn } from '../../lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
  isEarned?: boolean;
  earnedAt?: Date;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onShare?: () => void;
  onClick?: () => void;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  isEarned = false,
  earnedAt,
  progress = 0,
  size = 'md',
  showDetails = true,
  onShare,
  onClick,
  className
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  };

  const progressBarHeight = size === 'sm' ? 'h-1' : size === 'md' ? 'h-2' : 'h-3';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative group cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        "rounded-full flex items-center justify-center border-2 transition-all duration-300",
        sizeClasses[size],
        isEarned 
          ? `${getRarityColor(achievement.rarity)} border-transparent shadow-lg` 
          : 'bg-[var(--muted)] border-[var(--border)]',
        isEarned ? 'shadow-lg' : 'opacity-60'
      )}>
        {isEarned ? (
          <span className="select-none">
            {achievement.icon}
          </span>
        ) : (
          <Lock className="w-1/2 h-1/2 text-[var(--muted-foreground)]" />
        )}
      </div>

      {/* Rarity Indicator */}
      {isEarned && (
        <div className={cn(
          "absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white",
          achievement.rarity === 'legendary' ? 'bg-yellow-500' :
          achievement.rarity === 'rare' ? 'bg-purple-500' :
          achievement.rarity === 'uncommon' ? 'bg-gray-500' :
          'bg-amber-600'
        )}>
          {achievement.rarity === 'legendary' ? 'L' :
           achievement.rarity === 'rare' ? 'R' :
           achievement.rarity === 'uncommon' ? 'U' : 'C'}
        </div>
      )}

      {/* Points Badge */}
      {isEarned && (
        <div className="absolute -bottom-1 -right-1 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {achievement.points}
        </div>
      )}

      {/* Progress Bar (for incomplete achievements) */}
      {!isEarned && progress > 0 && (
        <div className={cn(
          "absolute -bottom-1 left-0 right-0 bg-[var(--accent)] rounded-full overflow-hidden",
          progressBarHeight
        )}>
          <motion.div
            className="bg-[var(--primary)] h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Tooltip */}
      {showDetails && (
        <div className="absolute inset-0 bg-black/80 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 -translate-x-1/2 left-1/2 bottom-full mb-2 w-64">
          <div className="text-center space-y-2">
            <div className="text-2xl mb-2">{achievement.icon}</div>
            <div className="font-bold text-sm">{achievement.name}</div>
            <div className="text-xs opacity-90 leading-relaxed">
              {achievement.description}
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-xs">
              <span className={cn(
                "px-2 py-1 rounded-full",
                achievement.rarity === 'legendary' ? 'bg-yellow-500/20' :
                achievement.rarity === 'rare' ? 'bg-purple-500/20' :
                achievement.rarity === 'uncommon' ? 'bg-gray-500/20' :
                'bg-amber-500/20'
              )}>
                {achievement.rarity}
              </span>
              <span className="px-2 py-1 bg-blue-500/20 rounded-full">
                {achievement.category}
              </span>
            </div>

            {earnedAt && (
              <div className="flex items-center justify-center space-x-1 text-xs opacity-75">
                <Calendar className="w-3 h-3" />
                <span>Earned {earnedAt.toLocaleDateString()}</span>
              </div>
            )}

            {progress > 0 && !isEarned && (
              <div className="text-xs opacity-75">
                Progress: {Math.round(progress)}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Button */}
      {isEarned && onShare && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="absolute top-0 right-0 p-1 bg-[var(--background)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--accent)]"
        >
          <Share2 className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
};