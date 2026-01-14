'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Shield, UserMinus, UserPlus, Search } from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useAuthStore } from '../../../store/authStore';
import { GroupMembers } from '../../../components/Groups/GroupMembers';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function GroupMembersPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getGroup, groupMemberships } = useSocialStore();

  const groupId = params.groupId as string;
  const group = getGroup(groupId);
  const membership = user ? groupMemberships.find(m => m.userId === user.id && m.groupId === groupId) : null;
  const isAdmin = membership?.role === 'admin' || membership?.role === 'owner';

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            Group not found
          </h2>
          <Button onClick={() => router.push('/groups')}>
            Browse Groups
          </Button>
        </div>
      </div>
    );
  }

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
                Group Members
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Manage and view members of {group.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-sm text-[var(--muted-foreground)] mr-2">
              {group.memberCount} members total
            </div>
            {isAdmin && (
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            )}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
          <GroupMembers
            groupId={groupId}
            isAdmin={isAdmin}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </div>
  );
}
