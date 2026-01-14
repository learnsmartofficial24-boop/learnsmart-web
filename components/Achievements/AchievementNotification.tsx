'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Award, Sparkles } from 'lucide-react';
import { Achievement } from '../../lib/types';
import { AchievementBadge } from './AchievementBadge';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  onShare?: () => void;
  isVisible: boolean;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  onShare,
  isVisible,
  position = 'top-right'
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={cn(
            "fixed z-50 max-w-sm w-full",
            positionClasses[position]
          )}
        >
          {/* Confetti Background */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{
                    opacity: 0,
                    y: -20,
                    x: Math.random() * 200 - 100,
                    rotate: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: 200,
                    rotate: 360
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 1,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  {['🎉', '🎊', '⭐', '🏆', '✨', '💫', '🎯', '🏅'][Math.floor(Math.random() * 8)]}
                </motion.div>
              ))}
            </div>
          )}

          {/* Notification Card */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-0.5 rounded-lg shadow-2xl">
            <div className="bg-[var(--card)] rounded-lg p-4 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-full bg-[var(--background)]/80 hover:bg-[var(--background)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Achievement Header */}
              <div className="flex items-start space-x-3 pr-8">
                <div className="flex-shrink-0">
                  <AchievementBadge
                    achievement={achievement}
                    isEarned={true}
                    size="lg"
                    showDetails={false}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-sm font-medium text-[var(--primary)] uppercase tracking-wide">
                      Achievement Unlocked!
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">
                    {achievement.name}
                  </h3>
                  
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {achievement.description}
                  </p>

                  {/* Rarity Badge */}
                  <div className="flex items-center space-x-2 mt-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-bold text-white",
                      achievement.rarity === 'legendary' ? 'bg-yellow-500' :
                      achievement.rarity === 'rare' ? 'bg-purple-500' :
                      achievement.rarity === 'uncommon' ? 'bg-gray-500' :
                      'bg-amber-600'
                    )}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {achievement.category}
                    </span>
                    <span className="text-xs font-bold text-[var(--primary)]">
                      +{achievement.points} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mt-4">
                <Button
                  onClick={onShare}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                <Button
                  onClick={onClose}
                  size="sm"
                  className="flex-1"
                >
                  Awesome!
                </Button>
              </div>

              {/* Sparkle Animation */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
            </div>
          </div>

          {/* Pulse Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg opacity-20"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};