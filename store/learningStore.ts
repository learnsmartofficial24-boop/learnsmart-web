import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LearningProgress {
  subjectId: string;
  chapterId: string;
  conceptId: string;
  completed: boolean;
  lastStudied: Date;
  timeSpent: number;
}

interface LearningState {
  progress: LearningProgress[];
  currentSubject: string | null;
  currentChapter: string | null;
  
  setProgress: (progress: LearningProgress) => void;
  setCurrentSubject: (subjectId: string | null) => void;
  setCurrentChapter: (chapterId: string | null) => void;
  getProgressBySubject: (subjectId: string) => LearningProgress[];
  getProgressByChapter: (chapterId: string) => LearningProgress[];
  clearProgress: () => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      progress: [],
      currentSubject: null,
      currentChapter: null,

      setProgress: (newProgress) =>
        set((state) => {
          const existingIndex = state.progress.findIndex(
            (p) =>
              p.subjectId === newProgress.subjectId &&
              p.chapterId === newProgress.chapterId &&
              p.conceptId === newProgress.conceptId
          );

          if (existingIndex >= 0) {
            const updated = [...state.progress];
            updated[existingIndex] = newProgress;
            return { progress: updated };
          }

          return { progress: [...state.progress, newProgress] };
        }),

      setCurrentSubject: (subjectId) =>
        set({ currentSubject: subjectId }),

      setCurrentChapter: (chapterId) =>
        set({ currentChapter: chapterId }),

      getProgressBySubject: (subjectId) =>
        get().progress.filter((p) => p.subjectId === subjectId),

      getProgressByChapter: (chapterId) =>
        get().progress.filter((p) => p.chapterId === chapterId),

      clearProgress: () =>
        set({ progress: [], currentSubject: null, currentChapter: null }),
    }),
    {
      name: 'learnsmartLearning',
    }
  )
);
