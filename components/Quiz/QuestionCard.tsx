'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import type { QuizQuestion } from '@/lib/types';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (answerIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSubmit,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(question.selectedAnswer || null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(!!question.isAnswered);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    onAnswerSubmit(selectedAnswer);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (!isSubmitted && selectedAnswer !== null) {
      handleSubmit();
    }
    onNext();
  };

  const isCorrect = selectedAnswer !== null && selectedAnswer === question.correctAnswer;
  const showFeedback = isSubmitted || question.isAnswered;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--foreground)] opacity-60" />
            <span className="text-sm text-[var(--foreground)] opacity-70">
              {formatTime(timeSpent)}
            </span>
          </div>
        </div>

        <div className="text-center">
          <span className="text-sm text-[var(--foreground)] opacity-70">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--foreground)] opacity-70">
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
          {question.difficulty === 'easy' && (
            <span className="w-2 h-2 bg-green-500 rounded-full" />
          )}
          {question.difficulty === 'medium' && (
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          )}
          {question.difficulty === 'hard' && (
            <span className="w-2 h-2 bg-red-500 rounded-full" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[var(--border)] rounded-full h-2">
        <motion.div
          className="bg-[var(--primary)] h-2 rounded-full"
          initial={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question Card */}
      <Card padding="lg" className="bg-[var(--card)] border-[var(--border)]">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === question.correctAnswer;
                let bgColor = 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--card-hover)]';
                let textColor = 'text-[var(--foreground)]';
                let icon = null;

                if (showFeedback) {
                  if (isSelected && isCorrectAnswer) {
                    bgColor = 'bg-green-50 border-green-200';
                    textColor = 'text-green-800';
                    icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                  } else if (isSelected && !isCorrectAnswer) {
                    bgColor = 'bg-red-50 border-red-200';
                    textColor = 'text-red-800';
                    icon = <XCircle className="w-5 h-5 text-red-500" />;
                  } else if (!isSelected && isCorrectAnswer) {
                    bgColor = 'bg-green-50 border-green-200';
                    textColor = 'text-green-800';
                    icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                  } else {
                    bgColor = 'bg-gray-50 border-gray-200';
                    textColor = 'text-gray-500';
                  }
                } else if (isSelected) {
                  bgColor = 'bg-[var(--primary)]/10 border-[var(--primary)]';
                  textColor = 'text-[var(--primary)]';
                }

                return (
                  <motion.div
                    key={index}
                    whileHover={!showFeedback ? { scale: 1.01 } : undefined}
                    whileTap={!showFeedback ? { scale: 0.99 } : undefined}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${bgColor}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`font-semibold ${textColor}`}>
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <div className="flex-1 flex items-center justify-between">
                        <span className={textColor}>{option}</span>
                        {icon && <div className="shrink-0">{icon}</div>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-lg overflow-hidden"
                >
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-[var(--primary)]">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                  <p className="text-sm text-[var(--foreground)] opacity-80 mb-3">
                    {question.explanation}
                  </p>
                  {isCorrect ? (
                    <p className="text-sm text-green-600 font-medium">
                      +{Math.round(100 / totalQuestions)} points
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 font-medium">
                      Better luck next time!
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
            <Button
              onClick={onPrevious}
              disabled={isFirstQuestion}
              variant="outline"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              {!showFeedback ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                  rightIcon={!isLastQuestion && <ChevronRight className="w-4 h-4" />}
                >
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Warning for unanswered question */}
      <AnimatePresence>
        {!showFeedback && selectedAnswer === null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Please select an answer to continue</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};