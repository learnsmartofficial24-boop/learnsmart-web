'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Clock, CheckCircle2, XCircle, BarChart2, Search, Filter, X } from 'lucide-react';
import type { QuizResult } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface QuizHistoryProps {
  history: QuizResult[];
  onViewDetails: (result: QuizResult) => void;
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({ history, onViewDetails }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'time'>('date');

  const filteredHistory = history
    .filter(quiz => 
      (filterDifficulty === 'all' || quiz.difficulty === filterDifficulty) &&
      (quiz.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
       quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'score':
          return b.score - a.score;
        case 'time':
          return a.timeSpent - b.timeSpent;
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}sec`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Quiz History
        </h1>
        <Button variant="outline" size="sm" className="text-[var(--primary)]">
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card padding="md" className="bg-[var(--card)]">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by chapter or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)] opacity-50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Difficulty
            </label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as 'all' | 'easy' | 'medium' | 'hard')}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'time')}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="date">Date (Newest First)</option>
              <option value="score">Score (Highest First)</option>
              <option value="time">Time (Fastest First)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || filterDifficulty !== 'all') && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterDifficulty('all');
              }}
              className="text-[var(--foreground)] opacity-70"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Summary Stats */}
      {history.length > 0 ? (
        <Card padding="lg" className="bg-gradient-to-r from-[var(--primary)]/5 to-purple-50/5 border-[var(--primary)]/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">Total Quizzes</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{history.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">Avg Score</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(history.reduce((sum, quiz) => sum + quiz.score, 0) / history.length)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">Avg Accuracy</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(history.reduce((sum, quiz) => sum + quiz.accuracy, 0) / history.length)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">Total Time</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatTime(history.reduce((sum, quiz) => sum + quiz.timeSpent, 0))}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card padding="lg" className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-[var(--foreground)] opacity-50" />
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            No Quiz History Yet
          </h3>
          <p className="text-[var(--foreground)] opacity-70">
            Complete your first quiz to start tracking your progress!
          </p>
        </Card>
      )}

      {/* Quiz List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((quiz) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                padding="md"
                className="hover:shadow-[var(--shadow-hover)] transition-shadow cursor-pointer"
                onClick={() => onViewDetails(quiz)}
              >
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-1">
                      {quiz.chapter}
                    </h3>
                    <p className="text-sm text-[var(--foreground)] opacity-70">
                      {quiz.subject} - Class {quiz.class}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-[var(--foreground)] opacity-60 mb-1">Score</p>
                      <p className={`text-xl font-bold ${quiz.score >= 70 ? 'text-green-600' : quiz.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {quiz.score}%
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-[var(--foreground)] opacity-60 mb-1">Accuracy</p>
                      <p className="text-xl font-bold text-[var(--primary)]">
                        {Math.round(quiz.accuracy)}%
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-[var(--foreground)] opacity-60 mb-1">Time</p>
                      <p className="text-xl font-bold text-purple-600">
                        {formatTime(quiz.timeSpent)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                    <span className="text-sm text-[var(--foreground)] opacity-70">
                      {formatDate(quiz.date)}
                    </span>
                    <Button size="sm" variant="outline" className="text-[var(--primary)]">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <Search className="w-12 h-12 mx-auto mb-4 text-[var(--foreground)] opacity-50" />
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            No Results Found
          </h3>
          <p className="text-[var(--foreground)] opacity-70">
            Try adjusting your filters or search terms.
          </p>
        </Card>
      )}
    </motion.div>
  );
};