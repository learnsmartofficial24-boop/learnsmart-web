'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Pin, Plus, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { cn } from '../../lib/utils';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  isPinned: boolean;
}

interface GroupAnnouncementsProps {
  groupId: string;
  isAdmin?: boolean;
  className?: string;
}

export const GroupAnnouncements: React.FC<GroupAnnouncementsProps> = ({
  groupId,
  isAdmin,
  className
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Welcome to the group!',
      content: 'Let\'s start our physics journey together. Feel free to ask any questions!',
      author: 'Group Admin',
      date: 'Jan 15, 2024',
      isPinned: true
    },
    {
      id: '2',
      title: 'Weekly Study Session',
      content: 'We will have a live study session this Sunday at 5 PM. Don\'t miss out!',
      author: 'Group Admin',
      date: 'Jan 20, 2024',
      isPinned: false
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAddAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      author: 'You',
      date: new Date().toLocaleDateString(),
      isPinned: false
    };

    setAnnouncements([announcement, ...announcements]);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, isPinned: !a.isPinned } : a
    ));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center space-x-2">
          <Megaphone className="w-5 h-5 text-[var(--primary)]" />
          <span>Announcements</span>
        </h3>
        {isAdmin && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(true)}
            className="text-[var(--primary)]"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-[var(--accent)]/50 rounded-lg border border-[var(--primary)]/30 space-y-3"
          >
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Announcement title..."
            />
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your announcement..."
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddAnnouncement}>
                Post
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {announcements.map((announcement) => (
          <motion.div
            key={announcement.id}
            layout
            className={cn(
              "p-4 rounded-lg border bg-[var(--card)] relative group",
              announcement.isPinned ? "border-[var(--primary)]/30" : "border-[var(--border)]"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {announcement.isPinned && (
                    <Pin className="w-3 h-3 text-[var(--primary)]" />
                  )}
                  <h4 className="font-bold text-[var(--foreground)]">
                    {announcement.title}
                  </h4>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] whitespace-pre-wrap">
                  {announcement.content}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    By {announcement.author} • {announcement.date}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="ml-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTogglePin(announcement.id)}
                    className={cn(
                      "p-1 rounded hover:bg-[var(--accent)]",
                      announcement.isPinned ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                    )}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-1 rounded hover:bg-red-100 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-8 text-[var(--muted-foreground)] italic">
            No announcements yet.
          </div>
        )}
      </div>
    </div>
  );
};
