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
