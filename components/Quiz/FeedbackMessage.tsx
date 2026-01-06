'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FeedbackMessageProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
  pointsEarned: number;
  onContinue: () => void;
  showContinueButton?: boolean;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  isCorrect,
  explanation,
  correctAnswer,
  pointsEarned,
  onContinue,
  showContinueButton = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto"
    >
      <Card
        padding="lg"
        className={`border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500" />
            )}
            <div>
              <h2 className={`text-xl font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Correct Answer!' : 'Not Quite Right'}
              </h2>
              <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'Great job! You earned points.' : 'Let\'s learn from this.'}
              </p>
            </div>
          </div>

          {/* Points */}
          {isCorrect && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
              <Lightbulb className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-green-600">Points Earned</p>
                <p className="text-2xl font-bold text-green-700">+{pointsEarned}</p>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="font-semibold text-[var(--foreground)]">Explanation</h3>
            </div>
            <p className="text-[var(--foreground)] opacity-80 leading-relaxed">
              {explanation}
            </p>
          </div>

          {/* Correct Answer */}
          {!isCorrect && (
            <div className="p-4 bg-white rounded-lg border border-green-100">
              <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Correct Answer
              </h3>
              <p className="text-green-800 font-medium">
                {correctAnswer}
              </p>
            </div>
          )}

          {/* Continue Button */}
          {showContinueButton && (
            <Button
              onClick={onContinue}
              className={`w-full ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-[var(--primary)] hover:bg-[var(--primary)]/90'}`}
              size="lg"
            >
              Continue
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};