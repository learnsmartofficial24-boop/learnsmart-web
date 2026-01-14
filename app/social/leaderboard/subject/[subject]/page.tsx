'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Target } from 'lucide-react';
import { LeaderboardViewer } from '../../../../components/Leaderboard/LeaderboardViewer';
import { useAuthStore } from '../../../../store/authStore';
import { Button } from '../../../../components/ui/Button';

export default function SubjectLeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const subject = params.subject as string;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)] capitalize">
                {subject} Leaderboard
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Top performers in {subject}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LeaderboardViewer 
            currentUserId={user?.id} 
          />
        </motion.div>
      </div>
    </div>
  );
}
