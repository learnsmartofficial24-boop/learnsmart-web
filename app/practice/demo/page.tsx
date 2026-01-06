'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Sparkles, Zap, Flame } from 'lucide-react';

export default function QuizDemoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const demoQuizzes = [
    {
      class: 10,
      subject: 'Science',
      chapter: 'Heredity',
      difficulty: 'easy',
      description: 'Basic genetics concepts - 5 questions'
    },
    {
      class: 10,
      subject: 'Science',
      chapter: 'Heredity',
      difficulty: 'medium',
      description: 'Intermediate genetics - 10 questions'
    },
    {
      class: 10,
      subject: 'Science',
      chapter: 'Heredity',
      difficulty: 'hard',
      description: 'Advanced genetics - 15 questions'
    },
    {
      class: 10,
      subject: 'Maths',
      chapter: 'Algebra',
      difficulty: 'easy',
      description: 'Basic algebra - 5 questions'
    }
  ];

  const handleStartQuiz = (quiz: any) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/practice/${quiz.class}/${quiz.subject}/${quiz.chapter}`);
    }, 500);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Interactive Quiz System Demo
          </h1>
          <p className="text-[var(--foreground)] opacity-70">
            Test the new quiz system with sample questions
          </p>
        </div>

        <Card padding="lg">
          <div className="space-y-4">
            <p className="text-[var(--foreground)] opacity-70">
              Choose a quiz to test the interactive quiz system. All quizzes include:
            </p>

            <ul className="space-y-2 text-sm text-[var(--foreground)] opacity-80 pl-6 mb-6">
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
                <span>Performance tracking and analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary)]">•</span>
                <span>XP and gamification integration</span>
              </li>
            </ul>

            <div className="grid md:grid-cols-2 gap-4">
              {demoQuizzes.map((quiz, index) => (
                <Card
                  key={index}
                  padding="md"
                  className="hover:shadow-[var(--shadow-hover)] transition-shadow cursor-pointer"
                  onClick={() => handleStartQuiz(quiz)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                        <h3 className="font-semibold text-[var(--foreground)]">
                          {quiz.chapter}
                        </h3>
                      </div>
                      <p className="text-sm text-[var(--foreground)] opacity-70 mb-2">
                        Class {quiz.class} - {quiz.subject}
                      </p>
                      <p className="text-sm text-[var(--foreground)] opacity-60">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                      </span>
                      <Button
                        size="sm"
                        className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartQuiz(quiz);
                        }}
                        isLoading={isLoading}
                      >
                        Start Quiz
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center pt-6">
              <Button
                onClick={() => router.push('/practice')}
                variant="ghost"
                className="text-[var(--primary)]"
              >
                Browse All Quizzes
              </Button>
            </div>
          </div>
        </Card>

        {/* Features Section */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold mb-6 text-[var(--foreground)]">
            Quiz System Features
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold mb-2 text-[var(--foreground)]">Instant Feedback</h3>
              <p className="text-sm text-[var(--foreground)] opacity-70">
                Get immediate feedback on each answer with detailed explanations
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold mb-2 text-[var(--foreground)]">Performance Tracking</h3>
              <p className="text-sm text-[var(--foreground)] opacity-70">
                Track your progress with detailed analytics and history
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold mb-2 text-[var(--foreground)]">Gamification</h3>
              <p className="text-sm text-[var(--foreground)] opacity-70">
                Earn XP, maintain streaks, and unlock achievements
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}