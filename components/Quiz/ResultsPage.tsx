'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Clock, CheckCircle2, XCircle, BarChart2, BookOpen, Repeat, ArrowLeft, Star, Flame } from 'lucide-react';
import type { QuizResult } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ResultsPageProps {
  result: QuizResult;
  onRetakeQuiz: () => void;
  onReviewAnswers: () => void;
  onBackToLearning: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  onRetakeQuiz,
  onReviewAnswers,
  onBackToLearning
}) => {
  const router = useRouter();
  
  const getPerformanceRating = () => {
    if (result.accuracy >= 90) return { label: 'Excellent!', color: 'text-green-500', icon: <Star className="w-6 h-6" /> };
    if (result.accuracy >= 70) return { label: 'Great Job!', color: 'text-blue-500', icon: <Trophy className="w-6 h-6" /> };
    if (result.accuracy >= 50) return { label: 'Good Effort', color: 'text-yellow-500', icon: <CheckCircle2 className="w-6 h-6" /> };
    return { label: 'Keep Practicing', color: 'text-orange-500', icon: <BookOpen className="w-6 h-6" /> };
  };

  const performance = getPerformanceRating();

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[var(--primary)] to-purple-500 rounded-full flex items-center justify-center"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Quiz Completed!
        </h1>
        <p className="text-xl text-[var(--foreground)] opacity-80">
          {result.chapter} - {result.subject}
        </p>
      </div>

      {/* Score Card */}
      <Card padding="lg" className="bg-gradient-to-r from-[var(--primary)]/10 to-purple-50/10 border-[var(--primary)]/20">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            {performance.icon}
            <h2 className={`text-2xl font-bold ${performance.color}`}>
              {performance.label}
            </h2>
          </div>

          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="text-5xl font-bold text-[var(--foreground)]">
              {result.score}
            </span>
            <span className="text-xl text-[var(--foreground)] opacity-70">
              / 100
            </span>
          </div>

          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70">Correct</p>
              <p className="text-2xl font-bold text-green-600">{result.correctAnswers}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70">Incorrect</p>
              <p className="text-2xl font-bold text-red-600">{result.incorrectAnswers}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70">Accuracy</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{Math.round(result.accuracy)}%</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--foreground)] opacity-60" />
              <span className="text-[var(--foreground)] opacity-70">
                {formatTime(result.timeSpent)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[var(--foreground)] opacity-60" />
              <span className={`capitalize ${result.difficulty === 'easy' ? 'text-green-500' : result.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                {result.difficulty}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card padding="lg">
          <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            Performance Metrics
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--foreground)] opacity-70">Accuracy</span>
              <span className="font-semibold text-[var(--primary)]">{Math.round(result.accuracy)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--foreground)] opacity-70">Time per Question</span>
              <span className="font-semibold text-[var(--foreground)]">
                {Math.round(result.timeSpent / result.totalQuestions)} sec
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--foreground)] opacity-70">Score</span>
              <span className="font-semibold text-green-600">{result.score}/100</span>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Question Analysis
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Correct Answers
              </span>
              <span className="font-semibold text-green-600">{result.correctAnswers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-600 font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Incorrect Answers
              </span>
              <span className="font-semibold text-red-600">{result.incorrectAnswers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--foreground)] font-medium">Total Questions</span>
              <span className="font-semibold text-[var(--foreground)]">{result.totalQuestions}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card padding="lg">
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={onReviewAnswers}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <BookOpen className="w-6 h-6" />
            <span>Review Answers</span>
          </Button>

          <Button
            onClick={onRetakeQuiz}
            className="flex flex-col items-center gap-2 h-auto py-4 bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-white"
          >
            <Repeat className="w-6 h-6" />
            <span>Retake Quiz</span>
          </Button>

          <Button
            onClick={onBackToLearning}
            className="flex flex-col items-center gap-2 h-auto py-4 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Learning</span>
          </Button>
        </div>
      </Card>

      {/* Achievement Section */}
      <Card padding="lg" className="text-center">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
          Great Work! 🎉
        </h3>
        <p className="text-[var(--foreground)] opacity-70 mb-4">
          You've earned <span className="font-bold text-[var(--primary)]">10 XP</span> and maintained your learning streak!
        </p>
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-[var(--foreground)]">+10 XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-[var(--foreground)]">Streak +1</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};