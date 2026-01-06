import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChapterProgress {
  class: number;
  subject: string;
  chapter: string;
  currentConceptId: string;
  conceptsCompleted: string[];
  lastViewed: string; // ISO string for Date
  timeSpent: number; // in seconds
}

interface LearningState {
  chapterProgress: Record<string, ChapterProgress>; // Key format: "class-subject-chapter"
  
  setCurrentConcept: (classNum: number, subject: string, chapter: string, conceptId: string) => void;
  markConceptCompleted: (classNum: number, subject: string, chapter: string, conceptId: string) => void;
  getProgress: (classNum: number, subject: string, chapter: string) => ChapterProgress | undefined;
  updateTimeSpent: (classNum: number, subject: string, chapter: string, seconds: number) => void;
  clearProgress: () => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      chapterProgress: {},

      setCurrentConcept: (classNum, subject, chapter, conceptId) =>
        set((state) => {
          const key = `${classNum}-${subject}-${chapter}`;
          const current = state.chapterProgress[key] || {
            class: classNum,
            subject,
            chapter,
            currentConceptId: conceptId,
            conceptsCompleted: [],
            lastViewed: new Date().toISOString(),
            timeSpent: 0,
          };

          return {
            chapterProgress: {
              ...state.chapterProgress,
              [key]: {
                ...current,
                currentConceptId: conceptId,
                lastViewed: new Date().toISOString(),
              },
            },
          };
        }),

      markConceptCompleted: (classNum, subject, chapter, conceptId) =>
        set((state) => {
          const key = `${classNum}-${subject}-${chapter}`;
          const current = state.chapterProgress[key] || {
            class: classNum,
            subject,
            chapter,
            currentConceptId: conceptId,
            conceptsCompleted: [],
            lastViewed: new Date().toISOString(),
            timeSpent: 0,
          };

          if (!current.conceptsCompleted.includes(conceptId)) {
            return {
              chapterProgress: {
                ...state.chapterProgress,
                [key]: {
                  ...current,
                  conceptsCompleted: [...current.conceptsCompleted, conceptId],
                },
              },
            };
          }
          return state;
        }),

      getProgress: (classNum, subject, chapter) => {
        const key = `${classNum}-${subject}-${chapter}`;
        return get().chapterProgress[key];
      },

      updateTimeSpent: (classNum, subject, chapter, seconds) =>
        set((state) => {
          const key = `${classNum}-${subject}-${chapter}`;
          const current = state.chapterProgress[key];
          if (!current) return state;

          return {
            chapterProgress: {
              ...state.chapterProgress,
              [key]: {
                ...current,
                timeSpent: current.timeSpent + seconds,
              },
            },
          };
        }),

      clearProgress: () => set({ chapterProgress: {} }),
    }),
    {
      name: 'learnsmartProgress',
    }
  )
);
