'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, Camera, Lock, Globe, Users } from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { cn } from '../../../lib/utils';
import { StudyGroup } from '../../../lib/types';

export default function CreateGroupPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createGroup, joinGroup } = useSocialStore();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<StudyGroup>>({
    name: '',
    description: '',
    type: 'study',
    isPrivate: false,
    subject: '',
    class: user?.class || 10,
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...(formData.tags || []), tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const groupId = createGroup({
        ...formData,
        memberIds: [user.id],
        adminIds: [user.id],
        createdAt: new Date(),
        lastActivity: new Date(),
        totalXP: 0,
        achievementsCount: 0,
        postCount: 0,
        memberCount: 1
      });

      // Navigate to the new group
      router.push(`/groups/${groupId}`);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
                Create Study Group
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Start a new community and learn together
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 space-y-6">
            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Group Name
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Physics Champions"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Description
              </label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What is this group about?"
                rows={4}
              />
            </div>

            {/* Group Type & Privacy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Group Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)]"
                >
                  <option value="study">Study Group</option>
                  <option value="social">Social</option>
                  <option value="competitive">Competitive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Privacy
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPrivate: false })}
                    className={cn(
                      "flex-1 flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors",
                      !formData.isPrivate
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "border-[var(--border)] text-[var(--muted-foreground)]"
                    )}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Public</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPrivate: true })}
                    className={cn(
                      "flex-1 flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors",
                      formData.isPrivate
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "border-[var(--border)] text-[var(--muted-foreground)]"
                    )}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Private</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Subject & Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Subject (Optional)
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Mathematics"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Class
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)]"
                >
                  {[9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>Class {num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Tags
              </label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Press Enter to add tags"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center space-x-1 px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
