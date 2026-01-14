'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { GroupBrowser } from '../../components/Groups/GroupBrowser';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';

export default function GroupsPage() {
  const { user } = useAuthStore();
  const { joinGroup } = useSocialStore();
  const router = useRouter();

  const handleJoinGroup = (groupId: string) => {
    if (user) {
      joinGroup(groupId, user.id);
      // Navigate to the group page
      router.push(`/groups/${groupId}`);
    }
  };

  const handleCreateGroup = () => {
    router.push('/groups/create');
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <GroupBrowser
            currentUserId={user?.id}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
          />
        </motion.div>
      </div>
    </div>
  );
}