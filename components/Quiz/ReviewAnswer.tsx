'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import type { QuestionAttempt } from '@/lib/types';

interface ReviewAnswerProps {
  questions: QuestionAttempt[];
  onClose: () => void;
}

export const ReviewAnswer: React.FC<ReviewAnswerProps> = ({ questions, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Review Your Answers
        </h2>
        <Button onClick={onClose} variant="ghost" size="sm">
          Close Review
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[var(--foreground)] opacity-70">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="w-32 bg-[var(--border)] rounded-full h-2">
          <motion.div
            className="bg-[var(--primary)] h-2 rounded-full"
            initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <Card padding="lg">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
              Question {currentIndex + 1}
            </h3>

            <div className={`p-4 rounded-lg border-2 mb-4 ${currentQuestion.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center gap-3 mb-3">
                {currentQuestion.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <h4 className={`font-semibold ${currentQuestion.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {currentQuestion.isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
                </h4>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-[var(--foreground)] opacity-80">
                  You selected: <span className="font-medium">{String.fromCharCode(65 + currentQuestion.selectedAnswer)}</span>
                </p>
                <p className="text-sm text-[var(--foreground)] opacity-80">
                  Time spent: <span className="font-medium">{currentQuestion.timeSpent} seconds</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                variant="outline"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                {currentIndex === questions.length - 1 ? 'Finish Review' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card padding="md" className="bg-[var(--card)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">Total Questions</p>
            <p className="text-xl font-bold text-[var(--primary)]">{questions.length}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">Correct</p>
            <p className="text-xl font-bold text-green-600">
              {questions.filter(q => q.isCorrect).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">Incorrect</p>
            <p className="text-xl font-bold text-red-600">
              {questions.filter(q => !q.isCorrect).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">Accuracy</p>
            <p className="text-xl font-bold text-blue-600">
              {Math.round((questions.filter(q => q.isCorrect).length / questions.length) * 100)}%
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};