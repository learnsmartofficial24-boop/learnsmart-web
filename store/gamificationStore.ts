import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  achievements: Achievement[];
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  
  addXP: (amount: number) => void;
  updateStreak: () => void;
  addAchievement: (achievement: Omit<Achievement, 'unlockedAt'>) => void;
  incrementQuizStats: (correct: boolean) => void;
  resetStats: () => void;
}

const XP_PER_LEVEL = 100;

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      lastStudyDate: null,
      achievements: [],
      totalQuizzesTaken: 0,
      totalQuestionsAnswered: 0,
      correctAnswers: 0,

      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
          return {
            xp: newXP,
            level: newLevel,
          };
        }),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          
          if (state.lastStudyDate === today) {
            return state;
          }
          
          if (state.lastStudyDate === yesterday) {
            return {
              streak: state.streak + 1,
              lastStudyDate: today,
            };
          }
          
          return {
            streak: 1,
            lastStudyDate: today,
          };
        }),

      addAchievement: (achievement) =>
        set((state) => {
          const exists = state.achievements.some((a) => a.id === achievement.id);
          if (exists) return state;
          
          return {
            achievements: [
              ...state.achievements,
              { ...achievement, unlockedAt: new Date() },
            ],
          };
        }),

      incrementQuizStats: (correct) =>
        set((state) => ({
          totalQuestionsAnswered: state.totalQuestionsAnswered + 1,
          correctAnswers: correct ? state.correctAnswers + 1 : state.correctAnswers,
          totalQuizzesTaken: state.totalQuizzesTaken + 1,
        })),

      resetStats: () =>
        set({
          xp: 0,
          level: 1,
          streak: 0,
          lastStudyDate: null,
          achievements: [],
          totalQuizzesTaken: 0,
          totalQuestionsAnswered: 0,
          correctAnswers: 0,
        }),
    }),
    {
      name: 'learnsmartGamification',
    }
  )
);
