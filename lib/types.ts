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
