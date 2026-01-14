'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Award, Star, Lock } from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

export default function GroupAchievementsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getGroup, groupMemberships } = useSocialStore();

  const groupId = params.groupId as string;
  const group = getGroup(groupId);
  const membership = user ? groupMemberships.find(m => m.userId === user.id && m.groupId === groupId) : null;
  const isMember = !!membership;

  if (!group || !isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            {!group ? "Group not found" : "Access Denied"}
          </h2>
          <Button onClick={() => router.push('/groups')}>
            Browse Groups
          </Button>
        </div>
      </div>
    );
  }

  // Sample group achievements
  const groupAchievements = [
    {
      id: 'g1',
      name: 'Founding Members',
      description: 'First 5 members to join the group',
      unlocked: true,
      icon: '🏛️',
      date: 'Jan 15, 2024'
    },
    {
      id: 'g2',
      name: 'Active Community',
      description: 'Reach 100 total messages in the group',
      unlocked: true,
      icon: '💬',
      date: 'Jan 22, 2024'
    },
    {
      id: 'g3',
      name: 'Century Club',
      description: 'Group members collectively earned 1000 XP',
      unlocked: group.totalXP >= 1000,
      icon: '💯',
      date: group.totalXP >= 1000 ? 'Jan 25, 2024' : null
    },
    {
      id: 'g4',
      name: 'Study Marathon',
      description: 'Maintain group activity for 7 consecutive days',
      unlocked: false,
      icon: '🏃',
      progress: 4,
      target: 7
    },
    {
      id: 'g5',
      name: 'Subject Masters',
      description: 'All members complete at least one concept in the group subject',
      unlocked: false,
      icon: '🎓',
      progress: 2,
      target: group.memberCount
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)]">
                Group Achievements
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Collectively earned milestones for {group.name}
              </p>
            </div>
          </div>

          <div className="bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-lg font-bold">
            {groupAchievements.filter(a => a.unlocked).length} / {groupAchievements.length} Unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groupAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-6 rounded-lg border flex items-start space-x-4 transition-all",
                achievement.unlocked
                  ? "bg-[var(--card)] border-[var(--primary)]/30"
                  : "bg-[var(--card)]/50 border-[var(--border)] opacity-75"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                achievement.unlocked
                  ? "bg-[var(--primary)]/10"
                  : "bg-[var(--accent)]"
              )}>
                {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-[var(--muted-foreground)]" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-[var(--foreground)]">
                    {achievement.name}
                  </h3>
                  {achievement.unlocked && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mb-3">
                  {achievement.description}
                </p>

                {achievement.unlocked ? (
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Earned on {achievement.date}
                  </p>
                ) : achievement.target ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--muted-foreground)]">Progress</span>
                      <span className="text-[var(--foreground)] font-medium">
                        {achievement.progress} / {achievement.target}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--accent)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] transition-all duration-500"
                        style={{ width: `${(achievement.progress! / achievement.target!) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--muted-foreground)] italic">
                    Criteria not yet met
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
