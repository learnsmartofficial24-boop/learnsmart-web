import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  
  setUser: (user: User) => void;
  selectClass: (classNum: number) => void;
  selectStream: (stream: 'science' | 'commerce' | 'arts') => void;
  selectSpecialization: (specialization: 'pcm' | 'pcb') => void;
  selectSubjects: (subjects: string[]) => void;
  updateProfile: (updates: Partial<User>) => void;
  toggleTheme: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      selectClass: (classNum) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                class: classNum,
                // Reset stream and specialization if not in 11-12
                stream: classNum === 11 || classNum === 12 ? state.user.stream : undefined,
                specialization: classNum === 11 || classNum === 12 ? state.user.specialization : undefined,
              }
            : null,
        })),

      selectStream: (stream) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                stream,
                // Reset specialization if not science
                specialization: stream === 'science' ? state.user.specialization : undefined,
                subjects: [],
              }
            : null,
        })),

      selectSpecialization: (specialization) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                specialization,
                subjects: [],
              }
            : null,
        })),

      selectSubjects: (subjects) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                subjects,
              }
            : null,
        })),

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...updates,
              }
            : null,
        })),

      toggleTheme: () =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                theme: state.user.theme === 'light' ? 'dark' : 'light',
              }
            : null,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'learnsmartUser',
    }
  )
);
