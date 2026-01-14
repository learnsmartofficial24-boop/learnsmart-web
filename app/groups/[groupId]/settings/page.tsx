'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2, Shield, Lock, Globe, AlertTriangle } from 'lucide-react';
import { useSocialStore } from '../../../store/socialStore';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { cn } from '../../../lib/utils';
import { StudyGroup } from '../../../lib/types';

export default function GroupSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getGroup, updateGroup, groupMemberships } = useSocialStore();

  const groupId = params.groupId as string;
  const group = getGroup(groupId);
  const membership = user ? groupMemberships.find(m => m.userId === user.id && m.groupId === groupId) : null;
  const isAdmin = membership?.role === 'admin' || membership?.role === 'owner';

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<StudyGroup>>(group || {});

  if (!group || !isAdmin) {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      updateGroup(groupId, formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/groups/${groupId}`);
    } catch (error) {
      console.error('Failed to update group:', error);
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
                Group Settings
              </h1>
              <p className="text-[var(--muted-foreground)]">
                Manage {group.name}'s configuration
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[var(--primary)]" />
              <span>General Settings</span>
            </h3>

            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Group Name
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                rows={4}
              />
            </div>

            {/* Privacy */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Privacy Level
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: false })}
                  className={cn(
                    "flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors",
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
                    "flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors",
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

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Danger Zone</span>
            </h3>
            <p className="text-sm text-red-600/80 dark:text-red-400/80">
              Once you delete a group, there is no going back. Please be certain.
            </p>
            <Button
              type="button"
              variant="danger"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Group
            </Button>
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
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
