'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Trophy, Flame, Star } from 'lucide-react';
import { DashboardSocialWidget } from '@/components/Social/DashboardSocialWidget';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { xp, level, streak } = useGamificationStore();

  const stats = [
    {
      icon: Star,
      label: 'Level',
      value: level,
      color: 'text-[var(--primary)]',
    },
    {
      icon: Trophy,
      label: 'XP Points',
      value: xp,
      color: 'text-[var(--accent)]',
    },
    {
      icon: Flame,
      label: 'Day Streak',
      value: streak,
      color: 'text-[var(--error)]',
    },
    {
      icon: BookOpen,
      label: 'Subjects',
      value: user?.subjects.length || 0,
      color: 'text-[var(--info)]',
    },
  ];

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-[var(--foreground)] opacity-70">
            Ready to continue your learning journey?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card padding="md">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-[var(--radius-sm)] bg-[var(--card-hover)] ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--foreground)] opacity-70">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-[var(--foreground)]">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                  Your Profile
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)] opacity-70">Class</span>
                    <Badge variant="info">{user?.class}</Badge>
                  </div>
                  {user?.stream && (
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)] opacity-70">Stream</span>
                      <Badge variant="default">
                        {user.stream.charAt(0).toUpperCase() + user.stream.slice(1)}
                      </Badge>
                    </div>
                  )}
                  {user?.specialization && (
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)] opacity-70">
                        Specialization
                      </span>
                      <Badge variant="success">
                        {user.specialization.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                  Your Subjects
                </h2>
                {user?.subjects && user.subjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.subjects.map((subject) => (
                      <Badge key={subject} variant="default">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--foreground)] opacity-70">
                    No subjects selected yet
                  </p>
                )}
              </Card>
            </div>

            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--card-hover)] hover:bg-[var(--border)] transition-colors cursor-pointer">
                  <BookOpen className="text-[var(--primary)] mb-2" size={24} />
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    Start Learning
                  </h3>
                  <p className="text-sm text-[var(--foreground)] opacity-70">
                    Continue where you left off
                  </p>
                </div>
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--card-hover)] hover:bg-[var(--border)] transition-colors cursor-pointer">
                  <Trophy className="text-[var(--accent)] mb-2" size={24} />
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    Take a Quiz
                  </h3>
                  <p className="text-sm text-[var(--foreground)] opacity-70">
                    Test your knowledge
                  </p>
                </div>
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--card-hover)] hover:bg-[var(--border)] transition-colors cursor-pointer">
                  <Star className="text-[var(--info)] mb-2" size={24} />
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    AI Tutor
                  </h3>
                  <p className="text-sm text-[var(--foreground)] opacity-70">
                    Get help from AI
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <DashboardSocialWidget />
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
