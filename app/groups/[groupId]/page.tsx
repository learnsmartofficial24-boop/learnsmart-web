'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Users, MessageCircle } from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useAuthStore } from '../../../store/authStore';
import { GroupChat } from '../../../components/Groups/GroupChat';
import { GroupMembers } from '../../../components/Groups/GroupMembers';
import { GroupAnnouncements } from '../../../components/Groups/GroupAnnouncements';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getGroup, groupMemberships } = useSocialStore();

  const groupId = params.groupId as string;
  const group = getGroup(groupId);
  const membership = user ? groupMemberships.find(m => m.userId === user.id && m.groupId === groupId) : null;
  const isMember = !!membership;
  const isAdmin = membership?.role === 'admin' || membership?.role === 'owner';

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            Group not found
          </h2>
          <p className="text-[var(--muted-foreground)] mb-4">
            The group you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push('/groups')}>
            Browse Groups
          </Button>
        </div>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            Access Restricted
          </h2>
          <p className="text-[var(--muted-foreground)] mb-4">
            You need to join this group to view its content.
          </p>
          <Button onClick={() => router.push(`/groups/${groupId}`)}>
            Join Group
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 flex items-center justify-center text-[var(--primary-foreground)]">
                {group.avatar ? (
                  <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded object-cover" />
                ) : (
                  <span className="font-bold text-lg">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--foreground)]">
                  {group.name}
                </h1>
                <p className="text-[var(--muted-foreground)]">
                  {group.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => router.push(`/groups/${groupId}/settings`)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push(`/groups/${groupId}/members`)}
            >
              <Users className="w-4 h-4 mr-2" />
              Members ({group.memberCount})
            </Button>
          </div>
        </div>

        {/* Group Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg h-[600px]">
              {user && (
                <GroupChat
                  groupId={groupId}
                  currentUserId={user.id}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Announcements */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
              <GroupAnnouncements
                groupId={groupId}
                isAdmin={isAdmin}
              />
            </div>

            {/* Group Stats */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Group Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted-foreground)]">Members</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {group.memberCount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted-foreground)]">Total XP</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {group.totalXP.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted-foreground)]">Achievements</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {group.achievementsCount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted-foreground)]">Posts</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {group.postCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Group Info */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Group Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-[var(--foreground)]">Type</span>
                  <p className="text-sm text-[var(--muted-foreground)] capitalize">
                    {group.type} Group
                  </p>
                </div>
                
                {group.subject && (
                  <div>
                    <span className="text-sm font-medium text-[var(--foreground)]">Subject</span>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {group.subject}
                    </p>
                  </div>
                )}
                
                {group.class && (
                  <div>
                    <span className="text-sm font-medium text-[var(--foreground)]">Class</span>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Class {group.class}
                    </p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm font-medium text-[var(--foreground)]">Privacy</span>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {group.isPrivate ? 'Private' : 'Public'} Group
                  </p>
                </div>
              </div>
            </div>

            {/* Group Tags */}
            {group.tags.length > 0 && (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Tags
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[var(--accent)] text-[var(--muted-foreground)] text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* My Role */}
            {membership && (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Your Role
                </h3>
                
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--primary)]/10 text-[var(--primary)] capitalize">
                    {membership.role}
                  </div>
                  
                  <div className="mt-3 text-sm text-[var(--muted-foreground)]">
                    Member since {membership.joinedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}