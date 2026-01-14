import { Achievement, UserAchievement, UserProfile } from './types';

// Achievement Definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Learning Milestones
  {
    id: 'first-concept',
    name: 'First Steps',
    description: 'Complete your first concept',
    icon: '🎯',
    category: 'learning',
    rarity: 'common',
    points: 10,
    unlockCriteria: {
      type: 'concepts',
      value: 1
    }
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Reach 100 XP',
    icon: '💯',
    category: 'learning',
    rarity: 'common',
    points: 25,
    unlockCriteria: {
      type: 'xp',
      value: 100
    }
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 10 concepts',
    icon: '📚',
    category: 'learning',
    rarity: 'uncommon',
    points: 50,
    unlockCriteria: {
      type: 'concepts',
      value: 10
    }
  },
  {
    id: 'chapter-master',
    name: 'Chapter Master',
    description: 'Complete all concepts in a chapter',
    icon: '🏆',
    category: 'learning',
    rarity: 'uncommon',
    points: 75,
    unlockCriteria: {
      type: 'concepts',
      value: 20
    }
  },
  {
    id: 'quiz-expert',
    name: 'Quiz Expert',
    description: 'Score 100% on 5 quizzes',
    icon: '🎯',
    category: 'performance',
    rarity: 'rare',
    points: 100,
    unlockCriteria: {
      type: 'quiz_score',
      value: 5,
      difficulty: 'medium'
    }
  },

  // Consistency Achievements
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    category: 'consistency',
    rarity: 'common',
    points: 30,
    unlockCriteria: {
      type: 'streak',
      value: 7
    }
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 30-day study streak',
    icon: '⚡',
    category: 'consistency',
    rarity: 'rare',
    points: 150,
    unlockCriteria: {
      type: 'streak',
      value: 30
    }
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Maintain a 100-day study streak',
    icon: '👑',
    category: 'consistency',
    rarity: 'legendary',
    points: 500,
    unlockCriteria: {
      type: 'streak',
      value: 100
    }
  },
  {
    id: 'early-riser',
    name: 'Early Riser',
    description: 'Complete 5 quizzes before 9 AM',
    icon: '🌅',
    category: 'consistency',
    rarity: 'uncommon',
    points: 40,
    unlockCriteria: {
      type: 'time',
      value: 5
    }
  },

  // Performance Achievements
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'Complete a concept in under 2 minutes',
    icon: '🚀',
    category: 'performance',
    rarity: 'uncommon',
    points: 60,
    unlockCriteria: {
      type: 'time',
      value: 120
    }
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Score 100% on a quiz',
    icon: '💎',
    category: 'performance',
    rarity: 'rare',
    points: 80,
    unlockCriteria: {
      type: 'quiz_score',
      value: 100,
      difficulty: 'hard'
    }
  },
  {
    id: 'accuracy-master',
    name: 'Accuracy Master',
    description: 'Maintain 95%+ accuracy',
    icon: '🎯',
    category: 'performance',
    rarity: 'rare',
    points: 120,
    unlockCriteria: {
      type: 'quiz_score',
      value: 95,
      difficulty: 'medium'
    }
  },

  // Social Achievements
  {
    id: 'community-builder',
    name: 'Community Builder',
    description: 'Create your first study group',
    icon: '👥',
    category: 'social',
    rarity: 'common',
    points: 25,
    unlockCriteria: {
      type: 'groups',
      value: 1
    }
  },
  {
    id: 'team-player',
    name: 'Team Player',
    description: 'Join 3 study groups',
    icon: '🤝',
    category: 'social',
    rarity: 'uncommon',
    points: 50,
    unlockCriteria: {
      type: 'groups',
      value: 3
    }
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Have 10 followers',
    icon: '🦋',
    category: 'social',
    rarity: 'rare',
    points: 100,
    unlockCriteria: {
      type: 'friends',
      value: 10
    }
  },
  {
    id: 'group-legend',
    name: 'Group Legend',
    description: 'Help 5 group members achieve their goals',
    icon: '⭐',
    category: 'social',
    rarity: 'legendary',
    points: 300,
    unlockCriteria: {
      type: 'groups',
      value: 5
    }
  },

  // Special Achievements
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Learn concepts from 5 different subjects',
    icon: '🌟',
    category: 'special',
    rarity: 'rare',
    points: 200,
    unlockCriteria: {
      type: 'concepts',
      value: 50
    }
  },
  {
    id: 'marathon-learner',
    name: 'Marathon Learner',
    description: 'Study for 10 hours in total',
    icon: '⏰',
    category: 'special',
    rarity: 'uncommon',
    points: 75,
    unlockCriteria: {
      type: 'time',
      value: 600 // 10 hours in minutes
    }
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Study after 10 PM for 5 days',
    icon: '🦉',
    category: 'special',
    rarity: 'uncommon',
    points: 40,
    unlockCriteria: {
      type: 'time',
      value: 5
    }
  }
];

// Get all achievements
export const getAchievements = (): Achievement[] => {
  return ACHIEVEMENTS;
};

// Get achievement by ID
export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
};

// Get achievements by category
export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
};

// Get achievements by rarity
export const getAchievementsByRarity = (rarity: Achievement['rarity']): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.rarity === rarity);
};

// Check if user meets achievement criteria
export const checkAchievementCriteria = (
  achievement: Achievement,
  userStats: UserProfile
): { unlocked: boolean; progress: number } => {
  const { unlockCriteria } = achievement;
  let currentValue = 0;
  let progress = 0;

  switch (unlockCriteria.type) {
    case 'concepts':
      currentValue = userStats.totalConcepts || 0;
      break;
    case 'xp':
      currentValue = userStats.totalXP || 0;
      break;
    case 'streak':
      currentValue = userStats.currentStreak || 0;
      break;
    case 'time':
      currentValue = userStats.totalStudyTime || 0; // in minutes
      break;
    case 'groups':
      currentValue = userStats.groupsCount || 0;
      break;
    case 'friends':
      currentValue = userStats.followersCount || 0;
      break;
    case 'quiz_score':
      // For quiz_score, we need to check perfect scores or high accuracy
      if (unlockCriteria.value === 100) {
        // Perfect score achievements
        currentValue = userStats.totalQuizzes || 0; // Simplified - would need quiz history
      } else {
        // High accuracy achievements
        currentValue = Math.round(userStats.averageQuizScore || 0);
      }
      break;
    default:
      currentValue = 0;
  }

  progress = Math.min((currentValue / unlockCriteria.value) * 100, 100);
  const unlocked = currentValue >= unlockCriteria.value;

  return { unlocked, progress };
};

// Get achievement progress for user
export const getAchievementProgress = (
  achievementId: string,
  userStats: UserProfile
): { unlocked: boolean; progress: number; currentValue: number; targetValue: number } => {
  const achievement = getAchievementById(achievementId);
  if (!achievement) {
    return { unlocked: false, progress: 0, currentValue: 0, targetValue: 0 };
  }

  const result = checkAchievementCriteria(achievement, userStats);
  let currentValue = 0;

  switch (achievement.unlockCriteria.type) {
    case 'concepts':
      currentValue = userStats.totalConcepts || 0;
      break;
    case 'xp':
      currentValue = userStats.totalXP || 0;
      break;
    case 'streak':
      currentValue = userStats.currentStreak || 0;
      break;
    case 'time':
      currentValue = userStats.totalStudyTime || 0;
      break;
    case 'groups':
      currentValue = userStats.groupsCount || 0;
      break;
    case 'friends':
      currentValue = userStats.followersCount || 0;
      break;
    case 'quiz_score':
      if (achievement.unlockCriteria.value === 100) {
        currentValue = userStats.totalQuizzes || 0;
      } else {
        currentValue = Math.round(userStats.averageQuizScore || 0);
      }
      break;
  }

  return {
    unlocked: result.unlocked,
    progress: result.progress,
    currentValue,
    targetValue: achievement.unlockCriteria.value
  };
};

// Check for new achievements to unlock
export const checkAndUnlockAchievements = (
  userStats: UserProfile,
  existingAchievements: UserAchievement[]
): UserAchievement[] => {
  const unlockedAchievements: UserAchievement[] = [];
  const alreadyUnlocked = new Set(existingAchievements.map(a => a.achievementId));

  for (const achievement of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(achievement.id)) continue;

    const { unlocked } = checkAchievementCriteria(achievement, userStats);
    
    if (unlocked) {
      unlockedAchievements.push({
        userId: userStats.id,
        achievementId: achievement.id,
        earnedAt: new Date(),
        progress: 100
      });
    }
  }

  return unlockedAchievements;
};

// Get user's earned achievements
export const getUserAchievements = (
  userId: string,
  userAchievements: UserAchievement[]
): (UserAchievement & { achievement: Achievement })[] => {
  const userEarnedAchievements = userAchievements.filter(ua => ua.userId === userId);
  
  return userEarnedAchievements.map(ua => {
    const achievement = getAchievementById(ua.achievementId);
    return achievement ? { ...ua, achievement } : null;
  }).filter(Boolean) as (UserAchievement & { achievement: Achievement })[];
};

// Calculate achievement points
export const calculateAchievementPoints = (userAchievements: UserAchievement[]): number => {
  return userAchievements.reduce((total, ua) => {
    const achievement = getAchievementById(ua.achievementId);
    return total + (achievement?.points || 0);
  }, 0);
};

// Get achievement statistics
export const getAchievementStats = (userAchievements: UserAchievement[]) => {
  const totalPoints = calculateAchievementPoints(userAchievements);
  const achievementsByCategory: { [key: string]: number } = {};
  const achievementsByRarity: { [key: string]: number } = {};

  userAchievements.forEach(ua => {
    const achievement = getAchievementById(ua.achievementId);
    if (achievement) {
      achievementsByCategory[achievement.category] = (achievementsByCategory[achievement.category] || 0) + 1;
      achievementsByRarity[achievement.rarity] = (achievementsByRarity[achievement.rarity] || 0) + 1;
    }
  });

  return {
    totalPoints,
    totalAchievements: userAchievements.length,
    byCategory: achievementsByCategory,
    byRarity: achievementsByRarity
  };
};

// Get motivational message based on achievements
export const getAchievementMessage = (achievement: Achievement): string => {
  const messages = {
    learning: [
      "Keep expanding your knowledge!",
      "You're becoming a true scholar!",
      "Knowledge is power - keep going!",
      "Your dedication to learning is inspiring!"
    ],
    consistency: [
      "Consistency is key to mastery!",
      "Your dedication is paying off!",
      "You're building excellent habits!",
      "Persistence leads to success!"
    ],
    performance: [
      "Outstanding performance!",
      "You're hitting all the right notes!",
      "Excellence in every attempt!",
      "Your skills are really shining!"
    ],
    social: [
      "Building connections through learning!",
      "Great to see you helping others!",
      "Community makes learning better!",
      "You're a true team player!"
    ],
    special: [
      "You're doing something extraordinary!",
      "This achievement is truly unique!",
      "You're pushing the boundaries!",
      "This is what sets you apart!"
    ]
  };

  const categoryMessages = messages[achievement.category] || messages.learning;
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
};

// Rarity colors for achievements
export const getRarityColor = (rarity: Achievement['rarity']): string => {
  const colors = {
    common: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900',
    uncommon: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    rare: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900',
    legendary: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-800'
  };
  return colors[rarity];
};

// Get recent achievements for a user
export const getRecentAchievements = (
  userId: string,
  userAchievements: UserAchievement[],
  days: number = 7
): (UserAchievement & { achievement: Achievement })[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentAchievements = userAchievements
    .filter(ua => ua.userId === userId && ua.earnedAt >= cutoffDate)
    .map(ua => {
      const achievement = getAchievementById(ua.achievementId);
      return achievement ? { ...ua, achievement } : null;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.earnedAt).getTime() - new Date(a!.earnedAt).getTime());

  return recentAchievements as (UserAchievement & { achievement: Achievement })[];
};