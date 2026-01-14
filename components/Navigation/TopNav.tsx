'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Moon, Sun, User, LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, toggleTheme, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      document.documentElement.setAttribute('data-theme', user.theme);
    }
  }, [user?.theme, mounted]);

  const handleToggleTheme = () => {
    toggleTheme();
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden text-[var(--foreground)] hover:opacity-70 transition-opacity"
              >
                <Menu size={24} />
              </button>
            )}
            
            <Link href="/dashboard" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-[var(--primary)]"
              >
                LearnSmart
              </motion.div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleTheme}
              className="p-2 rounded-[var(--radius-sm)] text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
              aria-label="Toggle theme"
            >
              {user?.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {user && (
              <>
                <Link
                  href="/profile/me"
                  className="p-2 rounded-[var(--radius-sm)] text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
                >
                  <User size={20} />
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="p-2 rounded-[var(--radius-sm)] text-[var(--error)] hover:bg-[var(--card-hover)] transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
