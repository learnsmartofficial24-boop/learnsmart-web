'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-[var(--success)] text-white',
  error: 'bg-[var(--error)] text-white',
  warning: 'bg-[var(--warning)] text-[var(--text-charcoal)]',
  info: 'bg-[var(--info)] text-white',
};

export function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'flex items-center gap-3 p-4 rounded-[var(--radius-md)] shadow-[var(--shadow-elevation)]',
        'min-w-[300px] max-w-md',
        styles[type]
      )}
    >
      <Icon size={20} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="hover:opacity-80 transition-opacity"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
