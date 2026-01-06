'use client';

import { usePathname } from 'next/navigation';
import { LandingNav } from '@/components/Navigation/LandingNav';
import { Footer } from '@/components/Layout/Footer';

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Show landing nav/footer on home and legal pages
  const isLandingPage = pathname === '/' || pathname?.startsWith('/legal') || pathname?.startsWith('/contact');
  
  // Don't show nav/footer on auth and dashboard pages (they have their own layouts)
  const isDashboardOrAuth = pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth');

  if (isDashboardOrAuth) {
    return <>{children}</>;
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <LandingNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
