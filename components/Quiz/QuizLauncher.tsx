'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Sparkles, Zap, Flame, Clock, List, BarChart2 } from 'lucide-react';
import { getDifficultyInfo } from '@/lib/quizData';
import { useRouter } from 'next/navigation';

interface QuizLauncherProps {
  classNum: number;
  subject: string;
  chapter: string;
}

export const QuizLauncher: React.FC<QuizLauncherProps> = ({ classNum, subject, chapter }) => {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isLoading, setIsLoading] = useState(false);

  const difficultyInfo = getDifficultyInfo(selectedDifficulty);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    
    try {
      // Navigate to quiz page with parameters
      router.push(`/practice/${classNum}/${subject}/${chapter}/quiz/${selectedDifficulty}`);
    } catch (error) {
      console.error('Error starting quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Practice Quiz: {chapter}
        </h1>
        <p className="text-[var(--foreground)] opacity-70">
          {subject} - Class {classNum}
        </p>
      </div>

      <Card padding="lg" className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 border-[var(--primary)]/20">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
              Choose Difficulty Level
            </h2>
            <p className="text-[var(--foreground)] opacity-70 mb-6">
              Select the challenge level that matches your current understanding
            </p>

            <div className="space-y-4">
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
                const info = getDifficultyInfo(difficulty);
                return (
                  <motion.div
                    key={difficulty}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDifficulty === difficulty
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                        : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                    }`}
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {difficulty === 'easy' && <Sparkles className={`w-5 h-5 ${info.color}`} />}
                        {difficulty === 'medium' && <Zap className={`w-5 h-5 ${info.color}`} />}
                        {difficulty === 'hard' && <Flame className={`w-5 h-5 ${info.color}`} />}
                        <div>
                          <h3 className={`font-semibold ${info.color}`}>{info.label}</h3>
                          <p className="text-sm text-[var(--foreground)] opacity-70">
                            {info.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[var(--foreground)]">{info.questionCount}</p>
                        <p className="text-xs text-[var(--foreground)] opacity-60">Questions</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="border-l border-[var(--border)] pl-6">
            <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
              Quiz Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-[var(--primary)]" />
                <div>
                  <p className="text-sm text-[var(--foreground)] opacity-70">Questions</p>
                  <p className="font-semibold text-[var(--foreground)]">{difficultyInfo.questionCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--primary)]" />
                <div>
                  <p className="text-sm text-[var(--foreground)] opacity-70">Estimated Time</p>
                  <p className="font-semibold text-[var(--foreground)]">{difficultyInfo.questionCount * 1.5} minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BarChart2 className="w-5 h-5 text-[var(--primary)]" />
                <div>
                  <p className="text-sm text-[var(--foreground)] opacity-70">Difficulty</p>
                  <p className={`font-semibold ${difficultyInfo.color}`}>{difficultyInfo.label}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-3 text-[var(--foreground)]">What to expect:</h3>
              <ul className="space-y-2 text-sm text-[var(--foreground)] opacity-70">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary)]">•</span>
                  <span>Multiple choice questions with instant feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary)]">•</span>
                  <span>Detailed explanations for each answer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary)]">•</span>
                  <span>Performance tracking and progress analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary)]">•</span>
                  <span>Earn XP and maintain your learning streak</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleStartQuiz}
              className="w-full mt-8 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Start {difficultyInfo.label} Quiz
            </Button>
          </div>
        </div>
      </Card>

      {/* Past Results Section */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Past Quiz Results
          </h2>
          <Button variant="ghost" size="sm" className="text-[var(--primary)]">
            View All History
          </Button>
        </div>

        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-[var(--foreground)] opacity-50" />
          <p className="text-[var(--foreground)] opacity-70">
            No quiz history yet. Complete your first quiz to see results here!
          </p>
        </div>
      </Card>
    </motion.div>
  );
};