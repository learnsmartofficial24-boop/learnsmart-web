'use client';

import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Sparkles, Zap, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PracticePage() {
  const router = useRouter();

  const sampleQuizzes = [
    {
      class: 10,
      subject: 'Science',
      chapter: 'Heredity',
      difficulty: 'medium'
    },
    {
      class: 10,
      subject: 'Maths',
      chapter: 'Algebra',
      difficulty: 'easy'
    }
  ];

  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Practice & Quizzes
        </h1>

        <Card padding="lg">
          <div className="space-y-4">
            <p className="text-[var(--foreground)] opacity-70">
              Test your knowledge with interactive quizzes. Choose a subject and chapter to get started!
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {sampleQuizzes.map((quiz, index) => (
                <div key={index} className="p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--card-hover)] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)]">
                        {quiz.chapter}
                      </h3>
                      <p className="text-sm text-[var(--foreground)] opacity-70">
                        Class {quiz.class} - {quiz.subject}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <Button
                    onClick={() => router.push(`/practice/${quiz.class}/${quiz.subject}/${quiz.chapter}`)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Start Quiz
                  </Button>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => router.push('/learn')}
                variant="ghost"
                className="text-[var(--primary)]"
              >
                Browse All Subjects & Chapters
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Start Section */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
            Quick Start
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--card-hover)] transition-colors cursor-pointer">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-[var(--primary)]" />
              <p className="text-sm font-medium text-[var(--foreground)]">Class 10</p>
              <p className="text-xs text-[var(--foreground)] opacity-70">Science</p>
            </div>
            <div className="text-center p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--card-hover)] transition-colors cursor-pointer">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium text-[var(--foreground)]">Easy</p>
              <p className="text-xs text-[var(--foreground)] opacity-70">5 Questions</p>
            </div>
            <div className="text-center p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--card-hover)] transition-colors cursor-pointer">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm font-medium text-[var(--foreground)]">Medium</p>
              <p className="text-xs text-[var(--foreground)] opacity-70">10 Questions</p>
            </div>
            <div className="text-center p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--card-hover)] transition-colors cursor-pointer">
              <Flame className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm font-medium text-[var(--foreground)]">Hard</p>
              <p className="text-xs text-[var(--foreground)] opacity-70">15 Questions</p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
