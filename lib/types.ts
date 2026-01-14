export interface User {
  id: string;
  name: string;
  email: string;
  class: number;
  stream?: 'science' | 'commerce' | 'arts';
  specialization?: 'pcm' | 'pcb';
  subjects: string[];
  avatar?: string;
  theme: 'light' | 'dark';
  createdAt: Date;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion extends MCQ {
  conceptId?: string;
  timeSpent?: number;
  isAnswered?: boolean;
  selectedAnswer?: number;
  isCorrect?: boolean;
}

export interface QuestionAttempt {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: Date;
}

export interface QuizSession {
  id: string;
  class: number;
  subject: string;
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  startTime: Date;
  endTime?: Date;
  score: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface QuizResult {
  id: string;
  class: number;
  subject: string;
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  date: Date;
  questions: QuestionAttempt[];
  accuracy: number;
}

export interface Curriculum {
  classes: {
    [key: string]: {
      subjects?: string[];
      streams?: {
        [streamName: string]: {
          core: string[];
          specializations?: {
            [specName: string]: {
              required: string;
              optional: string[];
            };
          };
          optional?: string[];
        };
      };
    };
  };
}

export interface Subject {
  id: string;
  name: string;
  class: number;
  stream?: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  concepts: Concept[];
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface LearningMetrics {
  totalXP: number;
  currentLevel: number;
  conceptsLearned: number;
  quizAccuracy: number;
  currentStreak: number;
  averageQuizScore: number;
  totalStudyTime: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
}

export interface ConceptProgress {
  conceptId: string;
  name: string;
  masteryLevel: 'Not Started' | 'In Progress' | 'Competent' | 'Master';
  progressPercentage: number;
  timeSpent: number;
  lastStudied: Date;
  attempts: number;
  averageScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizPerformance {
  totalQuizzes: number;
  averageScore: number;
  accuracy: number;
  timeSpent: number;
  performanceByDifficulty: {
    easy: { count: number; averageScore: number };
    medium: { count: number; averageScore: number };
    hard: { count: number; averageScore: number };
  };
  mostChallengingConcepts: string[];
  improvementTrend: number;
}

export interface StudySession {
  id: string;
  date: Date;
  duration: number;
  subjects: string[];
  conceptsStudied: string[];
  quizTaken: boolean;
  accuracy?: number;
  xpEarned: number;
}

export interface ProgressTrend {
  date: string;
  accuracy: number;
  conceptsCompleted: number;
  studyTime: number;
  quizScore: number;
  xp: number;
  streak: number;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';

export interface SubjectsData {
  [subject: string]: {
    chapters: {
      [chapter: string]: {
        concepts: {
          [concept: string]: {
            difficulty: 'easy' | 'medium' | 'hard';
            attempts: number;
            averageScore: number;
            lastStudied: string;
            timeSpent: number;
          };
        };
        totalTimeSpent: number;
        conceptsCompleted: number;
        totalConcepts: number;
      };
    };
    subjectStats: {
      totalTimeSpent: number;
      averageAccuracy: number;
      conceptsCompleted: number;
      totalConcepts: number;
    };
  };
}

export interface Insight {
  id: string;
  type: 'highlight' | 'warning' | 'encouragement' | 'recommendation';
  title: string;
  message: string;
  action?: {
    label: string;
    target: string;
    type: 'concept' | 'quiz' | 'study';
  };
  timestamp: Date;
}

export interface AnalyticsFilters {
  dateRange: '7d' | '30d' | '90d' | 'all';
  subjects: string[] | 'all';
  chapters: string[] | 'all';
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
}

export type ChartViewType = 'line' | 'bar' | 'pie' | 'radar' | 'heatmap';

export enum MasteryLevel {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Competent = 'Competent',
  Master = 'Master'
}

export enum RelationType {
  Prerequisite = 'prerequisite',
  Reinforces = 'reinforces',
  Enables = 'enables',
  Related = 'related'
}

export interface ConceptNode {
  id: string;
  label: string;
  type: 'concept';
  masteryLevel: MasteryLevel;
  progressPercentage: number;
  subject: string;
  chapter: string;
  description: string;
  icon?: string;
  x?: number;
  y?: number;
}

export interface ConceptEdge {
  source: string;
  target: string;
  type: RelationType;
  label?: string;
}

export interface ConceptMap {
  id: string;
  subject: string;
  chapter?: string;
  nodes: ConceptNode[];
  edges: ConceptEdge[];
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  concepts: string[]; // IDs of concepts in sequence
  currentConceptId: string;
  progress: number; // percentage
}

// Flashcard & Spaced Repetition Types

export interface Flashcard {
  id: string;
  deckId: string;
  front: string; // Question/prompt
  back: string; // Answer/explanation
  conceptId?: string;
  createdAt: Date;
  lastReviewed?: Date;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  class?: number;
  subject?: string;
  chapter?: string;
  conceptId?: string;
  cardIds: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  lastStudied?: Date;
}

export interface SmSuperheroData {
  easeFactor: number; // EF: How easy the card is (1.3-2.5+)
  interval: number; // I: Days until next review
  repetitions: number; // n: Number of successful reviews
}

export interface ReviewMetrics {
  cardId: string;
  quality: number; // 1-5 rating
  easeFactor: number;
  interval: number;
  repetitions: number;
  reviewDate: Date;
  nextReviewDate: Date;
  timeTaken?: number; // Seconds spent on this card
}

export interface CardProgress {
  cardId: string;
  smData: SmSuperheroData;
  nextReviewDate: Date;
  totalReviews: number;
  successfulReviews: number;
  failedReviews: number;
  averageQuality: number;
  successRate: number;
  lastReviewed: Date;
  isDue: boolean;
  retentionScore: number; // 0-100
}

export interface ReviewItem {
  cardId: string;
  dueDate: Date;
  priority: number; // Higher = more urgent
  estimatedDifficulty: 'easy' | 'medium' | 'hard';
}

export interface ReviewSchedule {
  [date: string]: ReviewItem[]; // Map of ISO date strings to review items
}

export interface ReviewSession {
  id: string;
  deckId: string;
  cardIds: string[];
  currentIndex: number;
  startTime: Date;
  endTime?: Date;
  reviews: ReviewMetrics[];
  pausedAt?: Date;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
}

export interface SessionStats {
  totalCardsReviewed: number;
  cardsDueToday: number;
  cardsDueTomorrow: number;
  averageQuality: number;
  cardsMastered: number; // Quality 5
  cardsNeedReview: number; // Quality < 3
  sessionDuration: number; // Seconds
  cardsPerMinute: number;
  xpEarned: number;
  newCardsLearned: number;
}

// Social Features & Leaderboards Types

export interface UserProfile extends User {
  bio?: string;
  joinDate: Date;
  lastActive: Date;
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalQuizzes: number;
  totalConcepts: number;
  totalStudyTime: number;
  averageQuizScore: number;
  favoriteSubject?: string;
  achievementsCount: number;
  followersCount: number;
  followingCount: number;
  groupsCount: number;
  privacy: {
    showProfile: boolean;
    showProgress: boolean;
    showAchievements: boolean;
    showStats: boolean;
  };
  theme: 'light' | 'dark';
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  type: 'study' | 'social' | 'competitive';
  subject?: string;
  class?: number;
  avatar?: string;
  coverImage?: string;
  isPrivate: boolean;
  memberIds: string[];
  adminIds: string[];
  moderatorIds: string[];
  rules: string[];
  createdAt: Date;
  lastActivity: Date;
  totalXP: number;
  achievementsCount: number;
  postCount: number;
  tags: string[];
  memberCount: number;
}

export interface GroupMembership {
  userId: string;
  groupId: string;
  role: 'member' | 'moderator' | 'admin' | 'owner';
  joinedAt: Date;
  lastActive: Date;
  contributionScore: number; // XP earned within group
  postsCount: number;
  achievementsCount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'consistency' | 'performance' | 'social' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  points: number;
  unlockCriteria: {
    type: 'quiz_score' | 'streak' | 'concepts' | 'xp' | 'time' | 'groups' | 'friends' | 'special';
    value: number;
    subject?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  hidden?: boolean; // Secret achievements
  maxUnlocks?: number; // Some achievements can be earned multiple times
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  earnedAt: Date;
  progress: number; // 0-100 for progress-based achievements
  isMaxed?: boolean; // For achievements that can be earned multiple times
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  currentLevel: number;
  totalXP: number;
  currentStreak: number;
  rank: number;
  previousRank?: number;
  rankChange: number; // Positive = moved up, negative = moved down
  lastActive: Date;
  subjects?: string[];
  class?: number;
}

export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date;
  streakStartDate: Date;
  totalStudyDays: number;
  averageStreak: number;
}

export interface SocialConnection {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  status: 'active' | 'blocked' | 'pending';
}

export interface Post {
  id: string;
  groupId?: string;
  userId: string;
  content: string;
  type: 'achievement' | 'study_update' | 'group_announcement' | 'general' | 'milestone';
  attachments?: string[];
  likes: string[]; // User IDs who liked
  comments: Comment[];
  createdAt: Date;
  updatedAt?: Date;
  isPinned?: boolean;
  visibility: 'public' | 'friends' | 'groups';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentId?: string; // For replies to comments
  likes: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'follower' | 'group_invite' | 'group_mention' | 'streak_milestone' | 'rank_change' | 'group_activity';
  title: string;
  message: string;
  data?: any; // Additional data (achievement ID, group ID, etc.)
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface LeaderboardFilter {
  type: 'global' | 'subject' | 'class' | 'streak';
  subject?: string;
  class?: number;
  timePeriod: 'week' | 'month' | 'all_time';
  metric: 'xp' | 'streak' | 'quizzes' | 'concepts';
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  attachments?: string[];
  mentions: string[]; // User IDs mentioned
  reactions: { [emoji: string]: string[] }; // emoji -> user IDs
  createdAt: Date;
  editedAt?: Date;
  replyToId?: string;
}

export interface FriendActivity {
  userId: string;
  activity: {
    type: 'achievement_unlocked' | 'streak_milestone' | 'quiz_completed' | 'level_up' | 'group_joined';
    description: string;
    timestamp: Date;
    data?: any;
  };
}

export interface SocialStats {
  totalUsers: number;
  activeUsers24h: number;
  totalGroups: number;
  totalAchievements: number;
  averageStreak: number;
  topSubjects: { subject: string; count: number }[];
  newUsersThisWeek: number;
}

export interface GroupAnalytics {
  groupId: string;
  memberCount: number;
  activeMembers7d: number;
  averageActivity: number;
  topPerformers: string[]; // User IDs
  groupXP: number;
  achievementsUnlocked: number;
  messagesCount: number;
  joinRate: number; // New members per week
}
