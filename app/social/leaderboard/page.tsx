'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { LeaderboardViewer } from '../../components/Leaderboard/LeaderboardViewer';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';

export default function GlobalLeaderboardPage() {
  const { user } = useAuthStore();
  const { currentProfile } = useSocialStore();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <LeaderboardViewer currentUserId={user?.id} />
        </motion.div>
      </div>
    </div>
  );
}