'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export type ChatSender = 'user' | 'smarty';
export type ChatProvider = 'openai' | 'gemini';
export type MessageFeedback = 'helpful' | 'not_helpful' | null;

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  content: string;
  timestamp: number;
  provider?: ChatProvider;
  feedback?: MessageFeedback;
}

interface ChatState {
  isOpen: boolean;
  isTyping: boolean;
  unreadCount: number;
  messages: ChatMessage[];
  hasSeenWelcome: boolean;

  open: () => void;
  close: () => void;
  toggle: () => void;
  clear: () => void;

  addMessage: (message: ChatMessage) => void;
  setFeedback: (messageId: string, feedback: MessageFeedback) => void;
  markAllRead: () => void;

  sendMessage: (userMessage: string) => Promise<void>;
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: 'smarty-welcome',
    sender: 'smarty',
    content:
      "Hey! I’m Smarty — your study buddy. Tell me what you’re stuck on, and we’ll figure it out together. What are you studying right now?",
    timestamp: Date.now(),
  };
}

const MAX_HISTORY = 12;

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isTyping: false,
      unreadCount: 0,
      messages: [],
      hasSeenWelcome: false,

      open: () =>
        set((state) => {
          const shouldSeedWelcome = !state.hasSeenWelcome && state.messages.length === 0;
          return {
            isOpen: true,
            unreadCount: 0,
            hasSeenWelcome: true,
            messages: shouldSeedWelcome ? [createWelcomeMessage()] : state.messages,
          };
        }),

      close: () => set({ isOpen: false }),

      toggle: () => {
        const { isOpen } = get();
        if (isOpen) {
          set({ isOpen: false });
          return;
        }
        get().open();
      },

      clear: () => set({ messages: [], unreadCount: 0, hasSeenWelcome: false }),

      addMessage: (message) =>
        set((state) => {
          const nextMessages = [...state.messages, message];
          const shouldIncrementUnread = message.sender === 'smarty' && !state.isOpen;

          return {
            messages: nextMessages,
            unreadCount: shouldIncrementUnread ? state.unreadCount + 1 : state.unreadCount,
          };
        }),

      setFeedback: (messageId, feedback) =>
        set((state) => ({
          messages: state.messages.map((m) => (m.id === messageId ? { ...m, feedback } : m)),
        })),

      markAllRead: () => set({ unreadCount: 0 }),

      sendMessage: async (userMessage) => {
        const trimmed = userMessage.trim();
        if (!trimmed) return;

        const { user } = useAuthStore.getState();
        const history = get()
          .messages.slice(-MAX_HISTORY)
          .map((m) => ({ sender: m.sender, content: m.content }));

        const newUserMessage: ChatMessage = {
          id: generateId(),
          sender: 'user',
          content: trimmed,
          timestamp: Date.now(),
        };

        set((state) => ({ messages: [...state.messages, newUserMessage], isTyping: true }));

        try {
          const response = await fetch('/api/smarty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: trimmed,
              context: { class: user?.class },
              history,
            }),
          });

          if (!response.ok) {
            throw new Error(`Smarty request failed: ${response.status}`);
          }

          const data = (await response.json()) as {
            content?: string;
            provider?: ChatProvider;
          };

          const content = typeof data.content === 'string' ? data.content : '';
          if (!content.trim()) {
            throw new Error('Smarty response missing content');
          }

          const aiMessage: ChatMessage = {
            id: generateId(),
            sender: 'smarty',
            content,
            timestamp: Date.now(),
            provider: data.provider,
            feedback: null,
          };

          set((state) => {
            const shouldIncrementUnread = !state.isOpen;
            return {
              isTyping: false,
              messages: [...state.messages, aiMessage],
              unreadCount: shouldIncrementUnread ? state.unreadCount + 1 : state.unreadCount,
            };
          });
        } catch (error) {
          console.error('Smarty chat error:', error);

          const fallbackMessage: ChatMessage = {
            id: generateId(),
            sender: 'smarty',
            content: "I'm having trouble reaching my brain right now. Try again in a moment! 🧠",
            timestamp: Date.now(),
            feedback: null,
          };

          set((state) => {
            const shouldIncrementUnread = !state.isOpen;
            return {
              isTyping: false,
              messages: [...state.messages, fallbackMessage],
              unreadCount: shouldIncrementUnread ? state.unreadCount + 1 : state.unreadCount,
            };
          });
        }
      },
    }),
    {
      name: 'smartyChat',
      partialize: (state) => ({
        messages: state.messages,
        unreadCount: state.unreadCount,
        hasSeenWelcome: state.hasSeenWelcome,
      }),
    }
  )
);
