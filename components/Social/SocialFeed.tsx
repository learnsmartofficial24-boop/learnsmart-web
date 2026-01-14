'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Award, TrendingUp, Users, Calendar, Bookmark } from 'lucide-react';
import { Post, UserProfile, Comment } from '../../lib/types';
import { useSocialStore } from '../../store/socialStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface SocialFeedProps {
  currentUserId?: string;
  userId?: string; // Show only this user's posts
  groupId?: string; // Show only group posts
  limit?: number;
  className?: string;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  currentUserId,
  userId,
  groupId,
  limit,
  className
}) => {
  const {
    posts,
    profiles,
    getProfile,
    likePost,
    addComment,
    getUserAchievements,
    checkAchievements
  } = useSocialStore();

  const [newPosts, setNewPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'achievements' | 'milestones'>('all');

  // Get posts filtered by props
  const filteredPosts = React.useMemo(() => {
    let result = [...posts, ...newPosts];

    if (userId) {
      result = result.filter(post => post.userId === userId);
    }

    if (groupId) {
      result = result.filter(post => post.groupId === groupId);
    }

    switch (filter) {
      case 'achievements':
        result = result.filter(post => post.type === 'achievement');
        break;
      case 'milestones':
        result = result.filter(post => post.type === 'milestone');
        break;
      default:
        break;
    }

    return result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, limit);
  }, [posts, newPosts, userId, groupId, filter, limit]);

  const handleLike = (postId: string) => {
    if (currentUserId) {
      likePost(postId, currentUserId);
    }
  };

  const handleComment = (postId: string, content: string) => {
    if (currentUserId) {
      addComment(postId, currentUserId, content);
    }
  };

  const getUserProfile = (userId: string): UserProfile | null => {
    return getProfile(userId) || profiles[userId] || null;
  };

  const getPostIcon = (type: Post['type']) => {
    switch (type) {
      case 'achievement':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'milestone':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'group_announcement':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'study_update':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const userProfile = getUserProfile(post.userId);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    const isLiked = currentUserId && post.likes.includes(currentUserId);
    const isOwnPost = currentUserId === post.userId;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        {/* Post Header */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0">
            {userProfile?.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-semibold">
                {userProfile?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-[var(--foreground)]">
                {userProfile?.name || 'Unknown User'}
              </h3>
              <div className="flex items-center space-x-1">
                {getPostIcon(post.type)}
                <span className="text-xs text-[var(--muted-foreground)] capitalize">
                  {post.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-[var(--muted-foreground)]">
              <span>{formatTimeAgo(post.createdAt)}</span>
              {userProfile?.class && (
                <>
                  <span>•</span>
                  <span>Class {userProfile.class}</span>
                </>
              )}
              {userProfile?.currentLevel && (
                <>
                  <span>•</span>
                  <span>Level {userProfile.currentLevel}</span>
                </>
              )}
            </div>
          </div>

          {isOwnPost && (
            <Button variant="ghost" size="sm">
              ⋯
            </Button>
          )}
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-[var(--foreground)] leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Achievement Details (for achievement posts) */}
        {post.type === 'achievement' && (
          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Achievement Unlocked!
              </span>
            </div>
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={() => handleLike(post.id)}
              className={cn(
                "flex items-center space-x-2 text-sm transition-colors",
                isLiked 
                  ? "text-red-500 hover:text-red-600" 
                  : "text-[var(--muted-foreground)] hover:text-red-500"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span>{post.likes.length}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments.length}</span>
            </button>

            {/* Share Button */}
            <button className="flex items-center space-x-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Bookmark */}
          <button className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-[var(--border)]"
          >
            {/* Comment Input */}
            <div className="flex items-center space-x-3 mb-4">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && commentText.trim()) {
                    handleComment(post.id, commentText);
                    setCommentText('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (commentText.trim()) {
                    handleComment(post.id, commentText);
                    setCommentText('');
                  }
                }}
                disabled={!commentText.trim()}
                size="sm"
              >
                Post
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments.map((comment) => {
                const commentUserProfile = getUserProfile(comment.userId);
                return (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {commentUserProfile?.avatar ? (
                        <img
                          src={commentUserProfile.avatar}
                          alt={commentUserProfile.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-sm font-semibold">
                          {commentUserProfile?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="bg-[var(--accent)] rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm text-[var(--foreground)]">
                            {commentUserProfile?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--foreground)]">
                          {comment.content}
                        </p>
                      </div>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center space-x-4 mt-1 text-xs">
                        <button className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                          Like ({comment.likes.length})
                        </button>
                        <button className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6 text-[var(--primary)]" />
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            {userId ? 'User Activity' : groupId ? 'Group Feed' : 'Social Feed'}
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 bg-[var(--accent)] rounded-lg p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'achievements', label: 'Achievements' },
            { id: 'milestones', label: 'Milestones' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                filter === tab.id
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
              No posts yet
            </h3>
            <p className="text-[var(--muted-foreground)]">
              {userId 
                ? "This user hasn't posted anything yet."
                : groupId 
                ? "No group posts yet. Be the first to share something!"
                : "Be the first to share your learning journey!"}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Load More */}
      {limit && filteredPosts.length === limit && (
        <div className="text-center">
          <Button variant="outline">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
};