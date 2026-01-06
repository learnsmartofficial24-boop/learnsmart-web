'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Pause, AlertTriangle } from 'lucide-react';

interface QuizProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QuizProgressBar: React.FC<QuizProgressBarProps> = ({
  currentQuestion,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  timeSpent,
  difficulty
}) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const accuracy = totalQuestions > 0 ? (correctAnswers / (correctAnswers + incorrectAnswers)) * 100 : 0;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Progress and Question Counter */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                Question {currentQuestion} of {totalQuestions}
              </span>
            </div>

            <div className="flex-1 max-w-xs">
              <div className="w-full bg-[var(--border)] rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${getDifficultyColor()}`}
                  initial={{ width: `${progressPercentage}%` }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                {correctAnswers}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">
                {incorrectAnswers}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--foreground)] opacity-60" />
              <span className="text-sm text-[var(--foreground)] opacity-70">
                {formatTime(timeSpent)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getDifficultyColor()}`} />
              <span className="text-sm text-[var(--foreground)] opacity-70 capitalize">
                {difficulty}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[var(--card)] transition-colors">
              <Pause className="w-4 h-4 text-[var(--foreground)]" />
            </button>
            <button className="p-2 rounded-lg hover:bg-[var(--card)] transition-colors">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};