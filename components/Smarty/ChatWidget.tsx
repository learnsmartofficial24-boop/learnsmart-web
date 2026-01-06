'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore, type ChatMessage } from '@/store/chatStore';
import { MarkdownMessage } from '@/components/Smarty/MarkdownMessage';
import { TypingIndicator } from '@/components/Smarty/TypingIndicator';

const QUICK_ACTIONS: Array<{ label: string; prompt: string }> = [
  { label: 'Explain a concept', prompt: 'Explain photosynthesis in simple words.' },
  { label: 'Make 3 practice questions', prompt: 'Make 3 quick practice questions on fractions (with answers).' },
  { label: 'Help me start', prompt: 'I have 20 minutes. What should I revise today?' },
];

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';
  const setFeedback = useChatStore((s) => s.setFeedback);

  return (
    <div
      className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}
      aria-label={isUser ? 'Your message' : 'Smarty message'}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-[var(--radius-md)] px-3 py-2 shadow-[var(--shadow-subtle)]',
          isUser
            ? 'bg-[var(--primary)] text-white rounded-br-sm'
            : 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-bl-sm'
        )}
      >
        <MarkdownMessage content={message.content} />

        <div className="mt-1 flex items-center justify-between gap-3">
          <span
            className={cn(
              'text-[11px] opacity-70',
              isUser ? 'text-white' : 'text-[var(--foreground)]'
            )}
          >
            {formatTime(message.timestamp)}
          </span>

          {!isUser ? (
            <div className="flex items-center gap-2" aria-label="Message feedback">
              <button
                type="button"
                onClick={() => setFeedback(message.id, message.feedback === 'helpful' ? null : 'helpful')}
                className={cn(
                  'p-1 rounded hover:bg-[var(--card-hover)] transition-colors',
                  message.feedback === 'helpful' && 'text-[var(--primary)]'
                )}
                aria-label="Helpful"
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setFeedback(message.id, message.feedback === 'not_helpful' ? null : 'not_helpful')
                }
                className={cn(
                  'p-1 rounded hover:bg-[var(--card-hover)] transition-colors',
                  message.feedback === 'not_helpful' && 'text-[var(--error)]'
                )}
                aria-label="Not helpful"
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ChatWidget() {
  const isOpen = useChatStore((s) => s.isOpen);
  const unreadCount = useChatStore((s) => s.unreadCount);
  const isTyping = useChatStore((s) => s.isTyping);
  const messages = useChatStore((s) => s.messages);
  const open = useChatStore((s) => s.open);
  const close = useChatStore((s) => s.close);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const markAllRead = useChatStore((s) => s.markAllRead);

  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const showQuickActions = useMemo(() => {
    const hasUserMessage = messages.some((m) => m.sender === 'user');
    return !hasUserMessage;
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    markAllRead();

    const id = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(id);
  }, [isOpen, markAllRead]);

  useEffect(() => {
    if (!isOpen) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, messages.length, isTyping]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (isCmdK) {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close, isOpen, open]);

  async function handleSend(customMessage?: string) {
    const message = (customMessage ?? draft).trim();
    if (!message || isTyping) return;

    setDraft('');
    await sendMessage(message);
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => (isOpen ? close() : open())}
        className={cn(
          'fixed z-50 flex items-center justify-center rounded-full shadow-[var(--shadow-elevation)]',
          'bg-[var(--primary)] text-white',
          'h-14 w-14',
          'bottom-4 left-1/2 -translate-x-1/2',
          'sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
          isOpen && 'hidden sm:flex'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-label={isOpen ? 'Close Smarty chat' : 'Open Smarty chat'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}

        {unreadCount > 0 ? (
          <span
            className={cn(
              'absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1',
              'bg-[var(--accent)] text-[11px] font-semibold text-white',
              'flex items-center justify-center',
              'animate-pulse'
            )}
            aria-label={`${unreadCount} unread messages`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            key="smarty-drawer"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed z-50',
              'bottom-0 left-0 right-0',
              'w-full',
              'h-[70vh]',
              'rounded-none',
              'sm:bottom-24 sm:right-6 sm:left-auto sm:w-[400px] sm:max-w-[calc(100vw-2rem)] sm:h-[520px] sm:rounded-[var(--radius-lg)]',
              'bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow-elevation)]',
              'flex flex-col overflow-hidden'
            )}
            role="dialog"
            aria-label="Smarty chat"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)]">
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-[var(--foreground)]">Smarty</div>
                  <div className="text-xs opacity-70">Your helpful older-sibling tutor</div>
                </div>
              </div>

              <button
                type="button"
                onClick={close}
                className="p-2 rounded hover:bg-[var(--card-hover)] transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {showQuickActions ? (
                <div className="mb-3 flex flex-wrap gap-2" aria-label="Quick actions">
                  {QUICK_ACTIONS.map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => handleSend(a.prompt)}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-full border border-[var(--border)]',
                        'bg-[var(--background)] hover:bg-[var(--card-hover)] transition-colors'
                      )}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}

                {isTyping ? (
                  <div className="flex justify-start">
                    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-subtle)]">
                      <TypingIndicator />
                    </div>
                  </div>
                ) : null}

                <div ref={endRef} />
              </div>
            </div>

            <form
              className="border-t border-[var(--border)] p-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Ask Smarty…"
                  className={cn(
                    'flex-1 resize-none rounded-[var(--radius-md)] border border-[var(--border)]',
                    'bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
                  )}
                  aria-label="Message input"
                />

                <motion.button
                  type="submit"
                  className={cn(
                    'h-10 w-10 rounded-[var(--radius-md)] flex items-center justify-center',
                    'bg-[var(--primary)] text-white disabled:opacity-60 disabled:cursor-not-allowed'
                  )}
                  whileHover={{ scale: isTyping ? 1 : 1.03 }}
                  whileTap={{ scale: isTyping ? 1 : 0.97 }}
                  disabled={isTyping || draft.trim().length === 0}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="mt-2 text-[11px] opacity-70">
                Press <span className="font-semibold">Enter</span> to send · <span className="font-semibold">Shift</span>+<span className="font-semibold">Enter</span> for newline · <span className="font-semibold">Ctrl</span>+<span className="font-semibold">K</span> to toggle
              </div>
            </form>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
