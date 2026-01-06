'use client';

import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useGamificationStore } from '@/store/gamificationStore';
import { Trophy, Star, Flame, Target } from 'lucide-react';

export default function AchievementsPage() {
  const { achievements, totalQuizzesTaken, totalQuestionsAnswered, correctAnswers } = useGamificationStore();
  
  const accuracy = totalQuestionsAnswered > 0 
    ? Math.round((correctAnswers / totalQuestionsAnswered) * 100) 
    : 0;

  const placeholderAchievements = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: Star,
      locked: true,
    },
    {
      id: '2',
      name: 'Quiz Master',
      description: 'Complete 10 quizzes',
      icon: Trophy,
      locked: true,
    },
    {
      id: '3',
      name: 'On Fire',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      locked: true,
    },
    {
      id: '4',
      name: 'Perfectionist',
      description: 'Score 100% on a quiz',
      icon: Target,
      locked: true,
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Achievements
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md">
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">
                Quizzes Taken
              </p>
              <p className="text-3xl font-bold text-[var(--primary)]">
                {totalQuizzesTaken}
              </p>
            </div>
          </Card>
          
          <Card padding="md">
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">
                Questions Answered
              </p>
              <p className="text-3xl font-bold text-[var(--accent)]">
                {totalQuestionsAnswered}
              </p>
            </div>
          </Card>
          
          <Card padding="md">
            <div className="text-center">
              <p className="text-sm text-[var(--foreground)] opacity-70 mb-1">
                Accuracy
              </p>
              <p className="text-3xl font-bold text-[var(--success)]">
                {accuracy}%
              </p>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
            Your Achievements
          </h2>
          
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} padding="lg">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-[var(--foreground)] opacity-70">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-[var(--foreground)] opacity-50 mt-2">
                        Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card padding="lg">
              <p className="text-[var(--foreground)] opacity-70 text-center">
                No achievements unlocked yet. Keep learning to unlock your first achievement!
              </p>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
            Locked Achievements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placeholderAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card key={achievement.id} padding="lg">
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="p-3 bg-[var(--card-hover)] rounded-full">
                      <Icon size={24} className="text-[var(--foreground)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">
                          {achievement.name}
                        </h3>
                        <Badge variant="default" size="sm">Locked</Badge>
                      </div>
                      <p className="text-sm text-[var(--foreground)] opacity-70">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
