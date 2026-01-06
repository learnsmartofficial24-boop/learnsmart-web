'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-[var(--primary)]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Ready to Learn Smarter?
          </h2>
          <p className="text-lg text-[var(--foreground)]/70 mb-8 max-w-2xl mx-auto">
            Join thousands of students mastering their subjects with clarity and confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Free Now
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                I Already Have an Account
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-[var(--foreground)]/60">
            No credit card required. Start learning in minutes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
