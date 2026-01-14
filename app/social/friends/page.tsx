'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserPlus, Search, UserMinus, MessageSquare } from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { UserProfileCard } from '../../../components/Social/UserProfileCard';
import { cn } from '../../../lib/utils';

export default function FriendsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profiles, following, followers, followUser, unfollowUser } = useSocialStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');

  const followingIds = user ? following[user.id] || [] : [];
  const followerIds = user ? followers[user.id] || [] : [];

  const displayIds = activeTab === 'following' ? followingIds : followerIds;
  const filteredProfiles = displayIds
    .map(id => profiles[id])
    .filter(Boolean)
    .filter(profile => 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                Social Connections
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Manage your friends and followers
              </p>
            </div>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex p-1 bg-[var(--accent)] rounded-lg self-start">
              <button
                onClick={() => setActiveTab('following')}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === 'following'
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                Following ({followingIds.length})
              </button>
              <button
                onClick={() => setActiveTab('followers')}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === 'followers'
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                Followers ({followerIds.length})
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search connections..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <UserProfileCard
                profile={profile}
                currentUserId={user?.id}
                showFollowButton={true}
                compact={false}
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/80 dark:bg-black/80 backdrop-blur-sm"
                  onClick={() => router.push(`/profile/${profile.id}`)}
                >
                  View Profile
                </Button>
              </div>
            </motion.div>
          ))}

          {filteredProfiles.length === 0 && (
            <div className="col-span-full py-20 text-center bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg">
              <Users className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">
                No connections found
              </h3>
              <p className="text-[var(--muted-foreground)] mb-6">
                {searchQuery 
                  ? `No profiles matching "${searchQuery}"`
                  : activeTab === 'following' 
                    ? "You haven't followed anyone yet." 
                    : "No one is following you yet."}
              </p>
              {activeTab === 'following' && !searchQuery && (
                <Button onClick={() => router.push('/social/leaderboard')}>
                  Find people on Leaderboard
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
