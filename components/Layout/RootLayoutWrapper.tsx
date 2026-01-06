'use client';

import { usePathname } from 'next/navigation';
import { LandingNav } from '@/components/Navigation/LandingNav';
import { Footer } from '@/components/Layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import { useToastStore } from '@/store/toastStore';
import { ChatWidget } from '@/components/Smarty/ChatWidget';

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toasts, removeToast } = useToastStore();

  // Show landing nav/footer on home and legal pages
  const isLandingPage = pathname === '/' || pathname?.startsWith('/legal') || pathname?.startsWith('/contact');

  // Don't show nav/footer on auth and dashboard pages (they have their own layouts)
  const isDashboardOrAuth = pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth');

  const content = (
    <>
      {children}
      <ToastContainer toasts={toasts.map((toast) => ({ ...toast, onClose: removeToast }))} />
      <ChatWidget />
    </>
  );

  if (isDashboardOrAuth) {
    return content;
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <LandingNav />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastContainer toasts={toasts.map((toast) => ({ ...toast, onClose: removeToast }))} />
        <ChatWidget />
      </div>
    );
  }

  return content;
}
