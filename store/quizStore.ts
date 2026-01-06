import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizSession, QuizResult, QuizQuestion, QuestionAttempt } from '@/lib/types';
import { useGamificationStore } from './gamificationStore';

interface QuizState {
  currentSession: QuizSession | null;
  quizHistory: QuizResult[];
  
  // Actions
  startQuiz: (classNum: number, subject: string, chapter: string, difficulty: 'easy' | 'medium' | 'hard', questions: QuizQuestion[]) => void;
  submitAnswer: (questionId: string, selectedAnswer: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => QuizResult;
  clearQuiz: () => void;
  getQuizHistory: () => QuizResult[];
  getQuizHistoryByChapter: (classNum: number, subject: string, chapter: string) => QuizResult[];
  getPerformanceMetrics: () => {
    totalQuizzes: number;
    averageAccuracy: number;
    totalTimeSpent: number;
    quizzesByDifficulty: Record<'easy' | 'medium' | 'hard', number>;
  };
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      quizHistory: [],

      startQuiz: (classNum, subject, chapter, difficulty, questions) => {
        const sessionId = `quiz-${Date.now()}`;
        const questionCount = questions.length;
        
        set({
          currentSession: {
            id: sessionId,
            class: classNum,
            subject,
            chapter,
            difficulty,
            questionCount,
            questions: questions.map(q => ({
              ...q,
              timeSpent: 0,
              isAnswered: false,
              selectedAnswer: undefined,
              isCorrect: undefined
            })),
            currentQuestionIndex: 0,
            startTime: new Date(),
            score: 0,
            status: 'in_progress'
          }
        });
      },

      submitAnswer: (questionId, selectedAnswer) => {
        set((state) => {
          if (!state.currentSession) return state;
          
          const currentQuestionIndex = state.currentSession.currentQuestionIndex;
          const questions = [...state.currentSession.questions];
          const question = questions[currentQuestionIndex];
          
          if (question.id !== questionId) return state;
          
          // Update question state
          questions[currentQuestionIndex] = {
            ...question,
            isAnswered: true,
            selectedAnswer,
            isCorrect: selectedAnswer === question.correctAnswer
          };
          
          // Calculate score
          const answeredQuestions = questions.filter(q => q.isAnswered);
          const correctAnswers = answeredQuestions.filter(q => q.isCorrect === true);
          const score = (correctAnswers.length / questions.length) * 100;
          
          return {
            currentSession: {
              ...state.currentSession,
              questions,
              score
            }
          };
        });
      },

      nextQuestion: () => {
        set((state) => {
          if (!state.currentSession) return state;
          
          const nextIndex = state.currentSession.currentQuestionIndex + 1;
          
          if (nextIndex >= state.currentSession.questions.length) {
            return state; // Can't go beyond last question
          }
          
          return {
            currentSession: {
              ...state.currentSession,
              currentQuestionIndex: nextIndex
            }
          };
        });
      },

      previousQuestion: () => {
        set((state) => {
          if (!state.currentSession) return state;
          
          const prevIndex = state.currentSession.currentQuestionIndex - 1;
          
          if (prevIndex < 0) {
            return state; // Can't go before first question
          }
          
          return {
            currentSession: {
              ...state.currentSession,
              currentQuestionIndex: prevIndex
            }
          };
        });
      },

      completeQuiz: () => {
        const state = get();
        if (!state.currentSession) throw new Error('No active quiz session');
        
        const endTime = new Date();
        const startTime = new Date(state.currentSession.startTime);
        const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds
        
        const questions = state.currentSession.questions;
        const correctAnswers = questions.filter(q => q.isCorrect === true).length;
        const incorrectAnswers = questions.filter(q => q.isCorrect === false).length;
        const accuracy = (correctAnswers / questions.length) * 100;
        
        const questionAttempts: QuestionAttempt[] = questions.map(q => ({
          questionId: q.id,
          selectedAnswer: q.selectedAnswer || -1,
          isCorrect: q.isCorrect || false,
          timeSpent: q.timeSpent || 0,
          timestamp: new Date()
        }));
        
        const result: QuizResult = {
          id: state.currentSession.id,
          class: state.currentSession.class,
          subject: state.currentSession.subject,
          chapter: state.currentSession.chapter,
          difficulty: state.currentSession.difficulty,
          score: state.currentSession.score,
          totalQuestions: questions.length,
          correctAnswers,
          incorrectAnswers,
          timeSpent,
          date: endTime,
          questions: questionAttempts,
          accuracy
        };
        
        // Update gamification
        useGamificationStore.getState().addXP(10);
        useGamificationStore.getState().updateStreak();
        
        set({
          currentSession: {
            ...state.currentSession,
            endTime,
            status: 'completed'
          },
          quizHistory: [...state.quizHistory, result]
        });
        
        return result;
      },

      clearQuiz: () => {
        set({
          currentSession: null
        });
      },

      getQuizHistory: () => {
        const state = get();
        return state.quizHistory;
      },

      getQuizHistoryByChapter: (classNum, subject, chapter) => {
        const state = get();
        return state.quizHistory.filter(quiz =>
          quiz.class === classNum &&
          quiz.subject === subject &&
          quiz.chapter === chapter
        );
      },

      getPerformanceMetrics: () => {
        const state = get();
        
        if (state.quizHistory.length === 0) {
          return {
            totalQuizzes: 0,
            averageAccuracy: 0,
            totalTimeSpent: 0,
            quizzesByDifficulty: { easy: 0, medium: 0, hard: 0 }
          };
        }
        
        const totalQuizzes = state.quizHistory.length;
        const averageAccuracy = state.quizHistory.reduce((sum, quiz) => sum + quiz.accuracy, 0) / totalQuizzes;
        const totalTimeSpent = state.quizHistory.reduce((sum, quiz) => sum + quiz.timeSpent, 0);
        
        const quizzesByDifficulty = {
          easy: state.quizHistory.filter(q => q.difficulty === 'easy').length,
          medium: state.quizHistory.filter(q => q.difficulty === 'medium').length,
          hard: state.quizHistory.filter(q => q.difficulty === 'hard').length
        };
        
        return {
          totalQuizzes,
          averageAccuracy,
          totalTimeSpent,
          quizzesByDifficulty
        };
      }
    }),
    {
      name: 'learnsmartQuiz',
    }
  )
);