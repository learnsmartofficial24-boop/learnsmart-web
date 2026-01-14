import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  LearningMetrics, 
  ConceptProgress, 
  QuizPerformance, 
  StudySession, 
  ProgressTrend,
  AnalyticsFilters,
  Insight
} from '@/lib/types';
import { useGamificationStore } from './gamificationStore';
import { useLearningStore } from './learningStore';
import { useQuizStore } from './quizStore';

interface AnalyticsState {
  // Computed metrics
  learningMetrics: LearningMetrics;
  quizPerformance: QuizPerformance;
  conceptProgress: ConceptProgress[];
  studySessions: StudySession[];
  progressTrends: ProgressTrend[];
  insights: Insight[];
  
  // Filters
  filters: AnalyticsFilters;
  
  // Actions
  updateAnalytics: () => void;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  calculateConceptMastery: () => void;
  calculateTrends: () => void;
  generateInsights: () => void;
  clearAllAnalytics: () => void;
}

// Helper function to determine concept mastery level
const getMasteryLevel = (attempts: number, averageScore: number): 'Not Started' | 'In Progress' | 'Competent' | 'Master' => {
  if (attempts === 0) return 'Not Started';
  if (averageScore < 50) return 'In Progress';
  if (averageScore < 80) return 'Competent';
  return 'Master';
};

// Helper to calculate progress percentage
const getProgressPercentage = (attempts: number, averageScore: number): number => {
  if (attempts === 0) return 0;
  if (averageScore >= 95) return 100;
  return Math.min(averageScore, 100);
};

const generateMockStudySessions = (): StudySession[] => {
  const sessions: StudySession[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    if (Math.random() > 0.3) { // 70% chance of having a session
      const duration = Math.floor(Math.random() * 4800) + 1200; // 20-100 minutes
      const quizTaken = Math.random() > 0.6;
      
      sessions.push({
        id: `session-${i}`,
        date,
        duration,
        subjects: ['Mathematics', 'Physics', 'Chemistry'], // Simplified for now
        conceptsStudied: [`concept-${i % 3}`],
        quizTaken,
        accuracy: quizTaken ? Math.floor(Math.random() * 40) + 60 : undefined,
        xpEarned: Math.floor(Math.random() * 50) + 10
      });
    }
  }
  
  return sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const generateMockProgressTrends = (): ProgressTrend[] => {
  const trends: ProgressTrend[] = [];
  const today = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseAccuracy = 60 + (i * 0.2); // Shows improvement over time
    const baseXP = 100 + (i * 5);
    
    trends.push({
      date: date.toDateString(),
      accuracy: Math.min(baseAccuracy + (Math.random() * 20 - 10), 95),
      conceptsCompleted: Math.max(0, Math.floor(i / 3) + Math.floor(Math.random() * 3)),
      studyTime: Math.floor(Math.random() * 5000) + 2000,
      quizScore: Math.min(baseAccuracy + (Math.random() * 15 - 7.5), 95),
      xp: baseXP + Math.floor(Math.random() * 50),
      streak: Math.min(Math.floor(i / 7) + 1, 15)
    });
  }
  
  return trends;
};

// Generate conceptual insights based on the data
const generateMockInsights = (): Insight[] => {
  return [
    {
      id: 'insight-1',
      type: 'highlight',
      title: 'Strong Performance in Mathematics',
      message: 'Your average quiz score in Mathematics has improved by 15% this week. Keep up the excellent work!',
      action: {
        label: 'Take Quiz',
        target: 'Mathematics',
        type: 'quiz'
      },
      timestamp: new Date()
    },
    {
      id: 'insight-2',
      type: 'warning',
      title: 'Concept Needs Review',
      message: '"Algebraic Expressions" needs attention. Your last quiz score was 40%. Consider revisiting this concept.',
      action: {
        label: 'Review Concepts',
        target: 'Algebraic Expressions',
        type: 'concept'
      },
      timestamp: new Date()
    },
    {
      id: 'insight-3',
      type: 'encouragement',
      title: 'Study Streak Achieved!',
      message: 'Amazing! You\'ve studied for 7 consecutive days. This consistency will boost your learning significantly.',
      action: {
        label: 'View Progress',
        target: 'trends',
        type: 'study'
      },
      timestamp: new Date()
    },
    {
      id: 'insight-4',
      type: 'recommendation',
      title: 'Focus on Physics This Week',
      message: 'Based on your performance, we recommend spending more time on Physics concepts to maintain balanced progress.',
      action: {
        label: 'Study Physics',
        target: 'Physics',
        type: 'concept'
      },
      timestamp: new Date()
    }
  ];
};

const XP_PER_LEVEL = 100;

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      learningMetrics: {
        totalXP: 0,
        currentLevel: 1,
        conceptsLearned: 0,
        quizAccuracy: 0,
        currentStreak: 0,
        averageQuizScore: 0,
        totalStudyTime: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0
      },
      
      quizPerformance: {
        totalQuizzes: 0,
        averageScore: 0,
        accuracy: 0,
        timeSpent: 0,
        performanceByDifficulty: {
          easy: { count: 0, averageScore: 0 },
          medium: { count: 0, averageScore: 0 },
          hard: { count: 0, averageScore: 0 }
        },
        mostChallengingConcepts: [],
        improvementTrend: 0
      },
      
      conceptProgress: [],
      studySessions: [],
      progressTrends: [],
      insights: [],
      
      filters: {
        dateRange: '30d',
        subjects: 'all',
        chapters: 'all',
        difficulty: 'all'
      },

      updateAnalytics: () => {
        // Aggregate data from all stores
        const gamification = useGamificationStore.getState();
        const quiz = useQuizStore.getState();
        const learning = useLearningStore.getState();
        
        // Calculate learning metrics from gamification store
        const { quizHistory } = quiz;
        const totalQuizzes = quizHistory.length;
        
        const averageQuizScore = totalQuizzes > 0
          ? quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
          : 0;
        
        const totalQuestionsAnswered = quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
        const correctAnswers = quizHistory.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
        
        const studySessions = generateMockStudySessions();
        const totalStudyTime = studySessions.reduce((sum, session) => sum + session.duration, 0);
        
        const learningMetrics: LearningMetrics = {
          totalXP: gamification.xp,
          currentLevel: Math.floor(gamification.xp / XP_PER_LEVEL) + 1,
          conceptsLearned: Object.values(learning.chapterProgress).reduce(
            (sum, progress) => sum + progress.conceptsCompleted.length, 0
          ),
          quizAccuracy: totalQuestionsAnswered > 0
            ? (correctAnswers / totalQuestionsAnswered) * 100
            : 0,
          currentStreak: gamification.streak,
          averageQuizScore,
          totalStudyTime,
          totalQuestionsAnswered,
          correctAnswers
        };
        
        // Calculate quiz performance
        const performanceByDifficulty = {
          easy: { 
            count: quizHistory.filter(q => q.difficulty === 'easy').length,
            averageScore: 0
          },
          medium: {
            count: quizHistory.filter(q => q.difficulty === 'medium').length,
            averageScore: 0
          },
          hard: {
            count: quizHistory.filter(q => q.difficulty === 'hard').length,
            averageScore: 0
          }
        };
        
        // Calculate average scores by difficulty
        ['easy', 'medium', 'hard'].forEach(difficulty => {
          const quizzesByDiff = quizHistory.filter(q => q.difficulty === difficulty);
          if (quizzesByDiff.length > 0) {
            performanceByDifficulty[difficulty].averageScore = 
              quizzesByDiff.reduce((sum, quiz) => sum + quiz.score, 0) / quizzesByDiff.length;
          }
        });
        
        const quizPerformance: QuizPerformance = {
          totalQuizzes,
          averageScore: averageQuizScore,
          accuracy: totalQuizzes > 0
            ? quizHistory.reduce((sum, quiz) => sum + quiz.accuracy, 0) / totalQuizzes
            : 0,
          timeSpent: quizHistory.reduce((sum, quiz) => sum + quiz.timeSpent, 0),
          performanceByDifficulty,
          mostChallengingConcepts: ['Algebraic Expressions', 'Thermodynamics', 'Chemical Equilibrium'].slice(0, 3),
          improvementTrend: calculateImprovementTrend(quizHistory)
        };
        
        // Mock concept progress data for now
        const mockConcepts: ConceptProgress[] = [
          {
            conceptId: 'concept-1',
            name: 'Algebraic Expressions',
            masteryLevel: getMasteryLevel(2, 45),
            progressPercentage: getProgressPercentage(2, 45),
            timeSpent: 1800,
            lastStudied: new Date(Date.now() - 86400000),
            attempts: 2,
            averageScore: 45,
            difficulty: 'medium'
          },
          {
            conceptId: 'concept-2',
            name: 'Linear Equations',
            masteryLevel: getMasteryLevel(4, 85),
            progressPercentage: getProgressPercentage(4, 85),
            timeSpent: 3600,
            lastStudied: new Date(Date.now() - 3600000),
            attempts: 4,
            averageScore: 85,
            difficulty: 'easy'
          },
          {
            conceptId: 'concept-3',
            name: 'Thermodynamics',
            masteryLevel: getMasteryLevel(1, 35),
            progressPercentage: getProgressPercentage(1, 35),
            timeSpent: 2400,
            lastStudied: new Date(Date.now() - 172800000),
            attempts: 1,
            averageScore: 35,
            difficulty: 'hard'
          },
          {
            conceptId: 'concept-4',
            name: 'Chemical Bonds',
            masteryLevel: getMasteryLevel(3, 90),
            progressPercentage: getProgressPercentage(3, 90),
            timeSpent: 5400,
            lastStudied: new Date,
            attempts: 3,
            averageScore: 90,
            difficulty: 'medium'
          }
        ];
        
        set({
          learningMetrics,
          quizPerformance,
          conceptProgress: mockConcepts,
          studySessions,
          progressTrends: generateMockProgressTrends(),
          insights: generateMockInsights()
        });
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      calculateConceptMastery: () => {
        // This would calculate mastery based on quiz performance and time spent
        // For now, we'll update with mock data
        const conceptProgress = get().conceptProgress;
        
        const updatedProgress = conceptProgress.map(concept => {
          // Simulate mastery improvement on click/update
          const newAverageScore = Math.min(concept.averageScore + Math.random() * 10, 100);
          return {
            ...concept,
            masteryLevel: getMasteryLevel(concept.attempts, newAverageScore),
            progressPercentage: getProgressPercentage(concept.attempts, newAverageScore),
            averageScore: newAverageScore
          };
        });
        
        set({ conceptProgress: updatedProgress });
      },

      calculateTrends: () => {
        // Calculate historical trends based on study sessions and quiz history
        // For now, regenerate mock data
        set({ progressTrends: generateMockProgressTrends() });
      },

      generateInsights: () => {
        // Generate AI-like insights based on current data
        set({ insights: generateMockInsights() });
      },

      clearAllAnalytics: () => {
        set({
          learningMetrics: {
            totalXP: 0,
            currentLevel: 1,
            conceptsLearned: 0,
            quizAccuracy: 0,
            currentStreak: 0,
            averageQuizScore: 0,
            totalStudyTime: 0,
            totalQuestionsAnswered: 0,
            correctAnswers: 0
          },
          quizPerformance: {
            totalQuizzes: 0,
            averageScore: 0,
            accuracy: 0,
            timeSpent: 0,
            performanceByDifficulty: {
              easy: { count: 0, averageScore: 0 },
              medium: { count: 0, averageScore: 0 },
              hard: { count: 0, averageScore: 0 }
            },
            mostChallengingConcepts: [],
            improvementTrend: 0
          },
          conceptProgress: [],
          studySessions: [],
          progressTrends: [],
          insights: []
        });
      }
    }),
    {
      name: 'learnsmartAnalytics',
    }
  )
);

// Helper function to calculate improvement trend
const calculateImprovementTrend = (quizHistory: any[]): number => {
  if (quizHistory.length < 2) return 0;
  
  const firstHalf = quizHistory.slice(0, Math.floor(quizHistory.length / 2));
  const secondHalf = quizHistory.slice(Math.floor(quizHistory.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, quiz) => sum + quiz.score, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, quiz) => sum + quiz.score, 0) / secondHalf.length;
  
  return secondHalfAvg - firstHalfAvg; // Positive = improvement, Negative = decline
};

// Auto-update analytics when stores change
let initialized = false;

if (!initialized) {
  initialized = true;
  // Subscribe to changes in other stores to update analytics automatically
  const analyticsStore = useAnalyticsStore.getState();
  
  // Initial load
  setTimeout(() => {
    analyticsStore.updateAnalytics();
  }, 100);
}