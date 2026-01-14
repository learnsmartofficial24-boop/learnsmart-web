'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Paperclip, MoreVertical, Edit, Trash2, Reply } from 'lucide-react';
import { GroupMessage, UserProfile } from '../../lib/types';
import { useSocialStore } from '../../store/socialStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface GroupChatProps {
  groupId: string;
  currentUserId: string;
  className?: string;
}

export const GroupChat: React.FC<GroupChatProps> = ({
  groupId,
  currentUserId,
  className
}) => {
  const {
    getGroupMessages,
    sendGroupMessage,
    deleteGroupMessage,
    profiles,
    getProfile
  } = useSocialStore();

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<GroupMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const groupMessages = getGroupMessages(groupId);
    setMessages(groupMessages);
  }, [groupId, getGroupMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (editingMessage) {
      // Update existing message (simplified)
      setEditingMessage(null);
    } else {
      sendGroupMessage(groupId, currentUserId, newMessage);
    }

    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteGroupMessage(groupId, messageId, currentUserId);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (date: Date) => {
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

  const getUserProfile = (userId: string): UserProfile | null => {
    return getProfile(userId) || profiles[userId] || null;
  };

  const MessageBubble: React.FC<{ message: GroupMessage; isOwn: boolean }> = ({ message, isOwn }) => {
    const userProfile = getUserProfile(message.userId);
    const isEdited = message.editedAt !== undefined;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex group relative",
          isOwn ? "justify-end" : "justify-start"
        )}
      >
        {!isOwn && (
          <div className="flex-shrink-0 mr-3">
            {userProfile?.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-sm font-semibold">
                {userProfile?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
        )}

        <div className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
          isOwn
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-none"
            : "bg-[var(--accent)] text-[var(--foreground)] rounded-bl-none"
        )}>
          {!isOwn && userProfile && (
            <div className="text-xs font-semibold mb-1 text-[var(--primary)]">
              {userProfile.name}
            </div>
          )}
          
          {replyingTo && (
            <div className="text-xs opacity-70 mb-1 border-l-2 border-current pl-2">
              Replying to {getUserProfile(replyingTo.userId)?.name}
            </div>
          )}
          
          <div className="text-sm">{message.content}</div>
          
          <div className={cn(
            "flex items-center justify-between mt-1 text-xs",
            isOwn ? "text-[var(--primary-foreground)]/70" : "text-[var(--muted-foreground)]"
          )}>
            <span>{formatTime(message.createdAt)}</span>
            {isEdited && <span>• edited</span>}
          </div>
        </div>

        {isOwn && (
          <div className="flex-shrink-0 ml-3">
            {userProfile?.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-sm font-semibold">
                {userProfile?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
        )}

        {/* Message Actions */}
        {isOwn && (
          <div className="absolute -top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-1">
              <button
                onClick={() => setEditingMessage(message.id)}
                className="p-1 bg-[var(--background)] border border-[var(--border)] rounded shadow-sm hover:bg-[var(--accent)]"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDeleteMessage(message.id)}
                className="p-1 bg-[var(--background)] border border-[var(--border)] rounded shadow-sm hover:bg-[var(--accent)]"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const QuickActions = () => (
    <div className="flex space-x-2">
      <button
        onClick={() => {/* Handle emoji picker */}}
        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--accent)] rounded-lg transition-colors"
        title="Add emoji"
      >
        <Smile className="w-5 h-5" />
      </button>
      <button
        onClick={() => {/* Handle attachment */}}
        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--accent)] rounded-lg transition-colors"
        title="Attach file"
      >
        <Paperclip className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Group Chat</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--background)]/50">
        <AnimatePresence>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-[var(--muted-foreground)]" />
              </div>
              <h3 className="font-medium text-[var(--foreground)] mb-2">No messages yet</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Be the first to start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.userId === currentUserId}
              />
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-4 border-t border-[var(--border)] bg-[var(--card)]">
        {replyingTo && (
          <div className="mb-3 p-2 bg-[var(--accent)] rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-xs text-[var(--muted-foreground)]">
                Replying to {getUserProfile(replyingTo.userId)?.name}
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-[var(--foreground)] truncate">
              {replyingTo.content}
            </div>
          </div>
        )}
        
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="resize-none"
            />
          </div>
          
          <QuickActions />
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};