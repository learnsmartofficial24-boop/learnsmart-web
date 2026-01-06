'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FeaturesSection } from '@/components/Landing/FeaturesSection';
import { HowItWorksSection } from '@/components/Landing/HowItWorksSection';
import { TrustSection } from '@/components/Landing/TrustSection';
import { CTASection } from '@/components/Landing/CTASection';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Show landing page for non-authenticated users
  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--background)] to-[var(--card)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/10 rounded-full mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm font-medium text-[var(--primary)]">
                  AI-Powered Learning Platform
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-6 leading-tight">
                Learn Smarter.{' '}
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                  Not Harder.
                </span>
              </h1>

              <p className="text-xl text-[var(--foreground)]/70 mb-8 leading-relaxed">
                Concept-based learning powered by AI. Master your subjects with clarity and focus.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
              </div>

              <p className="mt-6 text-sm text-[var(--foreground)]/60">
                No credit card required. Start learning in minutes.
              </p>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-3xl p-8 border-2 border-[var(--primary)]/30 shadow-[var(--shadow-elevation)]">
                {/* Floating Cards Animation */}
                <motion.div
                  className="bg-[var(--card)] rounded-2xl p-6 shadow-[var(--shadow-hover)] mb-4"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-[var(--primary)]/20 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-[var(--primary)]/10 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-[var(--border)] rounded"></div>
                    <div className="h-2 bg-[var(--border)] rounded w-5/6"></div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-[var(--card)] rounded-2xl p-6 shadow-[var(--shadow-hover)]"
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-[var(--accent)]/20 rounded w-2/3 mb-2"></div>
                      <div className="h-2 bg-[var(--accent)]/10 rounded w-1/3"></div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--primary)] rounded-full opacity-20 blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--accent)] rounded-full opacity-20 blur-2xl"
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Trust Section */}
      <TrustSection />

      {/* CTA Section */}
      <CTASection />
    </>
  );
}
