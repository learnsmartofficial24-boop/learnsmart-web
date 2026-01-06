'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  GraduationCap,
  Trophy,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'My Classes', href: '/dashboard/classes' },
  { icon: GraduationCap, label: 'Learning', href: '/learn' },
  { icon: Trophy, label: 'Achievements', href: '/dashboard/achievements' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-64 bg-[var(--card)]',
          'border-r border-[var(--border)] z-50 lg:z-10',
          'flex flex-col'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] lg:hidden">
          <span className="text-lg font-semibold text-[var(--foreground)]">Menu</span>
          <button
            onClick={onClose}
            className="text-[var(--foreground)] hover:opacity-70 transition-opacity"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)]',
                    'transition-colors duration-[var(--transition-fast)]',
                    isActive
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--foreground)] hover:bg-[var(--card-hover)]'
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--foreground)] opacity-70">
            <p>LearnSmart v1.0.0</p>
            <p className="mt-1">© 2024 All rights reserved</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
